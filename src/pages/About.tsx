/** /nosotros — el holding y sus unidades. Texto verificable, sin cifras infladas. */
import { Link } from 'react-router-dom'
import { Seo } from '../components/Seo'
import { UNITS } from '../site/units'
import { SiteShell, Crumbs, ArrowGlyph, ExternalGlyph, btnPrimary } from '../site/chrome'

export default function About() {
  return (
    <SiteShell>
      <Seo
        title="Nosotros"
        description="VZ Groups es un holding de Talagante que reúne a Vetlain (control de plagas), Vetclean (aseo e higiene industrial) y VZModular (capacitación), y comercializa equipos profesionales."
        path="/nosotros"
      />

      <section className="on-blue bg-vz-blue text-white">
        <div className="mx-auto max-w-site px-5 pb-16 pt-8">
          <Crumbs tone="light" items={[{ label: 'Nosotros' }]} />
          <h1 className="mt-6 max-w-4xl text-[clamp(2.2rem,5vw,3.8rem)] font-extrabold leading-[1.03] tracking-[-0.025em]" style={{ fontStretch: '115%' }}>
            Un grupo, tres especialidades y los equipos para cada una.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#dbe4f5]">
            VZ Groups es un holding de Talagante que reúne tres empresas: control de plagas, aseo e higiene industrial y
            capacitación. Detrás hay más de 20 años de oficio en control y mantención ambiental.
          </p>
        </div>
      </section>

      <section aria-label="Empresas del grupo" className="mx-auto max-w-site px-5 py-16">
        <ul className="border-t border-vz-ink">
          {UNITS.map((u) => (
            <li key={u.id} className="grid gap-4 border-b border-vz-line py-8 md:grid-cols-[16rem_minmax(0,1fr)_auto] md:items-start md:gap-10">
              <div>
                <h2 className="font-display text-3xl font-bold" style={{ fontStretch: '115%' }}>{u.name}</h2>
                <p className="mt-1 font-semibold text-vz-green-dark">{u.area}</p>
              </div>
              <p className="max-w-2xl text-lg leading-relaxed text-vz-ink-soft">{u.text}</p>
              <div className="md:pt-1">
                {u.href ? (
                  <a href={u.href} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border border-vz-ink px-4 py-2.5 font-semibold hover:bg-vz-ink hover:text-white">
                    Ir a {u.href.replace(/^https?:\/\/(www\.)?/, '')} <ExternalGlyph className="h-4 w-4" />
                  </a>
                ) : u.status ? (
                  <span className="inline-block border border-vz-line bg-vz-mist px-3 py-1.5 text-sm font-semibold text-vz-muted">{u.status}</span>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-vz-mist">
        <div className="mx-auto grid max-w-site grid-cols-1 gap-8 px-5 py-16 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div>
            <h2 className="h-section">Venta de equipos profesionales</h2>
            <p className="mt-4 max-w-2xl text-vz-ink-soft">
              Además de los servicios, VZ Groups vende los equipos e insumos que el grupo usa en terreno: estaciones de
              cebo, trampas, lámparas UV de captura, atrayentes y sistemas anti-aves, para empresas y profesionales del
              control de plagas.
            </p>
          </div>
          <Link to="/productos" className={`${btnPrimary} px-6 py-3.5 text-base`}>
            Ver catálogo <ArrowGlyph className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </SiteShell>
  )
}
