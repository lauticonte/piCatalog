import { getCategory } from '@/actions/get-category'
import { getColors } from '@/actions/get-colors'
import { getProducts } from '@/actions/get-products'
import { getBrands } from '@/actions/get-brands'
import ProductCard from '@/components/product/product-card'
import Billboard from '@/components/ui/billboard'
import Container from '@/components/ui/container'
import NoResults from '@/components/ui/no-result'
import React from 'react'
import ClearFilter from './components/clear-filter'
import Filter from './components/filter'
import MobileFilters from './components/mobile-filters'

interface ICategoryPage {
  params: {
    categoryId: string
  }
  searchParams: {
    brandId: string
  }
}

async function CategoryPage({ params, searchParams }: ICategoryPage) {
  const products = await getProducts({
    categoryId: params.categoryId,
    brandId: searchParams.brandId,
  })
  const brands = await getBrands()
  const colors = await getColors()
  const category = await getCategory(params.categoryId)

  return (
    <div className='bg-white'>
      <Container>
        <Billboard data={category.billboard} />
        <div className='px-4 sm:px-6 lg:px-8 pb-24'>
          <div className='lg:grid lg:grid-cols-5 lg:gap-x-8'>
            <MobileFilters brands={brands} />
            <div className='hidden lg:block'>
              <ClearFilter />
              <Filter valueKey='brandId' name='Marcas' data={brands} />
            </div>
            <div className='mt-6 lg:col-span-4 lg:mt-0'>
              {products.length === 0 && <NoResults />}

              <div className='grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 gap-4'>
                {products.map(item => (
                  <ProductCard key={item.id} data={item} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}

export default CategoryPage
