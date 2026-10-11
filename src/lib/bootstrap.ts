/**
 * Datos que el prerender deja incrustados en el HTML (ver server/prerender.tsx).
 *
 * Por qué existe: las páginas se sirven ya renderizadas con el contenido real de
 * la base, pero al montar, el cliente partía de los valores por defecto y de
 * `data: null` hasta que respondía /api/... Eso producía un parpadeo — la
 * portada mostraba el titular por defecto encima del real durante unos cientos
 * de milisegundos. Sembrando el estado inicial con estos datos, lo primero que
 * pinta React es idéntico al HTML que ya estaba en pantalla.
 *
 * El fetch a la API se sigue haciendo igual: esto es solo el estado inicial, así
 * que las ediciones del panel posteriores al build siguen apareciendo (el HTML
 * incrustado es de la hora del build, la API manda).
 */
type Bootstrap = {
  /** Ruta que se prerenderizó; los datos solo valen para esa URL. */
  path: string
  /** Mapa de site_content (textos de portada, contacto, redes). */
  content?: Record<string, unknown>
  /** Respuestas de /api ya resueltas, por ruta ('/news', '/services/…'). */
  api?: Record<string, unknown>
}

/** URL con la que se cargó la página: los datos incrustados solo valen ahí. */
const ENTRY_PATH = typeof window === 'undefined' ? '' : window.location.pathname

let cache: Bootstrap | null | undefined

function read(): Bootstrap | null {
  if (cache !== undefined) return cache
  cache = null
  if (typeof document !== 'undefined') {
    const el = document.getElementById('__vz_data__')
    if (el?.textContent) {
      try {
        const parsed = JSON.parse(el.textContent) as Bootstrap
        if (parsed && typeof parsed.path === 'string') cache = parsed
      } catch {
        // HTML antiguo o payload corrupto: se ignora y todo sigue por fetch.
      }
    }
  }
  return cache
}

/** ¿Seguimos en la página que se prerenderizó? Tras navegar, los datos caducan. */
function onEntryPage(data: Bootstrap | null): data is Bootstrap {
  return !!data && data.path === ENTRY_PATH && window.location.pathname === ENTRY_PATH
}

/** Mapa de site_content incrustado, o null si esta página no lo trae. */
export function getBootstrapContent(): Record<string, unknown> | null {
  const data = read()
  return onEntryPage(data) && data.content ? data.content : null
}

/** Respuesta de /api ya incrustada para `path` ('/news'), o null si no la hay. */
export function getBootstrapApi<T>(path: string): T | null {
  const data = read()
  if (!onEntryPage(data) || !data.api) return null
  const value = data.api[path]
  return value === undefined || value === null ? null : (value as T)
}
