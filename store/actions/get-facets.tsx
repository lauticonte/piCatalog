import { Brand, Category } from '@/types'
import qs from 'query-string'

// Permite apuntar al admin local en desarrollo. Sin la variable usa producción.
const BASE = process.env.ADMIN_API_URL || 'https://admin.mhgarage.ar/api/65ec0a796702c9c0e4c0895f'

export interface Facets {
  total: number
  categories: Category[]
  brands: Brand[]
}

// Total y cantidades por categoría y marca para la búsqueda y los filtros actuales.
export const getFacets = async (query: { q?: string; categoryId?: string; brandId?: string }): Promise<Facets> => {
  const res = await fetch(qs.stringifyUrl({ url: `${BASE}/facets`, query }, { skipEmptyString: true, skipNull: true }), {
    next: { revalidate: 60 },
  })

  if (!res.ok) {
    return { total: 0, categories: [], brands: [] }
  }

  return res.json()
}
