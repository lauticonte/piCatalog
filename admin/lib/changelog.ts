/**
 * Novedades de cada versión, escritas para quien administra la tienda: qué puede hacer
 * ahora o qué cambió para sus clientes, sin detalles técnicos.
 *
 * Al publicar una versión: sumar la entrada ARRIBA con el mismo número que el
 * package.json. La primera entrada es la que el panel muestra como "nueva".
 */

export type ChangeType = 'nuevo' | 'mejora' | 'arreglo'

export interface ChangelogEntry {
  version: string
  /** AAAA-MM-DD */
  date: string
  title: string
  changes: Array<{ type: ChangeType; text: string }>
}

export const CHANGELOG: ChangelogEntry[] = [
  {
    version: '1.16.0',
    date: '2026-10-09',
    title: 'Panel y tienda más livianos',
    changes: [
      {
        type: 'mejora',
        text: 'Se quitaron el carrito y los pagos online, que no se usaban: la tienda sigue funcionando con la consulta por WhatsApp, igual que hasta ahora.',
      },
      {
        type: 'mejora',
        text: 'Las páginas de la tienda bajan menos datos (unos 7 kB menos cada una) y la de inicio ya no pide información que no mostraba, así que cargan un poco más rápido, sobre todo en el celular.',
      },
      {
        type: 'mejora',
        text: 'Los cambios llegan antes a la tienda y al panel: cada actualización se publica en un minuto y medio o menos, contra más de dos minutos de antes.',
      },
      {
        type: 'mejora',
        text: 'Limpieza a fondo: se sacaron unas 1.700 líneas de código y 21 componentes externos que no se usaban. La tienda quedó con un 22% menos de código, lo que la hace más fácil y segura de mantener.',
      },
      {
        type: 'arreglo',
        text: 'Los buscadores ya no reciben indicaciones de otro sitio: antes la tienda les señalaba un dominio que no era el de MH Garage.',
      },
    ],
  },
  {
    version: '1.15.3',
    date: '2026-10-08',
    title: 'Más actualizaciones de seguridad',
    changes: [
      {
        type: 'mejora',
        text: 'Se cerraron otras fallas de seguridad conocidas en componentes internos del panel y la tienda, incluido el manejo de la sesión al iniciar sesión. No cambia nada en el uso diario.',
      },
    ],
  },
  {
    version: '1.15.2',
    date: '2026-10-08',
    title: 'Actualizaciones de seguridad',
    changes: [
      {
        type: 'mejora',
        text: 'Se actualizaron componentes internos del panel y la tienda para cerrar fallas de seguridad conocidas. Subir y quitar imágenes de productos funciona igual que antes.',
      },
    ],
  },
  {
    version: '1.15.1',
    date: '2026-10-08',
    title: 'Velocidad de la tienda en el Panel',
    changes: [
      {
        type: 'nuevo',
        text: 'Nueva tarjeta "Velocidad de la tienda": cuánto tarda en cargar, en responder y cuánto se mueve la página para tus visitantes reales, en celular y computadora.',
      },
    ],
  },
  {
    version: '1.15.0',
    date: '2026-10-08',
    title: 'Panel con las visitas de la tienda',
    changes: [
      {
        type: 'nuevo',
        text: 'El Panel muestra cuánta gente visita la tienda: visitantes y páginas vistas por día, comparados con el período anterior.',
      },
      {
        type: 'nuevo',
        text: 'Productos más vistos con su tasa de consulta: de cada 100 personas que miran un producto, cuántas preguntan por WhatsApp.',
      },
      { type: 'nuevo', text: 'De dónde llegan los visitantes (Google, Instagram, WhatsApp, directo) y desde qué dispositivo.' },
      { type: 'mejora', text: 'Se puede ver el Panel de los últimos 7, 30 o 90 días.' },
    ],
  },
  {
    version: '1.14.0',
    date: '2026-10-08',
    title: 'Precios en masa y un panel con los colores de MH',
    changes: [
      {
        type: 'nuevo',
        text: 'Editar precios de varios productos a la vez: subir o bajar un porcentaje, poner un mismo precio o cambiarlos uno por uno, con vista previa antes de guardar.',
      },
      {
        type: 'nuevo',
        text: 'Las tablas se pueden ordenar por nombre, precio, cantidad o fecha, y tienen filtros rápidos: destacados, sin imagen, sin código, categorías vacías, combos sin cargar.',
      },
      { type: 'mejora', text: 'El panel pasa a los colores de MH, con el mismo encabezado que la tienda.' },
      {
        type: 'mejora',
        text: 'Formulario de producto ordenado en secciones, con la descripción en varias líneas y el botón de guardar siempre a la vista.',
      },
      { type: 'mejora', text: 'Al cargar un producto, los datos que faltan se marcan debajo de cada campo.' },
      { type: 'mejora', text: 'En el celular, el menú de la tienda se abre con una animación más clara.' },
    ],
  },
  {
    version: '1.13.0',
    date: '2026-10-08',
    title: 'Encabezado nuevo con menú de categorías',
    changes: [
      {
        type: 'nuevo',
        text: 'En la computadora, "Productos" despliega todas las categorías con una foto y la cantidad de productos de cada una, y "Marcas" muestra los logos.',
      },
      {
        type: 'nuevo',
        text: 'En el celular el encabezado entra en una sola línea: logo, buscador y un menú con las secciones, las categorías y las marcas.',
      },
      { type: 'mejora', text: 'Buscador más grande, con botón "Buscar" a la vista.' },
      { type: 'mejora', text: 'La ficha del producto aparece completa de una vez, con la foto ya cargada, en lugar de mostrarse por partes.' },
      { type: 'arreglo', text: 'Las fotos de productos nuevos vuelven a verse en la tienda: habían dejado de cargar.' },
    ],
  },
  {
    version: '1.12.3',
    date: '2026-09-15',
    title: 'Tarjetas de producto y encabezado renovados',
    changes: [
      { type: 'mejora', text: 'En el celular los productos se ven de a dos por fila: se recorre el catálogo con la mitad de desplazamiento.' },
      { type: 'mejora', text: 'Tarjetas con la foto enmarcada, el código del producto visible, el precio destacado y el botón "Consultar" más compacto.' },
      { type: 'mejora', text: 'La franja superior pasa a los colores de MH y suma "Retiro sin cargo" y "Cuotas fijas".' },
      { type: 'mejora', text: 'Pie de página renovado con los beneficios de la tienda, el número de WhatsApp y el horario de atención.' },
      { type: 'mejora', text: 'Componentes internos actualizados por seguridad.' },
    ],
  },
  {
    version: '1.12.1',
    date: '2026-09-15',
    title: 'Filtros más cómodos en el celular',
    changes: [
      {
        type: 'mejora',
        text: 'En el celular los filtros se abren con el botón "Filtrar": todas las categorías en una lista y las marcas con su logo, en lugar de una fila que había que deslizar.',
      },
      { type: 'mejora', text: 'Cada filtro se aplica al tocarlo y el botón muestra cuántos productos quedan.' },
    ],
  },
  {
    version: '1.12.0',
    date: '2026-09-15',
    title: 'Novedades en el panel',
    changes: [
      { type: 'nuevo', text: 'Esta sección: cada vez que se publica una versión, acá se cuenta qué cambió.' },
      { type: 'mejora', text: 'Los productos destacados se marcan con una estrella en la lista de productos, también desde el celular.' },
    ],
  },
  {
    version: '1.11.0',
    date: '2026-09-14',
    title: 'Catálogo completo con búsqueda al instante',
    changes: [
      { type: 'nuevo', text: 'Página "Productos" en la tienda con todo el catálogo, accesible desde el menú.' },
      { type: 'nuevo', text: 'El buscador muestra resultados mientras se escribe, sin tener que apretar Enter.' },
      { type: 'nuevo', text: 'Filtros de categoría y marca que se combinan con la búsqueda y muestran cuántos productos quedan en cada opción.' },
      { type: 'mejora', text: 'La búsqueda encuentra palabras en cualquier orden, sin importar tildes, y también por marca: "torx bremen".' },
      { type: 'arreglo', text: 'En celulares chicos el menú de la tienda ya no genera desplazamiento lateral.' },
    ],
  },
  {
    version: '1.10.0',
    date: '2026-09-14',
    title: 'Catálogo mejor ordenado',
    changes: [
      { type: 'mejora', text: '829 productos que estaban en "OTRO" pasaron a su categoría correspondiente.' },
      { type: 'nuevo', text: 'Categorías nuevas: Tubos & accesorios, Llaves, Puntas & destornilladores y Extractores & especiales.' },
      { type: 'arreglo', text: 'Los criquets hidráulicos pasaron a Hidráulicos.' },
    ],
  },
  {
    version: '1.9.0',
    date: '2026-09-14',
    title: 'Filtros de la tienda rediseñados',
    changes: [
      { type: 'mejora', text: 'En cada categoría solo se ofrecen las marcas que tienen productos ahí, con la cantidad.' },
      { type: 'nuevo', text: 'Tarjetas con el logo de cada marca para filtrar desde el celular.' },
      { type: 'nuevo', text: 'Se ve qué filtro está activo y se puede quitar con un toque.' },
      { type: 'mejora', text: '"Ver más productos" indica cuántos se están mostrando del total.' },
      { type: 'mejora', text: 'La página de cada marca muestra los productos de entrada, sin el banner que ocupaba toda la pantalla.' },
    ],
  },
  {
    version: '1.8.4',
    date: '2026-09-14',
    title: 'Panel usable desde el celular',
    changes: [
      { type: 'nuevo', text: 'Menú desplegable en el celular con todas las secciones.' },
      { type: 'mejora', text: 'Las tablas muestran en el celular solo lo importante, y precio y código debajo del nombre.' },
      { type: 'mejora', text: 'Los formularios de carga ocupan una columna y se completan cómodos desde el teléfono.' },
    ],
  },
  {
    version: '1.8.0',
    date: '2026-09-13',
    title: 'Nuevo diseño del panel y la tienda',
    changes: [
      { type: 'mejora', text: 'Rediseño visual del panel y de la tienda.' },
      { type: 'mejora', text: 'Ficha de producto renovada, con el precio contado bien visible y el botón de WhatsApp a lo ancho.' },
      { type: 'nuevo', text: 'La versión publicada se ve en el panel y al pie de la tienda.' },
    ],
  },
  {
    version: '1.7.0',
    date: '2026-09-12',
    title: 'Consultas por WhatsApp en el panel',
    changes: [
      { type: 'nuevo', text: 'Cada clic en "Consultar" de la tienda queda registrado.' },
      { type: 'nuevo', text: 'El panel muestra los productos más consultados, las últimas consultas y el valor consultado por mes.' },
    ],
  },
  {
    version: '1.6.0',
    date: '2026-09-12',
    title: 'Combos por rubro y tienda más rápida',
    changes: [
      { type: 'nuevo', text: 'Combos de productos armados por rubro, administrables desde el panel.' },
      { type: 'nuevo', text: 'Búsqueda de productos por nombre en la tienda.' },
      { type: 'mejora', text: 'La tienda carga más rápido: fichas de producto y portada.' },
    ],
  },
  {
    version: '1.5.0',
    date: '2026-09-12',
    title: 'Borrado masivo de productos',
    changes: [
      { type: 'nuevo', text: 'Seleccionar varios productos y eliminarlos juntos.' },
      { type: 'arreglo', text: 'La paginación de la lista de productos ya no vuelve a la primera página después de un cambio.' },
    ],
  },
  {
    version: '1.4.0',
    date: '2024-11-21',
    title: 'Búsqueda por código',
    changes: [{ type: 'nuevo', text: 'Buscar productos por SKU.' }],
  },
  {
    version: '1.3.0',
    date: '2024-08-13',
    title: 'Mejor presencia al compartir',
    changes: [{ type: 'mejora', text: 'Los links de la tienda se ven con imagen y descripción al compartirlos en redes y WhatsApp.' }],
  },
  {
    version: '1.2.0',
    date: '2024-06-02',
    title: 'Filtro por marca',
    changes: [{ type: 'nuevo', text: 'Filtrar los productos por marca.' }],
  },
  {
    version: '1.1.0',
    date: '2024-05-29',
    title: 'Paginación',
    changes: [{ type: 'nuevo', text: 'Los listados de la tienda cargan de a partes.' }],
  },
  {
    version: '1.0.0',
    date: '2024-04-16',
    title: 'Lanzamiento de la tienda',
    changes: [{ type: 'nuevo', text: 'Primera versión publicada de la tienda y el panel.' }],
  },
]

export const LATEST_VERSION = CHANGELOG[0].version
