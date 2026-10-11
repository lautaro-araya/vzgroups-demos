/** Tarjeta de producto del catálogo: foto sobre blanco, línea, nombre y acción. */
import { Link } from 'react-router-dom'
import type { Product } from '../lib/types'
import { lineById } from '../lib/catalog'
import { AddToQuote, assetUrl } from './chrome'

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const img = assetUrl(product.image)
  const line = lineById(product.line)
  return (
    <article className="group flex flex-col border border-vz-line bg-white transition-shadow hover:shadow-[0_10px_28px_-14px_rgba(28,33,39,0.35)]">
      <Link to={`/productos/${product.slug}`} className="flex flex-1 flex-col" aria-label={`${product.name}, ver ficha`}>
        <div className="relative grid aspect-[4/3] place-items-center overflow-hidden border-b border-vz-line bg-white p-5 sm:aspect-square sm:p-6">
          {img ? (
            <img
              src={img}
              alt={product.name}
              loading={priority ? 'eager' : 'lazy'}
              className="max-h-full max-w-full object-contain transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
          ) : (
            <span className="text-sm text-vz-muted">Sin imagen</span>
          )}
        </div>
        <div className="flex flex-1 flex-col px-4 pb-3 pt-4">
          {line && <p className="text-[0.8rem] font-semibold text-vz-green-dark">{line.name}</p>}
          <h3 className="mt-1 font-display text-lg font-bold leading-tight text-vz-ink group-hover:text-vz-blue">
            {product.name}
          </h3>
          {product.summary && (
            <p className="mt-2 line-clamp-3 text-[0.95rem] leading-snug text-vz-ink-soft">{product.summary}</p>
          )}
        </div>
      </Link>
      <div className="px-4 pb-4">
        <AddToQuote compact product={{ slug: product.slug, name: product.name, image: product.image }} className="w-full" />
      </div>
    </article>
  )
}
