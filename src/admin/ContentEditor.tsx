/** Edita el contenido suelto (site_content): contacto, redes, etc. */
import { useEffect, useState } from 'react'
import { api, ApiError } from '../lib/api'
import type { SiteContentRow } from '../lib/types'
import { PageHeading, Card, Field, Input, Button, Notice, Loading } from './ui'

export default function ContentEditor() {
  const [rows, setRows] = useState<SiteContentRow[] | null>(null)
  const [values, setValues] = useState<Record<string, string>>({})
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ kind: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    api.get<SiteContentRow[]>('/admin/content').then((data) => {
      setRows(data)
      const initial: Record<string, string> = {}
      for (const r of data) initial[r.key] = typeof r.value === 'string' ? r.value : JSON.stringify(r.value)
      setValues(initial)
    })
  }, [])

  async function save() {
    if (!rows) return
    setBusy(true)
    setMsg(null)
    try {
      // Guarda solo las claves que cambiaron.
      const changed = rows.filter((r) => {
        const original = typeof r.value === 'string' ? r.value : JSON.stringify(r.value)
        return values[r.key] !== original
      })
      for (const r of changed) {
        await api.put(`/admin/content/${encodeURIComponent(r.key)}`, { value: values[r.key] })
      }
      setMsg({ kind: 'success', text: changed.length ? `Guardado (${changed.length} cambios).` : 'No había cambios.' })
      // Refresca la base local para recalcular "cambiados".
      const fresh = await api.get<SiteContentRow[]>('/admin/content')
      setRows(fresh)
    } catch (err) {
      setMsg({ kind: 'error', text: err instanceof ApiError ? err.message : 'No se pudo guardar' })
    } finally {
      setBusy(false)
    }
  }

  if (!rows) return <Loading />

  // Agrupa por "group".
  const groups = rows.reduce<Record<string, SiteContentRow[]>>((acc, r) => {
    const g = r.group ?? 'otros'
    ;(acc[g] ??= []).push(r)
    return acc
  }, {})

  const groupTitles: Record<string, string> = {
    contacto: 'Datos de contacto',
    redes: 'Redes sociales',
    otros: 'Otros',
  }

  return (
    <div>
      <PageHeading
        title="Contacto y redes"
        description="Estos datos aparecen en el pie de página, la página de cotización y los botones de WhatsApp del sitio. Los campos vacíos no se muestran."
      />
      {msg && (
        <div className="mb-4">
          <Notice kind={msg.kind}>{msg.text}</Notice>
        </div>
      )}
      <div className="space-y-5">
        {Object.entries(groups).map(([group, items]) => (
          <Card key={group}>
            <h2 className="mb-4 text-sm font-extrabold uppercase tracking-wide text-vz-blue">
              {groupTitles[group] ?? group}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {items.map((r) => (
                <Field key={r.key} label={r.label ?? r.key}>
                  <Input
                    value={values[r.key] ?? ''}
                    onChange={(e) => setValues((v) => ({ ...v, [r.key]: e.target.value }))}
                    placeholder={r.group === 'redes' ? 'https://…' : ''}
                  />
                </Field>
              ))}
            </div>
          </Card>
        ))}
      </div>
      <div className="mt-6">
        <Button onClick={save} disabled={busy}>
          {busy ? 'Guardando…' : 'Guardar cambios'}
        </Button>
      </div>
    </div>
  )
}
