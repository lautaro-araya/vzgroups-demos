import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// El sitio se despliega en la raíz del dominio (Vercel), por eso base '/'.
// En desarrollo, Vite hace proxy de /api al servidor Express local
// (server/dev.ts, puerto 3001) para trabajar con front y back a la vez.
export default defineConfig({
  base: '/',
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:8787',
    },
  },
})
