/** Piezas compartidas del sitio: íconos, header, panel de cotización, footer. */
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, NavLink, useLocation } from 'react-router-dom'
import type { ReactNode, SVGProps } from 'react'
import { useSiteContent } from '../lib/site-content'
import { quoteList, useQuoteList } from '../lib/quote-list'
import { PRODUCT_LINES } from '../lib/catalog'

/* ── Assets ───────────────────────────────────────────────────────── */

// Prefijo de assets públicos. `?.` porque este módulo también lo importa el
// prerender (Node/tsx), donde import.meta.env no existe.
export const A = (import.meta as { env?: Record<string, string | undefined> }).env?.BASE_URL ?? '/'

/** Imagen guardada desde el panel: URL completa (Vercel Blob) o ruta en /public. */
export function assetUrl(image: string | null | undefined): string | null {
  if (!image) return null
  return /^https?:\/\//i.test(image) ? image : A + image.replace(/^\//, '')
}

/* ── Íconos (trazo único 1.75, esquinas redondeadas) ──────────────── */

export function Glyph(props: SVGProps<SVGSVGElement> & { children: ReactNode }) {
  const { children, ...rest } = props
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...rest}>
      {children}
    </svg>
  )
}

type G = SVGProps<SVGSVGElement>
export const ArrowGlyph = (p: G) => <Glyph {...p}><path d="M5 12h14M13 6l6 6-6 6" /></Glyph>
export const ChevronGlyph = (p: G) => <Glyph {...p}><path d="M9 6l6 6-6 6" /></Glyph>
export const ExternalGlyph = (p: G) => (
  <Glyph {...p}><path d="M14 5h5v5M19 5l-8 8M17 14v4a1 1 0 01-1 1H6a1 1 0 01-1-1V8a1 1 0 011-1h4" /></Glyph>
)
export const PlusGlyph = (p: G) => <Glyph {...p}><path d="M12 5v14M5 12h14" /></Glyph>
export const MinusGlyph = (p: G) => <Glyph {...p}><path d="M5 12h14" /></Glyph>
export const CheckGlyph = (p: G) => <Glyph {...p}><path d="M4.5 12.5l5 5L20 7" /></Glyph>
export const CloseGlyph = (p: G) => <Glyph {...p}><path d="M6 6l12 12M18 6L6 18" /></Glyph>
export const MenuGlyph = (p: G) => <Glyph {...p}><path d="M4 7h16M4 12h16M4 17h16" /></Glyph>
export const TrashGlyph = (p: G) => (
  <Glyph {...p}><path d="M4 7h16M9 7V4.5h6V7M6.5 7l1 12.5h9l1-12.5M10 11v5M14 11v5" /></Glyph>
)
export const SearchGlyph = (p: G) => <Glyph {...p}><circle cx="11" cy="11" r="6.5" /><path d="M16 16l4 4" /></Glyph>
/** Portapapeles con lista: la "lista de cotización". */
export const ListGlyph = (p: G) => (
  <Glyph {...p}>
    <path d="M9 4.5h6a1 1 0 011 1V7H8V5.5a1 1 0 011-1z" />
    <path d="M8 6H6a1 1 0 00-1 1v12.5a1 1 0 001 1h12a1 1 0 001-1V7a1 1 0 00-1-1h-2" />
    <path d="M9 11.5h6M9 15h6" />
  </Glyph>
)
export const PhoneGlyph = (p: G) => (
  <Glyph {...p}><path d="M5 4h3l1.5 4-2 1.5a12 12 0 006.5 6.5l1.5-2 4 1.5v3a2 2 0 01-2.2 2A17 17 0 013 6.2 2 2 0 015 4z" /></Glyph>
)
export const MailGlyph = (p: G) => <Glyph {...p}><rect x="3.5" y="5.5" width="17" height="13" rx="1" /><path d="M4 6.5l8 6 8-6" /></Glyph>
export const PinGlyph = (p: G) => (
  <Glyph {...p}><path d="M12 21s-6.5-6.2-6.5-11a6.5 6.5 0 0113 0c0 4.8-6.5 11-6.5 11z" /><circle cx="12" cy="10" r="2.3" /></Glyph>
)
export const WhatsappGlyph = (p: G) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M12 2a10 10 0 00-8.53 15.25L2 22l4.9-1.42A10 10 0 1012 2zm0 1.7a8.3 8.3 0 11-4.3 15.4l-.3-.18-2.9.84.86-2.83-.2-.3A8.3 8.3 0 0112 3.7z" />
    <path d="M9.3 7.2c-.2-.45-.36-.35-.55-.36l-.47-.01c-.16 0-.43.06-.66.3-.23.25-.87.85-.87 2.08 0 1.23.9 2.42 1.02 2.58.13.17 1.74 2.77 4.3 3.78 2.13.84 2.57.68 3.03.63.46-.04 1.48-.6 1.69-1.19.2-.58.2-1.08.15-1.18-.06-.1-.22-.16-.46-.28-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.93-1.19-.71-.63-1.2-1.42-1.34-1.66-.14-.24-.01-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78z" />
  </svg>
)

