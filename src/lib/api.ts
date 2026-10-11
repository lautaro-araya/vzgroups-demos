/** Cliente HTTP mínimo para hablar con /api. Envía cookies (sesión del panel). */

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch('/api' + path, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers ?? {}) },
    ...options,
  })
  const isJson = res.headers.get('content-type')?.includes('application/json')
  const data = isJson ? await res.json() : null
  if (!res.ok) {
    throw new ApiError(res.status, data?.error ?? `Error ${res.status}`)
  }
  return data as T
}

/**
 * Sube una imagen desde el panel y devuelve su URL definitiva.
 * El archivo viaja como cuerpo crudo (sin multipart); el servidor lo guarda en
 * Vercel Blob —o en public/uploads en desarrollo— y responde { url }.
 */
async function upload(file: File): Promise<string> {
  const res = await fetch(`/api/admin/uploads?filename=${encodeURIComponent(file.name)}`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': file.type || 'application/octet-stream' },
    body: file,
  })
  const data = res.headers.get('content-type')?.includes('application/json') ? await res.json() : null
  if (!res.ok) throw new ApiError(res.status, data?.error ?? `Error ${res.status}`)
  return (data as { url: string }).url
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  upload,
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body ?? {}) }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PUT', body: JSON.stringify(body ?? {}) }),
  del: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
}
