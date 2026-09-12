import { Combo } from '@/types'

// Los actions corren solo en el server, así que alcanza una var sin NEXT_PUBLIC_.
// Por defecto apunta a producción: en local se sobreescribe con ADMIN_API_URL.
const BASE = process.env.ADMIN_API_URL || 'https://admin.mhgarage.ar/api/65ec0a796702c9c0e4c0895f'

const URL = `${BASE}/combos`

export const getCombos = async (): Promise<Combo[]> => {
  const res = await fetch(URL, {
    next: {
      revalidate: 60,
    },
  })

  if (!res.ok) {
    throw new Error('Failed to fetch combos')
  }

  return res.json()
}
