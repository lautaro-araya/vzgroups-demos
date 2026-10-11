/**
 * Arranque de la base desde Vercel (sin terminal local).
 *
 *   GET /api/setup?token=EL_TOKEN
 *   GET /api/setup?token=EL_TOKEN&overwrite=1
 *
 * Crea las tablas (DDL), aplica los cambios de esquema posteriores (ALTERS) y
 * carga el contenido inicial (seed). Es idempotente: si las tablas ya existen o
 * los datos ya están, no rompe. Hay que volver a visitarlo tras cada despliegue
 * que cambie el esquema.
 *
 * Con `overwrite=1` el seed además re-sincroniza servicios, páginas y productos
 * con el texto del código (descarta ediciones hechas en el panel en esas tablas).
 *
 * Protegido por SETUP_TOKEN (variable de entorno). Tras dejar la base lista,
 * conviene borrar SETUP_TOKEN de Vercel para deshabilitar el endpoint.
 */
import { Router } from 'express'
import { neon } from '@neondatabase/serverless'
import { DDL, ALTERS } from '../db/ddl.js'
import { runSeed } from '../db/seed.js'
import { getDatabaseUrl } from '../env.js'

export const setupRouter = Router()

async function handleSetup(token: unknown, overwrite: boolean): Promise<
  | { ok: true; tablas: string[]; seed: Awaited<ReturnType<typeof runSeed>> }
  | { ok: false; status: number; error: string }
> {
  const expected = process.env.SETUP_TOKEN
  if (!expected) {
    return { ok: false, status: 400, error: 'SETUP_TOKEN no está configurado en el entorno.' }
  }
  if (token !== expected) {
    return { ok: false, status: 401, error: 'Token de setup inválido.' }
  }
  let url: string
  try {
    url = getDatabaseUrl(true) // conexión directa (mejor para DDL)
  } catch (e) {
    return { ok: false, status: 400, error: (e as Error).message }
  }

  const sql = neon(url)
  const trocear = (bloque: string) =>
    bloque
      .split('--> statement-breakpoint')
      .map((s) => s.trim())
      .filter(Boolean)

  // Primero crea lo que falte (DDL) y después aplica los cambios de esquema
  // posteriores (ALTERS), que son los que ponen al día una base ya creada.
  const tablas: string[] = []
  for (const stmt of [...trocear(DDL), ...trocear(ALTERS)]) {
    try {
      await sql.query(stmt)
      tablas.push('aplicada')
    } catch (err) {
      const code = (err as { code?: string })?.code
      const msg = (err as { message?: string })?.message ?? ''
      // 42P07: tabla ya existe · 42710: tipo/restricción ya existe → idempotente.
      if (code === '42P07' || code === '42710' || /already exists/i.test(msg)) {
        tablas.push('ya existía')
        continue
      }
      throw err
    }
  }

  const seed = await runSeed({ overwrite })
  return { ok: true, tablas, seed }
}

setupRouter.get('/', async (req, res) => {
  try {
    const result = await handleSetup(req.query.token, req.query.overwrite === '1')
    if (!result.ok) {
      res.status(result.status).json({ error: result.error })
      return
    }
    res.json(result)
  } catch (err) {
    console.error('[setup] error:', err)
    res.status(500).json({ error: 'Falló el arranque de la base.', detalle: String(err) })
  }
})
