'use client'

import { ColumnDef } from '@tanstack/react-table'

export type HistoryColumn = {
  id: string
  name: string
  SKU: string
  brand: string
  createdAt: string
}

export const historyColumns: ColumnDef<HistoryColumn>[] = [
  {
    accessorKey: 'createdAt',
    header: 'Fecha',
    cell: ({ row }) => <span className='whitespace-nowrap'>{row.original.createdAt}</span>,
  },
  {
    accessorKey: 'name',
    header: 'Producto',
    // SKU y marca se ocultan en mobile: se muestran bajo el nombre.
    cell: ({ row }) => (
      <div>
        {row.original.name}
        <div className='mt-0.5 text-[11px] font-normal text-slate-400 md:hidden'>
          {row.original.SKU} · {row.original.brand}
        </div>
      </div>
    ),
  },
  { accessorKey: 'SKU', header: 'SKU', meta: { hideOnMobile: true } },
  { accessorKey: 'brand', header: 'Marca', meta: { hideOnMobile: true } },
]
