import { Product } from '@/types'
import Link from 'next/link'
import React from 'react'
import BlurImage from '../blur-image'
import Currency from '../ui/currency'
import ProductAction from './product-action'

interface IProductCard {
  data: Product
}

function ProductCard({ data }: IProductCard) {
  // Obtener el nombre del producto antes del símbolo •
  const productName = data.name.split(' • ')[0];

  return (
    <div className='bg-white group cursor-pointer rounded-xl border p-3 space-y-4 shadow-md'>
      <div className='group aspect-square rounded-xl overflow-hidden bg-gray-100 relative'>
        <Link href={`/product/${data.id}`}>
          <BlurImage
            className='group-hover:scale-110 transition-all duration-300 ease-in-out h-auto w-full object-contain bg-white rounded-xl'
            src={data?.images[0].url}
            fill
            alt={data.name}
          />
        </Link>
        <ProductAction data={data} />
      </div>
      <div className='text-center'>
        <Link href={`/product/${data.id}`} className='focus:outline-none font-semibold group-hover:underline text-lg'>
          <span className="block flex items-center justify-center h-12 overflow-hidden mb-3">{productName}</span>
        </Link>
        <p className='mt-1 text-xs text-gray-600 bg-gray-200 px-3 py-1 rounded-full'>{data.category.name}</p>
      </div>
    
      <div className='flex items-center justify-center'>
        <div className='text-xl font-bold'>
          <span className='text-3xl font-bold text-primary'><Currency value={data.price} /></span>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
