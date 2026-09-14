import { Brand } from '@/types'

// Permite apuntar al admin local en desarrollo. Sin la variable usa producción.
const BASE = process.env.ADMIN_API_URL || 'https://admin.mhgarage.ar/api/65ec0a796702c9c0e4c0895f'

const URL = `${BASE}/brands`

// Con categoryId, la API devuelve solo las que tienen productos ahí y cuántos.
export const getBrands = async (query: { categoryId?: string } = {}): Promise<Brand[]> => {
  const res = await fetch(query.categoryId ? `${URL}?categoryId=${query.categoryId}` : URL, {
    next: {
      revalidate: 300,
    },
  })
  return res.json()
}
