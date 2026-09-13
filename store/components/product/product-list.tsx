import { Product } from '@/types'
import React from 'react'
import NoResults from '../ui/no-result'
import ProductCard from './product-card'

interface IProductList {
  title: string
  items: Product[]
}

function ProductList({ title, items }: IProductList) {
  return (
    <div className='space-y-4'>
      {/* Barrita amarilla: repite el acento de las tarjetas y del hero, para que la
          sección no arranque con un título suelto sobre el fondo. */}
      <div className='flex items-center gap-3'>
        <span className='h-7 w-1 rounded-full bg-[#f5b301]' />
        <h2 className='text-2xl font-extrabold uppercase tracking-tight'>{title}</h2>
      </div>
      {items.length === 0 ? (
        <NoResults />
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center'>
          {items.map((item, idx) => (
            <ProductCard key={idx} data={item} />
          ))}
        </div>
      )}
    </div>
  )
}

export default ProductList
