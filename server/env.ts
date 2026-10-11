/**
 * Resuelve la connection string de Postgres desde el entorno.
 * Acepta tanto DATABASE_URL (manual) como las variables que crea la integración
 * de Neon en Vercel (POSTGRES_URL, POSTGRES_URL_NON_POOLING, DATABASE_URL_UNPOOLED…).
 *
 * - Runtime serverless → conexión "pooled" (recomendada por Neon para HTTP).
 * - Migraciones / DDL   → conexión directa "unpooled" (más segura para DDL).
 */
const POOLED = ['DATABASE_URL', 'POSTGRES_URL']
const UNPOOLED = ['DATABASE_URL_UNPOOLED', 'POSTGRES_URL_NON_POOLING']

export function getDatabaseUrl(direct = false): string {
  const order = direct ? [...UNPOOLED, ...POOLED] : [...POOLED, ...UNPOOLED]
  for (const key of order) {
    const value = process.env[key]
    if (value) return value
  }
  throw new Error(
    'No hay connection string de Postgres. Define DATABASE_URL, o conecta Neon en ' +
      'Vercel (que provee POSTGRES_URL / DATABASE_URL_UNPOOLED).',
  )
}
