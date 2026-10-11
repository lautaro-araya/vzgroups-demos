/** Solicitudes de cotización recibidas desde el sitio. */
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, ApiError } from '../lib/api'
import type { Quote } from '../lib/types'
import { PageHeading, Card, Button, Notice, Loading } from './ui'

function formatWhen(iso: string): string {
  try {
    return new Intl.DateTimeFormat('es-CL', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso))
  } catch {
    return iso
  }
}

/** wa.me con el número del cliente y un saludo precargado. */
function whatsappUrl(phone: string, name: string): string {
  const digits = phone.replace(/\D/g, '')
  if (!digits) return ''
  const first = name.trim().split(/\s+/)[0] ?? ''
  return `https://wa.me/${digits}?text=${encodeURIComponent(`Hola ${first}, `)}`
}

export default function QuotesPanel() {
  const [quotes, setQuotes] = useState<Quote[] | null>(null)
  const [msg, setMsg] = useState<string | null>(null)
  const [show, setShow] = useState<'pendientes' | 'todas'>('pendientes')

  useEffect(() => {
    api
      .get<Quote[]>('/admin/quotes')
      .then(setQuotes)
      .catch((e) => setMsg(e instanceof ApiError ? e.message : 'No se pudieron cargar las cotizaciones'))
  }, [])

  async function toggle(q: Quote) {
    const updated = await api.put<Quote>(`/admin/quotes/${q.id}`, { handled: !q.handled })
    setQuotes((list) => list?.map((x) => (x.id === updated.id ? updated : x)) ?? null)
  }

  async function remove(q: Quote) {
    if (!confirm(`¿Eliminar la solicitud de ${q.name}?`)) return
    await api.del(`/admin/quotes/${q.id}`)
    setQuotes((list) => list?.filter((x) => x.id !== q.id) ?? null)
  }

  if (!quotes) return msg ? <Notice kind="error">{msg}</Notice> : <Loading />

  const pending = quotes.filter((q) => !q.handled).length
  const list = show === 'pendientes' ? quotes.filter((q) => !q.handled) : quotes

  return (
    <div>
      <PageHeading
        title="Cotizaciones"
        description={
          quotes.length
            ? `${quotes.length} en total · ${pending} sin atender. Llegan desde la página de cotización del sitio.`
            : 'Aquí aparecen las solicitudes que la gente envía desde el sitio.'
        }
      />

      {quotes.length > 0 && (
        <div className="mb-4 flex gap-2">
          {(['pendientes', 'todas'] as const).map((k) => (
            <button
              key={k}
              onClick={() => setShow(k)}
              className={`border-2 px-3 py-1.5 text-sm font-semibold ${show === k ? 'border-vz-blue bg-vz-blue-tint text-vz-blue-deep' : 'border-neutral-200 bg-white text-neutral-600'}`}
            >
              {k === 'pendientes' ? `Sin atender (${pending})` : `Todas (${quotes.length})`}
            </button>
          ))}
        </div>
      )}

      {list.length === 0 ? (
        <Card>
          <p className="text-sm text-neutral-500">
            {quotes.length ? 'No hay solicitudes sin atender. ' : 'Todavía no hay solicitudes. '}
            {quotes.length > 0 && (
              <button className="font-semibold text-vz-blue underline" onClick={() => setShow('todas')}>Ver todas</button>
            )}
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {list.map((q) => {
            const wa = whatsappUrl(q.phone, q.name)
            const units = q.items.reduce((n, it) => n + it.qty, 0)
            return (
              <Card key={q.id} className={q.handled ? 'opacity-60' : ''}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-base font-bold text-vz-ink">{q.name}</span>
                      {q.company && <span className="text-sm text-neutral-600">· {q.company}</span>}
                      {!q.handled && (
                        <span className="bg-vz-blue-tint px-1.5 py-0.5 text-[11px] font-bold uppercase text-vz-blue-deep">Nueva</span>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-neutral-500">
                      #{q.id} · {formatWhen(q.createdAt)}
                      {q.comuna ? ` · ${q.comuna}` : ''}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-2">
                    {wa && (
                      <a href={wa} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center border-2 border-vz-blue px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-vz-blue hover:bg-vz-blue-tint">
                        WhatsApp
                      </a>
                    )}
                    <a href={`tel:${q.phone.replace(/[^\d+]/g, '')}`}
                      className="inline-flex items-center border-2 border-neutral-300 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-vz-ink hover:border-vz-ink">
                      Llamar
                    </a>
                    {q.email && (
                      <a href={`mailto:${q.email}?subject=${encodeURIComponent(`Cotización VZ Groups #${q.id}`)}`}
                        className="inline-flex items-center border-2 border-neutral-300 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-vz-ink hover:border-vz-ink">
                        Correo
                      </a>
                    )}
                  </div>
                </div>

                <p className="mt-2 text-sm text-vz-ink">
                  <span className="font-semibold">{q.phone}</span>
                  {q.email && <span className="text-neutral-600"> · {q.email}</span>}
                </p>

                {q.items.length > 0 && (
                  <table className="mt-3 w-full border border-neutral-200 text-sm">
                    <thead className="bg-neutral-50 text-left text-xs uppercase text-neutral-500">
                      <tr>
                        <th className="px-3 py-1.5 font-semibold">Producto</th>
                        <th className="px-3 py-1.5 text-right font-semibold">Cant.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {q.items.map((it) => (
                        <tr key={it.slug} className="border-t border-neutral-100">
                          <td className="px-3 py-1.5">
                            <Link to={`/productos/${it.slug}`} target="_blank" className="hover:text-vz-blue hover:underline">{it.name}</Link>
                          </td>
                          <td className="px-3 py-1.5 text-right tabular-nums">{it.qty}</td>
                        </tr>
                      ))}
                      <tr className="border-t border-neutral-200 bg-neutral-50">
                        <td className="px-3 py-1.5 text-neutral-500">{q.items.length} productos</td>
                        <td className="px-3 py-1.5 text-right font-bold tabular-nums">{units}</td>
                      </tr>
                    </tbody>
                  </table>
                )}
                {q.message && <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-neutral-700">{q.message}</p>}

                <div className="mt-3 flex gap-2 border-t border-neutral-100 pt-3">
                  <Button variant="ghost" onClick={() => toggle(q)}>
                    {q.handled ? 'Marcar sin atender' : 'Marcar atendida'}
                  </Button>
                  <Button variant="danger" onClick={() => remove(q)}>
                    Eliminar
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
