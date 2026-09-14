/**
 * Saca del cajón "OTRO" los productos cuya categoría es obvia por el nombre.
 *
 * Paso 1 (solo lectura): genera un CSV con la propuesta para revisar.
 *   npx tsx scripts/normalize-categories.ts
 *   -> scripts/out/categorias-propuesta.csv
 *
 * Paso 2 (escribe): aplica las filas del CSV. Se puede editar antes: borrar filas
 * que no convencen o cambiar la columna "sugerida" a mano. Las filas con la
 * sugerida vacía se ignoran. Antes de escribir guarda un backup para deshacer.
 *   npx tsx scripts/normalize-categories.ts --apply scripts/out/categorias-propuesta.csv
 *
 * Deshacer:
 *   npx tsx scripts/normalize-categories.ts --restore scripts/out/backup-categorias-<fecha>.json
 */
import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const STORE_ID = process.env.STORE_ID || '65ec0a796702c9c0e4c0895f'
const SOURCE_CATEGORY = 'OTRO'
const OUT_DIR = path.join(__dirname, 'out')

// Nombres tal cual están en la base. Si alguno no existe, el script aborta.
const C = {
  manuales: 'HERRAMIENTAS MANUALES',
  electricas: 'ELÉCTRICAS DE MANO',
  neumaticas: 'NEUMÁTICAS',
  pintura: 'EQUIPOS DE PINTURA',
  hidraulicos: 'HIDRÁULICOS',
  taller: 'TALLER & RACING',
  inyeccion: 'iNYECCIÓN',
  soldadoras: 'SOLDADORAS',
  jardin: 'JARDÍN & AGRÍCOLA',
  hogar: 'HOGAR & RECREACIÓN',
  calefaccion: 'CALEFACCIÓN',
}

