import { Product } from '@/types'
import qs from 'query-string'

const URL = `https://admin.mhgarage.ar/api/65ec0a796702c9c0e4c0895f/products`

interface Query {
  categoryId?: string
  colorId?: string
  brandId?: string
  isFeatured?: boolean
  page?: number
  limit?: number
}

export const getProducts = async (query: Query): Promise<Product[]> => {
  const url = qs.stringifyUrl({
    url: URL,
    query: {
      colorId: query.colorId,
      brandId: query.brandId,
      categoryId: query.categoryId,
      isFeatured: query.isFeatured,
      page: query.page,
      limit: query.limit,
    },
  })

  const res = await fetch(url, {
    next: {
      revalidate: 10,
    },
  })

  if (!res.ok) {
    throw new Error('Failed to fetch products')
  }

  return res.json()
}
