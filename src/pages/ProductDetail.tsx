/**
 * Ficha de producto: /productos/:slug.
 * Foto y acción de cotizar arriba; ficha técnica (Markdown del panel) debajo;
 * plagas que controla enlazadas al filtro del catálogo y a la pestología de
 * Vetlain. `ProductDetailBody` es presentación pura (cliente y prerender).
 */
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Seo } from '../components/Seo'
import { Markdown } from '../components/Markdown'
import { useApi } from '../lib/useApi'
import type { Product } from '../lib/types'
import { lineById, pestBySlug } from '../lib/catalog'
import { useSiteContent } from '../lib/site-content'
import { ProductCard } from '../site/ProductCard'
import { SiteShell, Crumbs, AddToQuote, QtyStepper, ExternalGlyph, WhatsappGlyph, assetUrl } from '../site/chrome'
import NotFound from './NotFound'

export function ProductDetailBody({ product, related }: { product: Product; related: Product[] }) {
  const [qty, setQty] = useState(1)
  const { whatsappUrl } = useSiteContent()
  const line = lineById(product.line)
  const img = assetUrl(product.image)
  const pests = product.pests.map(pestBySlug).filter((p) => !!p)
  const waHref = whatsappUrl
    ? `${whatsappUrl}?text=${encodeURIComponent(`Hola, quiero cotizar ${qty} × ${product.name}.`)}`
    : ''

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.summary ?? undefined,
    image: img ? (img.startsWith('http') ? img : `https://www.vzgroups.com${img}`) : undefined,
    category: line?.name,
    ...(product.brand ? { brand: { '@type': 'Brand', name: product.brand } } : {}),
  }

  return (
    <SiteShell>
      <Seo
        title={product.seoTitle ?? `${product.name} · ${line?.name ?? 'Producto'}`}
        description={product.seoDescription ?? product.summary ?? undefined}
        path={`/productos/${product.slug}`}
        image={product.image ?? undefined}
        jsonLd={jsonLd}
      />

      <div className="mx-auto max-w-site px-5 pt-8">
        <Crumbs
          items={[
            { label: 'Productos', to: '/productos' },
            ...(line ? [{ label: line.name, to: `/productos/linea/${line.id}` }] : []),
            { label: product.name },
          ]}
        />
      </div>

      <section className="mx-auto grid max-w-site grid-cols-1 gap-10 px-5 pb-14 pt-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14">
        <div className="grid aspect-square place-items-center border border-vz-line bg-white p-10">
          {img ? (
            <img src={img} alt={product.name} className="max-h-full max-w-full object-contain" />
          ) : (
            <span className="text-vz-muted">Imagen pendiente</span>
          )}
        </div>

        <div className="lg:pt-4">
          {line && (
            <Link to={`/productos/linea/${line.id}`} className="text-[0.95rem] font-semibold text-vz-green-dark hover:underline">
              {line.name}
            </Link>
          )}
          <h1 className="mt-2 text-[clamp(2rem,4.2vw,3.1rem)] font-extrabold leading-[1.04] tracking-[-0.02em]" style={{ fontStretch: '112%' }}>
            {product.name}
          </h1>
          {product.brand && <p className="mt-2 text-vz-muted">Fabricante: {product.brand}</p>}
          {product.summary && <p className="mt-5 max-w-xl text-lg leading-relaxed text-vz-ink-soft">{product.summary}</p>}

          {pests.length > 0 && (
            <div className="mt-6">
              <h2 className="text-sm font-semibold text-vz-muted">Controla</h2>
              <ul className="mt-2 flex flex-wrap gap-2">
                {pests.map((p) => (
                  <li key={p.slug} className="flex items-stretch border border-vz-line">
                    <Link to={`/productos?plaga=${p.slug}`} className="px-3 py-1.5 font-semibold hover:bg-vz-blue-tint hover:text-vz-blue-deep">
                      {p.name}
                    </Link>
                    {p.vetlainUrl && (
                      <a href={p.vetlainUrl} target="_blank" rel="noopener noreferrer"
                        className="grid place-items-center border-l border-vz-line px-2 text-vz-muted hover:bg-vz-mist hover:text-vz-blue"
                        aria-label={`Ficha de ${p.name} en la pestología de Vetlain`} title="Pestología de Vetlain">
                        <ExternalGlyph className="h-4 w-4" />
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-8 border-t border-vz-line pt-6">
            <p className="text-[0.95rem] text-vz-ink-soft">
              Precio según volumen. Agrega el equipo a tu lista y te enviamos la cotización.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <QtyStepper value={qty} onChange={setQty} label={`Cantidad de ${product.name}`} />
              <AddToQuote product={{ slug: product.slug, name: product.name, image: product.image }} qty={qty} />
            </div>
            {waHref && (
              <a href={waHref} target="_blank" rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 font-semibold text-vz-ink hover:text-vz-blue">
                <WhatsappGlyph className="h-5 w-5 text-vz-green" /> Consultar este equipo por WhatsApp
              </a>
            )}
          </div>
        </div>
      </section>

      {product.bodyMd && (
        <section aria-labelledby="ficha" className="border-t border-vz-line bg-vz-mist">
          <div className="mx-auto grid max-w-site grid-cols-1 gap-8 px-5 py-14 lg:grid-cols-[15rem_minmax(0,1fr)]">
            <h2 id="ficha" className="h-section !text-2xl">Ficha técnica</h2>
            <Markdown source={product.bodyMd} />
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section aria-labelledby="relacionados" className="mx-auto max-w-site px-5 py-16">
          <h2 id="relacionados" className="h-section">Más de {line?.name.toLowerCase() ?? 'esta línea'}</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </SiteShell>
  )
}

/** Relacionados: misma línea, priorizando los que comparten plaga. */
export function relatedProducts(product: Product, all: Product[]): Product[] {
  return all
    .filter((p) => p.line === product.line && p.slug !== product.slug)
    .map((p) => ({ p, score: p.pests.filter((x) => product.pests.includes(x)).length }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((x) => x.p)
}

export default function ProductDetail() {
  const { slug = '' } = useParams()
  const { data, loading, error } = useApi<Product>(`/products/${slug}`)
  const all = useApi<Product[]>('/products')

  if (loading) {
    return (
      <SiteShell>
        <div className="mx-auto grid max-w-site gap-10 px-5 py-14 lg:grid-cols-2" aria-busy="true" aria-label="Cargando producto">
          <div className="aspect-square animate-pulse bg-vz-mist" />
          <div className="space-y-4 pt-4">
            <div className="h-5 w-40 animate-pulse bg-vz-mist" />
            <div className="h-12 w-3/4 animate-pulse bg-vz-mist" />
            <div className="h-24 w-full animate-pulse bg-vz-mist" />
          </div>
        </div>
      </SiteShell>
    )
  }
  if (error || !data) return <NotFound />
  return <ProductDetailBody product={data} related={relatedProducts(data, all.data ?? [])} />
}
