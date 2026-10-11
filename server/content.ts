/**
 * Consultas de contenido público, compartidas entre la API (routes/public.ts)
 * y el prerender. Un solo lugar para "qué se considera publicado".
 *
 * Sin base de datos configurada (desarrollo local recién clonado) sirve el
 * catálogo semilla en modo sólo lectura, para poder trabajar el sitio sin
 * credenciales. En producción siempre hay base y esto no se usa.
 */
import { eq } from 'drizzle-orm'
import { db, schema } from './db/index.js'
import { getDatabaseUrl } from './env.js'
import { productsSeed } from './db/seed-products.js'
import { CONTENT_DEFAULTS } from '../src/lib/site-fields.js'
import type { Product } from './db/schema.js'

export function hasDatabase(): boolean {
  try {
    getDatabaseUrl()
    return true
  } catch {
    return false
  }
}

let seedRows: Product[] | null = null
function seedProducts(): Product[] {
  return (seedRows ??= productsSeed.map((p, i) => ({
    id: i + 1,
    slug: p.slug,
    name: p.name,
    line: p.line,
    pests: p.pests,
    brand: p.brand ?? null,
    summary: p.summary,
    bodyMd: p.bodyMd,
    image: p.image,
    featured: p.featured ?? false,
    sortOrder: i,
    published: true,
    seoTitle: null,
    seoDescription: null,
    updatedAt: new Date(0),
  })))
}

export async function getSiteContentMap(): Promise<Record<string, unknown>> {
  if (!hasDatabase()) return { ...CONTENT_DEFAULTS }
  const rows = await db.select().from(schema.siteContent)
  const map: Record<string, unknown> = {}
  for (const row of rows) map[row.key] = row.value
  return map
}

export async function getPublishedProducts(): Promise<Product[]> {
  if (!hasDatabase()) return seedProducts()
  return db
    .select()
    .from(schema.products)
    .where(eq(schema.products.published, true))
    .orderBy(schema.products.sortOrder)
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!hasDatabase()) return seedProducts().find((p) => p.slug === slug) ?? null
  const [product] = await db.select().from(schema.products).where(eq(schema.products.slug, slug)).limit(1)
  return product && product.published ? product : null
}
