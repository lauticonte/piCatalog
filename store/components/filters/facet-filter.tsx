'use client'

import Image from 'next/image'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useState, useTransition } from 'react'
import qs from 'query-string'
import { BiCheck, BiGridAlt } from 'react-icons/bi'
import { cn } from '@/utils/utils'

export interface FacetOption {
  id: string
  name: string
  /** Productos publicados que quedan al elegir esta opción. */
  productsCount?: number
  /** Logo de la marca: si viene, la opción se muestra como tarjeta con logo. */
  imageUrl?: string
}

interface IFacetFilter {
  /** Parámetro de la URL que controla el filtro (brandId, categoryId). */
  valueKey: string
  title: string
  options: FacetOption[]
}

type Item = FacetOption & { id: string | null }

// Las opciones llegan ya acotadas desde la API: solo las que tienen productos en la
// página actual, así que ninguna lleva a un listado vacío.
function FacetFilter({ valueKey, title, options }: IFacetFilter) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const selected = searchParams.get(valueKey)
  const [isPending, startTransition] = useTransition()
  const [pendingId, setPendingId] = useState<string | null | undefined>(undefined)

  const total = options.reduce((sum, option) => sum + (option.productsCount ?? 0), 0)
  const withLogos = options.some(option => option.imageUrl)

  // Con una sola opción no hay nada que elegir.
  if (options.length < 2) return null

  const items: Item[] = [{ id: null, name: 'Todas', productsCount: total || undefined }, ...options]
  const isActive = (item: Item) => item.id === selected || (item.id === null && !selected)
  const isLoading = (item: Item) => isPending && pendingId === item.id

  const select = (id: string | null) => {
    // Cambiar de filtro vuelve al primer lote: el "limit" acumulado de "Ver más"
    // correspondía al listado anterior.
    const url = qs.stringifyUrl(
      { url: pathname, query: { ...qs.parse(searchParams.toString()), [valueKey]: id, limit: null } },
      { skipNull: true }
    )
    setPendingId(id)
    // La página es del servidor y tarda un momento: la transición permite marcar la
    // opción tocada mientras llega el listado nuevo, en vez de parecer que no pasó nada.
    startTransition(() => router.push(url, { scroll: false }))
  }

  return (
    <nav aria-label={title} aria-busy={isPending}>
      {/* Mobile: fila deslizable arriba del listado, sin panel que abrir. */}
      <div className='lg:hidden'>
        <p className='text-[10px] font-bold uppercase tracking-widest text-slate-500'>Filtrar por {title.toLowerCase()}</p>
        <div className='-mx-4 mt-2.5 flex snap-x scroll-px-4 gap-2.5 overflow-x-auto px-4 pb-2 sm:scroll-px-6 [scrollbar-width:none] sm:-mx-6 sm:px-6 [&::-webkit-scrollbar]:hidden'>
          {items.map(item =>
            withLogos ? (
              <LogoTile key={item.id ?? 'todas'} item={item} active={isActive(item)} loading={isLoading(item)} onSelect={select} />
            ) : (
              <Chip key={item.id ?? 'todas'} item={item} active={isActive(item)} loading={isLoading(item)} onSelect={select} />
            )
          )}
        </div>
      </div>

      {/* Desktop: panel lateral fijo mientras se recorre el listado. */}
      <div className='hidden rounded-2xl border border-white/10 bg-white/[0.03] p-2 lg:block'>
        <div className='flex items-center justify-between px-3 pb-2 pt-2'>
          <h2 className='flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#f5b301]'>
            <span className='h-3 w-0.5 rounded bg-[#f5b301]' />
            {title}
          </h2>
          {selected && (
            <button
              type='button'
              onClick={() => select(null)}
              className='text-[11px] font-semibold text-slate-400 underline-offset-2 hover:text-white hover:underline'
            >
              Limpiar
            </button>
          )}
        </div>
        <ul className='space-y-0.5'>
          {items.map(item => {
            const active = isActive(item)
            return (
              <li key={item.id ?? 'todas'}>
                <button
                  type='button'
                  onClick={() => select(item.id)}
                  aria-current={active ? 'true' : undefined}
                  className={cn(
                    'relative flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors',
                    active ? 'bg-[#f5b301]/10 text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white',
                    isLoading(item) && 'animate-pulse'
                  )}
                >
                  {active && <span className='absolute inset-y-2 left-0 w-0.5 rounded-full bg-[#f5b301]' />}
                  {withLogos && (
                    // Rectangular: los logos son apaisados y en un cuadrado quedaban ilegibles.
                    <span
                      className={cn(
                        'relative flex h-8 w-14 shrink-0 items-center justify-center overflow-hidden rounded-md',
                        item.imageUrl ? 'bg-white' : 'bg-white/[0.06] text-slate-300'
                      )}
                    >
                      {item.imageUrl ? (
                        <Image src={item.imageUrl} alt='' fill sizes='56px' className='object-contain px-1.5 py-1' />
                      ) : (
                        <BiGridAlt className='h-4 w-4' />
                      )}
                    </span>
                  )}
                  <span className={cn('min-w-0 flex-1 truncate text-[13px] uppercase', active ? 'font-bold' : 'font-medium')}>
                    {item.name}
                  </span>
                  {item.productsCount !== undefined && (
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums',
                        active ? 'bg-[#f5b301] text-[#1D232A]' : 'bg-white/5 text-slate-400'
                      )}
                    >
                      {item.productsCount}
                    </span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}

interface IOption {
  item: Item
  active: boolean
  loading: boolean
  onSelect: (id: string | null) => void
}

// Tarjeta con el logo de la marca: se reconoce de un vistazo, más rápido que leer el nombre.
function LogoTile({ item, active, loading, onSelect }: IOption) {
  return (
    <button
      type='button'
      onClick={() => onSelect(item.id)}
      aria-pressed={active}
      className={cn(
        'relative flex w-[104px] shrink-0 snap-start flex-col overflow-hidden rounded-xl border text-left transition',
        active ? 'border-[#f5b301] ring-1 ring-[#f5b301]' : 'border-white/10',
        loading && 'animate-pulse'
      )}
    >
      <span className={cn('relative flex h-14 items-center justify-center', item.imageUrl ? 'bg-white' : 'bg-white/[0.06]')}>
        {item.imageUrl ? (
          <Image src={item.imageUrl} alt='' fill sizes='104px' className='object-contain px-3 py-2' />
        ) : (
          <BiGridAlt className='h-6 w-6 text-slate-300' />
        )}
        {active && (
          <span className='absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#f5b301] text-[#1D232A]'>
            <BiCheck className='h-3.5 w-3.5' />
          </span>
        )}
      </span>
      <span className={cn('flex items-center justify-between gap-1 px-2 py-1.5', active ? 'bg-[#f5b301]/10' : 'bg-white/[0.03]')}>
        <span className={cn('truncate text-[10px] font-bold uppercase', active ? 'text-white' : 'text-slate-300')}>{item.name}</span>
        {item.productsCount !== undefined && (
          <span className='text-[10px] font-semibold tabular-nums text-slate-500'>{item.productsCount}</span>
        )}
      </span>
    </button>
  )
}

function Chip({ item, active, loading, onSelect }: IOption) {
  return (
    <button
      type='button'
      onClick={() => onSelect(item.id)}
      aria-pressed={active}
      className={cn(
        'flex shrink-0 snap-start items-center gap-2 whitespace-nowrap rounded-full border py-1.5 pl-3.5 pr-1.5 text-xs font-bold uppercase tracking-wide transition-colors',
        active ? 'border-[#f5b301] bg-[#f5b301] text-[#1D232A]' : 'border-white/10 bg-white/[0.04] text-slate-200',
        loading && 'animate-pulse'
      )}
    >
      {item.name}
      {item.productsCount !== undefined && (
        <span
          className={cn(
            'rounded-full px-2 py-0.5 text-[10px] tabular-nums',
            active ? 'bg-[#1D232A]/15 text-[#1D232A]' : 'bg-white/10 text-slate-400'
          )}
        >
          {item.productsCount}
        </span>
      )}
    </button>
  )
}

export default FacetFilter
