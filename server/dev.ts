/**
 * Servidor de desarrollo del backend.
 * Carga variables de entorno desde .env y levanta Express en el puerto local.
 * En producción NO se usa este archivo: Vercel importa api/index.ts.
 */
import 'dotenv/config'
import { createApp } from './app.js'

const app = createApp()
const port = Number(process.env.PORT) || 8787

app.listen(port, () => {
  console.log(`API de VZ Groups escuchando en http://localhost:${port}`)
})
