'use client'

import { ColumnDef } from '@tanstack/react-table'
import CellAction from './cell-action'
import { LuPackage } from 'react-icons/lu'
import { CountCell, DateCell, Thumb } from '@/components/ui/table-cells'

export type ComboColumn = {
  id: string
  image: string | null
  desc: string
  name: string
  productsCount: number
  createdAt: string
  /** Fecha de alta en milisegundos, para ordenar (la de `createdAt` ya viene formateada). */
  createdAtValue: number
}

export const columns: ColumnDef<ComboColumn>[] = [
  {
    accessorKey: 'name',
    header: 'Combo',
    meta: { sortable: true },
    cell: ({ row }) => (
      <div className='flex items-center gap-3'>
        <Thumb src={row.original.image} fallbackIcon={LuPackage} fit='cover' />
        <div className='min-w-0'>
          <div className='truncate font-medium text-slate-900'>{row.original.name}</div>
          {row.original.desc ? (
            <div className='truncate text-xs text-slate-500'>{row.original.desc}</div>
          ) : (
            <div className='text-xs text-slate-400'>Sin descripción</div>
          )}
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'productsCount',
    header: 'Productos',
    meta: { width: 160, sortable: true, sortValue: (row: ComboColumn) => row.productsCount },
    // Un combo vacío no se muestra completo en la tienda: el aviso tiene que notarse.
    cell: ({ row }) => <CountCell count={row.original.productsCount} emptyLabel='Sin cargar' />,
  },
  {
    accessorKey: 'createdAt',
    header: 'Creado',
    meta: { width: 130, hideOnMobile: true, sortable: true, sortValue: (row: ComboColumn) => row.createdAtValue },
    cell: ({ row }) => <DateCell value={row.original.createdAt} />,
  },
  {
    id: 'actions',
    meta: { width: 56 },
    cell: ({ row }) => <CellAction data={row.original} />,
  },
]