// Se evalúan en orden sobre el nombre en mayúsculas y sin tildes: gana la primera.
// Por eso los casos puntuales van antes que los genéricos (una "pistola para pintar
// neumática" es de pintura, no de neumáticas; un "juego de caballetes" es hidráulico).
// Lo que no matchea ninguna regla queda para revisión manual.
const RULES: Array<[RegExp, string]> = [
  // Pintura
  [/^PISTOLA (DE|PARA) PINTAR/, C.pintura],

  // Inyección
  [/INYECTOR/, C.inyeccion],
  [/^PROBADOR DE (MOTORES PASO|BOBINAS|CUERPO MARIPOSA)/, C.inyeccion],

  // Neumáticas: todo lo que lo diga en el nombre (clavadoras, engrasadoras, sus clavos y
  // grampas), salvo los tubos de impacto, que son accesorios de mano.
  [/^(?!TUBO|PRENSA).*NEUMATIC[AO]/, C.neumaticas],

  // Hidráulicos
  [/^PRENSA HIDRAULICA|^PRENSA DE BANCO PESADA/, C.hidraulicos],
  [/^CRIQUE\b|^ELEVADOR|^GUINCHE|CABALLETES|^EXPANSOR PARA CHAPISTA/, C.hidraulicos],

  // Jardín (antes que taller: "carro barre hojas" no es un carro de taller)
  [/^CARRO (BARRE HOJAS|PARA MINITRACTOR)|^CORTA CERCO/, C.jardin],

  // Mobiliario y equipamiento de taller
  [/^BANCO (DE TRABAJO|DE MOTOR|SOPORTE MOTOR)/, C.taller],
  [/^(TABLERO|MESA RODANTE|GABINETE|CARRO|CAMILLA)\b|^SILLA BANQUITO/, C.taller],
  [/^BANDEJA RECOLECTORA/, C.taller],

  // Soldadura
  [/^(MIG\/TIG|TIG|TMIG)\b|ELECTRODOS|\bMMA\b|PARA SOLDAR|^ESTACION DE SOLDADO/, C.soldadoras],

  // Jardín
  [/^(DESMALEZADORA|PODADORA|SOPLADOR|HOYADORA|ESPARCIDOR|ESQUILADORA)\b/, C.jardin],

  // Hogar y calefacción
  [/^(SILLA|SOMBRILLA|MATE|TERMO|CAJA FUERTE|ESCALERA|MAQUINA DE COSER)\b/, C.hogar],
  [/^ESTUFA\b/, C.calefaccion],

  // Eléctricas de mano (antes que neumáticas: "pistola de impacto a batería")
  [/^PISTOLA DE CALOR|^PISTOLA DE IMPACTO A BATERIA|^CEPILLO \d+ MM - \d+ W|^AFILADOR ELECTRICO|^LUSTRA PULIDORA/, C.electricas],
  // Potencia en watts o "eléctrica 220v": es una máquina, no una herramienta de mano.
  [/\b\d{3,4} ?W\b|ELECTRICA.*220 ?V/, C.electricas],
  [
    /^(AMOLADORA|LIJADORA|LUSTRALIJADORA|ATORNILLADOR|ROTOMARTILLO|PULIDORA|MULTICORTADORA|ENGALLETADORA|FRESADORA|TERMOFUSORA)\b/,
    C.electricas,
  ],

  // Herramientas manuales: el grueso del catálogo de Bremen, Hamilton y Eurotech.
  [
    /^(TUBOS?|LLAVES?|JUEGOS?|PUNTAS?|PINZA|EXTRACTOR|EXRACTOR|ETXRACTOR|KIT|SET|CRIQUET|TORQUIMETRO|FORMON|PROLONGADOR|SACA|SACAFILTRO|ESCUADRA|NIVEL|MANIJA|MANGO|BARRETA|PUESTA A PUNTO|ADAPTADOR(ES)?|SONDAS|COMPRESOMETRO|PALANCA|ALICATE|REGLA|VACUOMETRO|GONIOMETRO|ESPEJO|CALIBRE|SEPARADOR|IMAN|LIMA|SERRUCHO|SARGENTO|MAZA|CINCEL|DESTORNILLADOR|TIJERAS|COLOCADOR|INSTALADOR|MULTIPLICADOR|IMPULSADOR|MAGNETIZADOR|REMACHADORA?|ENGRAPADORA|GRAMPADORA|PROBADOR DE FUGAS|MOVIMIENTO UNIVERSAL|VALIJA|MALETIN COMPLETO DE HERRAMIENTAS|REMACHES|REPUESTO (DE )?PALANCA|SURTIDO|LAPIZ PESCATUERCA|COMBO IMAN|PUNTO DE MARCAR|CUBO PARA PASTILLA|CEPILLO DE ACERO|ALARGUES|BASE MAGNETICA|RELOJ COMPARADOR|COMBIMETRO|ESTETOSCOPIO|MANOMETRO|MEDIDOR DE PRESION|TERMOMETRO|MULTIMETRO|VOLTIMETRO|DENSIMETRO|PICO PARA INFLAR)\b/,
    C.manuales,
  ],
  [/^CAJA DE (TUBOS|HERRAMIENTAS)|^(BANDEJA|PLATO).*IMANTADA|^BANDEJA PARA PIEZAS MAGNETICAS/, C.manuales],
  [/^PRENSA (RESORTE|ESPIRALES|AROS|VALVULAS|CALIPER)/, C.manuales],
]

// Excepciones que matchearían una regla genérica pero no corresponden.
const SKIP = [/^KIT DE RODILLOS/]

const normalize = (text: string) =>
  text
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()

const suggest = (name: string): string | null => {
  const n = normalize(name)
  if (SKIP.some(re => re.test(n))) return null
  return RULES.find(([re]) => re.test(n))?.[1] ?? null
}

const csvCell = (value: string) => `"${value.replace(/"/g, '""')}"`

