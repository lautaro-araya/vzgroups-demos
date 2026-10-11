/**
 * Lista de cotización del visitante: productos y cantidades que irá a pedir.
 *
 * Vive en localStorage (sobrevive a recargas y a volver otro día) y se expone
 * como un store externo para React (useSyncExternalStore), así el contador del
 * header, los botones "Agregar" y la página /cotizacion ven siempre lo mismo.
 * Guarda nombre e imagen para pintar la lista sin esperar a la API; al enviar,
 * el servidor toma los nombres reales del catálogo.
 */
import { useSyncExternalStore } from 'react'
import { QUOTE_LIMITS } from './quote-validation'

export type QuoteLine = { slug: string; name: string; image: string | null; qty: number }

const KEY = 'vz.quote.v1'
const EMPTY: QuoteLine[] = []

let lines: QuoteLine[] = load()
const listeners = new Set<() => void>()

function load(): QuoteLine[] {
  if (typeof window === 'undefined') return EMPTY
  try {
    const raw = JSON.parse(window.localStorage.getItem(KEY) ?? '[]')
    if (!Array.isArray(raw)) return EMPTY
    return raw
      .filter((l) => l && typeof l.slug === 'string' && typeof l.name === 'string')
      .map((l) => ({ slug: l.slug, name: l.name, image: l.image ?? null, qty: clampQty(Number(l.qty)) }))
  } catch {
    return EMPTY
  }
}

function clampQty(n: number): number {
  return Number.isFinite(n) ? Math.min(QUOTE_LIMITS.maxQty, Math.max(1, Math.round(n))) : 1
}

function commit(next: QuoteLine[]) {
  lines = next
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    // Navegación privada o almacenamiento lleno: la lista vive solo en memoria.
  }
  listeners.forEach((l) => l())
}

// Otra pestaña cambió la lista: sincronizar.
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === KEY) {
      lines = load()
      listeners.forEach((l) => l())
    }
  })
}

export const quoteList = {
  add(item: Omit<QuoteLine, 'qty'>, qty = 1) {
    const found = lines.find((l) => l.slug === item.slug)
    if (found) {
      commit(lines.map((l) => (l.slug === item.slug ? { ...l, qty: clampQty(l.qty + qty) } : l)))
    } else if (lines.length < QUOTE_LIMITS.maxItems) {
      commit([...lines, { ...item, qty: clampQty(qty) }])
    }
  },
  setQty(slug: string, qty: number) {
    commit(lines.map((l) => (l.slug === slug ? { ...l, qty: clampQty(qty) } : l)))
  },
  remove(slug: string) {
    commit(lines.filter((l) => l.slug !== slug))
  },
  clear() {
    commit(EMPTY)
  },
}

function subscribe(cb: () => void) {
  listeners.add(cb)
  return () => listeners.delete(cb)
}

/** La lista actual. En el servidor (prerender) siempre vacía. */
export function useQuoteList(): QuoteLine[] {
  return useSyncExternalStore(
    subscribe,
    () => lines,
    () => EMPTY,
  )
}
