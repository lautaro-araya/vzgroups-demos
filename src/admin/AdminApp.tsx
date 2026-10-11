/**
 * Raíz del panel de administración (montado en /admin/*).
 * - Consulta la sesión; si no hay, muestra Login.
 * - Si hay sesión, muestra el layout con navegación lateral y las rutas.
 */
import { Routes, Route, NavLink, Navigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { AuthProvider, useAuth } from './auth'
import { Loading } from './ui'
import Login from './Login'
import Dashboard from './Dashboard'
import ContentEditor from './ContentEditor'
import ProductsEditor from './ProductsEditor'
import QuotesPanel from './QuotesPanel'

const sections = [
  { to: '/admin', label: 'Inicio', end: true },
  { to: '/admin/cotizaciones', label: 'Cotizaciones', end: false },
  { to: '/admin/productos', label: 'Productos', end: false },
  { to: '/admin/contacto', label: 'Contacto y redes', end: false },
]

function Shell() {
  const { user, logout } = useAuth()
  return (
    <div className="min-h-screen bg-neutral-100 text-vz-ink">
      <Helmet>
        <title>Panel VZ Groups</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Barra superior */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b-2 border-vz-blue bg-white px-5 py-3">
        <span className="text-lg font-extrabold uppercase tracking-tight">
          VZ Groups <span className="text-vz-blue">/ Panel</span>
        </span>
        <div className="flex items-center gap-4">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="hidden text-xs font-bold uppercase tracking-wide text-neutral-500 hover:text-vz-blue sm:inline"
          >
            Ver sitio ↗
          </a>
          <span className="hidden text-xs text-neutral-500 md:inline">{user?.email}</span>
          <button
            onClick={() => logout()}
            className="border-2 border-neutral-300 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-neutral-600 transition-colors hover:border-red-300 hover:text-red-700"
          >
            Salir
          </button>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl gap-6 px-5 py-6">
        {/* Navegación lateral */}
        <nav className="hidden w-52 shrink-0 md:block">
          <ul className="sticky top-20 space-y-1">
            {sections.map((s) => (
              <li key={s.to}>
                <NavLink
                  to={s.to}
                  end={s.end}
                  className={({ isActive }) =>
                    `block px-3 py-2 text-sm font-bold uppercase tracking-wide transition-colors ${
                      isActive
                        ? 'bg-white text-vz-blue shadow-sm'
                        : 'text-neutral-500 hover:bg-white/60 hover:text-vz-ink'
                    }`
                  }
                >
                  {s.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Navegación superior en móvil */}
        <div className="w-full">
          <nav className="mb-5 flex gap-1 overflow-x-auto border-b-2 border-neutral-200 md:hidden">
            {sections.map((s) => (
              <NavLink
                key={s.to}
                to={s.to}
                end={s.end}
                className={({ isActive }) =>
                  `whitespace-nowrap px-3 py-2 text-xs font-bold uppercase tracking-wide ${
                    isActive ? 'text-vz-blue' : 'text-neutral-500'
                  }`
                }
              >
                {s.label}
              </NavLink>
            ))}
          </nav>

          <main className="min-w-0 flex-1">
            <Routes>
              <Route index element={<Dashboard />} />
              <Route path="cotizaciones" element={<QuotesPanel />} />
              <Route path="productos" element={<ProductsEditor />} />
              <Route path="contacto" element={<ContentEditor />} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  )
}

function Gate() {
  const { user, loading } = useAuth()
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-100">
        <Loading label="Cargando panel…" />
      </div>
    )
  }
  return user ? <Shell /> : <Login />
}

export default function AdminApp() {
  return (
    <AuthProvider>
      <Gate />
    </AuthProvider>
  )
}
