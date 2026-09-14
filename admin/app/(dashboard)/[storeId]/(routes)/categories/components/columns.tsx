'use client'

import { ColumnDef } from '@tanstack/react-table'
import CellAction from './cell-action'

export type CategoryColumn = {
  id: string
  productsCount: number
  name: string
  createdAt: string
}

export const columns: ColumnDef<CategoryColumn>[] = [
  {
    accessorKey: 'name',
    header: 'Categoría',
    cell: ({ row }) => <span className='font-medium text-slate-900'>{row.original.name}</span>,
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
        <span className='text-xs text-slate-400'>vacía</span>
      ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Creado',
    meta: { width: 130, hideOnMobile: true },
    cell: ({ row }) => <span className='text-xs text-slate-400'>{row.original.createdAt}</span>,
  },
  {
    id: 'actions',
    meta: { width: 56 },
    cell: ({ row }) => <CellAction data={row.original} />,
  },
]
