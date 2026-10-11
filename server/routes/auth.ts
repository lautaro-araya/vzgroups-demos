/** Rutas de sesión del panel: login, logout y estado (/api/auth/*). */
import { Router } from 'express'
import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { db, schema } from '../db/index.js'
import { verifyPassword, issueSession, clearSession, readSession } from '../auth.js'

export const authRouter = Router()

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

authRouter.post('/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Email o contraseña inválidos' })
    return
  }
  const { email, password } = parsed.data
  const [user] = await db
    .select()
    .from(schema.adminUsers)
    .where(eq(schema.adminUsers.email, email))
    .limit(1)

  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    res.status(401).json({ error: 'Credenciales incorrectas' })
    return
  }

  issueSession(res, { sub: user.id, email: user.email })
  res.json({ ok: true, user: { email: user.email, name: user.name } })
})

authRouter.post('/logout', (_req, res) => {
  clearSession(res)
  res.json({ ok: true })
})

authRouter.get('/me', (req, res) => {
  const session = readSession(req)
  if (!session) {
    res.status(401).json({ error: 'No autenticado' })
    return
  }
  res.json({ user: { email: session.email } })
})
