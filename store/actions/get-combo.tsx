import { Combo } from '@/types'

// Los actions corren solo en el server, así que alcanza una var sin NEXT_PUBLIC_.
// Por defecto apunta a producción: en local se sobreescribe con ADMIN_API_URL.
const BASE = process.env.ADMIN_API_URL || 'https://admin.mhgarage.ar/api/65ec0a796702c9c0e4c0895f'

const URL = `${BASE}/combos`

export const getCombo = async (id: string): Promise<Combo> => {
  const res = await fetch(`${URL}/${id}`, {
    next: {
      revalidate: 60,
    },
  })
  return res.json()
}
