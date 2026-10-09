'use client'

import { ColumnDef } from '@tanstack/react-table'
import CellAction from './cell-action'
import { Checkbox } from '@/components/ui/checkbox'
import Image from 'next/image'
import { AiFillStar } from 'react-icons/ai'
import { LuImageOff } from 'react-icons/lu'
import { cn } from '@/lib/utils'

export type ProductColumn = {
  id: string
  image: string | null
  name: string
  price: string
  /** El precio sin formatear: lo usa la vista previa del cambio masivo de precios. */
  priceValue: number
  /** Fecha de alta en milisegundos, para ordenar (la de `createdAt` ya viene formateada). */
  createdAtValue: number
  category: string
  brand: string
  SKU: string
  createdAt: string
  isFeatured: boolean
  isArchived: boolean
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
    meta: { sortable: true },
    cell: ({ row }) => (
      <div className='flex items-center gap-3'>
        <div
          className={cn(
            'relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-white ring-1 ring-slate-200',
            row.original.isArchived && 'opacity-50 grayscale'
          )}
        >
          {row.original.image ? (
            <Image src={row.original.image} alt='' fill sizes='44px' className='object-contain p-0.5' />
          ) : (
            <div className='flex h-full w-full items-center justify-center bg-slate-50 text-slate-300' title='Sin imagen'>
              <LuImageOff className='h-4 w-4' />
            </div>
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
            {row.original.isArchived && (
              <span className='shrink-0 rounded-md bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium text-slate-500'>Archivado</span>
            )}
          </div>
          <div className='truncate text-xs text-slate-500'>{row.original.brand}</div>
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
        {/* Solo los destacados llevan estrella: una vacía en cada fila era ruido. */}
        {row.original.isFeatured && <AiFillStar className='h-[18px] w-[18px] text-[#f5b301]' aria-label='Destacado' />}
      </div>
    ),
  },
  {
    accessorKey: 'price',
    header: 'Precio',
    meta: { width: 150, hideOnMobile: true, align: 'right', sortable: true, sortValue: (row: ProductColumn) => row.priceValue },
    // "$" fijo a la izquierda y la cifra a la derecha, como en una planilla: con el "$"
    // pegado al número se corría de lugar según el largo del precio.
    cell: ({ row }) => (
      <div className='flex items-baseline justify-between gap-2 font-semibold tabular-nums text-slate-900'>
        <span className='text-slate-400'>$</span>
        <span>{row.original.price.replace(/^\$\s*/, '')}</span>
      </div>
    ),
  },
  {
    accessorKey: 'category',
    header: 'Categoría',
    meta: { width: 180, hideOnMobile: true },
    cell: ({ row }) => (
      <span className='inline-block max-w-full truncate rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700'>
        {row.original.category}
      </span>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Fecha',
    meta: { width: 120, hideOnMobile: true, sortable: true, sortValue: (row: ProductColumn) => row.createdAtValue },
    cell: ({ row }) => <span className='whitespace-nowrap text-xs tabular-nums text-slate-500'>{row.original.createdAt}</span>,
  },
  {
    accessorKey: 'SKU',
    header: 'SKU',
    meta: { width: 140, hideOnMobile: true },
    cell: ({ row }) =>
      row.original.SKU.trim() ? (
        <span className='font-mono text-xs text-slate-600'>{row.original.SKU}</span>
      ) : (
        <span className='text-xs font-medium text-amber-700'>Sin código</span>
      ),
  },
  {
    id: 'actions',
    meta: { width: 56 },
    cell: ({ row }) => <CellAction data={row.original} />,
  },
]
