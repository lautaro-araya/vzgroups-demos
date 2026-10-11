/**
 * Genera HTML estático de las páginas públicas (portada, catálogo, líneas,
 * fichas de producto, nosotros, cotización). Corre en `npm run build`,
 * DESPUÉS de `vite build` (usa dist/index.html como plantilla).
 *
 * Por qué: el SEO del catálogo depende de que Google reciba el HTML con el
 * contenido ya puesto, no un <div id="root"> vacío.
 *
 * Tolerante a fallos: si algo sale mal se registra y el build sigue; esas
 * rutas quedan servidas por el SPA (client-rendered). Sin base de datos usa el
 * catálogo semilla (server/content.ts), así que también funciona en local.
 *
 * Como el resultado pisa dist/index.html, antes se guarda una copia intacta de
 * la plantilla en dist/app.html: el shell al que Vercel manda las rutas sin
 * HTML propio (ver vercel.json).
 */
import 'dotenv/config'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { renderToStaticMarkup } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import type { HelmetServerState } from 'react-helmet-async'
import type { ReactElement } from 'react'

import { getSiteContentMap, getPublishedProducts, hasDatabase } from './content.js'
import { SiteContentProvider } from '../src/lib/site-content'
import { PRODUCT_LINES } from '../src/lib/catalog'
import { HomeBody } from '../src/pages/Home'
import { CatalogBody } from '../src/pages/Catalog'
import { ProductDetailBody, relatedProducts } from '../src/pages/ProductDetail'
import About from '../src/pages/About'
import QuotePage from '../src/pages/QuotePage'
import type { Product } from '../src/lib/types'

const DIST = join(process.cwd(), 'dist')

type Route = {
  path: string
  element: ReactElement
  /** Respuestas de /api que la página pediría al montar, ya resueltas (src/lib/bootstrap.ts). */
  api?: Record<string, unknown>
}

/** Fechas como string, igual que las entrega la API por JSON. */
function toJsonSafe<T>(row: unknown): T {
  return JSON.parse(JSON.stringify(row)) as T
}

async function main() {
  const templatePath = join(DIST, 'index.html')
  if (!existsSync(templatePath)) {
    console.warn('[prerender] No existe dist/index.html todavía. Se omite.')
    return
  }
  const template = readFileSync(templatePath, 'utf-8')
  // Shell del SPA para rutas sin HTML propio (/admin, 404…). Se escribe siempre y primero.
  writeFileSync(join(DIST, 'app.html'), template, 'utf-8')

  let content: Record<string, unknown> = {}
  let products: Product[] = []
  try {
    content = await getSiteContentMap()
    products = (await getPublishedProducts()).map((p) => toJsonSafe<Product>(p))
  } catch (err) {
    console.error('[prerender] No se pudo leer el contenido; se omite el prerender:', err)
    return
  }
  if (!hasDatabase()) console.warn('[prerender] Sin base de datos: se usa el catálogo semilla.')

  const wrap = (children: ReactElement) => <SiteContentProvider initial={content}>{children}</SiteContentProvider>

  const routes: Route[] = [
    { path: '/', element: wrap(<HomeBody products={products} />), api: { '/products': products } },
    { path: '/productos', element: wrap(<CatalogBody products={products} />), api: { '/products': products } },
    ...PRODUCT_LINES.map((l) => ({
      path: `/productos/linea/${l.id}`,
      element: wrap(<CatalogBody products={products} lineId={l.id} />),
      api: { '/products': products },
    })),
    ...products.map((p) => ({
      path: `/productos/${p.slug}`,
      element: wrap(<ProductDetailBody product={p} related={relatedProducts(p, products)} />),
      api: { [`/products/${p.slug}`]: p, '/products': products },
    })),
    { path: '/nosotros', element: wrap(<About />) },
    { path: '/cotizacion', element: wrap(<QuotePage />) },
  ]

  let written = 0
  for (const route of routes) {
    try {
      written += renderRoute(route, template, content) ? 1 : 0
    } catch (err) {
      console.error(`[prerender] Falló ${route.path}, se omite esa página:`, err)
    }
  }
  console.log(`[prerender] ${written}/${routes.length} páginas generadas como HTML estático.`)
}

/**
 * Serializa el payload para incrustarlo en un <script>. Escapar `<` evita que
 * un `</script>` dentro de los textos del panel corte la etiqueta.
 */
function serialize(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}

function renderRoute(route: Route, template: string, content: Record<string, unknown>): boolean {
  const helmetContext: { helmet?: HelmetServerState } = {}
  const app = (
    <StaticRouter location={route.path}>
      <HelmetProvider context={helmetContext}>{route.element}</HelmetProvider>
    </StaticRouter>
  )
  const html = renderToStaticMarkup(app)
  const helmet = helmetContext.helmet
  const headExtra = helmet
    ? [helmet.title.toString(), helmet.meta.toString(), helmet.link.toString(), helmet.script.toString()].join('\n')
    : ''

  let out = template
    // Quita el <title> y la meta description genéricos: Helmet aporta los de esta página.
    .replace(/<title>.*?<\/title>/s, '')
    .replace(/<meta\s+name="description"[^>]*\/?>/s, '')
    .replace('<div id="root"></div>', `<div id="root">${html}</div>`)
  if (headExtra) out = out.replace('</head>', `${headExtra}\n  </head>`)

  // Estado inicial para el cliente: exactamente el contenido que este HTML ya
  // muestra, para que al montar no parpadee con los valores por defecto.
  const bootstrap = serialize({ path: route.path, content, api: route.api ?? {} })
  out = out.replace(
    '</body>',
    `  <script id="__vz_data__" type="application/json">${bootstrap}</script>\n  </body>`,
  )

  const outDir = join(DIST, route.path)
  mkdirSync(outDir, { recursive: true })
  writeFileSync(join(outDir, 'index.html'), out, 'utf-8')
  return true
}

main().catch((err) => {
  // El prerender es un extra de SEO: nunca debe romper el deploy del sitio.
  console.error('[prerender] Error inesperado, se omite:', err)
})
