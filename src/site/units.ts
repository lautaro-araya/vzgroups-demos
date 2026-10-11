/**
 * Unidades del holding. Sólo Vetlain tiene sitio propio; Vetclean y VZModular
 * se muestran como tarjeta hasta que el cliente entregue su contenido.
 * Los textos describen lo que cada unidad hace, sin cifras ni promesas que no
 * estén verificadas (ver PRODUCT.md).
 */
export type Unit = {
  id: 'vetlain' | 'vetclean' | 'vzmodular'
  name: string
  area: string
  text: string
  /** Sitio propio (externo). */
  href: string | null
  /** Estado visible cuando la unidad no está operando con normalidad. */
  status: string | null
}

export const UNITS: Unit[] = [
  {
    id: 'vetlain',
    name: 'Vetlain',
    area: 'Control de plagas',
    text: 'Desratización, desinsectación, control de aves y sanitización para empresas y hogares, con certificación ISO 9001.',
    href: 'https://www.vetlain.cl',
    status: null,
  },
  {
    id: 'vetclean',
    name: 'Vetclean',
    area: 'Aseo e higiene industrial',
    text: 'Aseo e higiene para plantas, bodegas y espacios de trabajo.',
    href: null,
    status: 'Próximamente',
  },
  {
    id: 'vzmodular',
    name: 'VZModular',
    area: 'Capacitación',
    text: 'Capacitación para equipos de trabajo en prevención y buenas prácticas sanitarias.',
    href: null,
    status: null,
  },
]
