/**
 * robots.txt y sitemap.xml dinámicos.
 * Se registran tanto en /robots.txt y /sitemap.xml (nivel app) como en
 * /api/robots y /api/sitemap, para ser robustos ante cómo Vercel entrega la URL
 * a la función tras el rewrite. El sitemap lista las páginas fijas, las líneas
 * de producto y los productos publicados.
 */
import type { Request, Response } from 'express'
import { getPublishedProducts } from '../content.js'
import { PRODUCT_LINES } from '../../src/lib/catalog.js'

// Dominio canónico del sitio (override con SITE_URL en Vercel).
function baseUrl(): string {
  return (process.env.SITE_URL || 'https://www.vzgroups.com').replace(/\/$/, '')
}

export function robotsHandler(_req: Request, res: Response): void {
  const body = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin',
    'Disallow: /api',
    '',
    `Sitemap: ${baseUrl()}/sitemap.xml`,
    '',
  ].join('\n')
  res.type('text/plain').send(body)
}

export async function sitemapHandler(_req: Request, res: Response): Promise<void> {
  const base = baseUrl()
  type Entry = { loc: string; lastmod?: string }
  const entries: Entry[] = ['/', '/productos', '/nosotros', '/cotizacion'].map((p) => ({ loc: base + p }))
  for (const line of PRODUCT_LINES) entries.push({ loc: `${base}/productos/linea/${line.id}` })

  try {
    for (const p of await getPublishedProducts()) {
      // Sin base (catálogo semilla) no hay fecha real: se omite lastmod.
      const lastmod = p.updatedAt?.getTime?.() ? p.updatedAt.toISOString() : undefined
      entries.push({ loc: `${base}/productos/${p.slug}`, lastmod })
    }
  } catch (err) {
    // Sin BD: al menos devolvemos las rutas fijas.
    console.error('[sitemap] sin BD:', err)
  }

  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    entries
      .map((e) => `  <url><loc>${e.loc}</loc>${e.lastmod ? `<lastmod>${e.lastmod.slice(0, 10)}</lastmod>` : ''}</url>`)
      .join('\n') +
    '\n</urlset>\n'

  res.type('application/xml').send(xml)
}
