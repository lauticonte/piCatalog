/**
 * Motor común de los scripts que reubican productos de categoría según su nombre.
 * Cada script define la categoría de origen y las reglas; esto resuelve el resto:
 *
 *   (sin flags)           solo lectura: genera scripts/out/<outName>-propuesta.csv
 *   --apply <csv>         aplica las filas del CSV (editable) con backup previo
 *   --restore <backup>    vuelve cada producto a la categoría del backup
 *
 * La base es la de DATABASE_URL. Se imprime su nombre antes de hacer nada: admin/.env
 * apunta a la copia de desarrollo y producción está en .env.prod-backup.
 */
import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

export type Rule = [RegExp, string]

interface Options {
  storeId: string
  /** Categoría de la que se sacan productos. */
  source: string
  rules: Rule[]
  /** Nombres que matchearían una regla pero se dejan en la categoría de origen. */
  skip?: RegExp[]
  /** Si una categoría destino no existe, se crea al aplicar (en vez de abortar). */
  createMissing?: boolean
  /** Prefijo de los archivos generados. */
  outName: string
}

const OUT_DIR = path.join(__dirname, '..', 'out')

export const normalize = (text: string) =>
  text
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()

const csvCell = (value: string) => `"${value.replace(/"/g, '""')}"`

// Parser mínimo para el CSV que generan estos scripts (celdas entre comillas).
const parseCsv = (content: string) =>
  content
    .split(/\r?\n/)
    .slice(1)
    .filter(Boolean)
    .map(line =>
      (line.match(/("([^"]|"")*"|[^,]*)(,|$)/g) ?? []).map(cell => cell.replace(/,$/, '').replace(/^"|"$/g, '').replace(/""/g, '"'))
    )

const timestamp = () => new Date().toISOString().replace(/[:.]/g, '-')

const databaseName = () => {
  const url = (process.env.DATABASE_URL ?? '').split('?')[0]
  return url.slice(url.lastIndexOf('/') + 1) || '(sin DATABASE_URL)'
}

export async function runRecategorize({ storeId, source, rules, skip = [], createMissing = false, outName }: Options) {
  const prismadb = new PrismaClient()
  const [flag, file] = process.argv.slice(2)
  const targets = Array.from(new Set(rules.map(([, name]) => name)))

  const suggest = (name: string) => {
    const n = normalize(name)
    if (skip.some(re => re.test(n))) return null
    return rules.find(([re]) => re.test(n))?.[1] ?? null
  }

  console.log(`Base: ${databaseName()}\n`)
  fs.mkdirSync(OUT_DIR, { recursive: true })

  try {
    const categories = await prismadb.category.findMany({ where: { storeId } })
    const byName = new Map(categories.map(category => [category.name, category]))

    if (!byName.has(source)) throw new Error(`No existe la categoría de origen "${source}"`)
    const missing = targets.filter(name => !byName.has(name))
    if (missing.length && !createMissing) throw new Error(`No existen las categorías: ${missing.join(', ')}`)

    if (flag === '--restore') {
      if (!file) throw new Error('Falta la ruta del backup')
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
        if (!byName.has(row.suggested) && !targets.includes(row.suggested)) {
          throw new Error(`Categoría desconocida en el CSV: "${row.suggested}"`)
        }
      }

      // Backup completo de la tienda (no solo de las filas a mover): permite volver
      // atrás aunque después se edite algo a mano.
      const all = await prismadb.product.findMany({ where: { storeId }, select: { id: true, name: true, categoryId: true } })
      const fullPath = path.join(OUT_DIR, `${outName}-backup-completo-${timestamp()}.json`)
      fs.writeFileSync(fullPath, JSON.stringify(all, null, 2))

      const moved = new Set(rows.map(row => row.id))
      const backupPath = path.join(OUT_DIR, `${outName}-backup-${timestamp()}.json`)
      fs.writeFileSync(backupPath, JSON.stringify(all.filter(product => moved.has(product.id)), null, 2))
      console.log(`Backup completo (${all.length}): ${fullPath}`)
      console.log(`Backup de lo que se mueve (${moved.size}): ${backupPath}\n`)

      for (const name of missing) {
        const created = await prismadb.category.create({ data: { storeId, name } })
        byName.set(name, created)
        console.log(`  + categoría creada: ${name}`)
      }

      // Un updateMany por categoría destino en vez de un update por producto.
      const groups = new Map<string, string[]>()
      for (const row of rows) groups.set(row.suggested, [...(groups.get(row.suggested) ?? []), row.id])

      for (const [name, ids] of Array.from(groups)) {
        const { count } = await prismadb.product.updateMany({
          where: { storeId, id: { in: ids } },
          data: { categoryId: byName.get(name)!.id },
        })
        console.log(`  ${String(count).padStart(4)}  -> ${name}`)
      }
      console.log(`\nPara deshacer: --restore ${backupPath}`)
      return
    }

    // Modo por defecto: solo lectura.
    const products = await prismadb.product.findMany({
      where: { storeId, categoryId: byName.get(source)!.id },
      include: { brand: true },
      orderBy: { name: 'asc' },
    })

    const rows = products.map(product => ({ product, suggested: suggest(product.name) }))
    const matched = rows.filter(row => row.suggested)

    // Primero las sugeridas agrupadas por categoría; al final las que se quedan en el origen.
    rows.sort((a, b) => (a.suggested ?? '~').localeCompare(b.suggested ?? '~') || a.product.name.localeCompare(b.product.name))

    const lines = [
      ['id', 'nombre', 'marca', 'SKU', 'sugerida'].join(','),
      ...rows.map(({ product, suggested }) =>
        [product.id, product.name, product.brand.name, product.SKU, suggested ?? ''].map(csvCell).join(',')
      ),
    ]
    const outPath = path.join(OUT_DIR, `${outName}-propuesta.csv`)
    fs.writeFileSync(outPath, lines.join('\n'))

    const counts = new Map<string, number>()
    for (const row of matched) counts.set(row.suggested!, (counts.get(row.suggested!) ?? 0) + 1)

    console.log(`Productos en ${source}: ${products.length}`)
    console.log(`A mover: ${matched.length}  |  Se quedan: ${products.length - matched.length}\n`)
    for (const [name, count] of Array.from(counts).sort((a, b) => b[1] - a[1])) {
      console.log(`  ${String(count).padStart(4)}  ${name}${missing.includes(name) ? '  (nueva)' : ''}`)
    }
    console.log(`\nPropuesta: ${outPath}`)
  } finally {
    await prismadb.$disconnect()
  }
}

export function main(options: Options) {
  runRecategorize(options).catch(error => {
    console.error('\nError:', error.message)
    process.exit(1)
  })
}
