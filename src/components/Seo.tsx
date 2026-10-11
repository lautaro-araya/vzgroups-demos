/**
 * Metadatos SEO por página (react-helmet-async): title, description, canonical,
 * Open Graph y Twitter. Opcionalmente inyecta JSON-LD (structured data).
 *
 * Se usa tanto en el cliente (Vite) como en el script de prerender (Node/tsx,
 * donde `import.meta.env` no existe) — de ahí el `?.` antes de leerla.
 */
import { Helmet } from 'react-helmet-async'

const SITE_NAME = 'VZ Groups'
// Dominio canónico (override con VITE_SITE_URL en build).
const SITE_URL = (
  (import.meta as { env?: Record<string, string | undefined> }).env?.VITE_SITE_URL || 'https://www.vzgroups.com'
).replace(/\/$/, '')

/** Imagen social por defecto (1200×630, logo sobre la banda azul). Las fichas
 *  de producto la pisan con la foto del producto. */
const DEFAULT_OG_IMAGE = `${SITE_URL}/brand/og.png`

/** Los scrapers de OG exigen URL absoluta; las imágenes del panel pueden venir
 *  como ruta relativa (p. ej. `uploads/foo.jpg`) o URL completa de Vercel Blob. */
function absolute(src: string): string {
  return /^https?:\/\//i.test(src) ? src : `${SITE_URL}/${src.replace(/^\//, '')}`
}

export function Seo({
  title,
  description,
  path,
  image,
  type = 'website',
  noindex = false,
  jsonLd,
}: {
  title: string
  description?: string
  /** Ruta absoluta desde la raíz, ej: "/servicios". Si se omite, usa la actual. */
  path?: string
  image?: string
  type?: 'website' | 'article'
  noindex?: boolean
  jsonLd?: object | object[]
}) {
  const url =
    SITE_URL + (path ?? (typeof window !== 'undefined' ? window.location.pathname : ''))
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`
  const blocks = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : []
  const ogImage = image ? absolute(image) : DEFAULT_OG_IMAGE
  const isDefaultImage = ogImage === DEFAULT_OG_IMAGE

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      {/* Canonical sólo en páginas indexables: en una noindex es contradictorio. */}
      {!noindex && <link rel="canonical" href={url} />}

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content="es_CL" />
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />
      {/* Dimensiones sólo de la imagen por defecto (las conocemos de antemano);
          ayudan a que la primera compartida ya muestre la tarjeta con imagen. */}
      {isDefaultImage && <meta property="og:image:width" content="1200" />}
      {isDefaultImage && <meta property="og:image:height" content="630" />}
      {isDefaultImage && (
        <meta property="og:image:alt" content="VZ Groups: control de plagas, higiene y equipos profesionales" />
      )}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={ogImage} />

      {blocks.map((block, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(block)}
        </script>
      ))}
    </Helmet>
  )
}
