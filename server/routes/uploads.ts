/**
 * Subida de imágenes desde el panel (POST /api/admin/uploads?filename=foto.jpg).
 *
 * El cuerpo de la petición son los bytes crudos del archivo (el navegador envía
 * el File tal cual, sin multipart): así no hace falta multer ni ninguna otra
 * dependencia de parseo.
 *
 * Dos destinos según el entorno:
 *  - Producción (Vercel): Vercel Blob. Requiere un Blob Store enlazado al
 *    proyecto, que inyecta BLOB_READ_WRITE_TOKEN. Devuelve una URL absoluta.
 *  - Desarrollo local (sin ese token): escribe en public/uploads/ y devuelve
 *    /uploads/<archivo>, que Vite ya sirve. En Vercel esto no es posible (el
 *    sistema de archivos es de solo lectura), por eso allí se exige el token.
 *
 * Solo lo alcanza el panel: el router va montado detrás de requireAuth.
 */
import { Router, raw } from 'express'
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

export const uploadsRouter = Router()

/** Formatos aceptados. SVG queda fuera a propósito: puede contener scripts. */
const ALLOWED: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
}

const MAX_BYTES = 8 * 1024 * 1024 // 8 MB

/** Nombre seguro: sin rutas, sin espacios ni acentos, con la extensión correcta. */
function safeName(raw: unknown, ext: string): string {
  const base = typeof raw === 'string' ? raw : ''
  const stem =
    base
      .split(/[\\/]/)
      .pop()!
      .replace(/\.[^.]+$/, '')
      .normalize('NFD')
      .replace(/[^\x20-\x7E]/g, '') // fuera acentos, control y otros no-ASCII
      .replace(/[^a-zA-Z0-9-_]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .toLowerCase()
      .slice(0, 60) || 'imagen'
  return `${stem}.${ext}`
}

uploadsRouter.post(
  '/',
  raw({ type: Object.keys(ALLOWED), limit: MAX_BYTES }),
  async (req, res) => {
    const contentType = (req.headers['content-type'] ?? '').split(';')[0].trim()
    const ext = ALLOWED[contentType]
    if (!ext) {
      res.status(415).json({ error: 'Formato no admitido. Usa JPG, PNG, WEBP, GIF o AVIF.' })
      return
    }
    const body = req.body
    if (!Buffer.isBuffer(body) || body.length === 0) {
      res.status(400).json({ error: 'No llegó ningún archivo.' })
      return
    }

    const filename = safeName(req.query.filename, ext)

    // ── Producción: Vercel Blob ──────────────────────────────────────────
    const token = process.env.BLOB_READ_WRITE_TOKEN
    if (token) {
      try {
        const { put } = await import('@vercel/blob')
        const blob = await put(`vzgroups/${filename}`, body, {
          access: 'public',
          token,
          contentType,
          addRandomSuffix: true, // no pisar una imagen anterior con el mismo nombre
        })
        res.status(201).json({ url: blob.url })
      } catch (err) {
        console.error('[uploads] falló Vercel Blob:', err)
        res.status(502).json({ error: 'No se pudo subir la imagen al almacenamiento.' })
      }
      return
    }

    // ── Sin token ────────────────────────────────────────────────────────
    if (process.env.VERCEL) {
      res.status(500).json({
        error:
          'Falta configurar el almacenamiento de imágenes (BLOB_READ_WRITE_TOKEN). ' +
          'Mientras tanto puedes pegar la ruta o URL de una imagen en el campo de texto.',
      })
      return
    }

    // Desarrollo local: al disco, dentro de public/uploads.
    try {
      const dir = join(process.cwd(), 'public', 'uploads')
      await mkdir(dir, { recursive: true })
      const unique = `${Date.now().toString(36)}-${filename}`
      await writeFile(join(dir, unique), body)
      res.status(201).json({ url: `/uploads/${unique}` })
    } catch (err) {
      console.error('[uploads] no se pudo escribir en public/uploads:', err)
      res.status(500).json({ error: 'No se pudo guardar la imagen en local.' })
    }
  },
)
