/** Inicio del panel: cotizaciones pendientes, accesos rápidos y publicar cambios. */
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, ApiError } from '../lib/api'
import { PageHeading, Card, Button, Notice, Loading } from './ui'

type Stats = { products: number; productsPublished: number; quotes: number; quotesPending: number }

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [aviso, setAviso] = useState<string | null>(null)
  const [publishing, setPublishing] = useState(false)
  const [publishMsg, setPublishMsg] = useState<{ kind: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    api
      .get<Stats>('/admin/stats')
      .then(setStats)
      .catch(() =>
        setAviso(
          'No se pudieron cargar los datos. Si el sitio se acaba de instalar o actualizar, falta poner la base al día: abre una vez /api/setup?token=TU_SETUP_TOKEN.',
        ),
      )
  }, [])

  async function publish() {
    setPublishing(true)
    setPublishMsg(null)
    try {
      await api.post('/admin/publish')
      setPublishMsg({ kind: 'success', text: 'Publicación en curso. Los cambios quedarán visibles para Google en 1-2 minutos.' })
    } catch (err) {
      setPublishMsg({ kind: 'error', text: err instanceof ApiError ? err.message : 'No se pudo publicar' })
    } finally {
      setPublishing(false)
    }
  }

  const tiles = stats
    ? [
        { to: '/admin/cotizaciones', label: 'Cotizaciones', value: stats.quotes, unit: `${stats.quotesPending} sin atender` },
        { to: '/admin/productos', label: 'Productos', value: stats.products, unit: `${stats.productsPublished} publicados` },
      ]
    : []

  return (
    <div>
      <PageHeading
        title="Bienvenido al panel"
        description="Los cambios se guardan al instante y se ven en el sitio de inmediato. Para que también queden en el HTML que lee Google, publica los cambios."
      />

      {aviso && (
        <div className="mb-6">
          <Notice kind="error">{aviso}</Notice>
        </div>
      )}

      {stats && stats.quotesPending > 0 && (
        <Link to="/admin/cotizaciones" className="mb-6 block">
          <div className="flex items-center justify-between border-2 border-vz-blue bg-vz-blue-tint px-5 py-4 transition-colors hover:bg-white">
            <span className="text-sm font-bold uppercase tracking-wide text-vz-blue-deep">
              Tienes {stats.quotesPending} cotizaci{stats.quotesPending === 1 ? 'ón' : 'ones'} sin atender
            </span>
            <span className="text-sm font-bold uppercase tracking-wide text-vz-blue">Ver →</span>
          </div>
        </Link>
      )}

      <Card className="mb-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-extrabold uppercase tracking-wide text-vz-ink">Publicar cambios</h2>
          <p className="mt-1 text-sm text-neutral-600">
            Regenera las páginas del catálogo para que Google vea los productos con el contenido nuevo.
          </p>
        </div>
        <Button onClick={publish} disabled={publishing} className="shrink-0">
          {publishing ? 'Publicando…' : 'Publicar cambios'}
        </Button>
      </Card>
      {publishMsg && (
        <div className="mb-6">
          <Notice kind={publishMsg.kind}>{publishMsg.text}</Notice>
        </div>
      )}

      {!stats && !aviso ? (
        <Loading />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {tiles.map((t) => (
            <Link key={t.to} to={t.to}>
              <Card className="transition-colors hover:border-vz-blue">
                <div className="text-3xl font-extrabold text-vz-blue">{t.value}</div>
                <div className="mt-1 text-sm font-bold uppercase tracking-wide text-vz-ink">{t.label}</div>
                <div className="text-xs text-neutral-500">{t.unit}</div>
              </Card>
            </Link>
          ))}
          <Link to="/admin/contacto">
            <Card className="h-full transition-colors hover:border-vz-blue">
              <div className="text-sm font-bold uppercase tracking-wide text-vz-ink">Contacto y redes</div>
              <div className="mt-1 text-xs text-neutral-500">Teléfono, WhatsApp, correo, dirección y redes del pie de página.</div>
            </Card>
          </Link>
        </div>
      )}
    </div>
  )
}
