import { Product } from '@/types'
import Link from 'next/link'
import React, { MouseEventHandler } from 'react'
import BlurImage from '../blur-image'
import Currency from '../ui/currency'
import ProductAction from './product-action'
import { AiOutlineWhatsApp } from 'react-icons/ai'
import { formatter } from '@/utils/utils'
import Consult from './consult'

interface IProductCard {
  data: Product
}

function ProductCard({ data }: IProductCard) {

  return (


    <div className="group border-0 flex w-full max-w-xs flex-col self-center overflow-hidden rounded-xl border bg-gray-700 shadow-xl shadow-black">
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


      <span className="absolute top-0 left-0 m-2 rounded-full bg-black px-2 text-center text-sm font-medium text-white">20% OFF</span>
    </div>
    <div className="mt-4 px-5 pb-5">
      <Link className="text-xl font-medium text-ellipsis overflow-hidden text-white overflow-ellipsis block box-border flex-wrap items-center justify-center h-14 pb-6 mb-2 text-ellipsis" href={`/product/${data.id}`}>
        
          <h5 >{data.name}</h5>
        
      </Link>
      <p className='mt-1 text-xs text-center text-gray-600 bg-gray-200 px-3 py-1 rounded-full'>{data.category.name}</p>

    </div>


    <p className="text-xl text-gray-200 bg-gray-900 border-transparent px-14 py-3 text-white font-semibold transition text-center">

<Currency value={data.price} />

</p>

    <Consult data={data} />

  </div>


  
)
}

export default ProductCard
