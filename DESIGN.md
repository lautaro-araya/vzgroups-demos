---
name: VZ Groups
description: Holding de control de plagas, higiene y capacitación, con catálogo B2B de equipos profesionales y cotización en línea.
colors:
  vz-blue: "#2a4f9e"
  vz-blue-dark: "#1f3c7a"
  vz-blue-deep: "#152a57"
  vz-blue-tint: "#eaf0fa"
  vz-green: "#3b8a4f"
  vz-green-dark: "#2c6b3c"
  vz-green-tint: "#e9f4ec"
  vz-ink: "#1c2127"
  vz-ink-soft: "#3a424d"
  vz-muted: "#5b6573"
  vz-line: "#dfe4ea"
  vz-mist: "#f3f5f7"
  white: "#ffffff"
  error: "#b42318"
typography:
  display:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.3rem, 5vw, 3.9rem)"
    fontWeight: 800
    lineHeight: 1.02
    letterSpacing: "-0.025em"
    fontVariation: "'wdth' 115"
  headline:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 3.4vw, 2.6rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.02em"
    fontVariation: "'wdth' 112"
  title:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1.2
  body:
    fontFamily: "'Source Sans 3', ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  body-sm:
    fontFamily: "'Source Sans 3', ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 400
    lineHeight: 1.35
  caption:
    fontFamily: "'Source Sans 3', ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.8rem"
    fontWeight: 600
  label:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 700
    letterSpacing: "0.05em"
rounded:
  none: "0px"
spacing:
  gutter: "20px"
  card: "16px"
  section: "80px"
  container: "76rem"
components:
  button-primary:
    backgroundColor: "{colors.vz-blue}"
    textColor: "{colors.white}"
    rounded: "{rounded.none}"
    padding: "12px 20px"
  button-primary-hover:
    backgroundColor: "{colors.vz-blue-dark}"
  button-outline:
    backgroundColor: "{colors.white}"
    textColor: "{colors.vz-ink}"
    rounded: "{rounded.none}"
    padding: "12px 20px"
  button-outline-hover:
    backgroundColor: "{colors.vz-ink}"
    textColor: "{colors.white}"
  button-added:
    backgroundColor: "{colors.vz-green}"
    textColor: "{colors.white}"
  chip-filter:
    backgroundColor: "{colors.white}"
    textColor: "{colors.vz-ink}"
    rounded: "{rounded.none}"
    padding: "8px 12px"
  chip-filter-active:
    backgroundColor: "{colors.vz-blue}"
    textColor: "{colors.white}"
  input:
    backgroundColor: "{colors.white}"
    textColor: "{colors.vz-ink}"
    rounded: "{rounded.none}"
    height: "48px"
  product-card:
    backgroundColor: "{colors.white}"
    textColor: "{colors.vz-ink}"
    rounded: "{rounded.none}"
    padding: "16px"
---

# Design System: VZ Groups

## Overview

**Creative North Star: "El proveedor industrial serio"**

El estándar de un proveedor B2B de la categoría, ejecutado con oficio: un comprador de una planta de alimentos o un controlador de plagas tiene que reconocer en un vistazo a una empresa establecida, encontrar el equipo por línea o por plaga y pedir cotización sin fricción. La vara de calidad son ekommerce.it (estructura de catálogo) y desinsekta.de (tono).

El azul de la "V" del logo hace el trabajo: bandas de sección enteras (hero de portada y de Nosotros) y todas las acciones. El verde de la "Z" queda para lo que pertenece a una línea de producto y para confirmar ("Agregado"). El resto es blanco, gris frío y carbón, con filetes de 1 px y esquinas rectas. La fotografía es sólo de producto, sobre blanco: no hay fotos ambientales y el diseño no depende de ellas.

**Key Characteristics:**
- Banda azul a todo el ancho como apertura; el catálogo asoma en la primera pantalla.
- Esquinas rectas en todo: botones, tarjetas, campos, chips.
- Filetes de 1 px (`vz-line`) y listas con divisores en lugar de tarjetas anidadas.
- Archivo ancho para titulares; Source Sans 3 para leer.
- Sin precios publicados: la acción es "Agregar a cotización".

## Colors

Restringido: neutros fríos más un azul que manda y un verde con un solo trabajo.

### Primary
- **Azul VZ** (`#2a4f9e`): campo del hero, botones primarios, enlaces, contador de la lista, filtros activos, foco. Hover `#1f3c7a`; texto sobre tinte `#152a57`; tinte `#eaf0fa` para estados "en lista" y hover de chips.

### Secondary
- **Verde VZ** (`#3b8a4f`, oscuro `#2c6b3c`, tinte `#e9f4ec`): nombre de la línea de producto sobre cada tarjeta, íconos de línea, confirmación "Agregado", marcador de listas en la ficha técnica.

### Neutral
- **Carbón** (`#1c2127`) texto y footer; **carbón suave** (`#3a424d`) texto secundario; **gris** (`#5b6573`) metadatos y placeholders; **filete** (`#dfe4ea`); **niebla** (`#f3f5f7`) fondos de cabecera interna y bandas de respiro.

