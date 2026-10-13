/**
 * Carrusel del hero: productos del catálogo sobre un escenario blanco.
 *
 * - Fundido cruzado entre diapositivas; la barra de la diapositiva activa se
 *   llena mientras corre el tiempo (es el indicador y el reloj a la vez).
 * - Avanza solo cada AUTOPLAY_MS; se pausa al pasar el cursor, al enfocar con
 *   teclado, con el botón de pausa y cuando la pestaña no está visible. Con
 *   "reducir movimiento" arranca en pausa.
 * - Toda la primera diapositiva está en el HTML del prerender: sin JS se ve
 *   un producto, no un hueco.
 *
 * Hoy muestra fotos de producto (lo único disponible). Cuando el cliente
 * entregue fotos o videos de terreno se suman como otro tipo de diapositiva.
 */
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Product } from '../lib/types'
import { lineById } from '../lib/catalog'
import { ArrowGlyph, ChevronGlyph, Glyph, assetUrl } from './chrome'

const AUTOPLAY_MS = 5500

const PauseGlyph = () => <Glyph className="h-4 w-4"><path d="M9 6v12M15 6v12" /></Glyph>
const PlayGlyph = () => <Glyph className="h-4 w-4"><path d="M8 5.5v13l10.5-6.5z" /></Glyph>

export function HeroCarousel({ products }: { products: Product[] }) {
  const slides = products.filter((p) => p.image)
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false) // pausa explícita (botón)
  const [held, setHeld] = useState(false) // cursor encima o foco dentro
  const [hidden, setHidden] = useState(false) // pestaña oculta
  const [cycle, setCycle] = useState(0) // reinicia la barra al saltar a mano
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setPaused(true)
    const onVis = () => setHidden(document.hidden)
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  const running = !paused && !held && !hidden && slides.length > 1

  // El avance lo marca el fin de la animación de la barra (onAnimationEnd):
  // así la barra y el cambio de diapositiva nunca se desfasan.
  const go = (i: number) => {
    setIndex((i + slides.length) % slides.length)
    setCycle((c) => c + 1)
  }

  if (!slides.length) return null
  const current = slides[index]
  const line = lineById(current.line)

  return (
    <div
      ref={root}
      role="region"
      aria-roledescription="carrusel"
      aria-label="Productos del catálogo"
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={(e) => {
        if (!root.current?.contains(e.relatedTarget as Node)) setHeld(false)
      }}
      className="bg-white text-vz-ink shadow-[0_24px_48px_-28px_rgba(9,20,45,0.7)]"
    >
      {/* Escenario: todas las diapositivas apiladas, sólo la activa visible. */}
      <div className="relative aspect-[4/3] overflow-hidden border-b border-vz-line">
        {slides.map((p, i) => {
          const active = i === index
          return (
            <Link
              key={p.slug}
              to={`/productos/${p.slug}`}
              tabIndex={active ? 0 : -1}
              aria-hidden={!active}
              aria-roledescription="diapositiva"
              aria-label={`${i + 1} de ${slides.length}: ${p.name}`}
              className={`absolute inset-0 grid place-items-center p-8 transition-opacity duration-700 ease-out sm:p-12 ${
                active ? 'opacity-100' : 'pointer-events-none opacity-0'
              }`}
            >
              <img
                src={assetUrl(p.image) ?? undefined}
                alt={p.name}
                loading={i === 0 ? 'eager' : 'lazy'}
                className={`max-h-full max-w-full object-contain transition-transform duration-[1200ms] ease-out motion-reduce:transition-none ${
                  active ? 'scale-100' : 'scale-95'
                }`}
              />
            </Link>
          )
        })}
      </div>

      {/* Pie: qué producto es + controles. */}
      <div className="flex items-end justify-between gap-4 px-5 pb-4 pt-4">
        <div className="min-w-0" aria-live={running ? 'off' : 'polite'}>
          {line && <p className="text-[0.8rem] font-semibold text-vz-green-dark">{line.name}</p>}
          <p className="truncate font-display text-xl font-bold leading-tight" style={{ fontStretch: '110%' }}>
            {current.name}
          </p>
          <Link to={`/productos/${current.slug}`} className="mt-1 inline-flex items-center gap-1 text-[0.95rem] font-semibold text-vz-blue hover:underline">
            Ver ficha técnica <ArrowGlyph className="h-4 w-4" />
          </Link>
        </div>
        {slides.length > 1 && (
          <div className="flex shrink-0 items-center gap-1">
            <button type="button" onClick={() => setPaused((v) => !v)}
              className="grid h-10 w-10 place-items-center text-vz-ink hover:bg-vz-mist"
              aria-label={paused ? 'Reanudar carrusel' : 'Pausar carrusel'}>
              {paused ? <PlayGlyph /> : <PauseGlyph />}
            </button>
            <button type="button" onClick={() => go(index - 1)}
              className="grid h-10 w-10 place-items-center border border-vz-line hover:border-vz-ink" aria-label="Producto anterior">
              <ChevronGlyph className="h-5 w-5 rotate-180" />
            </button>
            <button type="button" onClick={() => go(index + 1)}
              className="grid h-10 w-10 place-items-center border border-vz-line hover:border-vz-ink" aria-label="Producto siguiente">
              <ChevronGlyph className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {/* Barras: una por diapositiva; la activa se llena con el tiempo. */}
      {slides.length > 1 && (
        <div className="flex gap-1 px-5 pb-5" role="group" aria-label="Elegir producto">
          {slides.map((p, i) => (
            <button
              key={p.slug}
              type="button"
              onClick={() => go(i)}
              aria-label={`Ver ${p.name}`}
              aria-current={i === index ? 'true' : undefined}
              className="group relative h-6 flex-1"
            >
              <span className="absolute inset-x-0 top-1/2 block h-1 -translate-y-1/2 overflow-hidden bg-vz-line group-hover:bg-[#c7cfd9]">
                {i < index && <span className="absolute inset-0 bg-vz-blue/40" />}
                {i === index && (
                  <span
                    key={cycle}
                    onAnimationEnd={() => go(index + 1)}
                    className="vz-progress absolute inset-0 origin-left bg-vz-blue"
                    style={{
                      animationDuration: `${AUTOPLAY_MS}ms`,
                      animationPlayState: running ? 'running' : 'paused',
                    }}
                  />
                )}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
