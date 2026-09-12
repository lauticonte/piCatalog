import Image from 'next/image'

interface IBlurImage {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
  fill?: boolean
  priority?: boolean
  quality?: number
  laoding?: 'lazy' | 'eager'
  fetchPriority?: 'auto' | 'high' | 'low'
  sizes?: string
  isExternal?: boolean
}

/**
 * Miniatura borrosa para el placeholder, derivada de la propia URL.
 *
 * Antes esto se resolvía con plaiceholder: había que descargar la imagen completa
 * en el server y procesarla con sharp en cada render (~500ms por imagen, casi todo
 * descarga). Cloudinary puede generar la versión borrosa por URL, así que el
 * placeholder sale gratis y el componente deja de ser async.
 */
const cloudinaryBlurUrl = (src: string) => {
  if (!src?.includes('/res.cloudinary.com/') || !src.includes('/upload/')) {
    return undefined
  }

  return src.replace('/upload/', '/upload/e_blur:1000,q_1,w_50/')
}

function BlurImage({
  src,
  alt,
  fill,
  className,
  width,
  height,
  priority,
  laoding,
  quality,
  fetchPriority,
  sizes,
  isExternal,
  ...props
}: IBlurImage) {
  const blurDataURL = cloudinaryBlurUrl(src)

  return (
    <Image
      {...props}
      src={src}
      width={width}
      height={height}
      // Sin miniatura (imágenes que no son de Cloudinary) se omite el blur en vez de fallar.
      placeholder={blurDataURL ? 'blur' : 'empty'}
      blurDataURL={blurDataURL}
      loading={laoding}
      className={className}
      alt={alt}
      fill={fill}
      priority={priority}
      quality={quality}
      fetchPriority={fetchPriority}
      sizes={sizes}
    />
  )
}

export default BlurImage
