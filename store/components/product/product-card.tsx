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

function ProductCard({ data }: IProductCard) {
  return (
    <article className='group flex h-full w-full max-w-xs flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#1D232A] transition duration-200 hover:-translate-y-1 hover:border-[#f5b301]/60'>
      {/* Altura fija: si la impone cada foto, las tarjetas de una misma fila quedan desparejas. */}
      <div className='relative h-56 shrink-0 bg-white'>
        <Link href={`/product/${data.id}`} className='absolute inset-0'>
          <BlurImage
            className='object-contain p-4 transition duration-300 group-hover:scale-105'
            src={data?.images[0].url}
            fill
            sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw'
            alt={data.name}
          />
        </Link>
        <span className='pointer-events-none absolute left-3 top-3 rounded-md bg-[#f5b301] px-2 py-0.5 text-[11px] font-extrabold tracking-wide text-[#1D232A]'>
          20% OFF
        </span>
        <ProductAction data={data} />
      </div>

      <div className='flex flex-1 flex-col gap-1 px-4 pt-3.5'>
        {/* En herramientas la marca pesa en la decisión y la tarjeta no la mostraba.
            La barrita amarilla repite el acento del hero. */}
        <div className='flex items-center gap-2'>
          <span className='h-3 w-0.5 rounded bg-[#f5b301]' />
          <span className='text-[10px] font-bold uppercase tracking-widest text-[#f5b301]'>{data.brand?.name}</span>
        </div>

        <Link href={`/product/${data.id}`}>
          <h3 className='line-clamp-2 min-h-[2.6rem] text-[15px] font-semibold uppercase leading-snug text-white'>
            {data.name}
          </h3>
        </Link>

        <Link href={`/category/${data.category.id}`}>
          <span className='text-[11px] uppercase tracking-wide text-slate-500 hover:text-slate-300'>
            {data.category.name}
          </span>
        </Link>
      </div>

      {/* El precio en su propia banda: antes se mezclaba con el resto del texto. */}
      <div className='mt-3 bg-white/[0.04] px-4 py-3 text-center text-[24px] font-extrabold leading-none tracking-tight text-white'>
        <Currency value={data.price} />
      </div>

      <Consult data={data} />
    </article>
  )
}

export default ProductCard
