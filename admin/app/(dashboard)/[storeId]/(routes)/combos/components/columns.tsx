'use client'

import { ColumnDef } from '@tanstack/react-table'
import CellAction from './cell-action'

export type ComboColumn = {
  id: string
  name: string
  productsCount: number
  createdAt: string
}

export const columns: ColumnDef<ComboColumn>[] = [
  {
    accessorKey: 'name',
    header: 'Combo',
  },
  {
    accessorKey: 'productsCount',
    header: 'Productos',
  },
  {
    accessorKey: 'createdAt',
    header: 'Creado',
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
]
