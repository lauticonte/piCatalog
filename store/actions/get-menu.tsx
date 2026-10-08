import { Brand, Category } from '@/types'
import { getFacets } from './get-facets'

// Permite apuntar al admin local en desarrollo. Sin la variable usa producción.
const BASE = process.env.ADMIN_API_URL || 'https://admin.mhgarage.ar/api/65ec0a796702c9c0e4c0895f'

export interface MenuCategory extends Category {
  productsCount: number
  /** Foto de un producto de la categoría, para que el menú no sea una lista de texto. */
  imageUrl?: string
}

export interface MenuData {
  total: number
  categories: MenuCategory[]
  brands: Brand[]
}

const primeraFoto = async (categoryId: string): Promise<string | undefined> => {
  try {
    const res = await fetch(`${BASE}/products?categoryId=${categoryId}&limit=1`, { next: { revalidate: 3600 } })
    if (!res.ok) return undefined
    const [product] = await res.json()
    return product?.images?.[0]?.url
  } catch {
    return undefined
  }
}

/**
 * Datos del menú del header: categorías con cantidad y una foto cada una, y marcas con
 * su cantidad. Salen de facets y no
 * de /categories para dejar afuera las que no tienen productos (un link a una lista vacía).
 * Ordenadas por cantidad, con "Otro" al final porque es el cajón de sastre.
 */
export const getMenuData = async (): Promise<MenuData> => {
  const { total, categories, brands } = await getFacets({})
  const conProductos = categories.filter(category => (category.productsCount ?? 0) > 0)
  const fotos = await Promise.all(conProductos.map(category => primeraFoto(category.id)))

  const menu = conProductos.map((category, i) => ({
    ...category,
    productsCount: category.productsCount ?? 0,
    imageUrl: fotos[i],
  }))

  menu.sort((a, b) => {
    if (a.name.toUpperCase() === 'OTRO') return 1
    if (b.name.toUpperCase() === 'OTRO') return -1
    return b.productsCount - a.productsCount
  })

  return {
    total,
    categories: menu,
    brands: [...brands].sort((a, b) => (b.productsCount ?? 0) - (a.productsCount ?? 0)),
  }
}
