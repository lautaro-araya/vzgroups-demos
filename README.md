# VZ Groups — vzgroups.com

Sitio del holding VZ Groups (Vetlain, Vetclean, VZModular) con catálogo de
equipos profesionales para control de plagas y solicitud de cotización.

Mismo stack que el sitio de Vetlain: React + Vite + Tailwind en el front,
Express como función serverless en Vercel, Postgres en Neon con Drizzle, y
prerender de HTML estático en el build para SEO.

## Desarrollo

```bash
npm install
cp .env.example .env   # opcional: sin DATABASE_URL se usa el catálogo semilla
npm run dev            # sitio en :5173, API en :8787
```

Sin base de datos el sitio funciona en modo lectura con el catálogo de
`server/db/seed-products.ts`; el envío de cotizaciones responde 503.

## Rutas

| Ruta | Qué es |
|---|---|
| `/` | Portada: holding + líneas de producto |
| `/productos` | Catálogo (`?plaga=` filtra por plaga, `?q=` busca) |
| `/productos/linea/:linea` | Línea de producto (roedores, insectos, aves) |
| `/productos/:slug` | Ficha técnica |
| `/cotizacion` | Lista de cotización + formulario |
| `/nosotros` | El holding y sus unidades |
| `/admin` | Panel: cotizaciones, productos, contacto |

## Puesta en marcha en Vercel

1. Crear el proyecto en Vercel desde este repo y conectar Neon (Storage).
2. Variables: `JWT_SECRET`, `SETUP_TOKEN`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`,
   `SITE_URL`, `SMTP_USER`, `SMTP_PASS` (ver `.env.example`).
3. Visitar una vez `/api/setup?token=SETUP_TOKEN` (crea tablas y carga el
   catálogo), luego borrar `SETUP_TOKEN`.
4. Crear un Deploy Hook (`DEPLOY_HOOK_URL`) para el botón "Publicar cambios".

Sistema visual: ver `DESIGN.md`.
