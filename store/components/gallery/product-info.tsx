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

  return (
    <div>
      <h1 className='text-2xl font-bold text-gray-900'>{data.name}</h1>
      <div className='mt-3 flex items-end justify-between'>
        <p className='text-2xl text-gray-900'>
          <Currency value={data.price} />
        </p>
      </div>
      <hr className='my-4' />

      {/* Agregar descripcion aquí */}
      <div className='mt-3'>
        <h3 className='font-semibold text-blas mb-1'>Descripción: </h3>
        <ul>
          {items.slice(0, visibleItems).map((item, index) => (
            <li key={index}>{item.trim()}</li>
          ))}
        </ul>
        {visibleItems < items.length && (
          <ActionButton className='text-xs' onClick={handleShowMore}>Ver más</ActionButton>
        )}
        <hr className='my-4' />
      </div>
      <div className='mt-2 flex justify-end items-center gap-x-2'>
        <Button className='flex items-center gap-x-3' onClick={handleAddToCart}>
          Consultar
          <AiOutlineWhatsApp className='w-6 h-6' />
        </Button>
      </div>
    </div>
  )
}

export default ProductInfo
