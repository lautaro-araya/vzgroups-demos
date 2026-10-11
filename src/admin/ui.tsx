/** Primitivas de UI del panel. Simples y consistentes (verde/carbón de marca). */
import type {
  ReactNode,
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  SelectHTMLAttributes,
} from 'react'

/* ── Botón ───────────────────────────────────────────────────────────── */
type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost' | 'danger'
}
export function Button({ variant = 'primary', className = '', ...rest }: BtnProps) {
  const styles = {
    primary: 'bg-vz-blue text-white hover:bg-vz-blue-deep disabled:opacity-50',
    ghost: 'border-2 border-neutral-300 text-vz-ink hover:border-vz-blue hover:text-vz-blue',
    danger: 'border-2 border-red-300 text-red-700 hover:bg-red-50',
  }[variant]
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold uppercase tracking-wide transition-colors disabled:cursor-not-allowed ${styles} ${className}`}
      {...rest}
    />
  )
}

/* ── Campo con etiqueta ──────────────────────────────────────────────── */
export function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-neutral-600">
        {label}
      </span>
      {children}
      {hint && <span className="mt-1 block text-xs text-neutral-500">{hint}</span>}
    </label>
  )
}

const inputBase =
  'w-full border-2 border-neutral-200 bg-white px-3 py-2 text-sm text-vz-ink outline-none transition-colors focus:border-vz-blue'

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  const { className = '', ...rest } = props
  return <input className={`${inputBase} ${className}`} {...rest} />
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className = '', ...rest } = props
  return <textarea className={`${inputBase} font-mono leading-relaxed ${className}`} {...rest} />
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  const { className = '', ...rest } = props
  return <select className={`${inputBase} ${className}`} {...rest} />
}

/* ── Tarjeta ─────────────────────────────────────────────────────────── */
export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`border-2 border-neutral-200 bg-white p-5 ${className}`}>{children}</div>
}

/* ── Aviso (éxito / error) ───────────────────────────────────────────── */
export function Notice({ kind, children }: { kind: 'success' | 'error'; children: ReactNode }) {
  const styles =
    kind === 'success'
      ? 'border-vz-blue bg-vz-blue-tint text-vz-blue-deep'
      : 'border-red-300 bg-red-50 text-red-700'
  return <div className={`border-2 px-4 py-2.5 text-sm font-medium ${styles}`}>{children}</div>
}

/* ── Encabezado de sección ───────────────────────────────────────────── */
export function PageHeading({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-extrabold uppercase tracking-tight text-vz-ink">{title}</h1>
      {description && <p className="mt-1 text-sm text-neutral-600">{description}</p>}
    </div>
  )
}

/* ── Spinner sencillo ────────────────────────────────────────────────── */
export function Loading({ label = 'Cargando…' }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 py-10 text-sm text-neutral-500">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-300 border-t-vz-blue" />
      {label}
    </div>
  )
}
