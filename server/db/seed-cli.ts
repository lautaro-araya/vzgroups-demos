/**
 * Ejecuta el seed desde la terminal local.
 *   npm run db:seed         → solo inserta lo que falta (no pisa nada)
 *   npm run db:seed:force   → además re-sincroniza servicios, páginas y productos
 */
import 'dotenv/config'
import { runSeed } from './seed.js'

const overwrite = process.argv.includes('--overwrite')

runSeed({ overwrite })
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Error en el seed:', err)
    process.exit(1)
  })
