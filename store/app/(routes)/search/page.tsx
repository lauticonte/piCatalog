import { getProducts } from '@/actions/get-products'
import ProductCard from '@/components/product/product-card'
import Container from '@/components/ui/container'
import NoResults from '@/components/ui/no-result'
import React from 'react'

interface ISearchPage {
  searchParams: {
    q?: string
    limit?: string
  }
}

export const metadata = {
  title: 'Buscar productos — MH Garage',
}

async function SearchPage({ searchParams }: ISearchPage) {
  const termino = searchParams.q?.trim() ?? ''
  const limit = Number(searchParams.limit) || 24

  // Sin término no se pide nada: evita traer el catálogo entero por una URL vacía.
  const products = termino ? await getProducts({ q: termino, limit }) : []

  return (
    <div className='flex flex-1 flex-col bg-custom'>
      <Container>
        <div className='px-4 pb-16 pt-8 sm:px-6 lg:px-8'>
          <div className='flex items-center gap-3'>
            <span className='h-7 w-1 rounded-full bg-[#f5b301]' />
            <h1 className='text-2xl font-extrabold uppercase tracking-tight text-white'>
              {termino ? `Resultados para "${termino}"` : 'Buscar productos'}
            </h1>
          </div>

          {termino && (
            <p className='mt-2 text-sm text-slate-400'>
              {products.length === 0
                ? 'No encontramos productos con ese término.'
                : `${products.length} producto${products.length > 1 ? 's' : ''} encontrado${products.length > 1 ? 's' : ''}`}
            </p>
          )}

          <div className='mt-8'>
            {!termino ? (
              <p className='text-sm text-slate-400'>Escribí en el buscador de arriba el nombre o el código del producto.</p>
            ) : products.length === 0 ? (
              <NoResults />
            ) : (
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 justify-items-center'>
                {products
                  .filter(product => product.images?.length > 0)
                  .map(product => (
                    <ProductCard key={product.id} data={product} />
                  ))}
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  )
}

export default SearchPage
