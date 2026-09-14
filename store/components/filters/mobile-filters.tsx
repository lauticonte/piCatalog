'use client'

import * as Dialog from '@radix-ui/react-dialog'
import React from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import { BiSlider } from 'react-icons/bi'
import { cn } from '@/utils/utils'
import { CheckMark, Count, Facet, facetItems, LogoBox } from './facet-filter'
import { useFilterUrl } from './use-filter-url'

interface IMobileFilters {
  facets: Facet[]
  /** Resultados con los filtros actuales: el botón del panel lo anuncia. */
  total: number
}

// Mobile: un botón "Filtrar" que abre un panel desde abajo con todos los filtros. Con
// muchas categorías el carrusel escondía casi todas; acá se ven completas.
// Cada toque aplica el filtro al instante y el total del botón se actualiza.
function MobileFilters({ facets, total }: IMobileFilters) {
  const { selected, select, clear, isPending, isLoading } = useFilterUrl()
  const usable = facets.filter(facet => facet.options.length >= 2)
  const activeCount = facets.filter(facet => selected(facet.valueKey)).length

  if (usable.length === 0) return null

  return (
    <Dialog.Root>
      <Dialog.Trigger
        className={cn(
          'flex w-full items-center justify-center gap-2 rounded-xl border py-3 text-sm font-bold uppercase tracking-wide transition lg:hidden',
          activeCount ? 'border-[#f5b301]/60 bg-[#f5b301]/10 text-[#f5b301]' : 'border-white/15 bg-white/[0.04] text-white'
        )}
      >
        <BiSlider className='h-5 w-5' />
        Filtrar
        {activeCount > 0 && (
          <span className='flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#f5b301] px-1.5 text-[11px] text-[#1D232A]'>
            {activeCount}
          </span>
        )}
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className='fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0' />
        <Dialog.Content
          className='fixed inset-x-0 bottom-0 z-50 flex max-h-[88dvh] flex-col rounded-t-2xl border-t border-white/10 bg-[#1D232A] text-white shadow-2xl data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom'
          aria-describedby={undefined}
        >
          {/* Asa: indica que es un panel que se cierra hacia abajo. */}
          <span className='mx-auto mt-2.5 h-1 w-10 shrink-0 rounded-full bg-white/20' aria-hidden />

          <div className='flex shrink-0 items-center justify-between border-b border-white/10 px-5 pb-3 pt-3'>
            <Dialog.Title className='text-lg font-extrabold uppercase tracking-tight'>Filtros</Dialog.Title>
            <div className='flex items-center gap-1'>
              {activeCount > 0 && (
                <button
                  type='button'
                  onClick={() => clear(facets.map(facet => facet.valueKey))}
                  className='rounded-md px-2 py-1.5 text-xs font-semibold text-slate-400 hover:text-white'
                >
                  Limpiar
                </button>
              )}
              <Dialog.Close className='flex h-9 w-9 items-center justify-center rounded-full text-slate-300 hover:bg-white/10' aria-label='Cerrar'>
                <AiOutlineClose className='h-5 w-5' />
              </Dialog.Close>
            </div>
          </div>

          <div className='flex-1 space-y-6 overflow-y-auto overscroll-contain px-5 py-5'>
            {usable.map(facet => {
              const current = selected(facet.valueKey)
              const withLogos = facet.options.some(option => option.imageUrl)
              const items = facetItems(facet.options)

              return (
                <section key={facet.valueKey}>
                  <h3 className='flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#f5b301]'>
                    <span className='h-3 w-0.5 rounded bg-[#f5b301]' />
                    {facet.title}
                  </h3>

                  {withLogos ? (
                    // Marcas: grilla de logos, se reconocen más rápido que leyendo.
                    <div className='mt-3 grid grid-cols-3 gap-2'>
                      {items.map(item => {
                        const active = item.id === current || (item.id === null && !current)
                        return (
                          <button
                            key={item.id ?? 'todas'}
                            type='button'
                            onClick={() => select(facet.valueKey, item.id)}
                            aria-pressed={active}
                            className={cn(
                              'relative flex flex-col overflow-hidden rounded-xl border text-left',
                              active ? 'border-[#f5b301] ring-1 ring-[#f5b301]' : 'border-white/10',
                              isLoading(facet.valueKey, item.id) && 'animate-pulse'
                            )}
                          >
                            <LogoBox item={item} className='h-12 w-full rounded-none' />
                            <span className={cn('flex items-center justify-between gap-1 px-2 py-1.5', active ? 'bg-[#f5b301]/10' : 'bg-white/[0.03]')}>
                              <span className='truncate text-[10px] font-bold uppercase'>{item.name}</span>
                              <span className='text-[10px] tabular-nums text-slate-500'>{item.productsCount}</span>
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  ) : (
                    // Categorías: lista completa, una por renglón, fácil de tocar.
                    <ul className='mt-2 divide-y divide-white/5'>
                      {items.map(item => {
                        const active = item.id === current || (item.id === null && !current)
                        return (
                          <li key={item.id ?? 'todas'}>
                            <button
                              type='button'
                              onClick={() => select(facet.valueKey, item.id)}
                              aria-pressed={active}
                              className={cn(
                                'flex w-full items-center gap-3 py-3 text-left',
                                isLoading(facet.valueKey, item.id) && 'animate-pulse'
                              )}
                            >
                              <span className={cn('min-w-0 flex-1 truncate text-sm uppercase', active ? 'font-bold text-white' : 'text-slate-300')}>
                                {item.name}
                              </span>
                              <Count value={item.productsCount} active={active} />
                              {active ? <CheckMark /> : <span className='h-5 w-5 shrink-0 rounded-full border border-white/15' />}
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </section>
              )
            })}
          </div>

          <div className='shrink-0 border-t border-white/10 px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3'>
            <Dialog.Close className='w-full rounded-xl bg-[#f5b301] py-3.5 text-sm font-extrabold uppercase tracking-wide text-[#1D232A] transition active:brightness-95'>
              {isPending ? 'Actualizando…' : `Ver ${total} ${total === 1 ? 'producto' : 'productos'}`}
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default MobileFilters
