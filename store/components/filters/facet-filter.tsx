'use client'

import Image from 'next/image'
import React from 'react'
import { BiCheck, BiGridAlt } from 'react-icons/bi'
import { cn } from '@/utils/utils'
import { useFilterUrl } from './use-filter-url'

export interface FacetOption {
  id: string
  name: string
  /** Productos publicados que quedan al elegir esta opción. */
  productsCount?: number
  /** Logo de la marca: si viene, la opción se muestra con su logo. */
  imageUrl?: string
}

export interface Facet {
  /** Parámetro de la URL que controla el filtro (brandId, categoryId). */
  valueKey: string
  title: string
  options: FacetOption[]
}

export type FacetItem = FacetOption & { id: string | null }

// "Todas" primero, con la suma: es la opción para salir del filtro.
export const facetItems = (options: FacetOption[]): FacetItem[] => {
  const total = options.reduce((sum, option) => sum + (option.productsCount ?? 0), 0)
  return [{ id: null, name: 'Todas', productsCount: total || undefined }, ...options]
}

// Panel lateral de desktop. En mobile los filtros viven en el panel de "Filtrar".
// Las opciones llegan ya acotadas desde la API: ninguna lleva a un listado vacío.
function FacetFilter({ valueKey, title, options }: Facet) {
  const { selected, select, isLoading } = useFilterUrl()
  const current = selected(valueKey)
  const withLogos = options.some(option => option.imageUrl)

  // Con una sola opción no hay nada que elegir.
  if (options.length < 2) return null

  return (
    <nav aria-label={title} className='hidden rounded-2xl border border-white/10 bg-white/[0.03] p-2 lg:block'>
      <div className='flex items-center justify-between px-3 pb-2 pt-2'>
        <h2 className='flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#f5b301]'>
          <span className='h-3 w-0.5 rounded bg-[#f5b301]' />
          {title}
        </h2>
        {current && (
          <button
            type='button'
            onClick={() => select(valueKey, null)}
            className='text-[11px] font-semibold text-slate-400 underline-offset-2 hover:text-white hover:underline'
          >
            Limpiar
          </button>
        )}
      </div>
      <ul className='space-y-0.5'>
        {facetItems(options).map(item => {
          const active = item.id === current || (item.id === null && !current)
          return (
            <li key={item.id ?? 'todas'}>
              <button
                type='button'
                onClick={() => select(valueKey, item.id)}
                aria-current={active ? 'true' : undefined}
                className={cn(
                  'relative flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors',
                  active ? 'bg-[#f5b301]/10 text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white',
                  isLoading(valueKey, item.id) && 'animate-pulse'
                )}
              >
                {active && <span className='absolute inset-y-2 left-0 w-0.5 rounded-full bg-[#f5b301]' />}
                {withLogos && <LogoBox item={item} className='h-8 w-14' />}
                <span className={cn('min-w-0 flex-1 truncate text-[13px] uppercase', active ? 'font-bold' : 'font-medium')}>
                  {item.name}
                </span>
                <Count value={item.productsCount} active={active} />
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

// Rectangular: los logos son apaisados y en un cuadrado quedaban ilegibles.
export function LogoBox({ item, className }: { item: FacetItem; className?: string }) {
  return (
    <span
      className={cn(
        'relative flex shrink-0 items-center justify-center overflow-hidden rounded-md',
        item.imageUrl ? 'bg-white' : 'bg-white/[0.06] text-slate-300',
        className
      )}
    >
      {item.imageUrl ? (
        <Image src={item.imageUrl} alt='' fill sizes='120px' className='object-contain px-2 py-1' />
      ) : (
        <BiGridAlt className='h-5 w-5' />
      )}
    </span>
  )
}

export function Count({ value, active }: { value?: number; active: boolean }) {
  if (value === undefined) return null
  return (
    <span
      className={cn(
        'rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums',
        active ? 'bg-[#f5b301] text-[#1D232A]' : 'bg-white/5 text-slate-400'
      )}
    >
      {value}
    </span>
  )
}

export function CheckMark() {
  return (
    <span className='flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#f5b301] text-[#1D232A]'>
      <BiCheck className='h-4 w-4' />
    </span>
  )
}

export default FacetFilter
