/**
 * /cotizacion — la lista armada en el catálogo + el formulario para enviarla.
 * Sin productos funciona como formulario de contacto (el mensaje pasa a ser
 * obligatorio). Valida con las mismas reglas que el servidor.
 */
import { useState } from 'react'
import type { FocusEvent, FormEvent, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Seo } from '../components/Seo'
import { quoteList, useQuoteList } from '../lib/quote-list'
import { useSiteContent } from '../lib/site-content'
import { QUOTE_LIMITS, normalizeChileanPhone, validateQuote } from '../lib/quote-validation'
import type { QuoteErrors, QuoteField, QuoteInput } from '../lib/quote-validation'
import {
  SiteShell,
  Crumbs,
  QtyStepper,
  ArrowGlyph,
  CheckGlyph,
  TrashGlyph,
  WhatsappGlyph,
  PhoneGlyph,
  MailGlyph,
  PinGlyph,
  assetUrl,
  btnPrimary,
} from '../site/chrome'

const EMPTY: QuoteInput = { name: '', company: '', email: '', phone: '', comuna: '', message: '' }

function Field({
  id,
  label,
  optional,
  error,
  children,
}: {
  id: string
  label: string
  optional?: boolean
  error?: string
  children: ReactNode
}) {
  return (
    <div>
      <label htmlFor={id} className="flex items-baseline justify-between text-[0.95rem] font-semibold">
        {label}
        {optional && <span className="text-sm font-normal text-vz-muted">Opcional</span>}
      </label>
      <div className="mt-1.5">{children}</div>
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm font-semibold text-[#b42318]">
          {error}
        </p>
      )}
    </div>
  )
}

const inputCls = (err?: string) =>
  `h-12 w-full border bg-white px-3 placeholder:text-vz-muted focus:outline-none focus:ring-2 focus:ring-vz-blue/30 ${
    err ? 'border-[#b42318]' : 'border-vz-line focus:border-vz-blue'
  }`

