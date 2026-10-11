/**
 * Cliente de base de datos (Neon serverless + Drizzle).
 * Usa el driver HTTP de Neon, ideal para funciones serverless en Vercel.
 *
 * La conexión se inicializa de forma perezosa (al primer uso), no al importar,
 * para que la app pueda arrancar aunque falte DATABASE_URL: en ese caso solo
 * fallan las rutas que tocan la base, no el servidor entero.
 */
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema.js'
import { getDatabaseUrl } from '../env.js'

function createDb() {
  return drizzle(neon(getDatabaseUrl()), { schema })
}

type DB = ReturnType<typeof createDb>

let instance: DB | null = null
function getDb(): DB {
  return (instance ??= createDb())
}

// Proxy: permite seguir usando `db.select()...` con inicialización perezosa.
export const db = new Proxy({} as DB, {
  get(_target, prop) {
    const real = getDb() as unknown as Record<string | symbol, unknown>
    const value = real[prop]
    return typeof value === 'function' ? (value as (...a: unknown[]) => unknown).bind(real) : value
  },
})

export { schema }
