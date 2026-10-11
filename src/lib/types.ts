/**
 * Tipos de lo que devuelve la API (fechas como string: así llegan por JSON).
 * Espejo de server/db/schema.ts.
 */
import type { ProductLineId } from './catalog'

export type Product = {
  id: number
  slug: string
  name: string
  line: ProductLineId
  pests: string[]
  brand: string | null
  summary: string | null
  bodyMd: string | null
  image: string | null
  featured: boolean
  sortOrder: number
  published: boolean
  seoTitle: string | null
  seoDescription: string | null
  updatedAt: string
}

export type QuoteItem = { slug: string; name: string; qty: number }

export type Quote = {
  id: number
  name: string
  company: string | null
  email: string | null
  phone: string
  comuna: string | null
  message: string | null
  items: QuoteItem[]
  handled: boolean
  createdAt: string
}

export type SiteContentRow = {
  key: string
  value: unknown
  label: string | null
  group: string | null
  updatedAt: string
}

export type AdminUser = { email: string; name?: string | null }
