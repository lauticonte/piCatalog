import { Brand } from '@/types'

const URL = `http://localhost:3001/api/65ec0a796702c9c0e4c0895f/brands`

export const getBrands = async (): Promise<Brand[]> => {
  const res = await fetch(URL, {
    next: {
      revalidate: 3,
    },
  })
  return res.json()
}
