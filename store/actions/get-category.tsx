import { Category } from '@/types'

// Permite apuntar al admin local en desarrollo. Sin la variable usa producción.
const BASE = process.env.ADMIN_API_URL || 'https://admin.mhgarage.ar/api/65ec0a796702c9c0e4c0895f'

const URL = `${BASE}/categories`

export const getCategory = async (id: string): Promise<Category> => {
  const res = await fetch(`${URL}/${id}`, {
    next: {
      revalidate: 300,
    },
  })
  return res.json()
}
