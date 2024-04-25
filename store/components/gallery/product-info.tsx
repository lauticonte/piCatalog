'use client'

import { Product } from '@/types'
import React, { MouseEventHandler, useState } from 'react'
import Button from '../ui/button'
import ActionButton from '../ui/action-button'
import Currency from '../ui/currency'
import { AiOutlineWhatsApp } from 'react-icons/ai'
import { useCart } from '@/hooks/use-cart'

interface IProductInfo {
  data: Product
}

function ProductInfo({ data }: IProductInfo) {
  const cart = useCart()

  const handleAddToCart: MouseEventHandler<HTMLButtonElement> = event => {
    event.stopPropagation()
    cart.addItem(data)
  }

  const [visibleItems, setVisibleItems] = useState(8);
  const handleShowMore = () => {
    setVisibleItems(data.desc.split('•').length);
  };

  const items = data.desc.split('•')
  const brand = data.brand.name
  

  return (
    <div className='text-gray-200'>
      <h1 className='text-2xl font-bold text-gray-200 uppercase'>{data.name}</h1>
      <div className='mt-3 flex items-center justify-center md:justify-start'>
        <p className='text-2xl text-gray-200 rounded-full bg-gray-900 border-transparent px-14 py-3 text-white font-semibold transition'>
          <Currency value={data.price} />
        </p>
      </div>
      <hr className='my-4 border-gray-400' />

      {/* Agregar descripcion aquí */}
      <div className='mt-3'>
      <li className='mt-4 mb-4 list-none'>Marca: <span className='font-semibold rounded-lg bg-gray-700 border-transparent px-4 py-3 ml-2 '>{brand}</span></li>
        <h3 className='font-semibold text-blas mb-1'>Descripción: </h3>
        <ul>
          {/* brand */}
          
          {/* category */}

          {items.slice(0, visibleItems).map((item, index) => (
            <li key={index}>{item.trim()}</li>
          ))}
        </ul>
        {visibleItems < items.length && (
          <ActionButton className='text-xs' onClick={handleShowMore}>Ver más...</ActionButton>
        )}
        <hr className='my-4 border-gray-400' />
      </div>
      <div className='mt-2 flex justify-end items-center gap-x-2'>
        <Button className='flex items-center gap-x-3 bg-lime-600' onClick={handleAddToCart}>
          Consultar
          <AiOutlineWhatsApp className='w-6 h-6' />
        </Button>
      </div>
    </div>
  )
}

export default ProductInfo
