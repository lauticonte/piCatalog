import Image from 'next/image'
import { IconType } from 'react-icons'
import { cn } from '@/lib/utils'

/**
 * Celdas que repiten todas las tablas del panel (categorías, marcas, combos, billboards),
 * para que una cantidad o una fecha se vean igual en cualquier pantalla.
 */

/** Miniatura cuadrada; sin imagen muestra un ícono en lugar de un guion suelto. */
export function Thumb({
  src,
  fallbackIcon: Icono,
  fit = 'contain',
  wide,
}: {
  src: string | null
  fallbackIcon: IconType
  fit?: 'contain' | 'cover'
  /** Formato apaisado, para banners. */
  wide?: boolean
}) {
  return (
    <div
      className={cn(
        'relative shrink-0 overflow-hidden rounded-lg bg-white ring-1 ring-slate-200',
        wide ? 'h-11 w-20' : 'h-11 w-11'
      )}
    >
      {src ? (
        <Image src={src} alt='' fill sizes={wide ? '80px' : '44px'} className={fit === 'cover' ? 'object-cover' : 'object-contain p-1'} />
      ) : (
        <div className='flex h-full w-full items-center justify-center bg-slate-50 text-slate-300'>
          <Icono className='h-4 w-4' />
        </div>
      )}
    </div>
  )
}

/** "51 productos"; en cero, un aviso en ámbar para que lo vacío se note. */
export function CountCell({ count, emptyLabel = 'Sin productos' }: { count: number; emptyLabel?: string }) {
  return count > 0 ? (
    <span className='whitespace-nowrap text-sm tabular-nums text-slate-700'>
      <b className='font-semibold text-slate-900'>{count}</b> {count === 1 ? 'producto' : 'productos'}
    </span>
  ) : (
    <span className='whitespace-nowrap text-xs font-medium text-amber-700'>{emptyLabel}</span>
  )
}

export function DateCell({ value }: { value: string }) {
  return <span className='whitespace-nowrap text-xs tabular-nums text-slate-500'>{value}</span>
}
