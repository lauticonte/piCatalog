import { getProducts } from '@/actions/get-products'
import { getCategories } from '@/actions/get-categories'
import { getBrand } from '@/actions/get-brand'
import ProductCard from '@/components/product/product-card'
import Billboard from '@/components/ui/billboard'
import Container from '@/components/ui/container'
import NoResults from '@/components/ui/no-result'
import FacetFilter from '@/components/filters/facet-filter'
import React from 'react'
import LoadMore from './components/load-more'

interface IBrandPage {
  params: {
    brandId: string
  }
  searchParams: {
    categoryId?: string
    limit?: number
  }
}

async function BrandPage({ params, searchParams }: IBrandPage) {
  const { brandId } = params
  const { categoryId } = searchParams
  const limit = Number(searchParams.limit) || 6

  // Independientes entre sí: en paralelo.
  const [products, categories, brand] = await Promise.all([
    getProducts({ categoryId, brandId, limit }),
    // Solo las categorías donde esta marca tiene productos.
    getCategories({ brandId }),
    getBrand(brandId),
  ])

  const total = categories.reduce((sum, category) => sum + (category.productsCount ?? 0), 0)

  return (
    <div className='bg-custom'>
      <Container>
        <Billboard data={brand.billboard} />
        <div className='px-4 pb-16 pt-6 sm:px-6 lg:px-8'>
          <div className='mb-5 flex items-center gap-3'>
            <span className='h-7 w-1 rounded-full bg-[#f5b301]' />
            <div>
              <h1 className='text-2xl font-extrabold uppercase tracking-tight text-white'>{brand?.name}</h1>
              {total > 0 && <p className='text-xs text-slate-500'>{total} productos</p>}
            </div>
          </div>

          <div className='lg:grid lg:grid-cols-5 lg:gap-x-8'>
            <aside className='lg:sticky lg:top-40 lg:self-start'>
              <FacetFilter valueKey='categoryId' title='Categorías' options={categories} />
            </aside>

            <div className='mt-5 lg:col-span-4 lg:mt-0'>
              {products.length === 0 && <NoResults />}

              <div className='grid grid-cols-1 justify-items-center gap-4 sm:grid-cols-3 md:grid-cols-3'>
                {products.map(item => (
                  <ProductCard key={item.id} data={item} />
                ))}
              </div>
              {/* Si vino menos de lo pedido ya no queda nada por cargar. */}
              {products.length >= limit && <LoadMore defaultLimit={limit} />}
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}

export default BrandPage
