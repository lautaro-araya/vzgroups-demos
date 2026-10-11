/** Edita, crea y elimina fichas de producto del catálogo. */
import { useEffect, useState } from 'react'
import { api, ApiError } from '../lib/api'
import type { Product } from '../lib/types'
import { PRODUCT_LINES, PESTS, lineById } from '../lib/catalog'
import type { ProductLineId } from '../lib/catalog'
import { ImageField } from './ImageField'
import { PageHeading, Card, Field, Input, Textarea, Select, Button, Notice, Loading } from './ui'

type Draft = Partial<Product> & { name: string; slug: string; line: ProductLineId; pests: string[] }

const blank: Draft = {
  slug: '',
  name: '',
  line: 'roedores',
  pests: [],
  brand: '',
  summary: '',
  bodyMd: '',
  image: '',
  featured: false,
  published: true,
}

/** "Trampa Rotatoria Ñ" → "trampa-rotatoria-n" */
function slugify(s: string): string {
  return s
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default function ProductsEditor() {
  const [products, setProducts] = useState<Product[] | null>(null)
  const [draft, setDraft] = useState<Draft | null>(null)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ kind: 'success' | 'error'; text: string } | null>(null)
  const [filter, setFilter] = useState<ProductLineId | 'todas'>('todas')

  function reload() {
    return api.get<Product[]>('/admin/products').then(setProducts)
  }
  useEffect(() => {
    reload().catch((e) => setMsg({ kind: 'error', text: e instanceof ApiError ? e.message : 'No se pudo cargar' }))
  }, [])

  function set<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((d) => (d ? { ...d, [key]: value } : d))
  }

  function togglePest(slug: string) {
    setDraft((d) => (d ? { ...d, pests: d.pests.includes(slug) ? d.pests.filter((p) => p !== slug) : [...d.pests, slug] } : d))
  }

  async function save() {
    if (!draft) return
    if (!draft.name.trim() || !draft.slug.trim()) {
      setMsg({ kind: 'error', text: 'El producto necesita nombre y slug.' })
      return
    }
    setBusy(true)
    setMsg(null)
    try {
      const payload = {
        slug: draft.slug,
        name: draft.name,
        line: draft.line,
        pests: draft.pests,
        brand: draft.brand || null,
        summary: draft.summary,
        bodyMd: draft.bodyMd,
        image: draft.image,
        featured: draft.featured ?? false,
        published: draft.published ?? true,
        seoTitle: draft.seoTitle || null,
        seoDescription: draft.seoDescription || null,
      }
      if (draft.id) await api.put(`/admin/products/${draft.id}`, payload)
      else await api.post('/admin/products', { ...payload, sortOrder: products?.length ?? 0 })
      await reload()
      setDraft(null)
      setMsg({ kind: 'success', text: 'Producto guardado. Usa "Publicar cambios" en el inicio para que Google vea la versión nueva.' })
    } catch (err) {
      setMsg({ kind: 'error', text: err instanceof ApiError ? err.message : 'No se pudo guardar' })
    } finally {
      setBusy(false)
    }
  }

  async function remove(p: Product) {
    if (!confirm(`¿Eliminar el producto "${p.name}"? Esta acción no se puede deshacer.`)) return
    try {
      await api.del(`/admin/products/${p.id}`)
      await reload()
      if (draft?.id === p.id) setDraft(null)
    } catch (err) {
      setMsg({ kind: 'error', text: err instanceof ApiError ? err.message : 'No se pudo eliminar' })
    }
  }

  if (!products) return msg ? <Notice kind="error">{msg.text}</Notice> : <Loading />

  const visible = filter === 'todas' ? products : products.filter((p) => p.line === filter)

  return (
    <div>
      <PageHeading
        title="Productos"
        description="El catálogo del sitio. Cada producto pertenece a una línea y puede marcar las plagas que controla: así aparece en el filtro por plaga."
      />
      {msg && (
        <div className="mb-4">
          <Notice kind={msg.kind}>{msg.text}</Notice>
        </div>
      )}

      {!draft && (
        <>
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <Button onClick={() => setDraft({ ...blank })}>+ Nuevo producto</Button>
            <Select value={filter} onChange={(e) => setFilter(e.target.value as ProductLineId | 'todas')} className="!w-auto">
              <option value="todas">Todas las líneas ({products.length})</option>
              {PRODUCT_LINES.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name} ({products.filter((p) => p.line === l.id).length})
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            {visible.map((p) => (
              <Card key={p.id} className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="truncate text-sm font-bold text-vz-ink">{p.name}</span>
                    <span className="shrink-0 bg-vz-blue-tint px-1.5 py-0.5 text-[11px] font-semibold text-vz-blue-deep">
                      {lineById(p.line)?.name ?? p.line}
                    </span>
                    {p.featured && (
                      <span className="shrink-0 bg-amber-100 px-1.5 py-0.5 text-[11px] font-semibold text-amber-900">Destacado</span>
                    )}
                    {!p.published && (
                      <span className="shrink-0 bg-neutral-200 px-1.5 py-0.5 text-[11px] font-semibold text-neutral-600">Oculto</span>
                    )}
                  </div>
                  <p className="truncate text-xs text-neutral-500">/productos/{p.slug}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button variant="ghost" onClick={() => setDraft({ ...p, pests: p.pests ?? [] })}>
                    Editar
                  </Button>
                  <Button variant="danger" onClick={() => remove(p)}>
                    Eliminar
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      {draft && (
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-extrabold uppercase tracking-wide text-vz-blue">
              {draft.id ? 'Editar producto' : 'Nuevo producto'}
            </h2>
            <button onClick={() => setDraft(null)} className="text-xs font-bold uppercase text-neutral-500 hover:text-vz-ink">
              ← Volver
            </button>
          </div>
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nombre">
                <Input
                  value={draft.name}
                  onChange={(e) => {
                    const name = e.target.value
                    // En un producto nuevo el slug sigue al nombre hasta que se edite a mano.
                    setDraft((d) => (d ? { ...d, name, slug: d.id || d.slug !== slugify(d.name) ? d.slug : slugify(name) } : d))
                  }}
                />
              </Field>
              <Field label="Slug (URL)" hint="Solo minúsculas y guiones. Cambiarlo cambia la dirección de la ficha.">
                <Input value={draft.slug} onChange={(e) => set('slug', slugify(e.target.value))} />
              </Field>
              <Field label="Línea">
                <Select value={draft.line} onChange={(e) => set('line', e.target.value as ProductLineId)}>
                  {PRODUCT_LINES.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Fabricante / marca" hint="Opcional. Se muestra en la ficha.">
                <Input value={draft.brand ?? ''} onChange={(e) => set('brand', e.target.value)} />
              </Field>
            </div>

            <fieldset>
              <legend className="mb-2 text-sm font-semibold text-vz-ink">Plagas que controla</legend>
              <div className="flex flex-wrap gap-2">
                {PESTS.map((p) => {
                  const on = draft.pests.includes(p.slug)
                  return (
                    <label
                      key={p.slug}
                      className={`cursor-pointer border-2 px-3 py-1.5 text-sm has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-vz-blue ${on ? 'border-vz-blue bg-vz-blue-tint font-semibold text-vz-blue-deep' : 'border-neutral-200 bg-white text-neutral-700'}`}
                    >
                      <input type="checkbox" checked={on} onChange={() => togglePest(p.slug)} className="sr-only" />
                      {p.name}
                    </label>
                  )
                })}
              </div>
            </fieldset>

            <ImageField
              label="Imagen"
              hint="Foto del producto sobre fondo blanco, idealmente cuadrada."
              value={draft.image ?? ''}
              onChange={(v) => set('image', v)}
            />
            <Field label="Resumen" hint="Una o dos frases. Se muestra en la tarjeta del catálogo y en Google.">
              <Textarea rows={2} value={draft.summary ?? ''} onChange={(e) => set('summary', e.target.value)} />
            </Field>
            <Field label="Ficha técnica (Markdown)" hint="Usos, características, dimensiones, consejos de instalación. ### para subtítulos, - para listas.">
              <Textarea rows={12} value={draft.bodyMd ?? ''} onChange={(e) => set('bodyMd', e.target.value)} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Título en Google" hint="Opcional. Si se deja vacío se usa el nombre.">
                <Input value={draft.seoTitle ?? ''} onChange={(e) => set('seoTitle', e.target.value)} />
              </Field>
              <Field label="Descripción en Google" hint="Opcional. Si se deja vacía se usa el resumen.">
                <Input value={draft.seoDescription ?? ''} onChange={(e) => set('seoDescription', e.target.value)} />
              </Field>
            </div>
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2 text-sm font-medium text-vz-ink">
                <input type="checkbox" checked={draft.published ?? true} onChange={(e) => set('published', e.target.checked)} className="h-4 w-4 accent-vz-blue" />
                Publicado (visible en el sitio)
              </label>
              <label className="flex items-center gap-2 text-sm font-medium text-vz-ink">
                <input type="checkbox" checked={draft.featured ?? false} onChange={(e) => set('featured', e.target.checked)} className="h-4 w-4 accent-vz-blue" />
                Destacado en la portada
              </label>
            </div>
            <Button onClick={save} disabled={busy}>
              {busy ? 'Guardando…' : 'Guardar producto'}
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
