/**
 * Aviso por correo de cada solicitud de cotización.
 *
 * Envía por el SMTP de Gmail con una cuenta y una contraseña de aplicación
 * (Cuenta de Google → Seguridad → Contraseñas de aplicaciones).
 * Variables: SMTP_USER, SMTP_PASS y, opcional, QUOTE_NOTIFY_TO (lista separada
 * por comas; si falta se usa DEFAULT_RECIPIENTS).
 *
 * Si faltan las credenciales no se envía nada: la solicitud igual queda en la
 * base y visible en el panel, que es la fuente de verdad.
 */
import nodemailer from 'nodemailer'
import type { Quote } from './db/schema.js'

const DEFAULT_RECIPIENTS = [
  'echan@vzgroups.com',
  'vzamora@vzgroups.com',
  'varavena@vzgroups.com',
  'jennyp@vzgroups.com',
]

function recipients(): string[] {
  const raw = process.env.QUOTE_NOTIFY_TO
  if (!raw) return DEFAULT_RECIPIENTS
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)

/** wa.me con el número del cliente y un saludo precargado. */
function whatsappUrl(phone: string, name: string): string {
  const digits = phone.replace(/\D/g, '')
  if (!digits) return ''
  const first = name.trim().split(/\s+/)[0] ?? ''
  return `https://wa.me/${digits}?text=${encodeURIComponent(`Hola ${first}, `)}`
}

/** Asunto, HTML y texto plano del aviso de una cotización. */
export function buildQuoteEmail(q: Quote) {
  const site = (process.env.SITE_URL || 'https://www.vzgroups.com').replace(/\/$/, '')
  const fecha = q.createdAt.toLocaleString('es-CL', {
    timeZone: 'America/Santiago',
    dateStyle: 'full',
    timeStyle: 'short',
  })
  const units = q.items.reduce((n, it) => n + it.qty, 0)
  const who = q.company ? `${q.name} (${q.company})` : q.name
  const subject = q.items.length
    ? `Cotización web: ${q.items.length} producto${q.items.length === 1 ? '' : 's'} · ${who}`
    : `Consulta web: ${who}`
  const wa = whatsappUrl(q.phone, q.name)

  const rows = q.items
    .map(
      (it) =>
        `<tr><td style="padding:8px 12px;border-bottom:1px solid #e3e7ec">${esc(it.name)}</td>` +
        `<td style="padding:8px 12px;border-bottom:1px solid #e3e7ec;text-align:right;font-variant-numeric:tabular-nums">${it.qty}</td></tr>`,
    )
    .join('')

  const field = (label: string, value: string | null) =>
    value
      ? `<tr><td style="padding:4px 0;color:#5b6573;width:110px;vertical-align:top">${label}</td><td style="padding:4px 0">${esc(value).replace(/\n/g, '<br>')}</td></tr>`
      : ''

  const html = `<!doctype html><html lang="es"><body style="margin:0;background:#f3f5f7;font-family:Arial,Helvetica,sans-serif;color:#1c2127">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:24px 12px"><tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border:1px solid #dfe4ea">
<tr><td style="background:#2a4f9e;color:#ffffff;padding:18px 24px;font-size:13px;letter-spacing:.08em;text-transform:uppercase;font-weight:bold">VZ Groups · ${q.items.length ? 'Nueva solicitud de cotización' : 'Nueva consulta'}</td></tr>
<tr><td style="padding:24px">
<p style="margin:0 0 4px;font-size:20px;font-weight:bold">${esc(who)}</p>
<p style="margin:0 0 20px;color:#5b6573;font-size:13px">Recibida el ${esc(fecha)}</p>
<table role="presentation" cellpadding="0" cellspacing="0" style="font-size:14px;margin-bottom:20px">
${field('Teléfono', q.phone)}${field('Correo', q.email)}${field('Empresa', q.company)}${field('Comuna', q.comuna)}${field('Mensaje', q.message)}
</table>
${
  q.items.length
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;border:1px solid #e3e7ec;margin-bottom:20px">
<tr style="background:#f3f5f7"><th align="left" style="padding:8px 12px">Producto</th><th align="right" style="padding:8px 12px">Cantidad</th></tr>${rows}
<tr><td style="padding:8px 12px;color:#5b6573">Total</td><td style="padding:8px 12px;text-align:right;font-weight:bold">${units} u.</td></tr></table>`
    : ''
}
${wa ? `<a href="${wa}" style="display:inline-block;background:#2a4f9e;color:#ffffff;text-decoration:none;padding:12px 18px;font-weight:bold;font-size:14px;margin-right:8px">Responder por WhatsApp</a>` : ''}
<a href="${site}/admin/cotizaciones" style="display:inline-block;border:1px solid #1c2127;color:#1c2127;text-decoration:none;padding:11px 18px;font-weight:bold;font-size:14px">Ver en el panel</a>
</td></tr></table></td></tr></table></body></html>`

  const text = [
    q.items.length ? 'Nueva solicitud de cotización desde vzgroups.com' : 'Nueva consulta desde vzgroups.com',
    '',
    `Nombre: ${q.name}`,
    `Empresa: ${q.company ?? '—'}`,
    `Teléfono: ${q.phone}`,
    `Correo: ${q.email ?? '—'}`,
    `Comuna: ${q.comuna ?? '—'}`,
    `Mensaje: ${q.message ?? '—'}`,
    '',
    ...q.items.map((it) => `- ${it.name} × ${it.qty}`),
    '',
    `Recibida: ${fecha}`,
    wa ? `WhatsApp: ${wa}` : '',
    `Panel: ${site}/admin/cotizaciones`,
  ].join('\n')

  return { subject, html, text }
}

/**
 * Envía el aviso. Nunca lanza: un fallo de correo no debe hacer fallar el
 * formulario, que ya guardó la solicitud. Devuelve si se envió.
 */
export async function notifyQuote(quote: Quote): Promise<boolean> {
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  const to = recipients()
  if (!user || !pass || !to.length) {
    console.warn('[mailer] SMTP_USER/SMTP_PASS sin configurar: no se envía aviso de la cotización', quote.id)
    return false
  }
  try {
    const { subject, html, text } = buildQuoteEmail(quote)
    const transport = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user, pass },
      connectionTimeout: 8000,
      greetingTimeout: 8000,
      socketTimeout: 10000,
    })
    await transport.sendMail({
      from: { name: 'Sitio VZ Groups', address: user },
      to,
      replyTo: quote.email ?? undefined,
      subject,
      html,
      text,
    })
    return true
  } catch (err) {
    console.error('[mailer] No se pudo enviar el aviso de la cotización', quote.id, err)
    return false
  }
}
