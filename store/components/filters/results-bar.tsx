import Link from 'next/link'
import React from 'react'
import { AiOutlineClose } from 'react-icons/ai'

interface IResultsBar {
  count: number
  /** Nombre de la opción filtrada, si hay una activa. */
  activeLabel?: string
  /** A dónde lleva quitar el filtro. */
  clearHref: string
}

// Deja claro qué se está viendo y permite salir del filtro sin buscar dónde se eligió.
function ResultsBar({ count, activeLabel, clearHref }: IResultsBar) {
  return (
    <div className='mb-4 flex min-h-[32px] flex-wrap items-center gap-2'>
      <p className='text-sm text-slate-400'>
        <b className='font-bold tabular-nums text-white'>{count}</b> {count === 1 ? 'producto' : 'productos'}
      </p>
      {activeLabel && (
        <Link
          href={clearHref}
          scroll={false}
          className='flex items-center gap-1.5 rounded-full border border-[#f5b301]/40 bg-[#f5b301]/10 py-1 pl-3 pr-2 text-xs font-bold uppercase tracking-wide text-[#f5b301] transition-colors hover:bg-[#f5b301]/20'
          aria-label={`Quitar filtro ${activeLabel}`}
        >
          {activeLabel}
          <AiOutlineClose className='h-3 w-3' />
        </Link>
      )}
    </div>
  )
}

export default ResultsBar
