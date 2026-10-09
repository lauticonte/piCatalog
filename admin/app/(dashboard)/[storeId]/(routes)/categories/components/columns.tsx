'use client'

import { ColumnDef } from '@tanstack/react-table'
import CellAction from './cell-action'
import { CountCell, DateCell } from '@/components/ui/table-cells'

export type CategoryColumn = {
  id: string
  productsCount: number
  name: string
  createdAt: string
  /** Fecha de alta en milisegundos, para ordenar (la de `createdAt` ya viene formateada). */
  createdAtValue: number
}

export const columns: ColumnDef<CategoryColumn>[] = [
  {
    accessorKey: 'name',
    header: 'Categoría',
    meta: { sortable: true },
    cell: ({ row }) => <span className='font-medium text-slate-900'>{row.original.name}</span>,
  },
  {
    accessorKey: 'productsCount',
    header: 'Productos',
    meta: { width: 160, sortable: true, sortValue: (row: CategoryColumn) => row.productsCount },
    cell: ({ row }) => <CountCell count={row.original.productsCount} emptyLabel='Vacía' />,
  },
  {
    accessorKey: 'createdAt',
    header: 'Creada',
    meta: { width: 130, hideOnMobile: true, sortable: true, sortValue: (row: CategoryColumn) => row.createdAtValue },
    cell: ({ row }) => <DateCell value={row.original.createdAt} />,
  },
  {
    id: 'actions',
    meta: { width: 56 },
    cell: ({ row }) => <CellAction data={row.original} />,
  },
]
