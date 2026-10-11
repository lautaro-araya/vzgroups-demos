/**
 * Recepción de solicitudes de cotización (público).
 *   POST /api/quote
 * Guarda la solicitud para verla en el panel y avisa por correo al equipo
 * comercial (server/mailer.ts).
 */
import { Router } from 'express'
import { z } from 'zod'
import { db, schema } from '../db/index.js'
import { hasDatabase, getPublishedProducts } from '../content.js'
import { notifyQuote } from '../mailer.js'
import { validateQuote, QUOTE_LIMITS } from '../../src/lib/quote-validation.js'

export const quoteRouter = Router()

// Forma del cuerpo; las reglas de cada campo están en validateQuote.
const quoteSchema = z.object({
  name: z.string().max(500).default(''),
  company: z.string().max(500).nullish(),
  email: z.string().max(500).nullish(),
  phone: z.string().max(100).default(''),
  comuna: z.string().max(500).nullish(),
  message: z.string().max(5000).nullish(),
  items: z
    .array(z.object({ slug: z.string().max(160), qty: z.number().int().min(1).max(QUOTE_LIMITS.maxQty) }))
    .max(QUOTE_LIMITS.maxItems)
    .default([]),
  // Honeypot anti-spam: campo oculto que los humanos dejan vacío.
  website: z.string().nullish(),
})

quoteRouter.post('/', async (req, res) => {
  const parsed = quoteSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Revisa los datos del formulario.' })
    return
  }
  const { website, items: rawItems, ...raw } = parsed.data
  if (website) {
    res.json({ ok: true })
    return
  }
  if (!hasDatabase()) {
    res.status(503).json({ error: 'El servicio de cotizaciones no está disponible en este momento.' })
    return
  }

  // Los nombres salen del catálogo, no del navegador: el correo y el panel
  // muestran el producto real aunque alguien manipule la petición.
  const catalog = new Map((await getPublishedProducts()).map((p) => [p.slug, p.name]))
  const items = rawItems
    .filter((it) => catalog.has(it.slug))
    .map((it) => ({ slug: it.slug, name: catalog.get(it.slug)!, qty: it.qty }))

  const result = validateQuote(
    {
      name: raw.name,
      company: raw.company ?? '',
      email: raw.email ?? '',
      phone: raw.phone,
      comuna: raw.comuna ?? '',
      message: raw.message ?? '',
    },
    items.length > 0,
  )
  if (!result.ok) {
    res.status(400).json({ error: 'Revisa los datos del formulario.', fields: result.errors })
    return
  }
  const v = result.value

  const [quote] = await db
    .insert(schema.quotes)
    .values({
      name: v.name,
      company: v.company || null,
      email: v.email || null,
      phone: v.phone,
      comuna: v.comuna || null,
      message: v.message || null,
      items,
    })
    .returning()
  // Se espera el envío antes de responder: en Vercel la función se congela al
  // responder y un envío pendiente se perdería. notifyQuote nunca lanza.
  await notifyQuote(quote)
  res.json({ ok: true, id: quote.id })
})
