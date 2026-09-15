import { getCategory } from '@/actions/get-category'
import { getProducts } from '@/actions/get-products'
import { getBrands } from '@/actions/get-brands'
import ProductCard from '@/components/product/product-card'
import Container from '@/components/ui/container'
import NoResults from '@/components/ui/no-result'
import FacetFilter from '@/components/filters/facet-filter'
import MobileFilters from '@/components/filters/mobile-filters'
import ResultsBar from '@/components/filters/results-bar'
import LoadMore from '@/components/filters/load-more'
import Link from 'next/link'
import React from 'react'

const PAGE_SIZE = 12

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
  const limit = Number(searchParams.limit) || PAGE_SIZE

  // Independientes entre sí: en paralelo.
  const [products, brands, category] = await Promise.all([
    getProducts({ categoryId, brandId, limit }),
    // Solo las marcas con productos en esta categoría, con su logo y cantidad.
    getBrands({ categoryId }),
    getCategory(categoryId),
  ])

  const total = brands.reduce((sum, brand) => sum + (brand.productsCount ?? 0), 0)
  const activeBrand = brands.find(brand => brand.id === brandId)
  const count = activeBrand?.productsCount ?? total

  return (
    <div className='bg-custom'>
      <Container>
        <div className='px-4 pb-16 pt-6 sm:px-6 lg:px-8 lg:pt-8'>
          <header className='mb-6'>
            <nav aria-label='Ruta' className='text-[11px] font-semibold uppercase tracking-wider text-slate-500'>
              <Link href='/' className='hover:text-white'>
                Inicio
              </Link>
              <span className='mx-1.5'>/</span>
              <span className='text-slate-400'>Categorías</span>
            </nav>
            <div className='mt-2 flex items-center gap-3'>
              <span className='h-8 w-1 rounded-full bg-[#f5b301]' />
              <h1 className='text-2xl font-extrabold uppercase leading-tight tracking-tight text-white sm:text-3xl'>
                {category?.name}
              </h1>
            </div>
          </header>

          <div className='lg:grid lg:grid-cols-[260px_1fr] lg:items-start lg:gap-x-8'>
            <aside className='mb-5 lg:sticky lg:top-[120px] lg:mb-0'>
              <MobileFilters total={count} facets={[{ valueKey: 'brandId', title: 'Marcas', options: brands }]} />
              <FacetFilter valueKey='brandId' title='Marcas' options={brands} />
            </aside>

            <section>
              <ResultsBar
                count={count}
                active={activeBrand ? [{ label: activeBrand.name, clearHref: `/category/${categoryId}` }] : []}
              />
              {products.length === 0 && <NoResults />}

              <div className='grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3'>
                {products.map(item => (
                  <ProductCard key={item.id} data={item} />
                ))}
              </div>
              <LoadMore shown={products.length} total={count} step={PAGE_SIZE} />
            </section>
          </div>
        </div>
      </Container>
    </div>
  )
}

export default CategoryPage
