/**
 * Portada. El holding va primero (banda azul con las tres unidades); el
 * catálogo entra en la misma primera pantalla con sus líneas de producto.
 * `HomeBody` es presentación pura: la usan el cliente y el prerender.
 */
import { Link } from 'react-router-dom'
import { Seo } from '../components/Seo'
import { useApi } from '../lib/useApi'
import type { Product } from '../lib/types'
import { PRODUCT_LINES, PESTS } from '../lib/catalog'
import { useSiteContent } from '../lib/site-content'
import { UNITS } from '../site/units'
import { ServiceIcon } from '../site/service-icons'
import { ProductCard } from '../site/ProductCard'
import {
  SiteShell,
  ArrowGlyph,
  ExternalGlyph,
  ListGlyph,
  WhatsappGlyph,
  assetUrl,
  btnPrimary,
} from '../site/chrome'

function Hero() {
  return (
    <section className="on-blue relative bg-vz-blue text-white">
      <div className="mx-auto grid max-w-site grid-cols-1 gap-10 px-5 pb-28 pt-12 sm:pt-16 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-16 lg:pb-32 lg:pt-20">
        <div>
          <h1 className="text-[clamp(2.3rem,5.4vw,4.1rem)] font-extrabold leading-[1.02] tracking-[-0.025em]" style={{ fontStretch: '115%' }}>
            Control de plagas, higiene y capacitación. Y los equipos para hacerlo bien.
          </h1>
          <p className="mt-6 max-w-[34rem] text-lg leading-relaxed text-[#dbe4f5]">
            VZ Groups reúne a Vetlain, Vetclean y VZModular. Desde Talagante atendemos a empresas e instituciones, y
            vendemos los mismos equipos profesionales que usamos en terreno.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link to="/productos" className="inline-flex items-center gap-2 bg-white px-6 py-3.5 text-base font-semibold text-vz-blue-deep transition-colors hover:bg-vz-blue-tint">
              Ver catálogo de productos <ArrowGlyph className="h-5 w-5" />
            </Link>
            <Link to="/cotizacion" className="inline-flex items-center gap-2 border border-white/70 px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-white hover:text-vz-blue-deep">
              Solicitar cotización
            </Link>
          </div>
        </div>

        <div className="self-end">
          <h2 className="font-display text-sm font-bold uppercase tracking-wider text-[#b9c8e6]">Empresas del grupo</h2>
          <ul className="mt-3 border-t border-white/25">
            {UNITS.map((u) => {
              const body = (
                <>
                  <div className="min-w-0">
                    <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="font-display text-2xl font-bold" style={{ fontStretch: '112%' }}>{u.name}</span>
                      <span className="text-[0.95rem] text-[#c9d6ee]">{u.area}</span>
                    </p>
                    <p className="mt-1 text-[0.95rem] leading-snug text-[#dbe4f5]">{u.text}</p>
                  </div>
                  {u.href ? (
                    <ExternalGlyph className="h-5 w-5 shrink-0 text-white/80 transition-transform group-hover:translate-x-0.5" />
                  ) : u.status ? (
                    <span className="shrink-0 border border-white/40 px-2 py-0.5 text-xs font-semibold text-[#dbe4f5]">{u.status}</span>
                  ) : null}
                </>
              )
              return (
                <li key={u.id} className="border-b border-white/25">
                  {u.href ? (
                    <a href={u.href} target="_blank" rel="noopener noreferrer"
                      className="group -mx-3 flex items-start justify-between gap-4 px-3 py-4 transition-colors hover:bg-white/10">
                      {body}
                      <span className="sr-only">(sitio externo, se abre en otra pestaña)</span>
                    </a>
                  ) : (
                    <div className="flex items-start justify-between gap-4 py-4">{body}</div>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}

/**
 * Líneas de producto. Suben sobre el borde de la banda azul: el catálogo ya
 * asoma en la primera pantalla. Cada línea muestra sus productos reales.
 */
function Lines({ products }: { products: Product[] }) {
  return (
    <section aria-labelledby="lineas" className="relative z-10 -mt-20 px-5 lg:-mt-24">
      <div className="mx-auto max-w-site border border-vz-line bg-white shadow-[0_18px_40px_-24px_rgba(21,42,87,0.45)]">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-vz-line px-6 py-5">
          <h2 id="lineas" className="font-display text-xl font-bold" style={{ fontStretch: '110%' }}>
            Catálogo profesional por línea
          </h2>
          <Link to="/productos" className="inline-flex items-center gap-1.5 text-[0.95rem] font-semibold text-vz-blue hover:underline">
            Ver los {products.length || ''} productos <ArrowGlyph className="h-4 w-4" />
          </Link>
        </div>
        <ul className="grid grid-cols-1 divide-y divide-vz-line md:grid-cols-3 md:divide-x md:divide-y-0">
          {PRODUCT_LINES.map((line) => {
            const items = products.filter((p) => p.line === line.id)
            return (
              <li key={line.id}>
                <Link to={`/productos/linea/${line.id}`} className="group flex h-full flex-col px-6 py-6 transition-colors hover:bg-vz-mist">
                  <div className="flex items-center gap-3">
                    <span className="grid h-11 w-11 place-items-center bg-vz-green-tint text-vz-green-dark">
                      <ServiceIcon icon={line.icon} className="h-6 w-6" />
                    </span>
                    <h3 className="font-display text-lg font-bold leading-tight group-hover:text-vz-blue">{line.name}</h3>
                  </div>
                  <p className="mt-3 flex-1 text-[0.95rem] leading-snug text-vz-ink-soft">{line.blurb}</p>
                  {items.length > 0 && (
                    <div className="mt-5 flex items-center gap-2" aria-hidden="true">
                      {items.slice(0, 4).map((p, i) => (
                        <span key={p.slug} className={`${i === 3 ? 'hidden lg:grid' : 'grid'} h-14 w-14 shrink-0 place-items-center border border-vz-line bg-white p-1`}>
                          <img src={assetUrl(p.image) ?? undefined} alt="" loading="lazy" className="max-h-full max-w-full object-contain" />
                        </span>
                      ))}
                      <span className="tabular ml-1 text-sm font-semibold text-vz-muted">
                        {items.length} producto{items.length === 1 ? '' : 's'}
                      </span>
                    </div>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

function ByPest() {
  return (
    <section aria-labelledby="por-plaga" className="mx-auto max-w-site px-5 pt-20">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:items-start">
        <div>
          <h2 id="por-plaga" className="h-section">¿Qué plaga necesitas controlar?</h2>
          <p className="mt-4 max-w-md text-vz-ink-soft">
            Entra al catálogo por la plaga y te mostramos los equipos que la resuelven. Si quieres conocerla a fondo, la
            pestología de Vetlain explica cómo reconocerla y prevenirla.
          </p>
        </div>
        <ul className="flex flex-wrap gap-2.5">
          {PESTS.map((p) => (
            <li key={p.slug}>
              <Link
                to={`/productos?plaga=${p.slug}`}
                className="inline-flex items-center gap-2 border border-vz-line bg-white px-4 py-3 font-semibold text-vz-ink transition-colors hover:border-vz-blue hover:bg-vz-blue-tint hover:text-vz-blue-deep"
              >
                {p.name}
                <ArrowGlyph className="h-4 w-4 text-vz-muted" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Featured({ products }: { products: Product[] }) {
  const featured = products.filter((p) => p.featured).slice(0, 4)
  const list = featured.length ? featured : products.slice(0, 4)
  if (!list.length) return null
  return (
    <section aria-labelledby="destacados" className="mx-auto max-w-site px-5 pt-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 id="destacados" className="h-section">Equipos destacados</h2>
        <Link to="/productos" className="inline-flex items-center gap-1.5 font-semibold text-vz-blue hover:underline">
          Todo el catálogo <ArrowGlyph className="h-4 w-4" />
        </Link>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {list.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </section>
  )
}

/** Cómo se cotiza: la secuencia sí es información, por eso va numerada. */
function HowToQuote() {
  const { whatsappUrl } = useSiteContent()
  const steps = [
    { t: 'Arma tu lista', d: 'Agrega desde el catálogo los equipos que necesitas y ajusta las cantidades.' },
    { t: 'Envía tus datos', d: 'Nombre, empresa y un teléfono. Sin crear cuenta ni pagar nada en línea.' },
    { t: 'Recibe tu cotización', d: 'El equipo comercial te contacta por correo o WhatsApp con precios y plazos.' },
  ]
  return (
    <section aria-labelledby="como-cotizar" className="mt-24 bg-vz-mist">
      <div className="mx-auto grid max-w-site grid-cols-1 gap-10 px-5 py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:py-20">
        <div>
          <h2 id="como-cotizar" className="h-section">Cotizar toma dos minutos</h2>
          <p className="mt-4 max-w-sm text-vz-ink-soft">
            Vendemos a empresas y profesionales del control de plagas. Los precios dependen del volumen, por eso cotizamos
            cada pedido.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/cotizacion" className={btnPrimary}>
              <ListGlyph className="h-5 w-5" /> Ir a mi lista
            </Link>
            {whatsappUrl && (
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-2 py-3 font-semibold text-vz-ink hover:text-vz-blue">
                <WhatsappGlyph className="h-5 w-5 text-vz-green" /> Escribir por WhatsApp
              </a>
            )}
          </div>
        </div>
        <ol className="grid gap-px border border-vz-line bg-vz-line sm:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.t} className="bg-white p-6">
              <span className="tabular font-display text-4xl font-extrabold text-vz-blue" style={{ fontStretch: '115%' }}>
                {i + 1}
              </span>
              <h3 className="mt-3 font-display text-lg font-bold">{s.t}</h3>
              <p className="mt-2 text-[0.95rem] leading-snug text-vz-ink-soft">{s.d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/** Respaldo del grupo: lo verificable, sin cifras infladas. */
function Backing() {
  return (
    <section aria-labelledby="respaldo" className="mx-auto max-w-site px-5 py-20">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-center">
        <div>
          <h2 id="respaldo" className="h-section">Equipos probados en terreno antes de venderlos</h2>
          <p className="mt-4 max-w-xl text-vz-ink-soft">
            El catálogo nace del trabajo de Vetlain: son los equipos que usamos en plantas de alimentos, bodegas y
            comercio. Si además necesitas el servicio, el mismo grupo lo hace.
          </p>
          <a href="https://www.vetlain.cl" target="_blank" rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 font-semibold text-vz-blue hover:underline">
            Conoce los servicios de Vetlain <ExternalGlyph className="h-4 w-4" />
          </a>
        </div>
        <dl className="border-t border-vz-ink">
          {[
            ['Oficio', 'Más de 20 años en control y mantención ambiental.'],
            ['Calidad', 'Vetlain trabaja con certificación ISO 9001.'],
            ['Catálogo', 'Roedores, insectos y aves, con ficha técnica por equipo.'],
            ['Compra', 'Cotización por pedido, sin cuentas ni pago en línea.'],
          ].map(([k, v]) => (
            <div key={k} className="grid grid-cols-[7rem_1fr] gap-4 border-b border-vz-line py-4">
              <dt className="font-display font-bold">{k}</dt>
              <dd className="text-vz-ink-soft">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

export function HomeBody({ products }: { products: Product[] }) {
  return (
    <SiteShell>
      <Seo
        title="VZ Groups — Control de plagas, higiene y equipos profesionales"
        description="Holding de Talagante con Vetlain, Vetclean y VZModular. Catálogo de equipos profesionales para control de roedores, insectos y aves: arma tu lista y cotiza."
        path="/"
      />
      <Hero />
      <Lines products={products} />
      <ByPest />
      <Featured products={products} />
      <HowToQuote />
      <Backing />
    </SiteShell>
  )
}

export default function Home() {
  const { data } = useApi<Product[]>('/products')
  return <HomeBody products={data ?? []} />
}
