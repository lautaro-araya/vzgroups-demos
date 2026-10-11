/**
 * Catálogo inicial: las 17 fichas que vivían en vetlain.cl/productos, con su
 * línea, las plagas que controlan y si van destacadas en la portada.
 * El fabricante sólo se indica donde está confirmado; el resto lo completa el
 * cliente desde el panel.
 *
 * `image` es una ruta relativa a /public. Si el cliente pega una URL completa
 * desde el panel, también funciona.
 */
import type { ProductLineId } from '../../src/lib/catalog.js'

export type ProductSeed = {
  slug: string
  name: string
  line: ProductLineId
  pests: string[]
  brand?: string
  featured?: boolean
  summary: string
  bodyMd: string
  image: string
}

export const productsSeed: ProductSeed[] = [
  /* ── Control de roedores ──────────────────────────────────────────── */
  {
    slug: 'ekomille',
    name: 'Ekomille',
    line: 'roedores',
    pests: ['ratas-y-ratones'],
    brand: 'Ekommerce',
    featured: true,
    image: 'brand/productos/ekomille.png',
    summary:
      'Dispositivo electromecánico ecológico para el monitoreo y captura de roedores sinantrópicos, sin uso de veneno, de un modo muy seguro con el entorno y las personas.',
    bodyMd:
      'Indicado para el control de roedores de empresas de la cadena de suministro agroalimentario, industrias, lugares públicos, zonas exteriores, control de roedores ecocompatible y etológico, control de roedores integrado con otros métodos de control.\n\n### Características\n\n- Sin uso de sustancias tóxicas.\n- Sin dispersión de cadáveres en el medio ambiente.\n- Seguridad para alimentos, animales no objetivo, niños y lugares de trabajo.\n- Conteo automático de capturas.\n- LED brillante para comprobar el funcionamiento de la batería de 9 V.\n- Posibilidad de captura en vivo.\n- Fácil inspección y mantenimiento.',
  },
  {
    slug: 'ekologic',
    name: 'Ekologic',
    line: 'roedores',
    pests: ['ratas-y-ratones'],
    image: 'brand/productos/ekologic.jpg',
    summary:
      'Dispositivo para monitoreo de roedores sinantrópicos para emplear de forma integrada con Ekomille.',
    bodyMd:
      'Indicado para el seguimiento de plagas en empresas de la cadena de suministro agroalimentario, industrias, lugares públicos, zonas exteriores.\n\nEspecialmente pensado para el manejo de plagas de Rata gris (*Rattus norvegicus*), Rata negra (*Rattus rattus*), Ratón doméstico (*Mus musculus domesticus*).',
  },
  {
    slug: 'evo-estacion-de-control',
    name: 'EVO — Estación de Control',
    line: 'roedores',
    pests: ['ratas-y-ratones', 'cucarachas'],
    image: 'brand/productos/evo.jpg',
    summary:
      'Portacebos de alta seguridad, que permite monitorear y capturar tanto roedores como rastreros, combinando en su interior distintas alternativas de control.',
    bodyMd:
      'Es multifuncional y se puede utilizar con trampas de golpe o de papel para roedores, feromonas de insectos rastreros, etc.\n\n### Características\n\n- Apertura lateral, dejando las paredes ser un obstáculo.\n- Un solo cierre de seguridad.\n- Accesorio extraíble para fijación en pared.\n- Orificios de evacuación de lluvia.\n- Tapa reforzada resistente.\n- Entradas específicas para rastreros.',
  },
  {
    slug: 'snap-trap',
    name: 'Snap Trap',
    line: 'roedores',
    pests: ['ratas-y-ratones'],
    image: 'brand/productos/snap-trap.jpg',
    summary:
      'Trampa con sistema de pinza, que permite cazar roedores de forma eficiente.',
    bodyMd:
      'Consiste en atraer al roedor con una porción de atrayente, captura y retiene sin posibilidad de escape.',
  },
  {
    slug: 'nara-lure',
    name: 'Nara Lure',
    line: 'roedores',
    pests: ['ratas-y-ratones'],
    image: 'brand/productos/nara-lure.jpg',
    summary:
      'Placebo sintético totalmente atóxico con alto poder de atracción. Disponible en distintos sabores (vainilla, pescado, chocolate, mango, entre varios otros).',
    bodyMd:
      '### Características\n\n- Durabilidad aproximada de 3 meses, dependiendo del entorno de aplicación.\n- Las roeduras quedan impresas.\n- Al estar fabricado de goma no alimenta a los roedores ni insectos.\n- Resistente al agua y humedad.',
  },
  {
    slug: 'vastrap',
    name: 'Vastrap',
    line: 'roedores',
    pests: ['ratas-y-ratones'],
    image: 'brand/productos/vastrap.jpg',
    summary:
      'Trampa adhesiva, con base plástica traslúcida para ratas, resistente a altas y bajas temperaturas.',
    bodyMd:
      'Se complementa con el TÚNEL para conseguir efecto madriguera y mayor duración de la trampa.\n\n### Características\n\n- Dimensiones Vastrap: **25 x 12 x 1,2 cm**\n- Dimensiones Túnel: **25 x 12 x 8 cm**',
  },
  {
    slug: 'mouse-shield',
    name: 'Mouse Shield',
    line: 'roedores',
    pests: ['ratas-y-ratones'],
    image: 'brand/productos/mouse-shield.webp',
    summary:
      'Pasta ecológica para sellar accesos de roedores tales como pueden ser grietas, madrigueras y canales.',
    bodyMd:
      '### Características\n\n- No contiene ingredientes peligrosos.\n- Resiste la mordedura de roedores.\n- Larga duración.\n- Se aplica fácilmente con pistola de silicona.',
  },
  {
    slug: 'tunap',
    name: 'Tunap',
    line: 'roedores',
    pests: ['ratas-y-ratones'],
    image: 'brand/productos/tunap.png',
    summary:
      'Spray que crea una película de protección pegajosa alrededor de cables, impidiendo la mordedura de roedores.',
    bodyMd:
      '### Características\n\n- No contiene ingredientes peligrosos.\n- Para materiales tales como cauchos, motores, componentes mecánicos, tuberías, sistema de frenos, mangueras y cables de freno.\n- Es termoestable y resistente a salpicaduras de agua.\n- Efecto dura 15 días dependiendo del entorno de aplicación.',
  },

  /* ── Control de insectos ──────────────────────────────────────────── */
  {
    slug: 'nice-18-w40',
    name: 'Nice 18/W40',
    line: 'insectos',
    pests: ['moscas-y-mosquitos'],
    image: 'brand/productos/nice-18.jpg',
    summary:
      'Elegante aplique de luz para ambientes que precisan matar insectos. Decorativo y discreto para uso domiciliario, oficinas, salas, restaurantes, hoteles o comercio.',
    bodyMd:
      '### Características\n\n- Alto rendimiento en capturas (25 m²).\n- Fácil instalación y servicio.\n- Acero esmaltado en blanco.\n- Ocupa tubos UV de 18 WATTS inastillables.\n- Dimensiones: **470 x 170 x 250 mm**',
  },
  {
    slug: 'rb-40',
    name: 'RB-40',
    line: 'insectos',
    pests: ['moscas-y-mosquitos'],
    featured: true,
    image: 'brand/productos/rb-40.jpg',
    summary:
      'Ideado para minimizar los costos de mantenimiento. Incorpora un único tubo de 40 W que garantiza la misma eficacia que equipos con dos tubos.',
    bodyMd:
      'Su montaje puede ser a pared o en suspensión. Ideal para zonas industriales y grandes proyectos.\n\n### Características\n\n- Fácil sustitución de la tabla adhesiva.\n- Mínimo costo de mantenimiento.\n- Garantía de 3 años.\n- Cobertura: 120 m² / Dimensiones: **630 x 300 x 134 mm**\n- Incluye placa que se recambia mensualmente.',
  },
  {
    slug: 'onda',
    name: 'Onda',
    line: 'insectos',
    pests: ['moscas-y-mosquitos'],
    image: 'brand/productos/onda.jpg',
    summary:
      'Lámpara ideal para oficinas, salas, restaurantes, comedores o centros de producción alimentaria por su diseño discreto, versátil y moderno.',
    bodyMd:
      '### Características\n\n- Alto rendimiento y gran superficie de capturas (80 m²).\n- Se puede utilizar como plafón de techo y aplique de pared.\n- Ocupa tubos UV de 20 WATTS inastillables.\n- Incluye placa autoadhesiva que se cambia mensualmente.\n- Dimensiones: **470 x 170 x 250 mm**',
  },
  {
    slug: 'blatrap',
    name: 'Blatrap',
    line: 'insectos',
    pests: ['cucarachas'],
    image: 'brand/productos/blatrap.jpg',
    summary:
      'Trampa para la monitorización y captura de cucarachas con potente adhesivo aromatizado que refuerza su poder de atracción.',
    bodyMd:
      '### Características\n\n- Cartón engomado.\n- Dimensiones: largo 12 cm x ancho 8,5 cm x alto 1,5 cm.',
  },
  {
    slug: 'blatrap-mini',
    name: 'Blatrap (mini)',
    line: 'insectos',
    pests: ['cucarachas'],
    brand: 'Ekommerce',
    featured: true,
    image: 'brand/productos/blatrap-mini.png',
    summary:
      'Trampa para la monitorización y captura de cucarachas con potente adhesivo aromatizado que refuerza su poder de atracción.',
    bodyMd:
      '### Características\n\n- Subdivisibles en 5 monitores.\n- Calidad y eficacia demostrada y perdurable en el tiempo.\n- Dimensiones: **300 x 208 mm**',
  },
  {
    slug: 'venus-lure',
    name: 'Venus Lure',
    line: 'insectos',
    pests: ['moscas-y-mosquitos'],
    image: 'brand/productos/venus-lure.jpg',
    summary:
      'Polvo de origen orgánico en alubag, que es un atractivo recambio para trampas de exterior. Está diseñado para atraer moscas, moscardas y otros insectos voladores.',
    bodyMd:
      '### Características\n\n- 10 bolsas selladas de 45 grs.\n- Efectividad de hasta 8 semanas.\n- Atrayente soluble en agua que no contiene tóxicos.\n- Ideal para ambientes con gran densidad de moscas.\n- Atrayente exclusivo e irresistible para multitud de especies de moscas.',
  },
  {
    slug: 'xlure-mst',
    name: 'XLure MST',
    line: 'insectos',
    pests: ['plagas-de-almacen'],
    image: 'brand/productos/xlure-mst.png',
    summary:
      'Trampa de alta eficacia, diseñada para atraer y capturar múltiples especies de insectos de la industria alimentaria y productos almacenados.',
    bodyMd:
      'Su especial fórmula está compuesta por 3 tipos de feromonas y 2 mezclas de atrayentes alimenticios.\n\n### Especies que captura\n\n- Escarabajo del pan (*Stegobium paniceum*)\n- Escarabajo del tabaco (*Lasioderma serricorne*)\n- Escarabajo de la harina (*Tribolium* spp.)\n- Carcoma dentada del grano (*Oryzaephilus surinamensis*)\n- Gorgojo mercante de los granos (*Oryzaephilus mercator*)\n- Escarabajo Kapra (*Trogoderma granarium*)\n- Capuchino (*Rhyzopertha dominica*)\n- Gorgojo de los cereales (*Sitophilus* spp.)\n- Gorgojo del arroz (*Sitophilus oryzae*)\n- Gorgojo castaño de la harina (*Tribolium castaneum*)\n- Carcoma achatada (*Cryptolestes ferrugineus*)\n- Falso gorgojo de la harina (*Tribolium confusum*)\n- Gorgojo karpa (*Trogoderma granarium*)\n- Ácaro de la harina (*Acarus siro*)',
  },

  /* ── Control de aves ──────────────────────────────────────────────── */
  {
    slug: 'trampa-rotatoria',
    name: 'Trampa Rotatoria',
    line: 'aves',
    pests: ['palomas'],
    image: 'brand/productos/trampa-rotatoria.jpg',
    summary:
      'Innovadora trampa que permite a las palomas acceder en confianza al interior —utilizando alimento como cebo— gracias a su sistema de entrada giratorio y automático.',
    bodyMd:
      '### Características\n\n- Innovadora trampa que permite a las palomas acceder en confianza al interior —utilizando alimento como cebo— gracias a su sistema de entrada giratorio y automático.\n- El propio diseño y sistema de funcionamiento de la trampa —al contrario que las jaulas tradicionales— hacen que tanto jóvenes como adultos entren confiadamente.\n- Adaptable a cualquier tipo de jaula.',
  },
  {
    slug: 'inox-80-25',
    name: 'INOX 80/25',
    line: 'aves',
    pests: ['palomas'],
    featured: true,
    image: 'brand/productos/inox-80-25.jpg',
    summary: 'Pinchos de acero inoxidable con base en policarbonato.',
    bodyMd:
      '### Características\n\n- 80 pinchos por metro lineal en tramos de 10 cm.\n- Superficie disuasoria de los pinchos: 8 cm de ancho.\n- Gran resistencia a los agentes atmosféricos, resiste hasta temperaturas de -30 °C a 150 °C.\n- Flexible y fácil de montar.',
  },
]
