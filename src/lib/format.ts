/**
 * Formatea una fecha simple 'YYYY-MM-DD' (columnas `date` de Postgres).
 * Se construye con los componentes por separado a propósito: `new Date('2026-08-03')`
 * se interpreta como medianoche UTC y en Chile mostraría el día anterior.
 */
export function formatDay(ymd: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(ymd)
  if (!m) return formatDate(ymd)
  try {
    const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
    return new Intl.DateTimeFormat('es-CL', { dateStyle: 'long' }).format(d)
  } catch {
    return ymd
  }
}

/** Formatea una fecha ISO a texto legible en español de Chile. */
export function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat('es-CL', { dateStyle: 'long' }).format(new Date(iso))
  } catch {
    return iso.slice(0, 10)
  }
}
