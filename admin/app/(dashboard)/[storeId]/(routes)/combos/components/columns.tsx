'use client'

import { ColumnDef } from '@tanstack/react-table'
import CellAction from './cell-action'
import Image from 'next/image'

export type ComboColumn = {
  id: string
  image: string | null
  desc: string
  name: string
  productsCount: number
  createdAt: string
}

export const columns: ColumnDef<ComboColumn>[] = [
  {
    accessorKey: 'name',
    header: 'Combo',
    cell: ({ row }) => (
      <div className='flex items-center gap-3'>
        <div className='relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-slate-50 ring-1 ring-slate-200'>
          {row.original.image ? (
            <Image src={row.original.image} alt='' fill sizes='44px' className='object-cover' />
          ) : (
            <div className='flex h-full w-full items-center justify-center text-[10px] text-slate-300'>—</div>
          )}
        </div>
        <div className='min-w-0'>
          <div className='truncate font-medium text-slate-900'>{row.original.name}</div>
          <div className='truncate text-xs text-slate-400'>
            {row.original.desc || 'Sin descripción'}
          </div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'productsCount',
    header: 'Productos',
    meta: { width: 150 },
    // Un "0" suelto no dice nada; conviene que se note cuál está vacío.
    cell: ({ row }) =>
      row.original.productsCount > 0 ? (
        <span className='inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700'>
          {row.original.productsCount} producto{row.original.productsCount > 1 ? 's' : ''}
        </span>
      ) : (
        <span className='inline-flex items-center rounded-md bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700'>
          Sin cargar
        </span>
      ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Creado',
    meta: { width: 130 },
    cell: ({ row }) => <span className='text-xs text-slate-400'>{row.original.createdAt}</span>,
  },
  {
    id: 'actions',
    meta: { width: 56 },
    cell: ({ row }) => <CellAction data={row.original} />,
  },
]
