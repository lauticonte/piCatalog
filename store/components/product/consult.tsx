'use client'

import { useCart } from '@/hooks/use-cart'
import { Product } from '@/types'
import React, { MouseEventHandler } from 'react'
import { AiOutlineWhatsApp } from 'react-icons/ai'

interface IConsult {
  data: Product
}

function Consult({ data }: IConsult) {
  const cart = useCart()

  const handleConsult: MouseEventHandler<HTMLButtonElement> = event => {
    event.stopPropagation()
    cart.addItem(data)
  }

  return (
    // Verde real de WhatsApp: el anterior era un lima que no era ni el de la marca ni el de MH.
    <button
      onClick={handleConsult}
      className='flex w-full items-center justify-center gap-2 bg-[#25D366] py-3 text-sm font-bold text-[#0b2e1a] transition hover:brightness-110'
    >
      <AiOutlineWhatsApp className='h-5 w-5' />
      Consultar
    </button>
  )
}

export default Consult
