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
  }
}

async function ProductPage({ params }: IProductPage) {
  const product = await getProduct(params.productId)

  const suggestedProducts = await getProducts({
    categoryId: product?.category.id,
  })

  return (
    <div className='bg-gray-800'>
      <Container>
        <div className='px-4 py-10 sm:px-6 lg:px-8'>
          <div className='lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8'>
            <Gallery images={product.images} />
            <div className='mt-10 px-2 sm:mt-16 sm:px-0 mb-20'>
              
              <ProductInfo data={product} />
            </div>
          </div>
          <div className="relative flex py-5 items-center mt-16">
    <div className="flex-grow border-t border-gray-400 mt-16"></div>
    <span className="flex-shrink mx-4 text-gray-400 mt-16">Artículos Relacionados</span>
    <div className="flex-grow border-t border-gray-400 mt-16"></div>
</div>
          <ProductList title='' items={suggestedProducts} />
        </div>
      </Container>
    </div>
  );
}

export default ProductPage
