import { Category } from '@/types'

const URL = `https://admin.mhgarage.ar/api/65ec0a796702c9c0e4c0895f/categories`

export const getCategories = async (): Promise<Category[]> => {
  const res = await fetch(URL, {
    next: {
      revalidate: 3,
    },
  })
  return res.json()
}
