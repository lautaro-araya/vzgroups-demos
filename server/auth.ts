/**
 * Autenticación del panel de administración.
 * Un solo administrador (el cliente). Sesión con JWT en cookie httpOnly:
 * el token no es accesible desde JavaScript del navegador (mitiga XSS).
 */
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import type { Request, Response, NextFunction } from 'express'

const COOKIE_NAME = 'vzgroups_session'
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000 // 7 días

function getSecret(): string {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('Falta JWT_SECRET en el entorno.')
  return secret
}

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10)
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash)
}

export type SessionPayload = { sub: number; email: string }

export function issueSession(res: Response, payload: SessionPayload): void {
  const token = jwt.sign(payload, getSecret(), { expiresIn: '7d' })
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: MAX_AGE_MS,
    path: '/',
  })
}

export function clearSession(res: Response): void {
  res.clearCookie(COOKIE_NAME, { path: '/' })
}

export function readSession(req: Request): SessionPayload | null {
  const token = req.cookies?.[COOKIE_NAME]
  if (!token) return null
  try {
    return jwt.verify(token, getSecret()) as unknown as SessionPayload
  } catch {
    return null
  }
}

/** Middleware: exige sesión válida. Deja la sesión en req.session. */
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const session = readSession(req)
  if (!session) {
    res.status(401).json({ error: 'No autenticado' })
    return
  }
  ;(req as Request & { session?: SessionPayload }).session = session
  next()
}
