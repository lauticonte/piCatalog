import { getCategory } from '@/actions/get-category'
import { getProducts } from '@/actions/get-products'
import { getBrands } from '@/actions/get-brands'
import ProductCard from '@/components/product/product-card'
import Container from '@/components/ui/container'
import NoResults from '@/components/ui/no-result'
import FacetFilter from '@/components/filters/facet-filter'
import React from 'react'
import LoadMore from './components/load-more'

interface ICategoryPage {
  params: {
    categoryId: string
  }
  searchParams: {
    brandId?: string
    limit?: number
  }
}

async function CategoryPage({ params, searchParams }: ICategoryPage) {
  const { categoryId } = params
  const { brandId } = searchParams
  const limit = Number(searchParams.limit) || 6

  // Independientes entre sí: en paralelo.
  const [products, brands, category] = await Promise.all([
    getProducts({ categoryId, brandId, limit }),
    // Solo las marcas con productos en esta categoría.
    getBrands({ categoryId }),
    getCategory(categoryId),
  ])

  const total = brands.reduce((sum, brand) => sum + (brand.productsCount ?? 0), 0)

  return (
    <div className='bg-custom'>
      <Container>
        <div className='px-4 pb-16 pt-6 sm:px-6 lg:px-8'>
          <div className='mb-5 flex items-center gap-3'>
            <span className='h-7 w-1 rounded-full bg-[#f5b301]' />
            <div>
              <h1 className='text-2xl font-extrabold uppercase tracking-tight text-white'>{category?.name}</h1>
              {total > 0 && <p className='text-xs text-slate-500'>{total} productos</p>}
            </div>
          </div>

          <div className='lg:grid lg:grid-cols-5 lg:gap-x-8'>
            <aside className='lg:sticky lg:top-40 lg:self-start'>
              <FacetFilter valueKey='brandId' title='Marcas' options={brands} />
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

export default CategoryPage
