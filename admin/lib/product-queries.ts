import prismadb from '@/lib/prismadb'

/**
 * Lecturas de productos resueltas con una sola consulta a Mongo.
 *
 * Prisma traduce cada `include` a una consulta separada y las ejecuta en secuencia,
 * así que traer producto + imágenes + categoría + marca + color cuesta cinco viajes
 * a la base. Medido sobre el catálogo real: 166ms contra los 34ms que cuesta traer
 * el producto solo.
 *
 * Con un `$lookup` la base resuelve las relaciones de su lado y el costo baja a esos
 * mismos 34ms: las relaciones pasan a ser gratis. Por eso estas dos lecturas —las dos
 * calientes, las que consume la tienda— usan `aggregateRaw`. El resto del ABM sigue
 * con Prisma normal, donde la legibilidad vale más que los milisegundos.
 */

// Las relaciones que la tienda espera embebidas en cada producto.
const LOOKUPS = [
  { $lookup: { from: 'Image', localField: '_id', foreignField: 'productId', as: 'images' } },
  { $lookup: { from: 'Category', localField: 'categoryId', foreignField: '_id', as: 'category' } },
  { $lookup: { from: 'Brand', localField: 'brandId', foreignField: '_id', as: 'brand' } },
  { $lookup: { from: 'Color', localField: 'colorId', foreignField: '_id', as: 'color' } },
  // $lookup siempre devuelve array; estas tres son relaciones a uno.
  {
    $addFields: {
      category: { $first: '$category' },
      brand: { $first: '$brand' },
      color: { $first: '$color' },
    },
  },
]

/**
 * `aggregateRaw` devuelve BSON extendido: los ids llegan como `{ $oid }`, las fechas
 * como `{ $date }` y los números como `{ $numberDouble }`. Esto lo deja con la misma
 * forma que devolvía Prisma, para que la tienda no note el cambio.
 */
const normalize = (value: any): any => {
  if (Array.isArray(value)) {
    return value.map(normalize)
  }

  if (value === null || typeof value !== 'object') {
    return value
  }

  if ('$oid' in value) {
    return value.$oid
  }

  if ('$date' in value) {
    const raw = value.$date
    return new Date(typeof raw === 'object' && raw !== null ? Number(raw.$numberLong) : raw)
  }

  if ('$numberDouble' in value) return Number(value.$numberDouble)
  if ('$numberInt' in value) return Number(value.$numberInt)
  if ('$numberLong' in value) return Number(value.$numberLong)

  const out: Record<string, any> = {}
  for (const [key, item] of Object.entries(value)) {
    // Prisma expone el _id de Mongo como `id`.
    out[key === '_id' ? 'id' : key] = normalize(item)
  }
  return out
}

export interface ProductFilters {
  storeId: string
  categoryId?: string
  colorId?: string
  brandId?: string
  isFeatured?: boolean
  /** Texto libre: busca en el nombre y en el SKU. */
  q?: string
  skip?: number
  take?: number
}

// Escapa los caracteres que Mongo interpretaría como expresión regular, para que
// buscar "1/2" o "(2,00" no rompa la consulta.
const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export const findProductById = async (productId: string) => {
  const [product] = normalize(
    await prismadb.product.aggregateRaw({
      pipeline: [{ $match: { _id: { $oid: productId } } }, ...LOOKUPS],
    })
  )

  return product ?? null
}

// Cada palabra se busca por separado y tolera tildes: "tubo 1/2 22" encuentra
// "TUBO 1/2 22 MM HEXAGONAL" aunque las palabras no estén seguidas, e "hidraulica"
// encuentra "HIDRÁULICA".
const ACCENTS: Record<string, string> = { a: '[aáàä]', e: '[eéèë]', i: '[iíìï]', o: '[oóòö]', u: '[uúùü]', n: '[nñ]' }
const tokenRegex = (token: string) =>
  escapeRegex(token)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[aeioun]/g, char => ACCENTS[char])

const tokensOf = (q?: string) => (q ?? '').trim().split(/\s+/).filter(Boolean).slice(0, 8)

