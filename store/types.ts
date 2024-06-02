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
}

export interface Brand {
  id: string
  name: string
  value: string
  billboard: Billboard
}

export interface Color {
  id: string
  name: string
  value: string
}

export interface Beer {
  id: number
  name: string
  tagline: string
  image_url: string
}

export type PostProps = {
  userId: number
  id: number
  title: string
  body: string
}
