import Link from 'next/link'
import React from 'react'
import { AiOutlineClose } from 'react-icons/ai'

export interface ActiveFilter {
  label: string
  /** A dónde lleva quitar este filtro (con los demás intactos). */
  clearHref: string
}

interface IResultsBar {
  count: number
  active?: ActiveFilter[]
  /** Aparece con dos o más filtros activos. */
  clearAllHref?: string
}

// Deja claro qué se está viendo y permite quitar cada filtro sin buscar dónde se eligió.
function ResultsBar({ count, active = [], clearAllHref }: IResultsBar) {
  return (
    <div className='mb-4 flex min-h-[32px] flex-wrap items-center gap-2'>
      <p className='mr-1 text-sm text-slate-400'>
        <b className='font-bold tabular-nums text-white'>{count}</b> {count === 1 ? 'producto' : 'productos'}
      </p>
      {active.map(filter => (
        <Link
          key={filter.label}
          href={filter.clearHref}
          scroll={false}
          className='flex max-w-full items-center gap-1.5 rounded-full border border-[#f5b301]/40 bg-[#f5b301]/10 py-1 pl-3 pr-2 text-xs font-bold uppercase tracking-wide text-[#f5b301] transition-colors hover:bg-[#f5b301]/20'
          aria-label={`Quitar filtro ${filter.label}`}
        >
          <span className='truncate'>{filter.label}</span>
          <AiOutlineClose className='h-3 w-3 shrink-0' />
        </Link>
      ))}
      {clearAllHref && active.length > 1 && (
        <Link href={clearAllHref} scroll={false} className='text-xs font-semibold text-slate-400 underline-offset-2 hover:text-white hover:underline'>
          Limpiar todo
        </Link>
      )}
    </div>
  )
}

export default ResultsBar
