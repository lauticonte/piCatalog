'use client'

import { useRouter } from 'next/navigation'
import React from 'react'
import { BiSolidChevronLeft } from 'react-icons/bi'

interface IHeading {
  title: string
  description: string
  isDetail?: boolean
  /** Se muestra como pastilla al lado del título: el total, un estado, etc. */
  badge?: string | number
  /** Acción principal de la pantalla, alineada a la derecha. */
  action?: React.ReactNode
}

function Heading({ title, description, isDetail, badge, action }: IHeading) {
  const router = useRouter()

  return (
    <div className='flex flex-wrap items-start justify-between gap-4'>
      <div className='min-w-0'>
        {isDetail ? (
          <button
            className='mb-3 inline-flex items-center gap-1 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900'
            type='button'
            onClick={() => router.back()}
          >
            <BiSolidChevronLeft className='h-5 w-5' />
            Volver
          </button>
        ) : null}
        <div className='flex items-center gap-2.5'>
          <h1 className='text-[26px] font-extrabold leading-tight tracking-tight text-slate-900'>{title}</h1>
          {badge !== undefined && (
            <span className='rounded-full bg-slate-100 px-2.5 py-0.5 text-sm font-semibold text-slate-600'>{badge}</span>
          )}
        </div>
        <p className='mt-1 text-sm text-slate-500'>{description}</p>
      </div>
      {action ? <div className='shrink-0'>{action}</div> : null}
    </div>
  )
}

export default Heading
