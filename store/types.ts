export interface Product {
  id: string
  category: Category
  name: string
  desc: string
  price: string
  isFeatured: boolean
  brand: Brand
  color: Color
  images: Image[]
  SKU: string
}

export interface Image {
  id: string
  url: string
}

export interface Billboard {
  id: string
  label: string
  imageUrl: string
}

export interface Category {
  id: string
  name: string
  /** Solo viene cuando se pide acotado a una marca. */
  productsCount?: number
}

export interface Brand {
  id: string
  name: string
  value: string
  billboard: Billboard
  imageUrl: string
  /** Solo viene cuando se pide acotado a una categoría. */
  productsCount?: number
}

export interface Combo {
  id: string
  name: string
  desc: string
  imageUrl: string
  products: Product[]
}

export interface Color {
  id: string
  name: string
  value: string
}

export type PostProps = {
  userId: number
  id: number
  title: string
  body: string
}
