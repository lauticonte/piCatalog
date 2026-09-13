import { Brand } from '@/types'

// Permite apuntar al admin local en desarrollo. Sin la variable usa producción.
const BASE = process.env.ADMIN_API_URL || 'https://admin.mhgarage.ar/api/65ec0a796702c9c0e4c0895f'

const URL = `${BASE}/brands`

export const getBrand = async (id: string): Promise<Brand> => {
  const res = await fetch(`${URL}/${id}`, {
    next: {
      revalidate: 300,
    },
  })
  return res.json()
}
