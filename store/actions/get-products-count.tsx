const COUNT_URL = `https://admin.mhgarage.ar/api/65ec0a796702c9c0e4c0895f/products/count`

export const getProductsCount = async (): Promise<number> => {
  const res = await fetch(COUNT_URL)
  
  if (!res.ok) {
    throw new Error('Failed to fetch product count')
  }
  
  const data = await res.json()
  return data.count
}
