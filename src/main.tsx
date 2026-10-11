import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.tsx'
import { SiteContentProvider } from './lib/site-content'
import './index.css'

// BrowserRouter: URLs limpias (/servicios en vez de /#/servicios), imprescindible
// para SEO. HelmetProvider gestiona los <title>/<meta> por página.
// SiteContentProvider entrega el contenido editable (contacto, redes) a todo el sitio.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <SiteContentProvider>
          <App />
        </SiteContentProvider>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>,
)
