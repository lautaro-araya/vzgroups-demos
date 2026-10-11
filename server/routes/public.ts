/**
 * API pública de lectura (la consume el sitio). Solo contenido publicado.
 * La lógica de consulta vive en server/content.ts (compartida con el prerender).
 */
import { Router } from 'express'
import { getSiteContentMap, getPublishedProducts, getProductBySlug } from '../content.js'

export const publicRouter = Router()

publicRouter.get('/content', async (_req, res) => {
  res.json(await getSiteContentMap())
})

publicRouter.get('/products', async (_req, res) => {
  res.json(await getPublishedProducts())
})

publicRouter.get('/products/:slug', async (req, res) => {
  const product = await getProductBySlug(req.params.slug)
  if (!product) {
    res.status(404).json({ error: 'Producto no encontrado' })
    return
  }
  res.json(product)
})
