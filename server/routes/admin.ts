/**
 * API privada del panel (/api/admin/*). Todo protegido por requireAuth.
 * Contenido suelto, catálogo de productos, cotizaciones recibidas y subida de
 * imágenes.
 */
import { Router } from 'express'
import { z } from 'zod'
import { eq, desc } from 'drizzle-orm'
import { db, schema } from '../db/index.js'
import { requireAuth } from '../auth.js'
import { uploadsRouter } from './uploads.js'
import { LINE_IDS, PEST_SLUGS } from '../../src/lib/catalog.js'

export const adminRouter = Router()
adminRouter.use(requireAuth)

/* ── Subida de imágenes ──────────────────────────────────────────────── */
adminRouter.use('/uploads', uploadsRouter)

/* ── Publicar cambios (dispara un rebuild en Vercel) ──────────────────── */
// El sitio prerenderiza páginas como HTML estático en cada build (server/prerender.tsx).
// Este endpoint dispara ese rebuild vía un Deploy Hook de Vercel, sin exponer su
// URL al navegador (queda solo en la variable de entorno del servidor).
adminRouter.post('/publish', async (_req, res) => {
  const hook = process.env.DEPLOY_HOOK_URL
  if (!hook) {
    res.status(400).json({ error: 'DEPLOY_HOOK_URL no está configurado en el servidor.' })
    return
  }
  try {
    const r = await fetch(hook, { method: 'POST' })
    if (!r.ok) throw new Error(`El deploy hook respondió ${r.status}`)
    res.json({ ok: true })
  } catch (err) {
    res.status(502).json({ error: 'No se pudo iniciar la publicación.', detail: String(err) })
  }
})

/* ── Contenido suelto (site_content) ─────────────────────────────────── */

adminRouter.get('/content', async (_req, res) => {
  const rows = await db
    .select()
    .from(schema.siteContent)
    .orderBy(schema.siteContent.group, schema.siteContent.key)
  res.json(rows)
})

// Upsert: si la clave no existe todavía se crea (claves nuevas tras el seed).
// En un UPDATE no se tocan `label`/`group`: los pone el seed.
adminRouter.put('/content/:key', async (req, res) => {
  const parsed = z
    .object({ value: z.any(), label: z.string().nullish(), group: z.string().nullish() })
    .safeParse(req.body)
  if (!parsed.success || parsed.data.value === undefined) {
    res.status(400).json({ error: 'Datos inválidos' })
    return
  }
  const { value, label, group } = parsed.data
  const [row] = await db
    .insert(schema.siteContent)
    .values({ key: req.params.key, value, label: label ?? null, group: group ?? null })
    .onConflictDoUpdate({
      target: schema.siteContent.key,
      set: { value, updatedAt: new Date() },
    })
    .returning()
  res.json(row)
})

/* ── Productos ───────────────────────────────────────────────────────── */

const productFields = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  line: z.enum(LINE_IDS),
  pests: z.array(z.enum(PEST_SLUGS)).optional(),
  brand: z.string().nullish(),
  featured: z.boolean().optional(),
  summary: z.string().nullish(),
  bodyMd: z.string().nullish(),
  image: z.string().nullish(),
  sortOrder: z.number().int().optional(),
  published: z.boolean().optional(),
  seoTitle: z.string().nullish(),
  seoDescription: z.string().nullish(),
})

adminRouter.get('/products', async (_req, res) => {
  res.json(await db.select().from(schema.products).orderBy(schema.products.sortOrder))
})

adminRouter.post('/products', async (req, res) => {
  const parsed = productFields.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Datos inválidos' })
    return
  }
  const [row] = await db.insert(schema.products).values(parsed.data).returning()
  res.status(201).json(row)
})

adminRouter.put('/products/:id', async (req, res) => {
  const parsed = productFields.partial().safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Datos inválidos' })
    return
  }
  const [row] = await db
    .update(schema.products)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(schema.products.id, Number(req.params.id)))
    .returning()
  if (!row) {
    res.status(404).json({ error: 'Producto no encontrado' })
    return
  }
  res.json(row)
})

adminRouter.delete('/products/:id', async (req, res) => {
  await db.delete(schema.products).where(eq(schema.products.id, Number(req.params.id)))
  res.json({ ok: true })
})

/* ── Cotizaciones recibidas ─────────────────────────────────────────── */

// Más recientes primero.
adminRouter.get('/quotes', async (_req, res) => {
  res.json(await db.select().from(schema.quotes).orderBy(desc(schema.quotes.createdAt)))
})

// Marcar como atendido / no atendido.
adminRouter.put('/quotes/:id', async (req, res) => {
  const parsed = z.object({ handled: z.boolean() }).safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Datos inválidos' })
    return
  }
  const [row] = await db
    .update(schema.quotes)
    .set({ handled: parsed.data.handled })
    .where(eq(schema.quotes.id, Number(req.params.id)))
    .returning()
  if (!row) {
    res.status(404).json({ error: 'Cotización no encontrada' })
    return
  }
  res.json(row)
})

adminRouter.delete('/quotes/:id', async (req, res) => {
  await db.delete(schema.quotes).where(eq(schema.quotes.id, Number(req.params.id)))
  res.json({ ok: true })
})

/* ── Resumen para el inicio del panel ────────────────────────────────── */

adminRouter.get('/stats', async (_req, res) => {
  const [products, quotes] = await Promise.all([
    db.select({ id: schema.products.id, published: schema.products.published }).from(schema.products),
    db.select({ id: schema.quotes.id, handled: schema.quotes.handled }).from(schema.quotes),
  ])
  res.json({
    products: products.length,
    productsPublished: products.filter((p) => p.published).length,
    quotes: quotes.length,
    quotesPending: quotes.filter((q) => !q.handled).length,
  })
})
