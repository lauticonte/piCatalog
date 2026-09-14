'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useTransition } from 'react'
import qs from 'query-string'
import { cn } from '@/utils/utils'

interface ILoadMore {
  shown: number
  total: number
  /** Cuántos productos suma cada clic. */
  step?: number
}

function LoadMore({ shown, total, step = 12 }: ILoadMore) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  if (total <= 0) return null

  const handleLoadMore = () => {
    const url = qs.stringifyUrl(
      { url: pathname, query: { ...qs.parse(searchParams.toString()), limit: String(shown + step) } },
      { skipNull: true }
    )
    // scroll: false mantiene la posición: antes se guardaba y restauraba a mano.
    startTransition(() => router.push(url, { scroll: false }))
  }

  const progress = Math.min(100, Math.round((shown / total) * 100))

  return (
    <div className='mx-auto mt-10 flex max-w-xs flex-col items-center gap-3'>
      <p className='text-xs text-slate-400'>
        Mostrando <b className='tabular-nums text-white'>{Math.min(shown, total)}</b> de{' '}
        <b className='tabular-nums text-white'>{total}</b>
      </p>
      <div className='h-1 w-full overflow-hidden rounded-full bg-white/10'>
        <div className='h-full rounded-full bg-[#f5b301] transition-all' style={{ width: `${progress}%` }} />
      </div>
      {shown < total && (
        <button
          type='button'
          onClick={handleLoadMore}
          disabled={isPending}
          className={cn(
            'mt-1 w-full rounded-xl border border-white/15 bg-white/[0.04] py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:border-[#f5b301]/60 hover:bg-white/[0.08] disabled:cursor-wait',
            isPending && 'animate-pulse'
          )}
        >
          {isPending ? 'Cargando…' : 'Ver más productos'}
        </button>
      )}
    </div>
  )
}

export default LoadMore
