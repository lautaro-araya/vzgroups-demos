/** Hook simple de carga GET desde /api con estados loading/error/data. */
import { useEffect, useState } from 'react'
import { getBootstrapApi } from './bootstrap'

type State<T> = { data: T | null; loading: boolean; error: string | null }

/** Estado de partida: si el prerender dejó la respuesta incrustada, se usa esa. */
function seeded<T>(path: string | null): State<T> {
  const data = path ? getBootstrapApi<T>(path) : null
  return { data, loading: data === null && path !== null, error: null }
}

export function useApi<T>(path: string | null): State<T> {
  const [state, setState] = useState<State<T>>(() => seeded<T>(path))

  useEffect(() => {
    if (!path) {
      setState({ data: null, loading: false, error: null })
      return
    }
    let alive = true
    // Con datos incrustados no se vuelve a "loading": pisarlos con null sería
    // justo el parpadeo que esto viene a evitar. Igual se pide a la API y, si
    // el contenido cambió tras el build, se actualiza sin que se note.
    setState(seeded<T>(path))
    fetch('/api' + path, { credentials: 'include' })
      .then(async (r) => {
        const body = r.headers.get('content-type')?.includes('application/json') ? await r.json() : null
        if (!r.ok) throw new Error(body?.error ?? `Error ${r.status}`)
        return body as T
      })
      .then((data) => alive && setState({ data, loading: false, error: null }))
      .catch(
        (err) =>
          alive &&
          // Si ya teníamos los datos del prerender, se conservan: mejor contenido
          // de la hora del build que una página de error por un fallo de red.
          setState((prev) =>
            prev.data !== null
              ? { ...prev, loading: false }
              : { data: null, loading: false, error: String(err.message ?? err) },
          ),
      )
    return () => {
      alive = false
    }
  }, [path])

  return state
}
