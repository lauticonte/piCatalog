'use client'

import { ColumnDef } from '@tanstack/react-table'
import CellAction from './cell-action'
import { LuImageOff } from 'react-icons/lu'
import { DateCell, Thumb } from '@/components/ui/table-cells'

export type BillboardColumn = {
  id: string
  label: string
  image: string | null
  createdAt: string
  /** Fecha de alta en milisegundos, para ordenar (la de `createdAt` ya viene formateada). */
  createdAtValue: number
}

export const columns: ColumnDef<BillboardColumn>[] = [
  {
    accessorKey: 'label',
    header: 'Billboard',
    meta: { sortable: true },
    // El banner en miniatura: con la etiqueta sola no se sabía cuál era cuál.
    cell: ({ row }) => (
      <div className='flex items-center gap-3'>
        <Thumb src={row.original.image} fallbackIcon={LuImageOff} fit='cover' wide />
        {row.original.label.trim() ? (
          <span className='truncate font-medium text-slate-900'>{row.original.label}</span>
        ) : (
          <span className='text-sm text-slate-400'>Sin nombre</span>
        )}
      </div>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Creado',
    meta: { width: 130, hideOnMobile: true, sortable: true, sortValue: (row: BillboardColumn) => row.createdAtValue },
    cell: ({ row }) => <DateCell value={row.original.createdAt} />,
  },
  {
    id: 'actions',
    meta: { width: 56 },
    cell: ({ row }) => <CellAction data={row.original} />,
  },
]
