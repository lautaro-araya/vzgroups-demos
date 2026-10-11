/**
 * Vocabulario del catálogo, compartido entre el sitio, el panel y la API
 * (server/routes/* lo importan para validar). Una sola fuente de verdad.
 *
 * - Líneas de producto: el primer nivel del catálogo (/productos/linea/:id).
 * - Plagas: la segunda entrada al catálogo ("productos por plaga"). Las que
 *   tienen ficha en la Pestología de vetlain.cl enlazan a ella.
 */

export type ProductLineId = 'roedores' | 'insectos' | 'aves'

export type ProductLine = {
  id: ProductLineId
  name: string
  /** Frase corta para tarjetas y la cabecera de la línea. */
  blurb: string
  icon: 'rodent' | 'insect' | 'bird'
}

export const PRODUCT_LINES: ProductLine[] = [
  {
    id: 'roedores',
    name: 'Control de roedores',
    blurb: 'Estaciones de cebo, trampas mecánicas y adhesivas, dispositivos sin veneno y sellado de accesos.',
    icon: 'rodent',
  },
  {
    id: 'insectos',
    name: 'Control de insectos',
    blurb: 'Lámparas UV de captura, trampas de monitoreo para rastreros y atrayentes para voladores.',
    icon: 'insect',
  },
  {
    id: 'aves',
    name: 'Control de aves',
    blurb: 'Pinchos disuasorios y trampas de captura viva para palomas en techos, aleros y bodegas.',
    icon: 'bird',
  },
]

export const LINE_IDS = PRODUCT_LINES.map((l) => l.id) as [ProductLineId, ...ProductLineId[]]

export function lineById(id: string): ProductLine | undefined {
  return PRODUCT_LINES.find((l) => l.id === id)
}

export type Pest = {
  slug: string
  name: string
  /** Ficha en la Pestología de Vetlain, si existe. */
  vetlainUrl: string | null
}

const VETLAIN = 'https://www.vetlain.cl/pestologia/'

export const PESTS: Pest[] = [
  { slug: 'ratas-y-ratones', name: 'Ratas y ratones', vetlainUrl: VETLAIN + 'roedores' },
  { slug: 'cucarachas', name: 'Cucarachas', vetlainUrl: VETLAIN + 'cucarachas' },
  { slug: 'hormigas', name: 'Hormigas', vetlainUrl: VETLAIN + 'hormigas' },
  { slug: 'moscas-y-mosquitos', name: 'Moscas y mosquitos', vetlainUrl: VETLAIN + 'moscas-y-mosquitos' },
  { slug: 'pulgas', name: 'Pulgas', vetlainUrl: VETLAIN + 'pulgas' },
  { slug: 'plagas-de-almacen', name: 'Plagas de granos y almacén', vetlainUrl: null },
  { slug: 'palomas', name: 'Palomas y aves', vetlainUrl: VETLAIN + 'aves' },
]

export const PEST_SLUGS = PESTS.map((p) => p.slug) as [string, ...string[]]

export function pestBySlug(slug: string): Pest | undefined {
  return PESTS.find((p) => p.slug === slug)
}
