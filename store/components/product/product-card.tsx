import { Product } from '@/types'
import Link from 'next/link'
import React from 'react'
import BlurImage from '../blur-image'
import Currency from '../ui/currency'
import ProductAction from './product-action'
import Consult from './consult'

interface IProductCard {
  data: Product
}

// Pensada para dos columnas en un celular (~170px) y tres o cuatro en desktop.
function ProductCard({ data }: IProductCard) {
  return (
    <article className='group flex h-full w-full flex-col rounded-2xl bg-[#232b33] p-1.5 ring-1 ring-white/10 transition duration-200 hover:ring-[#f5b301]/70 sm:p-2'>
      {/* La foto va en un marco blanco dentro de la tarjeta: la placa blanca de borde a
          borde cortaba la tarjeta en dos bloques y se veía plana. */}
      <div className='relative aspect-square shrink-0 overflow-hidden rounded-xl bg-white'>
        <Link href={`/product/${data.id}`} className='absolute inset-0' aria-label={data.name}>
          <BlurImage
            className='object-contain p-3 transition duration-300 group-hover:scale-105 sm:p-5'
            src={data?.images[0].url}
            fill
            sizes='(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw'
            alt={data.name}
          />
        </Link>
        {/* Rótulo plano pegado al borde, como el de una góndola: sin sombra ni redondeos
            que lo hagan parecer un adorno. */}
        <span className='pointer-events-none absolute left-0 top-3 rounded-r-sm bg-[#f5b301] px-2 py-1 text-[11px] font-black leading-none text-[#1D232A] sm:text-xs'>
          -20% OFF
        </span>
        <ProductAction data={data} />
      </div>

      <div className='flex flex-1 flex-col items-center px-1.5 pb-1.5 pt-3 text-center sm:px-2'>
        <span className='text-[10px] font-bold uppercase tracking-wider text-[#f5b301] sm:text-[11px]'>{data.brand?.name}</span>

        {/* Alto fijo de dos renglones: un nombre corto queda centrado en ese espacio y
            todas las tarjetas de la fila mantienen el precio a la misma altura. */}
        <Link href={`/product/${data.id}`} className='mt-1 flex h-[2.5em] w-full items-center justify-center text-[12px] leading-tight sm:text-[14px]'>
          <h3 className='line-clamp-2 font-bold uppercase text-white'>{data.name}</h3>
        </Link>
        {/* "0000000" es un SKU de relleno: no se muestra, pero el renglón se reserva
            igual para que todas las tarjetas de la fila queden alineadas. */}
        <span
          className={`mt-1 max-w-full truncate font-mono text-[10px] text-slate-500 sm:text-[11px] ${
            data.SKU && !/^0+$/.test(data.SKU) ? '' : 'invisible'
          }`}
        >
          COD. {data.SKU || '-'}
        </span>

        <div className='mt-auto w-full pt-3'>
          <div className='border-t border-dashed border-white/15 pt-2.5'>
            <span className='block text-[10px] font-semibold uppercase tracking-wide text-slate-500 sm:text-[11px]'>
              Precio contado
            </span>
            <Currency
              value={data.price}
              className='mt-1 block text-[19px] font-extrabold leading-none tracking-tight text-white tabular-nums sm:text-[24px]'
            />
          </div>
          <Consult data={data} />
        </div>
      </div>
    </article>
  )
}

export default ProductCard
