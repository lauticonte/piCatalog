'use client'

import { ColumnDef } from '@tanstack/react-table'
import CellAction from './cell-action'

export type ProductColumn = {
  id: string
  name: string
  price: string
  desc: string
  category: string
  brand: string
  color: string
  createdAt: string
  isFeatured: boolean
  isArchived: boolean
}

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'isArchived',
    header: 'Archived',
  },
  {
    accessorKey: 'isFeatured',
    header: 'Featured',
  },
  {
    accessorKey: 'price',
    header: 'Price',
  },
  {
    accessorKey: 'desc',
    header: 'Description',
  },
  {
    accessorKey: 'category',
    header: 'Category',
  },
  {
    accessorKey: 'brand',
    header: 'Brand',
  },
  {
    accessorKey: 'color',
    header: 'Color',
    cell: ({ row }) => (
      <div className='flex items-center gap-x-2'>
        {row.original.color}
        <div className='h-6 w-6 rounded-full border' style={{ backgroundColor: row.original.color }} />
      </div>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Date',
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
]
