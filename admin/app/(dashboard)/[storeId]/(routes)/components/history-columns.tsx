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
  { accessorKey: 'createdAt', header: 'Fecha' },
  { accessorKey: 'name', header: 'Producto' },
  { accessorKey: 'SKU', header: 'SKU' },
  { accessorKey: 'brand', header: 'Marca' },
]
