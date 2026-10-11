/** Íconos de servicio, indexados por el campo `icon` de la BD. */
import type { SVGProps, ReactElement } from 'react'
import { Glyph } from './chrome'

const glyphs: Record<string, (p: SVGProps<SVGSVGElement>) => ReactElement> = {
  /**
   * Cara de roedor de frente: orejas redondas, ojos, hocico y bigotes.
   * De frente y no de perfil a propósito: el perfil con cola se vuelve una
   * mancha ilegible a los 36 px a los que se usa en las tarjetas de servicio.
   */
  rodent: (p) => (
    <Glyph {...p}>
      <path d="M12 19.4c-3.1 0-5.6-2.3-5.6-5.2 0-2.4 1.7-4.4 4-4.9 .5-.1 1-.2 1.6-.2s1.1.1 1.6.2c2.3.5 4 2.5 4 4.9 0 2.9-2.5 5.2-5.6 5.2z" />
      <circle cx="6.8" cy="8" r="2.9" />
      <circle cx="17.2" cy="8" r="2.9" />
      <path d="M10.2 13.6h.01M13.8 13.6h.01" />
      <path d="M12 16.4h.01" />
      <path d="M9.6 17.6l-4.4 1.6M14.4 17.6l4.4 1.6" />
    </Glyph>
  ),
  insect: (p) => (
    <Glyph {...p}>
      <ellipse cx="12" cy="13" rx="3.5" ry="5.5" />
      <path d="M12 7.5V4M10 5l2 2M14 5l-2 2" />
      <path d="M8.5 10L5 8M8.5 13H4.5M8.5 16l-3.2 1.8" />
      <path d="M15.5 10L19 8M15.5 13H19.5M15.5 16l3.2 1.8" />
    </Glyph>
  ),
  bird: (p) => (
    <Glyph {...p}>
      <path d="M4 15.5c3-1 4.5-4.5 7.5-4.5.9 0 1.6.2 2.2.6" />
      <path d="M13.7 11.6c1-2.3 3.2-3.9 5.8-3.9-1 1.6-1.1 2.8-.6 4 -1.2 4-4.8 6.8-9.3 6.8-1.9 0-3.4-.4-4.6-1.1 2 0 3.6-.6 4.6-1.7" />
    </Glyph>
  ),
  spray: (p) => (
    <Glyph {...p}>
      <rect x="8" y="9" width="7" height="12" />
      <path d="M8 9V6h4v3M12 6V4h3" />
      <path d="M18 6h1M18 9h2M19 12h1M18 4h1" />
    </Glyph>
  ),
  building: (p) => (
    <Glyph {...p}>
      <rect x="4" y="3" width="10" height="18" />
      <rect x="14" y="9" width="6" height="12" />
      <path d="M7 7h2M7 11h2M7 15h2M17 13h0M17 17h0" />
    </Glyph>
  ),
  training: (p) => (
    <Glyph {...p}>
      <path d="M12 4L2.5 8.5 12 13l9.5-4.5L12 4z" />
      <path d="M6 10.5V16c0 1.7 2.7 3 6 3s6-1.3 6-3v-5.5" />
      <path d="M20.5 9v5" />
    </Glyph>
  ),
  shield: (p) => (
    <Glyph {...p}>
      <path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z" />
      <path d="M9 12l2 2 4-4" />
    </Glyph>
  ),
}

/** Catálogo de iconos disponibles, para los selectores del panel. */
export const SERVICE_ICONS: { id: string; label: string }[] = [
  { id: 'rodent', label: 'Roedor (ratas y ratones)' },
  { id: 'insect', label: 'Insecto' },
  { id: 'bird', label: 'Ave' },
  { id: 'spray', label: 'Desinfección (spray)' },
  { id: 'building', label: 'Edificio (plantas y bodegas)' },
  { id: 'training', label: 'Capacitación' },
  { id: 'shield', label: 'Escudo (garantía)' },
]

export function ServiceIcon({ icon, ...props }: { icon: string | null } & SVGProps<SVGSVGElement>) {
  const Comp = glyphs[icon ?? 'shield'] ?? glyphs.shield
  return Comp(props)
}
