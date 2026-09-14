'use client'

import { ColumnDef } from '@tanstack/react-table'
import CellAction from './cell-action'
import { Checkbox } from '@/components/ui/checkbox'
import Image from 'next/image'
import { AiFillStar, AiOutlineStar } from 'react-icons/ai'

export type ProductColumn = {
  id: string
  image: string | null
  name: string
  price: string
  category: string
  brand: string
  SKU: string
  createdAt: string
  isFeatured: boolean
}

export const columns: ColumnDef<ProductColumn>[] = [
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
    meta: { width: 44 },
  },
  {
    accessorKey: 'name',
    header: 'Producto',
    cell: ({ row }) => (
      <div className='flex items-center gap-3'>
        <div className='relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-slate-50 ring-1 ring-slate-200'>
          {row.original.image ? (
            <Image src={row.original.image} alt='' fill sizes='44px' className='object-contain p-0.5' />
          ) : (
            <div className='flex h-full w-full items-center justify-center text-[10px] text-slate-300'>—</div>
          )}
        </div>
        {/* En mobile el ancho se limita al viewport: sin tope, el truncate estiraba la tabla. */}
        <div className='min-w-0 max-w-[44vw] md:max-w-none'>
          {/* Una sola línea: los nombres de dos renglones rompían el ritmo de la tabla. */}
          <div className='flex items-center gap-1.5'>
            {/* En mobile la columna "Dest." se oculta: la estrella acompaña al nombre. */}
            {row.original.isFeatured && (
              <AiFillStar className='h-3.5 w-3.5 shrink-0 text-amber-400 md:hidden' aria-label='Destacado' />
            )}
            <span className='truncate font-medium text-slate-900' title={row.original.name}>
              {row.original.name}
            </span>
          </div>
          <div className='truncate text-xs text-slate-400'>{row.original.brand}</div>
          {/* Precio y SKU: sus columnas se ocultan en mobile, así que se repiten acá. */}
          <div className='mt-0.5 flex items-center gap-2 md:hidden'>
            <span className='text-xs font-semibold tabular-nums text-slate-900'>{row.original.price}</span>
            <span className='truncate font-mono text-[11px] text-slate-400'>{row.original.SKU}</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'isFeatured',
    header: () => <div className='text-center'>Dest.</div>,
    meta: { width: 70, hideOnMobile: true },
    // Estrella: es el símbolo que se asocia con "destacado"; el punto verde se leía
    // como un estado (activo, publicado) y no como lo que es.
    cell: ({ row }) => (
      <div className='flex justify-center' title={row.original.isFeatured ? 'Destacado' : 'No destacado'}>
        {row.original.isFeatured ? (
          <AiFillStar className='h-5 w-5 text-amber-400' aria-label='Destacado' />
        ) : (
          <AiOutlineStar className='h-5 w-5 text-slate-200' aria-label='No destacado' />
        )}
      </div>
    ),
  },
  {
    accessorKey: 'price',
    header: () => <div className='text-right'>Precio</div>,
    meta: { width: 130, hideOnMobile: true },
    cell: ({ row }) => (
      <div className='text-right font-semibold tabular-nums text-slate-900'>{row.original.price}</div>
    ),
  },
  {
    accessorKey: 'category',
    header: 'Categoría',
    meta: { width: 180, hideOnMobile: true },
    cell: ({ row }) => (
      <span className='inline-block rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600'>
        {row.original.category}
      </span>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Fecha',
    meta: { width: 110, hideOnMobile: true },
    cell: ({ row }) => <span className='text-xs text-slate-400'>{row.original.createdAt}</span>,
  },
  {
    accessorKey: 'SKU',
    header: 'SKU',
    meta: { width: 140, hideOnMobile: true },
    cell: ({ row }) => (
      <span className='rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-600'>{row.original.SKU}</span>
    ),
  },
  {
    id: 'actions',
    meta: { width: 56 },
    cell: ({ row }) => <CellAction data={row.original} />,
  },
]
