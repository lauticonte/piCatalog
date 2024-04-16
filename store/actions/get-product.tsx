import { Product } from '@/types'

const URL = `https://admin.mhgarage.ar/api/65ec0a796702c9c0e4c0895f/products`

export const getProduct = async (id: string): Promise<Product> => {
  const res = await fetch(`${URL}/${id}`, {
    next: {
      revalidate: 10,
    },
  })
  return res.json()
}
