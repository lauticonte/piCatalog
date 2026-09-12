/**
 * Clona una base Mongo del cluster a otra del MISMO cluster, para tener un entorno
 * de pruebas descartable sin tocar la productiva.
 *
 *   SOURCE_DATABASE_URL  -> se LEE únicamente (por defecto: DATABASE_URL del .env)
 *   TARGET_DATABASE_URL  -> se ESCRIBE (obligatoria, tiene que ser otra base)
 *
 * Uso:
 *   npx tsx scripts/clone-db.ts
 *   npx tsx scripts/clone-db.ts --force   (sobreescribe un target que ya tenga datos)
 */
import { PrismaClient } from '@prisma/client'

const SOURCE_URL = process.env.SOURCE_DATABASE_URL || process.env.DATABASE_URL
const TARGET_URL = process.env.TARGET_DATABASE_URL
const FORCE = process.argv.includes('--force')

// El nombre de la base es el pathname de la connection string.
const dbName = (url: string) => {
  const withoutQuery = url.split('?')[0]
  return withoutQuery.slice(withoutQuery.lastIndexOf('/') + 1)
}

async function main() {
  if (!SOURCE_URL) throw new Error('Falta SOURCE_DATABASE_URL (o DATABASE_URL)')
  if (!TARGET_URL) throw new Error('Falta TARGET_DATABASE_URL')

  const sourceDb = dbName(SOURCE_URL)
  const targetDb = dbName(TARGET_URL)

  // Red de seguridad: si los nombres coinciden estaríamos escribiendo sobre la productiva.
  if (!targetDb) throw new Error('TARGET_DATABASE_URL no tiene nombre de base en el path')
  if (sourceDb === targetDb) {
    throw new Error(`Origen y destino son la misma base ("${sourceDb}"). Abortado.`)
  }

  console.log(`Clonando  ${sourceDb}  ->  ${targetDb}`)

  const source = new PrismaClient({ datasources: { db: { url: SOURCE_URL } } })
  const target = new PrismaClient({ datasources: { db: { url: TARGET_URL } } })

  try {
    const existing = await target.store.count()
    if (existing > 0 && !FORCE) {
      throw new Error(`"${targetDb}" ya tiene ${existing} store(s). Usá --force para reemplazar su contenido.`)
    }

    if (existing > 0) {
      console.log(`Vaciando "${targetDb}"...`)
      // Orden inverso a las dependencias.
      await target.orderItem.deleteMany()
      await target.order.deleteMany()
      await target.image.deleteMany()
      await target.product.deleteMany()
      await target.color.deleteMany()
      await target.brand.deleteMany()
      await target.category.deleteMany()
      await target.billboard.deleteMany()
      await target.store.deleteMany()
    }

    // Mongo rechaza un insert_many vacío, así que las colecciones sin datos se saltean.
    const copy = async (name: string, read: () => Promise<any[]>, write: (data: any[]) => Promise<{ count: number }>) => {
      const rows = await read()
      if (rows.length === 0) {
        console.log(`  ${name.padEnd(12)} 0 (vacía)`)
        return
      }
      const { count } = await write(rows)
      console.log(`  ${name.padEnd(12)} ${count}`)
    }

    // Se respeta el orden de las foreign keys, y se conservan los ids originales
    // para que el storeId de las URLs siga siendo el mismo.
    await copy('stores', () => source.store.findMany(), data => target.store.createMany({ data }))
    await copy('billboards', () => source.billboard.findMany(), data => target.billboard.createMany({ data }))
    await copy('categories', () => source.category.findMany(), data => target.category.createMany({ data }))
    await copy('brands', () => source.brand.findMany(), data => target.brand.createMany({ data }))
    await copy('colors', () => source.color.findMany(), data => target.color.createMany({ data }))
    await copy('products', () => source.product.findMany(), data => target.product.createMany({ data }))
    await copy('images', () => source.image.findMany(), data => target.image.createMany({ data }))
    await copy('orders', () => source.order.findMany(), data => target.order.createMany({ data }))
    await copy('orderItems', () => source.orderItem.findMany(), data => target.orderItem.createMany({ data }))

    console.log('\nListo. Apuntá DATABASE_URL del .env a la base de destino.')
  } finally {
    await source.$disconnect()
    await target.$disconnect()
  }
}

main().catch(error => {
  console.error('\nError:', error.message)
  process.exit(1)
})
