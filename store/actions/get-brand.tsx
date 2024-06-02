import { Brand } from '@/types'

const URL = `http://localhost:3001/api/65ec0a796702c9c0e4c0895f/brands`

export const getBrand = async (id: string): Promise<Brand> => {
  const res = await fetch(`${URL}/${id}`, {
    next: {
      revalidate: 3,
    },
  })
  return res.json()
}
