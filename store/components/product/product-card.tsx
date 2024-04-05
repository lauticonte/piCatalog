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

  return (


    <div className="group border-0 flex w-full max-w-xs flex-col self-center overflow-hidden rounded-xl border bg-gray-700 shadow-md">
    <div className="relative mx-3 mt-3 flex h-60 overflow-hidden rounded-l-lg">
      <Link href={`/product/${data.id}`}>
        
          <BlurImage
            className="absolute top-0 right-0 h-full w-full object-contain bg-white rounded-r-lg rounded-l-lg"
            src={data?.images[0].url}
            fill
            alt={data.name}
          />
        
      </Link>
      <ProductAction data={data} />


      <span className="absolute top-0 left-0 m-2 rounded-full bg-black px-2 text-center text-sm font-medium text-white">39% OFF</span>
    </div>
    <div className="mt-4 px-5 pb-5">
      <Link className="text-xl font-medium text-ellipsis overflow-hidden text-white overflow-ellipsis block box-border flex-wrap items-center justify-center h-14 pb-6 mb-2 text-ellipsis" href="#">
        
          <h5 >{data.name}</h5>
        
      </Link>
      <p className='mt-1 text-xs text-center text-gray-600 bg-gray-200 px-3 py-1 rounded-full'>{data.category.name}</p>
      <div className="mt-2 mb-5 flex items-center justify-between">
        
          <span className="text-2xl font-bold text-white mt-6">

          <Currency value={data.price} />
          
            </span>
          
        
      </div>
    </div>
  </div>


  
)
}






















    {/* <div className='bg-white group cursor-pointer rounded-xl border p-3 space-y-4 shadow-md'>
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
          <span className='block flex-wrap items-center justify-center h-12 overflow-hidden mb-3 text-ellipsis'>{data.name}</span>
        </Link>
        <p className='mt-1 text-xs text-gray-600 bg-gray-200 px-3 py-1 rounded-full'>{data.category.name}</p>
      </div>

      <div className='flex items-center justify-center'>
        <div className='text-xl font-bold mb-2'>
          <span className='text-3xl font-bold text-primary'>
            <Currency value={data.price} />
          </span>
        </div>
      </div>
    </div> */}


export default ProductCard
