import type { ImageLoaderProps } from 'next/image'

/**
 * Loader de next/image que delega el redimensionado a Cloudinary.
 *
 * Con el loader por defecto cada foto pasaba por el optimizador de Vercel, que cobra una
 * "transformation" por cada combinación de imagen, ancho y calidad: la cuota del plan se
 * agotaba y las imágenes nuevas empezaban a fallar con 402. Las fotos ya están en
 * Cloudinary, que las redimensiona por URL, así que el pedido va directo ahí.
 *
 * Lo que no es de Cloudinary (logos y banners de /public) se sirve tal cual.
 */
export default function cloudinaryLoader({ src, width, quality }: ImageLoaderProps) {
  if (!src.includes('/res.cloudinary.com/') || !src.includes('/upload/')) {
    return src
  }

  // c_limit: nunca agranda una foto más chica que el ancho pedido.
  const params = ['f_auto', `q_${quality || 'auto'}`, `w_${width}`, 'c_limit'].join(',')

  return src.replace('/upload/', `/upload/${params}/`)
}
