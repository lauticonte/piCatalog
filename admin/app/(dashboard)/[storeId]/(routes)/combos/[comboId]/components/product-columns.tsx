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
    // SKU, categoría y marca se ocultan en mobile: se muestran bajo el nombre.
    cell: ({ row }) => (
      <div>
        {row.original.name}
        <div className='mt-0.5 text-[11px] font-normal text-slate-400 md:hidden'>
          {row.original.SKU} · {row.original.price}
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'SKU',
    header: 'SKU',
    meta: { hideOnMobile: true },
  },
  {
    accessorKey: 'price',
    header: 'Precio',
    meta: { hideOnMobile: true },
  },
  {
    accessorKey: 'category',
    header: 'Categoría',
    meta: { hideOnMobile: true },
  },
  {
    accessorKey: 'brand',
    header: 'Marca',
    meta: { hideOnMobile: true },
  },
]
