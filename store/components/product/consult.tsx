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
      // Botón compacto dentro de la tarjeta: de borde a borde parecía un banner más.
      className='mt-3 flex h-9 w-full items-center justify-center gap-1.5 rounded-lg leading-none bg-[#25D366] text-[12px] font-extrabold uppercase tracking-wide text-[#0b2e1a] transition hover:brightness-110 active:brightness-95 sm:h-10 sm:text-[13px]'
    >
      <AiOutlineWhatsApp className='h-4 w-4 shrink-0 sm:h-5 sm:w-5' />
      {/* En mayúsculas no hay descendentes: con el interlineado normal el texto quedaba
          corrido respecto del ícono; con leading-none queda centrado. */}
      <span className='leading-none'>Consultar</span>
    </button>
  )
}

export default Consult