// La marca no forma parte del nombre del producto: "torx bremen" no encontraba nada.
// Se resuelve antes qué marcas coinciden con cada palabra y se busca también por su id.
const brandIdsByToken = async (storeId: string, q?: string) => {
  const tokens = tokensOf(q)
  if (tokens.length === 0) return new Map<string, string[]>()

  const brands = await prismadb.brand.findMany({ where: { storeId }, select: { id: true, name: true } })
  return new Map(
    tokens.map(token => {
      const regex = new RegExp(tokenRegex(token), 'i')
      return [token, brands.filter(brand => regex.test(brand.name)).map(brand => brand.id)]
    })
  )
}

const textMatch = (q: string | undefined, brandsByToken: Map<string, string[]>) => {
  const tokens = tokensOf(q)
  if (tokens.length === 0) return {}

  return {
    $and: tokens.map(token => {
      const regex = { $regex: tokenRegex(token), $options: 'i' }
      const brandIds = brandsByToken.get(token) ?? []
      return {
        $or: [
          { name: regex },
          { SKU: regex },
          ...(brandIds.length ? [{ brandId: { $in: brandIds.map(id => ({ $oid: id })) } }] : []),
        ],
      }
    }),
  }
}

// Filtro común a los listados y a los conteos. `omit` deja afuera un filtro: el conteo
// por marca se calcula sin la marca elegida, así las demás siguen apareciendo.
const buildMatch = (
  { storeId, categoryId, colorId, brandId, isFeatured, q }: ProductFilters,
  brandsByToken: Map<string, string[]>,
  omit?: 'categoryId' | 'brandId'
) => {
  const match: Record<string, any> = {
    storeId: { $oid: storeId },
    isArchived: false,
    ...textMatch(q, brandsByToken),
  }

  // Los filtros opcionales se agregan solo si vinieron, igual que el `undefined` de Prisma.
  if (categoryId && omit !== 'categoryId') match.categoryId = { $oid: categoryId }
  if (colorId) match.colorId = { $oid: colorId }
  if (brandId && omit !== 'brandId') match.brandId = { $oid: brandId }
  if (isFeatured) match.isFeatured = true

  return match
}

export const findProducts = async ({ skip = 0, take = 12, ...filters }: ProductFilters) => {
  const brandsByToken = await brandIdsByToken(filters.storeId, filters.q)

  return normalize(
    await prismadb.product.aggregateRaw({
      pipeline: [
        { $match: buildMatch(filters, brandsByToken) },
        { $sort: { createdAt: -1 } },
        ...(skip > 0 ? [{ $skip: skip }] : []),
        { $limit: take },
        ...LOOKUPS,
      ],
    })
  )
}

// Solo las claves pedidas: el resto del filtro ya se aplicó en el $match inicial.
const pick = (match: Record<string, any>, keys: string[]) =>
  Object.fromEntries(Object.entries(match).filter(([key]) => keys.includes(key)))

/**
 * Total y cantidades por categoría y por marca para una búsqueda, en una sola consulta.
 * Cada faceta ignora su propio filtro y respeta el resto: con Bremen elegido, las
 * categorías cuentan solo productos Bremen, pero las marcas siguen mostrando todas las
 * que tienen resultados para la categoría y el texto.
 */
export const findProductFacets = async (filters: Omit<ProductFilters, 'skip' | 'take'>) => {
  const brandsByToken = await brandIdsByToken(filters.storeId, filters.q)
  const countBy = (field: string) => [{ $group: { _id: `$${field}`, count: { $sum: 1 } } }]

  const [result] = normalize(
    await prismadb.product.aggregateRaw({
      pipeline: [
        // Lo que comparten las tres facetas; el resto se filtra dentro de cada una.
        { $match: buildMatch({ ...filters, categoryId: undefined, brandId: undefined }, brandsByToken) },
        {
          $facet: {
            total: [{ $match: pick(buildMatch(filters, brandsByToken), ['categoryId', 'brandId']) }, { $count: 'count' }],
            categories: [{ $match: pick(buildMatch(filters, brandsByToken, 'categoryId'), ['brandId']) }, ...countBy('categoryId')],
            brands: [{ $match: pick(buildMatch(filters, brandsByToken, 'brandId'), ['categoryId']) }, ...countBy('brandId')],
          },
        },
      ],
    })
  )

  return {
    total: (result?.total?.[0]?.count as number) ?? 0,
    categories: (result?.categories ?? []) as Array<{ id: string; count: number }>,
    brands: (result?.brands ?? []) as Array<{ id: string; count: number }>,
  }
}