/* ── Botones ──────────────────────────────────────────────────────── */

export const btnPrimary =
  'inline-flex items-center justify-center gap-2 bg-vz-blue px-5 py-3 text-[0.95rem] font-semibold text-white transition-colors hover:bg-vz-blue-dark disabled:cursor-not-allowed disabled:opacity-60'
export const btnOutline =
  'inline-flex items-center justify-center gap-2 border border-vz-ink px-5 py-3 text-[0.95rem] font-semibold text-vz-ink transition-colors hover:bg-vz-ink hover:text-white'

/* ── Lista de cotización: botón "Agregar" ─────────────────────────── */

/**
 * Agrega un producto a la lista. Tras agregar, el botón confirma en su lugar
 * ("En tu lista") y ofrece ver la lista; no abre nada por sorpresa.
 */
export function AddToQuote({
  product,
  qty = 1,
  className = '',
  compact = false,
}: {
  product: { slug: string; name: string; image: string | null }
  qty?: number
  className?: string
  compact?: boolean
}) {
  const lines = useQuoteList()
  const inList = lines.find((l) => l.slug === product.slug)
  const [justAdded, setJustAdded] = useState(false)

  useEffect(() => {
    if (!justAdded) return
    const t = window.setTimeout(() => setJustAdded(false), 1800)
    return () => window.clearTimeout(t)
  }, [justAdded])

  return (
    <button
      type="button"
      onClick={() => {
        quoteList.add({ slug: product.slug, name: product.name, image: product.image }, qty)
        setJustAdded(true)
      }}
      className={`inline-flex items-center justify-center gap-2 font-semibold transition-colors ${
        compact ? 'px-3 py-2 text-sm' : 'px-5 py-3 text-[0.95rem]'
      } ${
        justAdded
          ? 'bg-vz-green text-white'
          : inList
            ? 'border border-vz-blue bg-vz-blue-tint text-vz-blue-deep hover:bg-vz-blue hover:text-white'
            : 'bg-vz-blue text-white hover:bg-vz-blue-dark'
      } ${className}`}
      aria-live="polite"
    >
      {justAdded ? (
        <>
          <CheckGlyph className="h-4 w-4" /> Agregado
        </>
      ) : inList ? (
        <>
          <PlusGlyph className="h-4 w-4" /> {qty > 1 ? `Sumar ${qty} más` : 'Sumar uno más'}
          <span className="tabular font-normal opacity-80">· {inList.qty} en lista</span>
        </>
      ) : (
        <>
          <PlusGlyph className="h-4 w-4" /> Agregar a cotización
        </>
      )}
    </button>
  )
}

/** Selector de cantidad (− n +), usado en la ficha y en la lista. */
export function QtyStepper({
  value,
  onChange,
  label,
  size = 'md',
}: {
  value: number
  onChange: (n: number) => void
  label: string
  size?: 'sm' | 'md'
}) {
  const h = size === 'sm' ? 'h-9' : 'h-11'
  const w = size === 'sm' ? 'w-9' : 'w-11'
  return (
    <div className={`inline-flex items-stretch border border-vz-line bg-white ${h}`} role="group" aria-label={label}>
      <button type="button" className={`${w} grid place-items-center text-vz-ink hover:bg-vz-mist disabled:opacity-40`}
        onClick={() => onChange(value - 1)} disabled={value <= 1} aria-label="Restar uno">
        <MinusGlyph className="h-4 w-4" />
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 1)}
        className="tabular w-14 border-x border-vz-line text-center font-semibold [appearance:textfield] focus:outline-none focus-visible:bg-vz-blue-tint [&::-webkit-inner-spin-button]:appearance-none"
        aria-label="Cantidad"
      />
      <button type="button" className={`${w} grid place-items-center text-vz-ink hover:bg-vz-mist`}
        onClick={() => onChange(value + 1)} aria-label="Sumar uno">
        <PlusGlyph className="h-4 w-4" />
      </button>
    </div>
  )
}

