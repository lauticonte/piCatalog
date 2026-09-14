'use client'

import { Button } from './button'
import {
  ColumnDef,
  PaginationState,
  RowSelectionState,
  getFilteredRowModel,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useEffect, useState } from 'react'
import { Input } from './input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'
import ConfirmModal from '@/components/modals/confirm-modal'
import { BiSearch, BiTrash } from 'react-icons/bi'

/** Una acción que opera sobre las filas tildadas. */
export interface BulkAction<TData> {
  label: string
  icon?: React.ReactNode
  variant?: 'default' | 'destructive' | 'outline' | 'secondary'
  /** Si pasa por el modal de confirmación antes de ejecutarse. */
  confirm?: boolean
  confirmTitle?: (rows: TData[]) => string
  onRun: (rows: TData[]) => Promise<void> | void
}

// Ancho opcional declarado en la definición de cada columna.
const colWidth = (def: any) => (def?.meta?.width ? { width: def.meta.width } : undefined)

// Columnas secundarias marcadas con `meta.hideOnMobile`: en un celular no entran todas,
// así que se ocultan y la columna principal muestra ese dato debajo del nombre.
const colVisibility = (def: any) => (def?.meta?.hideOnMobile ? 'hidden md:table-cell' : undefined)

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  /** Columna(s) sobre las que busca el input. Con varias, matchea si coincide cualquiera. */
  searchKey: string | string[]
  searchPlaceholder?: string
  /** Atajo para el caso más común; se normaliza a una entrada más de bulkActions. */
  onDeleteSelected?: (rows: TData[]) => Promise<void> | void
  bulkActions?: BulkAction<TData>[]
  /** Cómo nombrar cada fila en el modal de confirmación de las acciones masivas. */
  getRowLabel?: (row: TData) => string
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = 'Buscar...',
  onDeleteSelected,
  bulkActions,
  getRowLabel,
}: DataTableProps<TData, TValue>) {
  const searchColumns = Array.isArray(searchKey) ? searchKey : [searchKey]
  const [globalFilter, setGlobalFilter] = useState('')
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 })
  const [pendingAction, setPendingAction] = useState<BulkAction<TData> | null>(null)
  const [running, setRunning] = useState(false)

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    // Una fila entra si el término aparece en cualquiera de las columnas buscables.
    globalFilterFn: (row, _columnId, filterValue) => {
      const term = String(filterValue).toLowerCase()
      return searchColumns.some(key => String(row.getValue(key) ?? '').toLowerCase().includes(term))
    },
    // Evita evaluar el filtro una vez por cada columna de la tabla.
    getColumnCanGlobalFilter: column => searchColumns.includes(column.id),
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    // Sin esto la tabla vuelve a la página 1 cada vez que cambia la referencia de `data`
    // (p. ej. después del router.refresh() que dispara un borrado).
    autoResetPageIndex: false,
    // Identifica las filas por id de entidad y no por índice, así la selección
    // sobrevive a un refresh y no se "corre" al reordenarse los datos.
    getRowId: (row: any, index) => row?.id ?? String(index),
    state: {
      globalFilter,
      pagination,
      rowSelection,
    },
  })

  const pageCount = table.getPageCount()

  // Si borrás los últimos items de la última página quedarías parado en una página
  // que ya no existe: retrocedemos a la última válida en vez de mostrar una vacía.
  useEffect(() => {
    if (pageCount > 0 && pagination.pageIndex > pageCount - 1) {
      table.setPageIndex(pageCount - 1)
    }
  }, [pageCount, pagination.pageIndex, table])

  const selectedRows = table.getFilteredSelectedRowModel().rows

  const actions: BulkAction<TData>[] = [
    ...(onDeleteSelected
      ? [
          {
            label: 'Eliminar seleccionados',
            icon: <BiTrash className='mr-2 h-4 w-4' />,
            variant: 'destructive' as const,
            confirm: true,
            confirmTitle: (rows: TData[]) => `¿Eliminar ${rows.length} elemento${rows.length > 1 ? 's' : ''}?`,
            onRun: onDeleteSelected,
          },
        ]
      : []),
    ...(bulkActions ?? []),
  ]

  const runAction = async (action: BulkAction<TData>) => {
    try {
      setRunning(true)
      await action.onRun(selectedRows.map(row => row.original))
      setRowSelection({})
    } finally {
      setRunning(false)
      setPendingAction(null)
    }
  }

  const handleActionClick = (action: BulkAction<TData>) => {
    if (action.confirm) {
      setPendingAction(action)
      return
    }

    runAction(action)
  }

  return (
    <div>
      <ConfirmModal
        loading={running}
        isOpen={Boolean(pendingAction)}
        onClose={() => setPendingAction(null)}
        onConfirm={() => pendingAction && runAction(pendingAction)}
        title={pendingAction?.confirmTitle?.(selectedRows.map(row => row.original)) ?? '¿Estás seguro?'}
        description='Esta acción no se puede deshacer.'
        items={getRowLabel ? selectedRows.map(row => getRowLabel(row.original)) : undefined}
      />
      {/* Buscador, tabla y paginador dentro de una sola tarjeta: antes el buscador
          flotaba suelto arriba y la tabla parecía un bloque aparte. */}
      <div className='overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm'>
      <div className='flex flex-wrap items-center gap-3 border-b border-slate-200 bg-slate-50/60 px-4 py-3'>
        <div className='relative w-full max-w-sm'>
          <BiSearch className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' />
          <Input
            placeholder={searchPlaceholder}
            value={globalFilter}
            onChange={event => {
              setGlobalFilter(event.target.value)
              // Al filtrar el resultado se achica: volvemos al principio para no
              // caer en una página fuera de rango.
              table.setPageIndex(0)
            }}
            className='bg-white pl-9'
          />
        </div>
        {globalFilter && (
          <span className='text-sm text-slate-500'>
            <b className='text-slate-700'>{table.getFilteredRowModel().rows.length}</b> encontrados
          </span>
        )}

        {/* La barra de acciones aparece solo con filas tildadas y se destaca del resto. */}
        {actions.length > 0 && selectedRows.length > 0 && (
          <div className='flex w-full flex-wrap items-center gap-2 rounded-lg border sm:ml-auto sm:w-auto border-emerald-200 bg-emerald-50 px-3 py-1.5'>
            <span className='whitespace-nowrap text-sm font-semibold text-emerald-800'>
              {selectedRows.length} seleccionado{selectedRows.length > 1 ? 's' : ''}
            </span>
            {actions.map(action => (
              <Button
                key={action.label}
                variant={action.variant ?? 'default'}
                size='sm'
                disabled={running}
                onClick={() => handleActionClick(action)}
              >
                {action.icon}
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>
      <div className='overflow-x-auto'>
        <Table>
          <TableHeader className='bg-muted/50'>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id} className='hover:bg-transparent'>
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead
                      key={header.id}
                      // Ancho declarado por columna: sin esto la tabla reparte sola y
                      // deja huecos enormes al lado de las columnas angostas.
                      // Se usa `meta.width` y no `size` porque TanStack le asigna
                      // size: 150 por defecto a todas, lo que limitaría la columna ancha.
                      style={colWidth(header.column.columnDef)}
                      className={colVisibility(header.column.columnDef)}
                    >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'} className='transition-colors'>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id} className={colVisibility(cell.column.columnDef)}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-28 text-center text-sm text-muted-foreground'>
                  No hay resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className='flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-slate-50/60 px-4 py-3'>
        <div className='flex items-center gap-3'>
          <span className='text-sm text-slate-500'>
            Mostrando <b className='text-slate-700'>{table.getRowModel().rows.length}</b> de{' '}
            <b className='text-slate-700'>{table.getFilteredRowModel().rows.length}</b>
          </span>
          {/* Con más de mil productos, 10 por página obliga a paginar demasiado. */}
          <Select
            value={String(pagination.pageSize)}
            onValueChange={value => table.setPageSize(Number(value))}
          >
            <SelectTrigger className='h-8 w-[130px] shrink-0 whitespace-nowrap bg-white text-sm'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[10, 30, 50, 100].map(size => (
                <SelectItem key={size} value={String(size)}>
                  {size} por pág.
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className='flex w-full items-center gap-2 sm:w-auto'>
        <span className='mr-auto text-sm text-slate-500 sm:mr-0'>
          Página {pageCount === 0 ? 0 : pagination.pageIndex + 1} de {pageCount}
        </span>
        <Button variant='outline' size='sm' onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          Anterior
        </Button>
        <Button variant='outline' size='sm' onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Siguiente
        </Button>
        </div>
      </div>
      </div>
    </div>
  )
}
