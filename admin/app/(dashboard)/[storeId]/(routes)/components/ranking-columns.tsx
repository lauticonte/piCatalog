'use client'

import { ColumnDef } from '@tanstack/react-table'

export type RankingColumn = {
  id: string
  name: string
  SKU: string
  brand: string
  price: string
  total: number
  last: string
}

export const rankingColumns: ColumnDef<RankingColumn>[] = [
  {
    accessorKey: 'total',
    header: 'Consultas',
    cell: ({ row }) => <span className='font-bold'>{row.original.total}</span>,
  },
  {
    accessorKey: 'name',
    header: 'Producto',
    // El resto de las columnas se oculta en mobile: el dato clave va bajo el nombre.
    cell: ({ row }) => (
      <div>
        {row.original.name}
        <div className='mt-0.5 text-[11px] font-normal text-slate-400 md:hidden'>
          {row.original.SKU} · {row.original.price}
        </div>
      </div>
    ),
  },
  { accessorKey: 'SKU', header: 'SKU', meta: { hideOnMobile: true } },
  { accessorKey: 'brand', header: 'Marca', meta: { hideOnMobile: true } },
  { accessorKey: 'price', header: 'Precio', meta: { hideOnMobile: true } },
  { accessorKey: 'last', header: 'Última consulta', meta: { hideOnMobile: true } },
]
