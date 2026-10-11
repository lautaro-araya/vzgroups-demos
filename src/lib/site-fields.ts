/**
 * Campos de contenido suelto editables desde el panel (site_content).
 * Una sola lista para el seed, los valores por defecto del sitio y el editor.
 *
 * Los datos de contacto por defecto son los del sitio actual de vzgroups.com;
 * los que no conocemos con certeza quedan vacíos (el sitio los oculta) hasta
 * que el cliente los complete en el panel.
 */
export type ContentField = {
  key: string
  label: string
  group: 'contacto' | 'redes'
  default: string
  hint?: string
}

export const CONTENT_FIELDS: ContentField[] = [
  { key: 'contact.phone', label: 'Teléfono visible', group: 'contacto', default: '+56 9 3957 6915' },
  {
    key: 'contact.whatsapp',
    label: 'WhatsApp (solo números)',
    group: 'contacto',
    default: '56939576915',
    hint: 'Con código de país, sin + ni espacios. Ej: 56939576915',
  },
  { key: 'contact.email', label: 'Email de contacto', group: 'contacto', default: '' },
  { key: 'contact.address', label: 'Dirección', group: 'contacto', default: 'Talagante, Región Metropolitana' },
  { key: 'contact.hours', label: 'Horario de atención', group: 'contacto', default: '' },
  { key: 'social.facebook', label: 'Facebook (URL)', group: 'redes', default: '' },
  { key: 'social.instagram', label: 'Instagram (URL)', group: 'redes', default: '' },
  { key: 'social.linkedin', label: 'LinkedIn (URL)', group: 'redes', default: '' },
  { key: 'social.youtube', label: 'YouTube (URL)', group: 'redes', default: '' },
]

export const CONTENT_DEFAULTS: Record<string, string> = Object.fromEntries(
  CONTENT_FIELDS.map((f) => [f.key, f.default]),
)
