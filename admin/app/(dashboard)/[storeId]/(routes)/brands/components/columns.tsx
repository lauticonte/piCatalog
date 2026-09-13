'use client'

import { ColumnDef } from '@tanstack/react-table'
import CellAction from './cell-action'
import Image from 'next/image'

export type BrandColumn = {
  id: string
  image: string | null
  name: string
  productsCount: number
  billboardLabel: string
  createdAt: string
}

export const columns: ColumnDef<BrandColumn>[] = [
  {
    accessorKey: 'name',
    header: 'Marca',
    cell: ({ row }) => (
      <div className='flex items-center gap-3'>
        {/* Las marcas ya tenían logo cargado y la tabla no lo mostraba. */}
        <div className='relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-white ring-1 ring-slate-200'>
          {row.original.image ? (
            <Image src={row.original.image} alt='' fill sizes='44px' className='object-contain p-1' />
          ) : (
            <div className='flex h-full w-full items-center justify-center text-[10px] text-slate-300'>—</div>
          )}
        </div>
        <span className='truncate font-medium text-slate-900'>{row.original.name}</span>
      </div>
    ),
  },
  {
    accessorKey: 'productsCount',
    header: 'Productos',
    meta: { width: 150 },
    cell: ({ row }) =>
      row.original.productsCount > 0 ? (
        <span className='inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700'>
          {row.original.productsCount}
        </span>
      ) : (
        <span className='text-xs text-slate-400'>sin productos</span>
      ),
  },
  {
    accessorKey: 'billboardLabel',
    header: 'Billboard',
    meta: { width: 220 },
    cell: ({ row }) => <span className='text-slate-500'>{row.original.billboardLabel}</span>,
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
