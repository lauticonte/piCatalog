'use client'

import { usePreviewModal } from '@/hooks/use-preview-modal'
import { useCart } from '@/hooks/use-cart'
import { Product } from '@/types'
import React, { MouseEventHandler } from 'react'
import { AiOutlineExpand, AiOutlineWhatsApp } from 'react-icons/ai'
import IconButton from '../ui/icon-button'

interface IConsult {
  data: Product
}

function Consult({ data }: IConsult) {
  const previewModal = usePreviewModal()
  const cart = useCart()

  const handleAddToCart: MouseEventHandler<HTMLButtonElement> = event => {
    event.stopPropagation()
    cart.addItem(data)
  }

  return (
    <div className="flex items-center justify-center">
    <button onClick={handleAddToCart} className="flex items-center justify-center gap-x-1 w-full bg-lime-600 text-white px-3 py-3 rounded-b-lg m-0">
      <AiOutlineWhatsApp className='w-6 h-6' />
      Consultar
    </button>
  </div>
  )
}

export default Consult
