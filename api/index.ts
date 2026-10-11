/**
 * Punto de entrada serverless para Vercel.
 * Vercel enruta /api/* a esta función (ver rewrites en vercel.json).
 *
 * La app de Express se construye de forma perezosa dentro del handler, envuelta
 * en try/catch: si algo falla al inicializar (import o construcción), devolvemos
 * el error como JSON en vez de un crash opaco (FUNCTION_INVOCATION_FAILED).
 */
import type { IncomingMessage, ServerResponse } from 'http'

type Handler = (req: IncomingMessage, res: ServerResponse) => void

let app: Handler | null = null

async function getApp(): Promise<Handler> {
  if (app) return app
  const { createApp } = await import('../server/app.js')
  app = createApp() as unknown as Handler
  return app
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  try {
    const a = await getApp()
    return a(req, res)
  } catch (err) {
    const detail = err instanceof Error ? (err.stack ?? err.message) : String(err)
    console.error('[api] fallo de inicialización:', detail)
    res.statusCode = 500
    res.setHeader('content-type', 'application/json; charset=utf-8')
    res.end(JSON.stringify({ error: 'init_failed', detail }))
  }
}