// Parser mínimo para el CSV que genera este mismo script (celdas entre comillas).
const parseCsv = (content: string) =>
  content
    .split(/\r?\n/)
    .slice(1)
    .filter(Boolean)
    .map(line => (line.match(/("([^"]|"")*"|[^,]*)(,|$)/g) ?? []).map(cell => cell.replace(/,$/, '').replace(/^"|"$/g, '').replace(/""/g, '"')))

async function main() {
  const prismadb = new PrismaClient()
  const [flag, file] = process.argv.slice(2)

  try {
    const categories = await prismadb.category.findMany({ where: { storeId: STORE_ID } })
    const byName = new Map(categories.map(category => [category.name, category]))

    for (const name of [SOURCE_CATEGORY, ...Object.values(C)]) {
      if (!byName.has(name)) throw new Error(`No existe la categoría "${name}" en la tienda`)
    }

    if (flag === '--restore') {
      const backup: Array<{ id: string; categoryId: string }> = JSON.parse(fs.readFileSync(file, 'utf8'))
      for (const item of backup) {
        await prismadb.product.update({ where: { id: item.id }, data: { categoryId: item.categoryId } })
      }
      console.log(`Restaurados ${backup.length} productos a su categoría original.`)
      return
    }

    if (flag === '--apply') {
      if (!file) throw new Error('Falta la ruta del CSV')
      const rows = parseCsv(fs.readFileSync(file, 'utf8'))
        .map(([id, , , , suggested]) => ({ id, suggested }))
        .filter(row => row.id && row.suggested)

      for (const row of rows) {
        if (!byName.has(row.suggested)) throw new Error(`Categoría desconocida en el CSV: "${row.suggested}"`)
      }

      const current = await prismadb.product.findMany({
        where: { storeId: STORE_ID, id: { in: rows.map(row => row.id) } },
        select: { id: true, categoryId: true },
      })

      fs.mkdirSync(OUT_DIR, { recursive: true })
      const backupPath = path.join(OUT_DIR, `backup-categorias-${new Date().toISOString().replace(/[:.]/g, '-')}.json`)
      fs.writeFileSync(backupPath, JSON.stringify(current, null, 2))
      console.log(`Backup: ${backupPath}`)

      // Un updateMany por categoría destino en vez de un update por producto.
      const groups = new Map<string, string[]>()
      for (const row of rows) groups.set(row.suggested, [...(groups.get(row.suggested) ?? []), row.id])

      for (const [name, ids] of Array.from(groups)) {
        const { count } = await prismadb.product.updateMany({
          where: { storeId: STORE_ID, id: { in: ids } },
          data: { categoryId: byName.get(name)!.id },
        })
        console.log(`  ${String(count).padStart(4)}  -> ${name}`)
      }
      return
    }

    // Modo por defecto: solo lectura.
    const products = await prismadb.product.findMany({
      where: { storeId: STORE_ID, categoryId: byName.get(SOURCE_CATEGORY)!.id },
      include: { brand: true },
      orderBy: { name: 'asc' },
    })

    const rows = products.map(product => ({ product, suggested: suggest(product.name) }))
    const matched = rows.filter(row => row.suggested)

    // Primero las sugeridas agrupadas por categoría, al final las que quedan para revisar a mano.
    rows.sort((a, b) => (a.suggested ?? '~').localeCompare(b.suggested ?? '~') || a.product.name.localeCompare(b.product.name))

    const lines = [
      ['id', 'nombre', 'marca', 'SKU', 'sugerida'].join(','),
      ...rows.map(({ product, suggested }) =>
        [product.id, product.name, product.brand.name, product.SKU, suggested ?? ''].map(csvCell).join(',')
      ),
    ]

    fs.mkdirSync(OUT_DIR, { recursive: true })
    const outPath = path.join(OUT_DIR, 'categorias-propuesta.csv')
    fs.writeFileSync(outPath, lines.join('\n'))

    const counts = new Map<string, number>()
    for (const row of matched) counts.set(row.suggested!, (counts.get(row.suggested!) ?? 0) + 1)

    console.log(`Productos en ${SOURCE_CATEGORY}: ${products.length}`)
    console.log(`Con sugerencia: ${matched.length}  |  Para revisar a mano: ${products.length - matched.length}\n`)
    for (const [name, count] of Array.from(counts).sort((a, b) => b[1] - a[1])) {
      console.log(`  ${String(count).padStart(4)}  ${name}`)
    }
    console.log(`\nPropuesta: ${outPath}`)
  } finally {
    await prismadb.$disconnect()
  }
}

main().catch(error => {
  console.error('\nError:', error.message)
  process.exit(1)
})
