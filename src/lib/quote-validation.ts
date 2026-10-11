/**
 * Reglas del formulario de cotización. Las usan el formulario del sitio (para
 * avisar junto a cada campo y autoformatear el teléfono) y POST /api/quote
 * (que las vuelve a aplicar: el navegador nunca es garantía).
 *
 * Módulo puro, sin React: también lo importa el servidor.
 */

export type QuoteInput = {
  name: string
  company: string
  email: string
  phone: string
  comuna: string
  message: string
}
export type QuoteField = keyof QuoteInput
export type QuoteErrors = Partial<Record<QuoteField | 'items', string>>

export const QUOTE_LIMITS = {
  nameMax: 80,
  companyMax: 120,
  comunaMax: 60,
  messageMax: 2000,
  maxItems: 60,
  maxQty: 9999,
} as const

/** Letras (con tildes, ñ, ü…), espacios, apóstrofo, punto y guion. */
const NAME_RE = /^[\p{L}\p{M}][\p{L}\p{M}' .-]*$/u
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
/** Lo que se permite escribir en un teléfono antes de normalizarlo. */
const PHONE_CHARS_RE = /^[\d\s+().-]+$/

const clean = (s: string) => s.trim().replace(/\s+/g, ' ')

/**
 * Normaliza un teléfono chileno a su forma escrita estándar, o null si no es
 * válido. Acepta cualquier separador y con o sin +56:
 *   "939576915", "9 3957 6915", "56939576915" → "+56 9 3957 6915"  (celular)
 *   "228153975"                               → "+56 2 2815 3975"  (fijo Santiago)
 *   "322123456"                               → "+56 32 212 3456"  (fijo regional)
 */
export function normalizeChileanPhone(raw: string): string | null {
  if (!PHONE_CHARS_RE.test(raw.trim())) return null
  let d = raw.replace(/\D/g, '')
  if (d.length === 11 && d.startsWith('56')) d = d.slice(2)
  if (d.length === 10 && d.startsWith('0')) d = d.slice(1)
  if (d.length !== 9 || !/^[2-9]/.test(d)) return null
  if (d[0] === '9' || d[0] === '2') return `+56 ${d[0]} ${d.slice(1, 5)} ${d.slice(5)}`
  return `+56 ${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5)}`
}

/**
 * Valida y limpia los datos de contacto de una cotización. `hasItems` indica
 * si la lista trae productos: sin productos, el mensaje pasa a ser obligatorio
 * (es una consulta general y necesitamos saber qué busca).
 */
export function validateQuote(
  input: QuoteInput,
  hasItems: boolean,
): { ok: true; value: QuoteInput } | { ok: false; errors: QuoteErrors } {
  const errors: QuoteErrors = {}
  const name = clean(input.name)
  const company = clean(input.company)
  const email = input.email.trim().toLowerCase()
  const comuna = clean(input.comuna)
  const message = input.message.trim()
  const phone = normalizeChileanPhone(input.phone)

  if (name.length < 2) errors.name = 'Escribe tu nombre.'
  else if (name.length > QUOTE_LIMITS.nameMax) errors.name = `Máximo ${QUOTE_LIMITS.nameMax} caracteres.`
  else if (!NAME_RE.test(name)) errors.name = 'Usa solo letras, sin números ni símbolos.'

  if (company.length > QUOTE_LIMITS.companyMax) errors.company = `Máximo ${QUOTE_LIMITS.companyMax} caracteres.`

  if (email && !EMAIL_RE.test(email)) errors.email = 'Revisa el correo, ej: nombre@empresa.cl.'

  if (!input.phone.trim()) errors.phone = 'Escribe un teléfono de contacto.'
  else if (!phone) errors.phone = 'Ingresa un teléfono chileno de 9 dígitos, ej: 9 3957 6915.'

  if (comuna) {
    if (comuna.length > QUOTE_LIMITS.comunaMax) errors.comuna = `Máximo ${QUOTE_LIMITS.comunaMax} caracteres.`
    else if (!NAME_RE.test(comuna)) errors.comuna = 'Usa solo letras, ej: Talagante.'
  }

  if (!hasItems && message.length < 5) errors.message = 'Cuéntanos qué necesitas cotizar.'
  else if (message.length > QUOTE_LIMITS.messageMax) errors.message = `Máximo ${QUOTE_LIMITS.messageMax} caracteres.`

  if (Object.keys(errors).length) return { ok: false, errors }
  return { ok: true, value: { name, company, email, phone: phone!, comuna, message } }
}
