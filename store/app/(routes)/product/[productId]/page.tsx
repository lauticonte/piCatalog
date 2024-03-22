import { getProduct } from '@/actions/get-product'
import { getProducts } from '@/actions/get-products'
import Gallery from '@/components/gallery'
import ProductInfo from '@/components/gallery/product-info'
import ProductList from '@/components/product/product-list'
import Container from '@/components/ui/container'
import { Metadata, ResolvingMetadata } from 'next'
import React from 'react'

interface IProductPage {
  params: {
    productId: string
  }
}

const DOMAIN_URL = 'http://localhost:3000/'

export async function generateMetadata({ params }: IProductPage): Promise<Metadata> {
  const product = await getProduct(params.productId)
  return {
    title: product.name,
    openGraph: {
      images: product.images[0].url,
      type: 'website',
      url: `http://localhost:3001/${product.id}`,
      locale: 'en',
      title: `${product.name} | AllUNeed Ecommece`,
      description: 'This is the Ecommerce named ALLUNEED',
      siteName: 'AllUNeed',
      countryName: 'Myanmar',
      alternateLocale: 'eng',
    },
    twitter: {
      title: `${product.name} | AllUNeed Ecommece`,
      description: 'This is the Ecommerce named ALLUNEED',
      card: 'summary_large_image',
      site: '@thutasann3',
      images: product.images[0].url,
    },
  }
}

async function ProductPage({ params }: IProductPage) {
  const product = await getProduct(params.productId)

  const suggestedProducts = await getProducts({
    categoryId: product?.category.id,
  })

  return (
    <div className='bg-white'>
      <Container>
        <div className='px-4 py-10 sm:px-6 lg:px-8'>
          <div className='lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8'>
            <Gallery images={product.images} />
            <div className='mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0'>
              <ProductInfo data={product} />
            </div>
          </div>
          <hr className='my-10' />
          <ProductList title='Related Items' items={suggestedProducts} />
        </div>
      </Container>
    </div>
  );
}

export default ProductPage
