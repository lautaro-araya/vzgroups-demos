/**
 * Catálogo: /productos y /productos/linea/:line.
 * Dos entradas con el mismo peso: por línea (URL propia, indexable) y por plaga
 * (?plaga=, filtro). Más una búsqueda por nombre (?q=).
 * `CatalogBody` es presentación pura: la usan el cliente y el prerender.
 */
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { Seo } from '../components/Seo'
import { useApi } from '../lib/useApi'
import type { Product } from '../lib/types'
import { PRODUCT_LINES, PESTS, lineById, pestBySlug } from '../lib/catalog'
import { ServiceIcon } from '../site/service-icons'
import { ProductCard } from '../site/ProductCard'
import { SiteShell, Crumbs, CloseGlyph, ExternalGlyph, SearchGlyph } from '../site/chrome'
import NotFound from './NotFound'

const norm = (s: string) => s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()

export function CatalogBody({
  products,
  lineId,
  loading = false,
}: {
  products: Product[]
  lineId?: string
  loading?: boolean
}) {
  const [params, setParams] = useSearchParams()
  const line = lineId ? lineById(lineId) : undefined
  const pest = pestBySlug(params.get('plaga') ?? '')
  const q = params.get('q') ?? ''

  const setParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true, preventScrollReset: true })
  }

  let list = line ? products.filter((p) => p.line === line.id) : products
  if (pest) list = list.filter((p) => p.pests.includes(pest.slug))
  if (q.trim()) {
    const nq = norm(q.trim())
    list = list.filter((p) => norm(`${p.name} ${p.summary ?? ''} ${p.brand ?? ''}`).includes(nq))
  }

  // Plagas con productos dentro de la línea actual (las demás no se ofrecen).
  const scope = line ? products.filter((p) => p.line === line.id) : products
  const pestsInScope = PESTS.filter((ps) => scope.some((p) => p.pests.includes(ps.slug)))

  const title = line ? line.name : pest ? `Productos para ${pest.name.toLowerCase()}` : 'Catálogo de productos'
  const path = line ? `/productos/linea/${line.id}` : '/productos'
  const description = line
    ? `${line.blurb} Arma tu lista y solicita cotización a VZ Groups.`
    : 'Equipos profesionales para control de roedores, insectos y aves: estaciones de cebo, trampas, lámparas UV, atrayentes y sistemas anti-aves. Cotiza en línea.'

  return (
    <SiteShell>
      <Seo title={title} description={description} path={path} />

      <section className="border-b border-vz-line bg-vz-mist">
        <div className="mx-auto max-w-site px-5 pb-8 pt-8">
          <Crumbs items={line ? [{ label: 'Productos', to: '/productos' }, { label: line.name }] : [{ label: 'Productos' }]} />
          <div className="mt-5 flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <h1 className="text-[clamp(2rem,4.4vw,3.2rem)] font-extrabold leading-[1.04] tracking-[-0.02em]" style={{ fontStretch: '112%' }}>
                {title}
              </h1>
              <p className="mt-3 text-lg text-vz-ink-soft">
                {line ? line.blurb : 'Equipos e insumos profesionales que usamos en terreno. Sin precios publicados: arma tu lista y te cotizamos.'}
              </p>
            </div>
            <label className="relative w-full max-w-xs">
              <span className="sr-only">Buscar en el catálogo</span>
              <SearchGlyph className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-vz-muted" />
              <input
                type="search"
                value={q}
                onChange={(e) => setParam('q', e.target.value || null)}
                placeholder="Buscar por nombre…"
                className="h-12 w-full border border-vz-line bg-white pl-10 pr-3 placeholder:text-vz-muted focus:border-vz-blue focus:outline-none"
              />
            </label>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-site grid-cols-1 gap-10 px-5 py-10 lg:grid-cols-[15rem_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <nav aria-label="Líneas de producto">
            <h2 className="font-display text-sm font-bold uppercase tracking-wider text-vz-muted">Líneas</h2>
            <ul className="mt-3 border-t border-vz-line">
              <li>
                <Link to={`/productos${pest ? `?plaga=${pest.slug}` : ''}`}
                  className={`flex items-center justify-between border-b border-vz-line py-2.5 ${!line ? 'font-bold text-vz-blue' : 'hover:text-vz-blue'}`}>
                  Todas
                  <span className="tabular text-sm text-vz-muted">{products.length}</span>
                </Link>
              </li>
              {PRODUCT_LINES.map((l) => (
                <li key={l.id}>
                  <Link to={`/productos/linea/${l.id}${pest ? `?plaga=${pest.slug}` : ''}`}
                    aria-current={line?.id === l.id ? 'page' : undefined}
                    className={`flex items-center gap-2.5 border-b border-vz-line py-2.5 ${line?.id === l.id ? 'font-bold text-vz-blue' : 'hover:text-vz-blue'}`}>
                    <ServiceIcon icon={l.icon} className="h-5 w-5 shrink-0 text-vz-green" />
                    <span className="flex-1">{l.name}</span>
                    <span className="tabular text-sm text-vz-muted">{products.filter((p) => p.line === l.id).length}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {pestsInScope.length > 0 && (
            <div className="mt-8" role="group" aria-labelledby="filtro-plaga">
              <h2 id="filtro-plaga" className="font-display text-sm font-bold uppercase tracking-wider text-vz-muted">
                Por plaga
              </h2>
              <ul className="mt-3 flex flex-wrap gap-2 lg:flex-col lg:gap-1.5">
                {pestsInScope.map((ps) => {
                  const active = pest?.slug === ps.slug
                  return (
                    <li key={ps.slug}>
                      <button
                        type="button"
                        aria-pressed={active}
                        onClick={() => setParam('plaga', active ? null : ps.slug)}
                        className={`w-full border px-3 py-2 text-left text-[0.95rem] transition-colors ${
                          active ? 'border-vz-blue bg-vz-blue text-white' : 'border-vz-line bg-white hover:border-vz-blue hover:text-vz-blue'
                        }`}
                      >
                        {ps.name}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </aside>

        <div>
          {(pest || q) && (
            <div className="mb-6 flex flex-wrap items-center gap-2 text-[0.95rem]">
              <span className="tabular text-vz-muted">{list.length} resultado{list.length === 1 ? '' : 's'}</span>
              {pest && (
                <button type="button" onClick={() => setParam('plaga', null)}
                  className="inline-flex items-center gap-1.5 bg-vz-blue-tint px-3 py-1.5 font-semibold text-vz-blue-deep hover:bg-vz-blue hover:text-white">
                  {pest.name} <CloseGlyph className="h-4 w-4" /><span className="sr-only">Quitar filtro</span>
                </button>
              )}
              {q && (
                <button type="button" onClick={() => setParam('q', null)}
                  className="inline-flex items-center gap-1.5 bg-vz-mist px-3 py-1.5 font-semibold hover:bg-vz-ink hover:text-white">
                  “{q}” <CloseGlyph className="h-4 w-4" /><span className="sr-only">Quitar búsqueda</span>
                </button>
              )}
              {pest?.vetlainUrl && (
                <a href={pest.vetlainUrl} target="_blank" rel="noopener noreferrer"
                  className="ml-auto inline-flex items-center gap-1.5 font-semibold text-vz-blue hover:underline">
                  Cómo reconocer {pest.name.toLowerCase()} <ExternalGlyph className="h-4 w-4" />
                </a>
              )}
            </div>
          )}

          {loading && !products.length ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-busy="true" aria-label="Cargando productos">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="aspect-[3/4] animate-pulse border border-vz-line bg-vz-mist" />
              ))}
            </div>
          ) : list.length ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {list.map((p, i) => (
                <ProductCard key={p.slug} product={p} priority={i < 3} />
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-vz-line px-6 py-14 text-center">
              <p className="font-display text-lg font-bold">No encontramos productos con esos filtros.</p>
              <p className="mt-2 text-vz-ink-soft">
                Prueba con otra plaga o línea, o{' '}
                <Link to="/cotizacion" className="font-semibold text-vz-blue underline">cuéntanos qué necesitas</Link> y te
                asesoramos.
              </p>
            </div>
          )}
        </div>
      </div>
    </SiteShell>
  )
}

export function CatalogPage() {
  const { data, loading } = useApi<Product[]>('/products')
  return <CatalogBody products={data ?? []} loading={loading} />
}

export function LinePage() {
  const { line = '' } = useParams()
  const { data, loading } = useApi<Product[]>('/products')
  if (!lineById(line)) return <NotFound />
  return <CatalogBody products={data ?? []} lineId={line} loading={loading} />
}
