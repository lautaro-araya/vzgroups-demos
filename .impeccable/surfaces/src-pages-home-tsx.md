---
version: 1
slug: "src-pages-home-tsx"
primary_target: "src/pages/Home.tsx"
related_targets: []
---

## Scope

Sitio público de vzgroups.com: portada (holding primero), catálogo (/productos, categorías, fichas), lista de cotización, nosotros y contacto. Modo: Persuade en portada; Read/Operate en catálogo y fichas.

## Audience and job

Comprador B2B (calidad / operaciones / empresas de control de plagas) que necesita saber quién es VZ Groups, encontrar un equipo por producto o por plaga y pedir cotización sin fricción. Prueba disponible: fotos de producto, fichas técnicas, +20 años, ISO 9001 de Vetlain. Sin fotos ambientales.

## Direction contract

THESIS: El estándar de la categoría ejecutado con oficio: un proveedor industrial B2B que se lee como empresa seria en un vistazo. Rechaza el one-pager de plantilla y el carrito de consumo; la vara es ekommerce.it (catálogo) y desinsekta.de (tono).

OWN-WORLD: Fondo blanco y gris frío #f3f5f7; tinta carbón #1c2127; azul VZ #2a4f9e como color de acción y de campo (bandas de sección enteras, no acentos sueltos); verde VZ #3b8a4f solo para líneas de producto y estados de éxito. Archivo (ancho expandido, 700) para titulares, Source Sans 3 para texto. Esquinas rectas, filetes de 1px, fotos de producto sobre blanco en recuadros cuadrados.

STORY: El visitante entiende que VZ Groups es un holding con tres unidades, ve que además vende los equipos que usa en terreno, entra al catálogo por línea o por plaga, abre la ficha técnica y agrega productos a una lista de cotización que envía en un formulario corto.

FIRST VIEWPORT: Banda azul a todo el ancho; a la izquierda titular grande en blanco (sin kicker) y bajada; dos acciones: "Ver catálogo de productos" (blanca, primaria) y "Solicitar cotización" (contorno). A la derecha, la lista "Empresas del grupo" con Vetlain (enlace a vetlain.cl), Vetclean ("Próximamente") y VZModular, sin numerar. La caja blanca de líneas de producto sube sobre el borde de la banda y asoma en la primera pantalla de escritorio.

FORM: Estándar de la categoría (canon), elegido por el usuario sobre el sorteo; seed key cd317ab0.

SIGNATURE INTERACTION: Lista de cotización: "Agregar a cotización" en cada producto actualiza el contador del header y abre un panel lateral con cantidades; persiste en el navegador y desemboca en /cotizacion.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Open decisions

- Precios: no se publican hasta auditoría del cliente.
- Contenido de Vetclean y VZModular: solo tarjeta hasta que el cliente entregue material.
