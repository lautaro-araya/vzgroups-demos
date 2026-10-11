/** 404 del sitio. */
import { Link } from 'react-router-dom'
import { Seo } from '../components/Seo'
import { SiteShell, ArrowGlyph, btnPrimary } from '../site/chrome'

export default function NotFound() {
  return (
    <SiteShell>
      <Seo title="Página no encontrada" noindex />
      <section className="mx-auto max-w-site px-5 py-24">
        <p className="tabular font-display text-6xl font-extrabold text-vz-blue" style={{ fontStretch: '115%' }}>404</p>
        <h1 className="mt-4 text-3xl font-bold">Esta página no existe o cambió de dirección.</h1>
        <p className="mt-3 max-w-xl text-vz-ink-soft">
          Si buscabas un producto, puede que haya cambiado de nombre. Revisa el catálogo o cuéntanos qué necesitas.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/productos" className={btnPrimary}>Ir al catálogo <ArrowGlyph className="h-4 w-4" /></Link>
          <Link to="/cotizacion" className="inline-flex items-center px-3 py-3 font-semibold text-vz-blue hover:underline">Contactarnos</Link>
        </div>
      </section>
    </SiteShell>
  )
}
