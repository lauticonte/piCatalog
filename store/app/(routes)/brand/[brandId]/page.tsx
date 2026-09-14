import { getProducts } from '@/actions/get-products'
import { getCategories } from '@/actions/get-categories'
import { getBrand } from '@/actions/get-brand'
import ProductCard from '@/components/product/product-card'
import Billboard from '@/components/ui/billboard'
import Container from '@/components/ui/container'
import NoResults from '@/components/ui/no-result'
import FacetFilter from '@/components/filters/facet-filter'
import ResultsBar from '@/components/filters/results-bar'
import LoadMore from '@/components/filters/load-more'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const PAGE_SIZE = 12

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
  const limit = Number(searchParams.limit) || PAGE_SIZE

  // Independientes entre sí: en paralelo.
  const [products, categories, brand] = await Promise.all([
    getProducts({ categoryId, brandId, limit }),
    // Solo las categorías donde esta marca tiene productos.
    getCategories({ brandId }),
    getBrand(brandId),
  ])

  const total = categories.reduce((sum, category) => sum + (category.productsCount ?? 0), 0)
  const activeCategory = categories.find(category => category.id === categoryId)
  const count = activeCategory?.productsCount ?? total

  return (
    <div className='bg-custom'>
      <Container>
        <Billboard data={brand.billboard} />
        <div className='px-4 pb-16 pt-6 sm:px-6 lg:px-8 lg:pt-8'>
          <header className='mb-6'>
            <nav aria-label='Ruta' className='text-[11px] font-semibold uppercase tracking-wider text-slate-500'>
              <Link href='/' className='hover:text-white'>
                Inicio
              </Link>
              <span className='mx-1.5'>/</span>
              <Link href='/brands' className='hover:text-white'>
                Marcas
              </Link>
            </nav>
            <div className='mt-2 flex items-center gap-3'>
              {brand?.imageUrl ? (
                <span className='relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-white'>
                  <Image src={brand.imageUrl} alt='' fill sizes='44px' className='object-contain p-1.5' />
                </span>
              ) : (
                <span className='h-8 w-1 rounded-full bg-[#f5b301]' />
              )}
              <h1 className='text-2xl font-extrabold uppercase leading-tight tracking-tight text-white sm:text-3xl'>
                {brand?.name}
              </h1>
            </div>
          </header>

          <div className='lg:grid lg:grid-cols-[260px_1fr] lg:items-start lg:gap-x-8'>
            <aside className='mb-5 lg:sticky lg:top-[120px] lg:mb-0'>
              <FacetFilter valueKey='categoryId' title='Categorías' options={categories} />
            </aside>

            <section>
              <ResultsBar count={count} activeLabel={activeCategory?.name} clearHref={`/brand/${brandId}`} />
              {products.length === 0 && <NoResults />}

              <div className='grid grid-cols-1 justify-items-center gap-4 sm:grid-cols-2 lg:grid-cols-3'>
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

export default BrandPage
