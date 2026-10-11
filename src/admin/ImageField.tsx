/**
 * Campo de imagen del panel: subir un archivo (arrastrando o desde el botón),
 * ver la miniatura y, si hace falta, escribir la ruta a mano.
 *
 * Guarda siempre un string: la URL que devuelve la subida, una ruta interna
 * (brand/foto.jpg) o una URL externa. El sitio lo resuelve con `assetUrl`.
 */
import { useRef, useState } from 'react'
import type { DragEvent } from 'react'
import { api, ApiError } from '../lib/api'
import { assetUrl } from '../site/chrome'
import { Input, Button, Notice } from './ui'

const ACCEPT = 'image/jpeg,image/png,image/webp,image/gif,image/avif'

export function ImageField({
  label,
  hint,
  value,
  onChange,
}: {
  label: string
  hint?: string
  value: string
  onChange: (value: string) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const preview = assetUrl(value)

  async function subir(file: File | undefined) {
    if (!file) return
    setError(null)
    setBusy(true)
    try {
      onChange(await api.upload(file))
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo subir la imagen.')
    } finally {
      setBusy(false)
      if (inputRef.current) inputRef.current.value = '' // permite re-subir el mismo archivo
    }
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setDragging(false)
    subir(e.dataTransfer.files?.[0])
  }

  return (
    <div className="block">
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-neutral-600">
        {label}
      </span>

      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`flex flex-wrap items-start gap-4 border-2 border-dashed p-3 transition-colors ${
          dragging ? 'border-vz-blue bg-vz-blue-tint' : 'border-neutral-200 bg-neutral-50'
        }`}
      >
        {preview ? (
          <img
            src={preview}
            alt=""
            className="h-24 w-32 shrink-0 border-2 border-neutral-200 bg-white object-cover"
          />
        ) : (
          <div className="flex h-24 w-32 shrink-0 items-center justify-center border-2 border-neutral-200 bg-white text-[11px] font-bold uppercase tracking-wide text-neutral-400">
            Sin imagen
          </div>
        )}

        <div className="min-w-[12rem] flex-1">
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="ghost"
              disabled={busy}
              onClick={() => inputRef.current?.click()}
            >
              {busy ? 'Subiendo…' : 'Subir imagen'}
            </Button>
            {value && (
              <Button type="button" variant="danger" disabled={busy} onClick={() => onChange('')}>
                Quitar
              </Button>
            )}
          </div>
          <p className="mt-2 text-xs text-neutral-500">
            Arrastra una foto aquí o pulsa «Subir imagen». JPG, PNG, WEBP, GIF o AVIF (hasta 8 MB).
          </p>
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPT}
            className="hidden"
            onChange={(e) => subir(e.target.files?.[0])}
          />
        </div>
      </div>

      <div className="mt-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="brand/foto-tecnico.jpg o https://…"
        />
        {hint && <span className="mt-1 block text-xs text-neutral-500">{hint}</span>}
      </div>

      {error && (
        <div className="mt-2">
          <Notice kind="error">{error}</Notice>
        </div>
      )}
    </div>
  )
}
