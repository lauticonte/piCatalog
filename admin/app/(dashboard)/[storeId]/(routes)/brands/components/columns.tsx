'use client'

import { ColumnDef } from '@tanstack/react-table'
import CellAction from './cell-action'
import { LuImageOff } from 'react-icons/lu'
import { CountCell, DateCell, Thumb } from '@/components/ui/table-cells'

export type BrandColumn = {
  id: string
  image: string | null
  name: string
  productsCount: number
  billboardLabel: string
  billboardImage: string | null
  createdAt: string
  /** Fecha de alta en milisegundos, para ordenar (la de `createdAt` ya viene formateada). */
  createdAtValue: number
}

export const columns: ColumnDef<BrandColumn>[] = [
  {
    accessorKey: 'name',
    header: 'Marca',
    meta: { sortable: true },
    cell: ({ row }) => (
      <div className='flex items-center gap-3'>
        <Thumb src={row.original.image} fallbackIcon={LuImageOff} />
        <span className='truncate font-medium text-slate-900'>{row.original.name}</span>
      </div>
    ),
  },
  {
    accessorKey: 'productsCount',
    header: 'Productos',
    meta: { width: 160, sortable: true, sortValue: (row: BrandColumn) => row.productsCount },
    cell: ({ row }) => <CountCell count={row.original.productsCount} />,
  },
  {
    accessorKey: 'billboardLabel',
    header: 'Billboard',
    meta: { width: 220, hideOnMobile: true },
    // Los billboards no tienen nombre cargado: la miniatura es lo que permite reconocerlo.
    cell: ({ row }) => (
      <div className='flex items-center gap-2'>
        <Thumb src={row.original.billboardImage} fallbackIcon={LuImageOff} fit='cover' wide />
        {row.original.billboardLabel.trim() && <span className='truncate text-sm text-slate-600'>{row.original.billboardLabel}</span>}
      </div>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Creada',
    meta: { width: 130, hideOnMobile: true, sortable: true, sortValue: (row: BrandColumn) => row.createdAtValue },
    cell: ({ row }) => <DateCell value={row.original.createdAt} />,
  },
  {
    id: 'actions',
    meta: { width: 56 },
    cell: ({ row }) => <CellAction data={row.original} />,
  },
]
