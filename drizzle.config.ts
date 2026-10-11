import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'
import { getDatabaseUrl } from './server/env'

// `generate` no necesita conexión; solo push/migrate. Placeholder para no romper
// `db:generate` cuando no hay variables de Postgres en local.
let url = 'postgresql://placeholder/placeholder'
try {
  url = getDatabaseUrl(true)
} catch {
  /* sin conexión: OK para generate */
}

export default defineConfig({
  schema: './server/db/schema.ts',
  out: './server/db/migrations',
  dialect: 'postgresql',
  dbCredentials: { url },
})
