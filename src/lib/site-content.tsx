/**
 * Proveedor del contenido suelto del sitio (contacto, redes).
 * Carga /api/content una vez y lo entrega a toda la app. Mientras carga —o si
 * la API falla— usa los valores por defecto de site-fields.ts, así el sitio
 * nunca se rompe por falta de datos.
 */
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { getBootstrapContent } from './bootstrap'
import { CONTENT_DEFAULTS } from './site-fields'

type ContentMap = Record<string, unknown>

const ContentCtx = createContext<ContentMap>(CONTENT_DEFAULTS)

export function SiteContentProvider({
  children,
  initial,
}: {
  children: ReactNode
  /** Usado solo por el script de prerender: datos ya cargados, sin fetch. */
  initial?: ContentMap
}) {
  // Estado de partida: lo que pase el prerender, o lo que ese mismo prerender
  // dejó incrustado en el HTML (evita un parpadeo con los valores por defecto).
  const [map, setMap] = useState<ContentMap>(() => {
    const preloaded = initial ?? getBootstrapContent()
    return preloaded ? { ...CONTENT_DEFAULTS, ...preloaded } : CONTENT_DEFAULTS
  })

  useEffect(() => {
    if (initial) return
    let alive = true
    fetch('/api/content')
      .then((r) => (r.ok ? r.json() : null))
      .then((data: ContentMap | null) => {
        if (!alive || !data) return
        setMap({ ...CONTENT_DEFAULTS, ...data })
      })
      .catch(() => {})
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `initial` es fijo (solo lo pasa el prerender, una vez).
  }, [])

  return <ContentCtx.Provider value={map}>{children}</ContentCtx.Provider>
}

/** Contenido del sitio con helpers de contacto ya derivados. */
export function useSiteContent() {
  const map = useContext(ContentCtx)
  return useMemo(() => {
    const str = (k: string) => (typeof map[k] === 'string' ? (map[k] as string).trim() : '')
    const phone = str('contact.phone')
    const whatsapp = str('contact.whatsapp').replace(/\D/g, '')
    const socials = (['facebook', 'instagram', 'linkedin', 'youtube'] as const)
      .map((name) => ({ name, href: str(`social.${name}`) }))
      .filter((s) => s.href)
    return {
      phone,
      whatsapp,
      email: str('contact.email'),
      address: str('contact.address'),
      hours: str('contact.hours'),
      whatsappUrl: whatsapp ? `https://wa.me/${whatsapp}` : '',
      telUrl: phone ? `tel:${phone.replace(/[^\d+]/g, '')}` : '',
      socials,
    }
  }, [map])
}
