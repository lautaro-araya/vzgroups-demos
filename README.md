# VZGroups — Propuestas de rediseño

Tres direcciones de diseño para recrear **vzgroups.com** fuera del modelador de GoDaddy.
Front-end estático: HTML, CSS y JavaScript sin build ni dependencias de compilación.

## Ver las demos

**https://lautaro-araya.github.io/vzgroups-demos/**

Cada demo tiene una **botonera flotante A · B · C** para saltar entre las tres sin volver a un índice.

| | Demo | Dirección | Ruta |
|---|---|---|---|
| **A** | Holding Técnico | Grafito oscuro, telemetría, mapa de cobertura real, un color por unidad de negocio | [`/holding-tecnico/`](./holding-tecnico/) |
| **B** | Institucional | Verde botella, tipografía serif, fotografía documental, memoria corporativa | [`/institucional/`](./institucional/) |
| **C** | Tienda | Tinta y naranja señal, catálogo mayorista, e-commerce + hub de marcas | [`/ecommerce/`](./ecommerce/) |

La Demo C tiene además una página de tienda completa en [`/ecommerce/tienda/`](./ecommerce/tienda/).

## Estructura

```
├── index.html            Redirección a la Demo A
├── holding-tecnico/      Demo A
├── institucional/        Demo B
├── ecommerce/            Demo C (home con destacados)
│   └── tienda/           Demo C — catálogo completo
└── shared/               Botonera de navegación entre demos
```

## Stack

Sin framework ni build step. Tipografías desde Google Fonts, fotografía desde Unsplash
y el mapa de cobertura con [Leaflet](https://leafletjs.com/) sobre tiles oscuros de
CARTO/OpenStreetMap (sin API key). Todo funciona con rutas relativas, así que el sitio
se sirve igual desde la raíz o desde un subdirectorio.

## Nota sobre los datos

Precios, fechas, cifras y comunas son **referenciales para la demo**. El catálogo del
sitio actual tiene precios inconsistentes que deben auditarse producto por producto
antes de cualquier migración.
