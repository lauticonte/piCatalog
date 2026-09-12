'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'

export type ComboProductColumn = {
  id: string
  name: string
  SKU: string
  price: string
  category: string
  brand: string
}

export const productColumns: ColumnDef<ComboProductColumn>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Seleccionar todos los productos de la página'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={value => row.toggleSelected(!!value)}
        aria-label='Seleccionar producto'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: 'Producto',
  },
  {
    accessorKey: 'SKU',
    header: 'SKU',
  },
  {
    accessorKey: 'price',
    header: 'Precio',
  },
  {
    accessorKey: 'category',
    header: 'Categoría',
  },
  {
    accessorKey: 'brand',
    header: 'Marca',
  },
]
