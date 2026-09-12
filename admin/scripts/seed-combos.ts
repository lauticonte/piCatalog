/**
 * Carga los combos iniciales (uno por rubro) para una tienda. Es idempotente: busca
 * por nombre y solo crea los que faltan, así se puede correr de nuevo sin duplicar.
 *
 * Uso:
 *   STORE_ID=<id de la tienda> npx tsx scripts/seed-combos.ts
 */
import { PrismaClient } from '@prisma/client'

const COMBOS = [
  'Taller Mecánico',
  'Taller Inyección',
  'Carpintería',
  'Herrería',
  'Puestos de Trabajo',
  'Albañilería',
  'Gomería',
]

async function main() {
  const storeId = process.env.STORE_ID

  if (!storeId) {
    throw new Error('Falta STORE_ID')
  }

  const prismadb = new PrismaClient()

  try {
    const store = await prismadb.store.findUnique({ where: { id: storeId } })

    if (!store) {
      throw new Error(`No existe la tienda ${storeId}`)
    }

    console.log(`Tienda: ${store.name}`)

    for (const name of COMBOS) {
      const existing = await prismadb.combo.findFirst({ where: { storeId, name } })

      if (existing) {
        console.log(`  = ${name} (ya existía)`)
        continue
      }

      await prismadb.combo.create({ data: { storeId, name } })
      console.log(`  + ${name}`)
    }

    console.log(`\nTotal de combos: ${await prismadb.combo.count({ where: { storeId } })}`)
  } finally {
    await prismadb.$disconnect()
  }
}

main().catch(error => {
  console.error('\nError:', error.message)
  process.exit(1)
})