### Named Rules
**The One Job Rule.** El verde nunca es una acción: sólo identifica líneas de producto y confirma. Toda acción es azul o contorno carbón.

**No Gray On Blue.** Texto secundario sobre el azul usa tintes del azul (`#dbe4f5`, `#c9d6ee`), nunca gris.

## Typography

**Display Font:** Archivo (variable, ancho 110–115 en titulares)
**Body Font:** Source Sans 3

**Character:** Archivo expandido da el peso industrial de una placa de equipo; Source Sans 3 mantiene las fichas técnicas legibles en tramos largos.

### Hierarchy
- **Display** (800, `clamp(2.3rem, 5vw, 3.9rem)`, 1.02): sólo el titular del hero.
- **Headline** (700, `clamp(1.75rem, 3.4vw, 2.6rem)`, 1.05, clase `.h-section`): titulares de sección y de página.
- **Title** (700, 1.125rem): nombres de producto, unidades, pasos.
- **Body** (400, 1.0625rem, 1.6): texto corrido; fichas técnicas a 68ch máximo.
- **Body small** (400, 0.95rem, 1.35): resúmenes en tarjetas, metadatos, botones y enlaces secundarios.
- **Caption** (600, 0.8rem): nombre de la línea de producto sobre tarjetas y carrusel.
- **Label** (700, 0.875rem, mayúsculas, tracking 0.05em): sólo encabezados de columna en sidebar y footer.

### Named Rules
**The Heading Speaks Alone Rule.** Ningún kicker ni etiqueta encima de un titular; la jerarquía la dan tamaño y peso.

## Layout

Contenedor `max-w-site` (76rem) con medianil de 20 px. Ritmo de secciones de 80 px (pt-20 / py-20) en escritorio. Catálogo en dos columnas desde `lg` (sidebar de 15rem + grilla de 3 tarjetas desde `xl`, 2 desde `sm`). Toda grilla de una columna declara `grid-cols-1` para que el contenido no la estire en móvil.

### Named Rules
**The Peek Rule.** En portada, la caja de líneas de producto sube 80–96 px sobre el borde de la banda azul: el catálogo siempre asoma en la primera pantalla.

## Elevation & Depth

Plano con filetes. Dos sombras con desplazamiento y desenfoque, ambas estructurales:
- `0 18px 40px -24px rgba(21,42,87,0.45)` bajo la caja de líneas que se superpone al hero.
- `0 10px 28px -14px rgba(28,33,39,0.35)` en hover de tarjeta de producto.
El panel de cotización proyecta `-12px 0 32px -12px rgba(28,33,39,0.35)` hacia la izquierda.

## Shapes

Esquinas rectas (0 px) sin excepción. Bordes de 1 px; el borde carbón (`vz-ink`) marca botones de contorno y el filete superior de listas definitorias.

## Components

### Buttons
- **Primario:** azul, texto blanco, 12×20 px, semibold 0.95rem; hover azul oscuro.
- **Contorno:** borde carbón 1 px; hover rellena carbón con texto blanco. Sobre azul: borde blanco 70 %.
- **Agregar a cotización:** tres estados — azul ("Agregar a cotización"), verde 1,8 s tras agregar ("Agregado"), tinte azul con borde ("Sumar uno más · n en lista").

### Chips
Filtros por plaga y accesos de portada: borde filete, fondo blanco; hover borde azul y tinte; activo relleno azul (`aria-pressed`).

### Cards / Containers
Tarjeta de producto: borde filete, foto `object-contain` sobre blanco (4:3 en móvil, cuadrada desde `sm`), línea en verde, nombre en Archivo, resumen a 3 líneas y botón a todo el ancho.

### Inputs / Fields
48 px de alto, borde filete, foco con borde azul y anillo azul 30 %. Error: borde y mensaje `#b42318` bajo el campo.

### Navigation
Header blanco pegajoso con desenfoque, logo a 48–56 px, tres enlaces y el botón "Cotización" con contador que late (`vz-bump`) al crecer la lista.

### Signature Component
**Lista de cotización:** persiste en el navegador; panel lateral (portal a `<body>`) con miniaturas, cantidades y "Continuar y enviar solicitud".

## Do's and Don'ts

### Do:
- **Do** usar el azul como campo completo de sección, no como acento suelto.
- **Do** mostrar productos reales (fotos del catálogo) donde otro sitio pondría ilustraciones.
- **Do** declarar `grid-cols-1` en grillas que pasan a varias columnas en `lg`.

### Don't:
- **Don't** publicar precios hasta que el cliente los audite.
- **Don't** poner kickers, numeración decorativa ni métricas gigantes como estructura.
- **Don't** usar el verde menta y el carrito de consumo del vzgroups.com antiguo.
- **Don't** usar gradientes, glassmorphism decorativo ni dark mode tipo SaaS.
