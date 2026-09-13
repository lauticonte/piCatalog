'use client'

import { Product } from '@/types'
import React, { MouseEventHandler, useState } from 'react'
import Currency from '../ui/currency'
import { AiOutlineWhatsApp } from 'react-icons/ai'
import { useCart } from '@/hooks/use-cart'

interface IProductInfo {
  data: Product
}

const ITEMS_INICIALES = 8

function ProductInfo({ data }: IProductInfo) {
  const cart = useCart()
  const [visibleItems, setVisibleItems] = useState(ITEMS_INICIALES)

  const handleConsult: MouseEventHandler<HTMLButtonElement> = event => {
    event.stopPropagation()
    cart.addItem(data)
  }

  // Las descripciones vienen con los puntos separados por "•". Muchos productos
  // tienen un guion o un espacio como relleno: eso no es descripción, así que se
  // descarta lo que no tenga al menos una letra o un número.
  const items = (data.desc ?? '')
    .split('•')
    .map(item => item.trim())
    .filter(item => /[a-zA-Z0-9\u00C0-\u00FF]/.test(item))

  return (
    <div className='text-slate-300'>
      {/* Mismo lenguaje que las tarjetas de la home: barrita amarilla, marca arriba. */}
      <div className='flex items-center gap-2'>
        <span className='h-3 w-0.5 rounded bg-[#f5b301]' />
        <span className='text-[10px] font-bold uppercase tracking-widest text-[#f5b301]'>{data.brand?.name}</span>
      </div>

      <h1 className='mt-2 text-2xl font-extrabold uppercase leading-tight text-white'>{data.name}</h1>

      <span className='mt-1 block text-[11px] uppercase tracking-wide text-slate-500'>{data.category?.name}</span>

      <div className='mt-5 rounded-xl bg-white/[0.04] px-5 py-4 text-center'>
        <span className='block text-[10px] font-bold uppercase tracking-widest text-slate-500'>Precio contado</span>
        <span className='mt-1 block text-[32px] font-extrabold leading-tight tracking-tight text-white'>
          <Currency value={data.price} />
        </span>
      </div>

      <button
        onClick={handleConsult}
        className='mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3.5 text-sm font-bold text-[#0b2e1a] transition hover:brightness-110'
      >
        <AiOutlineWhatsApp className='h-5 w-5' />
        Consultar por WhatsApp
      </button>

      {items.length > 0 && (
        <div className='mt-6 border-t border-white/10 pt-5'>
          <h2 className='text-[11px] font-bold uppercase tracking-widest text-[#f5b301]'>Descripción</h2>
          <ul className='mt-3 space-y-1.5'>
            {items.slice(0, visibleItems).map((item, index) => (
              <li key={index} className='flex gap-2 text-sm leading-relaxed text-slate-400'>
                <span className='mt-2 h-1 w-1 shrink-0 rounded-full bg-slate-600' />
                {item}
              </li>
            ))}
          </ul>
          {visibleItems < items.length && (
            <button
              onClick={() => setVisibleItems(items.length)}
              className='mt-3 text-xs font-bold uppercase tracking-wide text-[#f5b301] hover:underline'
            >
              Ver descripción completa
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default ProductInfo
