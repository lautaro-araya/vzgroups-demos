/**
 * Aplicación Express de VZ Groups.
 * Se usa en dos contextos:
 *  - Desarrollo: server/dev.ts la levanta en http://localhost:8787 y Vite le
 *    hace proxy de /api.
 *  - Producción: api/index.ts la exporta como función serverless de Vercel,
 *    montada en /api/*.
 */
import express from 'express'
import cookieParser from 'cookie-parser'
import type { Request, Response, NextFunction } from 'express'
import { authRouter } from './routes/auth.js'
import { publicRouter } from './routes/public.js'
import { adminRouter } from './routes/admin.js'
import { setupRouter } from './routes/setup.js'
import { robotsHandler, sitemapHandler } from './routes/seo.js'
import { quoteRouter } from './routes/quote.js'

export function createApp() {
  const app = express()

  app.use(express.json({ limit: '1mb' }))
  app.use(cookieParser())

  // robots.txt / sitemap.xml servidos en la raíz (Vercel reescribe hacia aquí).
  app.get('/robots.txt', robotsHandler)
  app.get('/sitemap.xml', sitemapHandler)

  const api = express.Router()

  api.get('/health', (_req, res) => {
    res.json({ ok: true, service: 'vzgroups-api' })
  })

  // Alias bajo /api por si el rewrite de Vercel entrega la ruta de destino.
  api.get('/robots', robotsHandler)
  api.get('/sitemap', sitemapHandler)

  api.use('/setup', setupRouter)
  api.use('/quote', quoteRouter)
  api.use('/auth', authRouter)
  api.use('/admin', adminRouter)
  api.use('/', publicRouter)

  app.use('/api', api)

  // 404 para rutas de API no encontradas.
  app.use('/api', (_req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' })
  })

  // Manejador de errores: evita filtrar detalles internos al cliente.
  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    console.error('[api] error no controlado:', err)
    res.status(500).json({ error: 'Error interno del servidor' })
  })

  return app
}
