'use client'

import { ColumnDef } from '@tanstack/react-table'
import CellAction from './cell-action'

export type BrandColumn = {
  id: string
  name: string
  billboardLabel: string
  createdAt: string
}

export const columns: ColumnDef<BrandColumn>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'billboardLabel',
    header: 'Billboard',
    cell: ({ row }) => row.original.billboardLabel,
  },
  {
    accessorKey: 'createdAt',
    header: 'Created on',
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
]
