/**
 * Carga inicial de datos (idempotente: se puede correr varias veces).
 *
 * Se usa desde:
 *  - CLI local:  npm run db:seed  (server/db/seed-cli.ts)
 *  - Vercel:     GET /api/setup?token=...  (server/routes/setup.ts)
 *
 * Por defecto sólo INSERTA lo que falta y nunca pisa lo editado en el panel.
 * Con `overwrite: true` re-sincroniza los productos con el texto del código.
 */
import { db, schema } from './index.js'
import { hashPassword } from '../auth.js'
import { productsSeed } from './seed-products.js'
import { CONTENT_FIELDS } from '../../src/lib/site-fields.js'

export async function runSeed({ overwrite = false }: { overwrite?: boolean } = {}) {
  /* ── Administrador ─────────────────────────────────────────────────── */
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@vzgroups.com'
  const adminPassword = process.env.ADMIN_PASSWORD || 'vzgroups2026'
  const passwordHash = await hashPassword(adminPassword)
  await db
    .insert(schema.adminUsers)
    .values({ email: adminEmail, passwordHash, name: 'Administrador VZ Groups' })
    .onConflictDoNothing({ target: schema.adminUsers.email })
  console.log(`✓ admin: ${adminEmail}`)

  /* ── Contenido suelto ──────────────────────────────────────────────── */
  for (const f of CONTENT_FIELDS) {
    await db
      .insert(schema.siteContent)
      .values({ key: f.key, value: f.default, label: f.label, group: f.group })
      .onConflictDoNothing({ target: schema.siteContent.key })
  }
  console.log(`✓ contenido suelto: ${CONTENT_FIELDS.length} claves`)

  /* ── Productos ─────────────────────────────────────────────────────── */
  let i = 0
  for (const p of productsSeed) {
    const values = {
      slug: p.slug,
      name: p.name,
      line: p.line,
      pests: p.pests,
      brand: p.brand ?? null,
      featured: p.featured ?? false,
      summary: p.summary,
      bodyMd: p.bodyMd,
      image: p.image,
      sortOrder: i++,
    }
    const insert = db.insert(schema.products).values(values)
    await (overwrite
      ? insert.onConflictDoUpdate({ target: schema.products.slug, set: { ...values, updatedAt: new Date() } })
      : insert.onConflictDoNothing({ target: schema.products.slug }))
  }
  console.log(`✓ productos: ${productsSeed.length}${overwrite ? ' (re-sincronizados)' : ''}`)

  return { admin: adminEmail, contenido: CONTENT_FIELDS.length, productos: productsSeed.length, overwrite }
}