/* ── Panel lateral de la lista ────────────────────────────────────── */

function QuoteDrawer({ onClose }: { onClose: () => void }) {
  const lines = useQuoteList()
  const panel = useRef<HTMLDivElement>(null)
  const units = lines.reduce((n, l) => n + l.qty, 0)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    panel.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  // Portal a <body>: el header usa backdrop-filter, que vuelve "fixed" relativo
  // al header y encerraba el panel en su altura.
  return createPortal(
    <div className="fixed inset-0 z-50">
      <div className="vz-scrim absolute inset-0 bg-vz-ink/45" onClick={onClose} aria-hidden="true" />
      <div
        ref={panel}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        className="vz-drawer absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-[-12px_0_32px_-12px_rgba(28,33,39,0.35)] focus:outline-none"
      >
        <div className="flex items-center justify-between border-b border-vz-line px-5 py-4">
          <h2 id="drawer-title" className="font-display text-lg font-bold">
            Tu lista de cotización
          </h2>
          <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center hover:bg-vz-mist" aria-label="Cerrar lista">
            <CloseGlyph className="h-5 w-5" />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-start justify-center gap-4 px-6">
            <ListGlyph className="h-10 w-10 text-vz-muted" />
            <p className="text-vz-ink-soft">
              Aún no agregas productos. Recorre el catálogo y suma los que necesitas: te enviamos la cotización por correo o WhatsApp.
            </p>
            <Link to="/productos" onClick={onClose} className={btnPrimary}>
              Ver catálogo <ArrowGlyph className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-vz-line overflow-y-auto px-5">
              {lines.map((l) => (
                <li key={l.slug} className="flex gap-3 py-4">
                  <div className="grid h-16 w-16 shrink-0 place-items-center border border-vz-line bg-white p-1">
                    {l.image && <img src={assetUrl(l.image) ?? undefined} alt="" className="max-h-full max-w-full object-contain" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link to={`/productos/${l.slug}`} onClick={onClose} className="font-semibold leading-tight hover:text-vz-blue">
                      {l.name}
                    </Link>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <QtyStepper size="sm" value={l.qty} onChange={(n) => quoteList.setQty(l.slug, n)} label={`Cantidad de ${l.name}`} />
                      <button type="button" onClick={() => quoteList.remove(l.slug)}
                        className="grid h-9 w-9 place-items-center text-vz-muted hover:bg-vz-mist hover:text-vz-ink" aria-label={`Quitar ${l.name}`}>
                        <TrashGlyph className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-vz-line bg-vz-mist px-5 py-4">
              <p className="tabular mb-3 text-sm text-vz-muted">
                {lines.length} producto{lines.length === 1 ? '' : 's'} · {units} unidad{units === 1 ? '' : 'es'}
              </p>
              <Link to="/cotizacion" onClick={onClose} className={`${btnPrimary} w-full`}>
                Continuar y enviar solicitud <ArrowGlyph className="h-4 w-4" />
              </Link>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body,
  )
}

/* ── Header ───────────────────────────────────────────────────────── */

const nav = [
  { to: '/productos', label: 'Productos' },
  { to: '/nosotros', label: 'Nosotros' },
  { to: '/cotizacion', label: 'Contacto' },
]

export function Header() {
  const lines = useQuoteList()
  const count = lines.length
  const [drawer, setDrawer] = useState(false)
  const [menu, setMenu] = useState(false)
  const [bump, setBump] = useState(false)
  const prevCount = useRef(count)
  const { pathname } = useLocation()

  // El contador late una vez cada vez que la lista crece.
  useEffect(() => {
    if (count > prevCount.current) setBump(true)
    prevCount.current = count
  }, [count])

  useEffect(() => setMenu(false), [pathname])

  const linkCls = ({ isActive }: { isActive: boolean }) =>
    `relative py-2 text-[0.95rem] font-semibold transition-colors ${
      isActive ? 'text-vz-blue' : 'text-vz-ink hover:text-vz-blue'
    }`

  return (
    <header className="sticky top-0 z-40 border-b border-vz-line bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-[4.5rem] max-w-site items-center gap-6 px-5">
        <Link to="/" className="shrink-0" aria-label="VZ Groups, inicio">
          <img src={A + 'brand/logo.png'} alt="VZ Groups" width={640} height={272} className="h-12 w-auto sm:h-14" />
        </Link>

        <nav aria-label="Principal" className="ml-4 hidden items-center gap-7 md:flex">
          {nav.map((n) => (
            <NavLink key={n.to} to={n.to} className={linkCls}>
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => setDrawer(true)}
            className="inline-flex h-11 items-center gap-2 border border-vz-ink px-3 text-[0.95rem] font-semibold text-vz-ink transition-colors hover:bg-vz-ink hover:text-white sm:px-4"
            aria-label={`Lista de cotización, ${count} producto${count === 1 ? '' : 's'}`}
          >
            <ListGlyph className="h-5 w-5" />
            <span className="hidden sm:inline">Cotización</span>
            <span
              onAnimationEnd={() => setBump(false)}
              className={`tabular grid h-6 min-w-6 place-items-center px-1.5 text-xs font-bold ${
                count ? 'bg-vz-blue text-white' : 'bg-vz-mist text-vz-muted'
              } ${bump ? 'vz-bump' : ''}`}
            >
              {count}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setMenu((v) => !v)}
            className="grid h-11 w-11 place-items-center border border-vz-line md:hidden"
            aria-expanded={menu}
            aria-controls="menu-movil"
            aria-label={menu ? 'Cerrar menú' : 'Abrir menú'}
          >
            {menu ? <CloseGlyph className="h-5 w-5" /> : <MenuGlyph className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menu && (
        <nav id="menu-movil" aria-label="Principal (móvil)" className="border-t border-vz-line bg-white md:hidden">
          <ul className="mx-auto max-w-site px-5 py-2">
            {nav.map((n) => (
              <li key={n.to}>
                <NavLink to={n.to} className={({ isActive }) =>
                  `flex items-center justify-between border-b border-vz-line py-3.5 font-semibold ${isActive ? 'text-vz-blue' : ''}`}>
                  {n.label}
                  <ChevronGlyph className="h-4 w-4 text-vz-muted" />
                </NavLink>
              </li>
            ))}
            {PRODUCT_LINES.map((l) => (
              <li key={l.id}>
                <Link to={`/productos/linea/${l.id}`} className="flex items-center justify-between border-b border-vz-line py-3 pl-4 text-vz-ink-soft">
                  {l.name}
                  <ChevronGlyph className="h-4 w-4 text-vz-muted" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {drawer && <QuoteDrawer onClose={() => setDrawer(false)} />}
    </header>
  )
}

/* ── Footer ───────────────────────────────────────────────────────── */

export function Footer() {
  const { phone, telUrl, email, address, hours, whatsappUrl, socials } = useSiteContent()
  return (
    <footer className="bg-vz-ink text-[#c4cad3]">
      <div className="mx-auto grid max-w-site gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <p className="font-display text-2xl font-bold text-white" style={{ fontStretch: '115%' }}>
            VZ Groups
          </p>
          <p className="mt-3 max-w-xs text-[0.95rem] leading-relaxed">
            Control de plagas, higiene industrial, capacitación y los equipos profesionales para hacerlo.
          </p>
          <ul className="mt-5 space-y-2 text-[0.95rem]">
            {address && (
              <li className="flex gap-2"><PinGlyph className="mt-0.5 h-5 w-5 shrink-0 text-[#8fa3c9]" />{address}</li>
            )}
            {phone && (
              <li className="flex gap-2">
                <PhoneGlyph className="mt-0.5 h-5 w-5 shrink-0 text-[#8fa3c9]" />
                <a href={telUrl} className="hover:text-white">{phone}</a>
              </li>
            )}
            {email && (
              <li className="flex gap-2">
                <MailGlyph className="mt-0.5 h-5 w-5 shrink-0 text-[#8fa3c9]" />
                <a href={`mailto:${email}`} className="hover:text-white">{email}</a>
              </li>
            )}
            {hours && <li className="pl-7">{hours}</li>}
          </ul>
        </div>

        <nav aria-label="Catálogo">
          <h2 className="font-display text-sm font-bold uppercase tracking-wider text-white">Catálogo</h2>
          <ul className="mt-4 space-y-2.5 text-[0.95rem]">
            {PRODUCT_LINES.map((l) => (
              <li key={l.id}><Link to={`/productos/linea/${l.id}`} className="hover:text-white">{l.name}</Link></li>
            ))}
            <li><Link to="/productos" className="hover:text-white">Todos los productos</Link></li>
          </ul>
        </nav>

        <nav aria-label="Empresas del grupo">
          <h2 className="font-display text-sm font-bold uppercase tracking-wider text-white">El grupo</h2>
          <ul className="mt-4 space-y-2.5 text-[0.95rem]">
            <li>
              <a href="https://www.vetlain.cl" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-white">
                Vetlain <ExternalGlyph className="h-3.5 w-3.5" />
              </a>
            </li>
            <li>Vetclean</li>
            <li>VZModular</li>
            <li><Link to="/nosotros" className="hover:text-white">Nosotros</Link></li>
          </ul>
        </nav>

        <div>
          <h2 className="font-display text-sm font-bold uppercase tracking-wider text-white">Cotiza</h2>
          <p className="mt-4 text-[0.95rem] leading-relaxed">Arma tu lista en el catálogo o escríbenos directo.</p>
          <div className="mt-4 flex flex-col items-start gap-2">
            <Link to="/cotizacion" className="inline-flex items-center gap-2 bg-white px-4 py-2.5 text-[0.95rem] font-semibold text-vz-ink hover:bg-vz-blue-tint">
              Solicitar cotización <ArrowGlyph className="h-4 w-4" />
            </Link>
            {whatsappUrl && (
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 py-2 text-[0.95rem] font-semibold text-white hover:underline">
                <WhatsappGlyph className="h-5 w-5" /> WhatsApp
              </a>
            )}
          </div>
          {socials.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm">
              {socials.map((s) => (
                <li key={s.name}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="capitalize hover:text-white">{s.name}</a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-site px-5 py-5 text-sm text-[#97a1ae]">
          © {new Date().getFullYear()} VZ Groups · Talagante, Chile
        </p>
      </div>
    </footer>
  )
}

/* ── Envoltorio de página ─────────────────────────────────────────── */

/** Header + contenido + footer. Al cambiar de página vuelve arriba (o al ancla). */
export function SiteShell({ children }: { children: ReactNode }) {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    const target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null
    if (target) target.scrollIntoView({ block: 'start' })
    else window.scrollTo(0, 0)
  }, [pathname, hash])
  return (
    <div className="flex min-h-screen flex-col">
      <a href="#contenido" className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:bg-white focus:px-4 focus:py-2">
        Saltar al contenido
      </a>
      <Header />
      <main id="contenido" className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

/** Migas de pan. */
export function Crumbs({ items, tone = 'dark' }: { items: { label: string; to?: string }[]; tone?: 'dark' | 'light' }) {
  const base = tone === 'light' ? 'text-[#c9d6ee]' : 'text-vz-muted'
  const hover = tone === 'light' ? 'hover:text-white' : 'hover:text-vz-blue'
  const current = tone === 'light' ? 'text-white' : 'text-vz-ink'
  return (
    <nav aria-label="Migas de pan" className={`flex flex-wrap items-center gap-1.5 text-sm ${base}`}>
      <Link to="/" className={hover}>Inicio</Link>
      {items.map((c) => (
        <span key={c.label} className="flex items-center gap-1.5">
          <ChevronGlyph className="h-3.5 w-3.5" />
          {c.to ? <Link to={c.to} className={hover}>{c.label}</Link> : <span className={current} aria-current="page">{c.label}</span>}
        </span>
      ))}
    </nav>
  )
}
