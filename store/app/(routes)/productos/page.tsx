import { getProducts } from '@/actions/get-products'
import { getFacets } from '@/actions/get-facets'
import ProductCard from '@/components/product/product-card'
import Container from '@/components/ui/container'
import FacetFilter from '@/components/filters/facet-filter'
import MobileFilters from '@/components/filters/mobile-filters'
import ResultsBar, { ActiveFilter } from '@/components/filters/results-bar'
import LoadMore from '@/components/filters/load-more'
import Link from 'next/link'
import qs from 'query-string'
import React from 'react'
import { BsSearch } from 'react-icons/bs'

const PAGE_SIZE = 12

export const metadata = {
  title: 'Productos — MH Garage',
  description: 'Catálogo completo de herramientas: buscá por nombre, código o marca y filtrá por categoría.',
}

interface ICatalogPage {
  searchParams: {
    q?: string
    categoryId?: string
    brandId?: string
    limit?: string
  }
}

async function CatalogPage({ searchParams }: ICatalogPage) {
  const q = searchParams.q?.trim() || undefined
  const { categoryId, brandId } = searchParams
  const limit = Number(searchParams.limit) || PAGE_SIZE

  // Independientes entre sí: en paralelo.
  const [products, facets] = await Promise.all([
    getProducts({ q, categoryId, brandId, limit }),
    getFacets({ q, categoryId, brandId }),
  ])

  // URL del catálogo con un filtro menos (y sin el "limit" de "Ver más").
  const without = (key: 'q' | 'categoryId' | 'brandId') =>
    qs.stringifyUrl({ url: '/productos', query: { q, categoryId, brandId, [key]: undefined } })

  const activeCategory = facets.categories.find(category => category.id === categoryId)
  const activeBrand = facets.brands.find(brand => brand.id === brandId)

  const active: ActiveFilter[] = [
    ...(q ? [{ label: `"${q}"`, clearHref: without('q') }] : []),
    ...(activeCategory ? [{ label: activeCategory.name, clearHref: without('categoryId') }] : []),
    ...(activeBrand ? [{ label: activeBrand.name, clearHref: without('brandId') }] : []),
  ]

  // Sin foto la tarjeta no tiene qué mostrar.
  const visible = products.filter(product => product.images?.length > 0)

  return (
    // Bloque y no flex-col: en flex, el mx-auto del Container anula el estiramiento y el
    // contenedor tomaba el ancho de la fila de chips (1024px en un celular).
    <div className='flex-1 bg-custom'>
      <Container>
        <div className='px-4 pb-16 pt-6 sm:px-6 lg:px-8 lg:pt-8'>
          <header className='mb-6'>
            <nav aria-label='Ruta' className='text-[11px] font-semibold uppercase tracking-wider text-slate-500'>
              <Link href='/' className='hover:text-white'>
                Inicio
              </Link>
              <span className='mx-1.5'>/</span>
              <span className='text-slate-400'>Productos</span>
            </nav>
            <div className='mt-2 flex items-center gap-3'>
              <span className='h-8 w-1 rounded-full bg-[#f5b301]' />
              <h1 className='text-2xl font-extrabold uppercase leading-tight tracking-tight text-white sm:text-3xl'>
                {q ? 'Resultados' : 'Productos'}
              </h1>
            </div>
            <p className='mt-1 text-sm text-slate-500'>Buscá por nombre, código o marca desde el buscador de arriba.</p>
          </header>

          <div className='lg:grid lg:grid-cols-[260px_1fr] lg:items-start lg:gap-x-8'>
            <aside className='mb-5 space-y-4 lg:sticky lg:top-[120px] lg:mb-0'>
              <MobileFilters
                total={facets.total}
                facets={[
                  { valueKey: 'categoryId', title: 'Categorías', options: facets.categories },
                  { valueKey: 'brandId', title: 'Marcas', options: facets.brands },
                ]}
              />
              <FacetFilter valueKey='categoryId' title='Categorías' options={facets.categories} />
              <FacetFilter valueKey='brandId' title='Marcas' options={facets.brands} />
            </aside>

            <section>
              <ResultsBar count={facets.total} active={active} clearAllHref='/productos' />

              {visible.length === 0 ? (
                <div className='flex flex-col items-center rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-14 text-center'>
                  <BsSearch className='h-7 w-7 text-slate-500' />
                  <p className='mt-4 font-bold text-white'>
                    {q ? `No encontramos productos para "${q}"` : 'No hay productos con estos filtros'}
                  </p>
                  <p className='mt-1 text-sm text-slate-400'>Probá con menos palabras, otro código o quitando algún filtro.</p>
                  <Link
                    href='/productos'
                    className='mt-5 rounded-xl border border-white/15 px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-white hover:border-[#f5b301]/60'
                  >
                    Ver todo el catálogo
                  </Link>
                </div>
              ) : (
                <div className='grid grid-cols-1 justify-items-center gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                  {visible.map(item => (
                    <ProductCard key={item.id} data={item} />
                  ))}
                </div>
              )}
              <LoadMore shown={products.length} total={facets.total} step={PAGE_SIZE} />
            </section>
          </div>
        </div>
      </Container>
    </div>
  )
}

export default CatalogPage
