'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import React from 'react'
import qs from 'query-string'
import { cn } from '@/utils/utils'

export interface FacetOption {
  id: string
  name: string
  /** Productos publicados que quedan al elegir esta opción. */
  productsCount?: number
}

interface IFacetFilter {
  /** Parámetro de la URL que controla el filtro (brandId, categoryId). */
  valueKey: string
  title: string
  options: FacetOption[]
}

// Las opciones llegan ya acotadas desde la API: solo las que tienen productos en la
// página actual, así que ninguna lleva a un listado vacío.
function FacetFilter({ valueKey, title, options }: IFacetFilter) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const selected = searchParams.get(valueKey)
  const total = options.reduce((sum, option) => sum + (option.productsCount ?? 0), 0)

  // Cambiar de filtro vuelve al primer lote: el "limit" acumulado de "Cargar más"
  // correspondía al listado anterior.
  const hrefFor = (id: string | null) =>
    qs.stringifyUrl(
      { url: pathname, query: { ...qs.parse(searchParams.toString()), [valueKey]: id, limit: null } },
      { skipNull: true }
    )

  // Con una sola opción no hay nada que elegir.
  if (options.length < 2) return null

  const items = [{ id: null, name: 'Todas', productsCount: total || undefined }, ...options]

  return (
    <nav aria-label={title}>
      {/* Mobile: una fila deslizable arriba del listado. Antes era un panel lateral que
          había que abrir, con chips grises que no seguían el estilo de la tienda. */}
      <div className='-mx-4 lg:hidden'>
        <p className='px-4 text-[10px] font-bold uppercase tracking-widest text-slate-500'>{title}</p>
        <div className='mt-2 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
          {items.map(item => {
            const active = item.id === selected || (item.id === null && !selected)
            return (
              <Link
                key={item.id ?? 'todas'}
                href={hrefFor(item.id)}
                scroll={false}
                className={cn(
                  'flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 py-2 text-xs font-bold uppercase tracking-wide transition-colors',
                  active
                    ? 'border-[#f5b301] bg-[#f5b301] text-[#1D232A]'
                    : 'border-white/10 bg-white/[0.04] text-slate-300 active:bg-white/10'
                )}
              >
                {item.name}
                {item.productsCount !== undefined && (
                  <span className={cn('tabular-nums', active ? 'text-[#1D232A]/60' : 'text-slate-500')}>
                    {item.productsCount}
                  </span>
                )}
              </Link>
            )
          })}
        </div>
      </div>

      {/* Desktop: lista lateral con la cantidad alineada a la derecha. */}
      <div className='hidden lg:block'>
        <div className='flex items-center gap-2'>
          <span className='h-3 w-0.5 rounded bg-[#f5b301]' />
          <h3 className='text-[11px] font-bold uppercase tracking-widest text-[#f5b301]'>{title}</h3>
        </div>
        <ul className='mt-3 space-y-0.5'>
          {items.map(item => {
            const active = item.id === selected || (item.id === null && !selected)
            return (
              <li key={item.id ?? 'todas'}>
                <Link
                  href={hrefFor(item.id)}
                  scroll={false}
                  className={cn(
                    'flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                    active ? 'bg-white/10 font-bold text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  )}
                >
                  <span className='truncate uppercase'>{item.name}</span>
                  {item.productsCount !== undefined && (
                    <span className='text-xs tabular-nums text-slate-500'>{item.productsCount}</span>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}

export default FacetFilter
