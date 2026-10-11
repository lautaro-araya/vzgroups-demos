/** Pantalla de acceso al panel. */
import { useState } from 'react'
import type { FormEvent } from 'react'
import { Helmet } from 'react-helmet-async'
import { useAuth } from './auth'
import { ApiError } from '../lib/api'
import { Button, Field, Input, Notice } from './ui'

export default function Login() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setBusy(true)
    try {
      await login(email, password)
      // Al lograr sesión, AdminApp re-renderiza y muestra el panel.
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo iniciar sesión')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-100 px-5">
      <Helmet>
        <title>Panel VZ Groups — Acceso</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <form onSubmit={onSubmit} className="w-full max-w-sm border-2 border-neutral-200 bg-white p-7">
        <div className="mb-6">
          <span className="inline-block bg-vz-blue-tint px-3 py-1 text-xs font-bold uppercase tracking-widest text-vz-blue-deep">
            Administración
          </span>
          <h1 className="mt-3 text-2xl font-extrabold uppercase tracking-tight text-vz-ink">
            Panel VZ Groups
          </h1>
          <p className="mt-1 text-sm text-neutral-600">Ingresa para editar el sitio.</p>
        </div>

        <div className="space-y-4">
          <Field label="Email">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
              autoFocus
            />
          </Field>
          <Field label="Contraseña">
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </Field>
          {error && <Notice kind="error">{error}</Notice>}
          <Button type="submit" disabled={busy} className="w-full py-3">
            {busy ? 'Ingresando…' : 'Ingresar'}
          </Button>
        </div>
      </form>
    </div>
  )
}
