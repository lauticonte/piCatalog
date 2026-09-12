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
  { accessorKey: 'name', header: 'Producto' },
  { accessorKey: 'SKU', header: 'SKU' },
  { accessorKey: 'brand', header: 'Marca' },
  { accessorKey: 'price', header: 'Precio' },
  { accessorKey: 'last', header: 'Última consulta' },
]
