/**
 * Esquema de la base de datos de VZ Groups (Neon / Postgres) — Drizzle ORM.
 *
 *  - admin_users  → login del panel.
 *  - site_content → valores sueltos editables (clave→valor): contacto, redes…
 *  - products     → catálogo (línea, plagas que controla, fabricante, ficha).
 *  - quotes       → solicitudes de cotización (lista de productos + datos).
 *
 * Mismo criterio que el proyecto Vetlain, del que sale esta base: categorías y
 * plagas son texto validado en la API (no enums de Postgres) para que sumar
 * una línea o una plaga no exija una migración.
 */
import { pgTable, serial, text, varchar, integer, boolean, jsonb, timestamp } from 'drizzle-orm/pg-core'

export const adminUsers = pgTable('admin_users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  name: varchar('name', { length: 120 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

export const siteContent = pgTable('site_content', {
  key: varchar('key', { length: 120 }).primaryKey(),
  value: jsonb('value').notNull(),
  label: text('label'),
  group: varchar('group', { length: 60 }),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

/**
 * Catálogo. `line` es una de PRODUCT_LINES y `pests` una lista de slugs de
 * PESTS (src/lib/catalog.ts). `featured` lo destaca en la portada.
 * No hay precio a propósito: se cotiza (el catálogo antiguo tenía precios
 * erróneos y el cliente debe auditarlos antes de publicarlos).
 */
export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 160 }).notNull().unique(),
  name: text('name').notNull(),
  line: varchar('line', { length: 40 }).notNull(),
  pests: jsonb('pests').$type<string[]>().default([]).notNull(),
  brand: text('brand'),
  summary: text('summary'),
  bodyMd: text('body_md'),
  image: text('image'),
  featured: boolean('featured').default(false).notNull(),
  sortOrder: integer('sort_order').default(0).notNull(),
  published: boolean('published').default(true).notNull(),
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

/** Solicitud de cotización. `items` guarda nombre y slug del momento del envío. */
export const quotes = pgTable('quotes', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 160 }).notNull(),
  company: varchar('company', { length: 200 }),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 60 }).notNull(),
  comuna: varchar('comuna', { length: 120 }),
  message: text('message'),
  items: jsonb('items').$type<{ slug: string; name: string; qty: number }[]>().default([]).notNull(),
  handled: boolean('handled').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

export type AdminUser = typeof adminUsers.$inferSelect
export type Product = typeof products.$inferSelect
export type Quote = typeof quotes.$inferSelect
