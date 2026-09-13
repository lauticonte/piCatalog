import { getProduct } from '@/actions/get-product'
import { getProducts } from '@/actions/get-products'
import Gallery from '@/components/gallery'
import ProductInfo from '@/components/gallery/product-info'
import ProductList from '@/components/product/product-list'
import Container from '@/components/ui/container'
import { Metadata, ResolvingMetadata } from 'next'
import React, { Suspense } from 'react'
import { Loader } from '@/components/ui/loader'

interface IProductPage {
  params: {
    productId: string
  }
}

const DOMAIN_URL = 'https://mhgarage.ar'  // Actualiza tu dominio

export async function generateMetadata({ params }: IProductPage): Promise<Metadata> {
  const product = await getProduct(params.productId)

  return {
    title: product.name,
    description: product.desc, // Descripción del producto
    openGraph: {
      title: product.name,
      description: product.desc,
      url: `${DOMAIN_URL}/producto/${params.productId}`,
      images: [
        {
          url: `${product.images[0]?.url}`, // URL de la primera imagen del producto
          width: 800,
          height: 600,
          alt: product.name,
        },
      ],
    },
  }
}

// Los relacionados dependen de la categoría del producto, así que no se pueden pedir
// en paralelo. Se aíslan en su propio componente para que Suspense los transmita aparte:
// el producto se pinta apenas está listo, sin esperar esta segunda llamada.
async function RelatedProducts({ categoryId }: { categoryId: string }) {
  const suggestedProducts = await getProducts({ categoryId })

  return <ProductList title='Artículos relacionados' items={suggestedProducts} />
}

async function ProductPage({ params }: IProductPage) {
  const product = await getProduct(params.productId)

  return (
    <div className='flex flex-1 flex-col bg-custom'>
      <Container>
        <div className='px-4 py-10 sm:px-6 lg:px-8'>
          <div className='lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8'>
            <Gallery images={product.images} />
            <div className='mt-10 px-2 sm:mt-16 sm:px-0 mb-20'>
              <ProductInfo data={product} />
            </div>
          </div>

          <Suspense
            fallback={
              <div className='flex w-full items-center justify-center py-10'>
                <Loader />
              </div>
            }
          >
            {/* @ts-ignore */}
            <RelatedProducts categoryId={product?.category.id} />
          </Suspense>
        </div>
      </Container>
    </div>
  );
}

export default ProductPage