export default function QuotePage() {
  const lines = useQuoteList()
  const { phone, telUrl, email, address, whatsappUrl } = useSiteContent()
  const [form, setForm] = useState<QuoteInput>(EMPTY)
  const [errors, setErrors] = useState<QuoteErrors>({})
  const [website, setWebsite] = useState('') // honeypot
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [serverError, setServerError] = useState('')
  const [sentCount, setSentCount] = useState(0)

  const units = lines.reduce((n, l) => n + l.qty, 0)

  const set = (k: QuoteField) => (e: { target: { value: string } }) => {
    setForm((f) => ({ ...f, [k]: e.target.value }))
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }))
  }

  function formatPhone(e: FocusEvent<HTMLInputElement>) {
    const n = normalizeChileanPhone(e.target.value)
    if (n) setForm((f) => ({ ...f, phone: n }))
  }

  async function submit(e: FormEvent) {
    e.preventDefault()
    const result = validateQuote(form, lines.length > 0)
    if (!result.ok) {
      setErrors(result.errors)
      const first = Object.keys(result.errors)[0]
      document.getElementById(`q-${first}`)?.focus()
      return
    }
    setStatus('sending')
    setServerError('')
    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...result.value,
          website,
          items: lines.map((l) => ({ slug: l.slug, qty: l.qty })),
        }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        if (data?.fields) setErrors(data.fields)
        throw new Error(data?.error ?? 'No pudimos enviar la solicitud.')
      }
      setSentCount(lines.length)
      quoteList.clear()
      setForm(EMPTY)
      setStatus('sent')
      window.scrollTo({ top: 0 })
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'No pudimos enviar la solicitud.')
      setStatus('error')
    }
  }

  return (
    <SiteShell>
      <Seo
        title="Solicitar cotización"
        description="Envía tu lista de productos o tu consulta a VZ Groups y recibe la cotización por correo o WhatsApp."
        path="/cotizacion"
      />

      <section className="border-b border-vz-line bg-vz-mist">
        <div className="mx-auto max-w-site px-5 py-8">
          <Crumbs items={[{ label: 'Cotización' }]} />
          <h1 className="mt-5 text-[clamp(2rem,4.4vw,3.2rem)] font-extrabold leading-[1.04] tracking-[-0.02em]" style={{ fontStretch: '112%' }}>
            {status === 'sent' ? 'Solicitud enviada' : 'Solicitar cotización'}
          </h1>
        </div>
      </section>

      {status === 'sent' ? (
        <section className="mx-auto max-w-site px-5 py-14">
          <div className="max-w-2xl border-t-2 border-vz-green pt-6">
            <p className="flex items-center gap-3 font-display text-xl font-bold">
              <span className="grid h-9 w-9 place-items-center bg-vz-green text-white"><CheckGlyph className="h-5 w-5" /></span>
              Recibimos tu {sentCount ? `lista de ${sentCount} producto${sentCount === 1 ? '' : 's'}` : 'consulta'}.
            </p>
            <p className="mt-4 text-lg text-vz-ink-soft">
              El equipo comercial de VZ Groups te contactará con la cotización. Si es urgente, escríbenos por WhatsApp.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/productos" className={btnPrimary}>Seguir viendo productos</Link>
              {whatsappUrl && (
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-2 py-3 font-semibold hover:text-vz-blue">
                  <WhatsappGlyph className="h-5 w-5 text-vz-green" /> WhatsApp
                </a>
              )}
            </div>
          </div>
        </section>
      ) : (
        <div className="mx-auto grid max-w-site grid-cols-1 gap-12 px-5 py-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          {/* Lista */}
          <section aria-labelledby="tu-lista">
            <div className="flex items-baseline justify-between gap-4 border-b border-vz-ink pb-3">
              <h2 id="tu-lista" className="font-display text-xl font-bold">Tu lista</h2>
              {lines.length > 0 && (
                <span className="tabular text-[0.95rem] text-vz-muted">
                  {lines.length} producto{lines.length === 1 ? '' : 's'} · {units} u.
                </span>
              )}
            </div>
            {lines.length === 0 ? (
              <div className="py-8">
                <p className="text-vz-ink-soft">
                  Tu lista está vacía. Puedes{' '}
                  <Link to="/productos" className="font-semibold text-vz-blue underline">agregar productos desde el catálogo</Link>{' '}
                  o escribirnos directamente lo que necesitas en el formulario.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-vz-line">
                {lines.map((l) => (
                  <li key={l.slug} className="flex items-center gap-4 py-4">
                    <div className="grid h-20 w-20 shrink-0 place-items-center border border-vz-line bg-white p-1.5">
                      {l.image && <img src={assetUrl(l.image) ?? undefined} alt="" className="max-h-full max-w-full object-contain" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <Link to={`/productos/${l.slug}`} className="font-display text-lg font-bold leading-tight hover:text-vz-blue">
                        {l.name}
                      </Link>
                      <div className="mt-2 flex items-center gap-3">
                        <QtyStepper size="sm" value={l.qty} onChange={(n) => quoteList.setQty(l.slug, n)} label={`Cantidad de ${l.name}`} />
                        <button type="button" onClick={() => quoteList.remove(l.slug)}
                          className="inline-flex items-center gap-1.5 px-2 py-2 text-sm font-semibold text-vz-muted hover:text-[#b42318]">
                          <TrashGlyph className="h-4 w-4" /> Quitar
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {lines.length > 0 && (
              <Link to="/productos" className="mt-2 inline-flex items-center gap-1.5 font-semibold text-vz-blue hover:underline">
                Agregar más productos <ArrowGlyph className="h-4 w-4" />
              </Link>
            )}

            <div className="mt-12 border-t border-vz-line pt-6 text-[0.95rem]">
              <h2 className="font-display text-base font-bold">¿Prefieres hablar con alguien?</h2>
              <ul className="mt-3 space-y-2 text-vz-ink-soft">
                {whatsappUrl && (
                  <li><a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-vz-blue"><WhatsappGlyph className="h-5 w-5 text-vz-green" /> WhatsApp</a></li>
                )}
                {phone && <li><a href={telUrl} className="inline-flex items-center gap-2 hover:text-vz-blue"><PhoneGlyph className="h-5 w-5" /> {phone}</a></li>}
                {email && <li><a href={`mailto:${email}`} className="inline-flex items-center gap-2 hover:text-vz-blue"><MailGlyph className="h-5 w-5" /> {email}</a></li>}
                {address && <li className="inline-flex items-center gap-2"><PinGlyph className="h-5 w-5" /> {address}</li>}
              </ul>
            </div>
          </section>

          {/* Formulario */}
          <section aria-labelledby="tus-datos">
            <form onSubmit={submit} noValidate className="relative border border-vz-line bg-white p-6 sm:p-8">
              <h2 id="tus-datos" className="font-display text-xl font-bold">Tus datos</h2>
              <p className="mt-1 text-[0.95rem] text-vz-ink-soft">Te respondemos por correo o WhatsApp. No necesitas crear una cuenta.</p>

              <div className="mt-6 grid gap-5">
                <Field id="q-name" label="Nombre" error={errors.name}>
                  <input id="q-name" autoComplete="name" value={form.name} onChange={set('name')} maxLength={QUOTE_LIMITS.nameMax}
                    aria-invalid={!!errors.name} aria-describedby={errors.name ? 'q-name-error' : undefined} className={inputCls(errors.name)} />
                </Field>
                <Field id="q-company" label="Empresa" optional error={errors.company}>
                  <input id="q-company" autoComplete="organization" value={form.company} onChange={set('company')} maxLength={QUOTE_LIMITS.companyMax}
                    aria-invalid={!!errors.company} className={inputCls(errors.company)} />
                </Field>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field id="q-phone" label="Teléfono" error={errors.phone}>
                    <input id="q-phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="Ej: 9 1234 5678" value={form.phone}
                      onChange={set('phone')} onBlur={formatPhone} aria-invalid={!!errors.phone}
                      aria-describedby={errors.phone ? 'q-phone-error' : undefined} className={inputCls(errors.phone)} />
                  </Field>
                  <Field id="q-email" label="Correo" optional error={errors.email}>
                    <input id="q-email" type="email" autoComplete="email" value={form.email} onChange={set('email')}
                      aria-invalid={!!errors.email} aria-describedby={errors.email ? 'q-email-error' : undefined} className={inputCls(errors.email)} />
                  </Field>
                </div>
                <Field id="q-comuna" label="Comuna" optional error={errors.comuna}>
                  <input id="q-comuna" autoComplete="address-level2" value={form.comuna} onChange={set('comuna')} maxLength={QUOTE_LIMITS.comunaMax}
                    aria-invalid={!!errors.comuna} className={inputCls(errors.comuna)} />
                </Field>
                <Field id="q-message" label={lines.length ? 'Comentarios' : '¿Qué necesitas?'} optional={lines.length > 0} error={errors.message}>
                  <textarea id="q-message" rows={4} value={form.message} onChange={set('message')} maxLength={QUOTE_LIMITS.messageMax}
                    placeholder={lines.length ? 'Plazos, lugar de entrega, consultas técnicas…' : 'Ej: estaciones de cebo para una bodega de 800 m²'}
                    aria-invalid={!!errors.message} aria-describedby={errors.message ? 'q-message-error' : undefined}
                    className={`${inputCls(errors.message)} h-auto py-2.5`} />
                </Field>
                {/* Honeypot: invisible para personas, los bots lo llenan. */}
                <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                  <label>Sitio web<input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} /></label>
                </div>
              </div>

              {status === 'error' && serverError && (
                <p role="alert" className="mt-5 border border-[#f0b8b2] bg-[#fdf1f0] px-4 py-3 text-[0.95rem] text-[#7a1a12]">
                  {serverError}
                  {whatsappUrl && <> Puedes intentar de nuevo o <a href={whatsappUrl} className="font-semibold underline">escribirnos por WhatsApp</a>.</>}
                </p>
              )}

              <button type="submit" disabled={status === 'sending'} className={`${btnPrimary} mt-6 w-full py-3.5 text-base`}>
                {status === 'sending'
                  ? 'Enviando…'
                  : lines.length
                    ? `Enviar solicitud de cotización (${lines.length})`
                    : 'Enviar consulta'}
              </button>
            </form>
          </section>
        </div>
      )}
    </SiteShell>
  )
}
