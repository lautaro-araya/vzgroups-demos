import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import { CatalogPage, LinePage } from './pages/Catalog'
import ProductDetail from './pages/ProductDetail'
import QuotePage from './pages/QuotePage'
import About from './pages/About'
import NotFound from './pages/NotFound'

// El panel se carga aparte (lazy): no lastra el bundle del sitio público.
const AdminApp = lazy(() => import('./admin/AdminApp'))

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/productos" element={<CatalogPage />} />
      <Route path="/productos/linea/:line" element={<LinePage />} />
      <Route path="/productos/:slug" element={<ProductDetail />} />
      <Route path="/cotizacion" element={<QuotePage />} />
      <Route path="/contacto" element={<Navigate to="/cotizacion" replace />} />
      <Route path="/nosotros" element={<About />} />
      <Route
        path="/admin/*"
        element={
          <Suspense fallback={null}>
            <AdminApp />
          </Suspense>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
