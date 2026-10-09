'use client'

import { Button } from './button'
import {
  ColumnDef,
  PaginationState,
  RowSelectionState,
  SortingState,
  getFilteredRowModel,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useEffect, useMemo, useState } from 'react'
import { Input } from './input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'
import ConfirmModal from '@/components/modals/confirm-modal'
import { BiSearch, BiTrash } from 'react-icons/bi'
import { LuArrowDown, LuArrowUp, LuChevronLeft, LuChevronRight, LuChevronsUpDown, LuSearchX, LuX } from 'react-icons/lu'
import { cn } from '@/lib/utils'

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
// Se aplica desde md: en mobile los anchos fijos sumados superaban la pantalla.
const colWidth = (def: any) =>
  def?.meta?.width ? ({ '--col-w': `${def.meta.width}px` } as React.CSSProperties) : undefined

// Columnas secundarias marcadas con `meta.hideOnMobile`: en un celular no entran todas,
// así que se ocultan y la columna principal muestra ese dato debajo del nombre.
// `meta.align: 'right'` alinea encabezado y celdas (precios y números).
const colVisibility = (def: any) =>
  [
    def?.meta?.width && 'md:w-[var(--col-w)]',
    def?.meta?.hideOnMobile && 'hidden md:table-cell',
    // pr-8: aire entre la cifra y la columna siguiente, igual en encabezado y celdas.
    def?.meta?.align === 'right' && 'text-right md:pr-8',
  ]
    .filter(Boolean)
    .join(' ') || undefined

/**
 * Orden por columna. Una columna se ordena solo si declara `meta.sortable`; con
 * `meta.sortValue` ordena por ese valor (el precio o la fecha sin formatear) y no por el
 * texto que se muestra, que en "$ 1.047.000" o "08/10/2026" daría un orden equivocado.
 */
const conOrden = <TData, TValue>(columns: ColumnDef<TData, TValue>[]) =>
  columns.map(column => {
    const meta = (column as any).meta
    if (!meta?.sortable) return { ...column, enableSorting: false }
    if (!meta.sortValue) return column
    return {
      ...column,
      sortingFn: (a: any, b: any) => {
        const x = meta.sortValue(a.original)
        const y = meta.sortValue(b.original)
        return typeof x === 'string' ? x.localeCompare(y, 'es', { sensitivity: 'base' }) : x - y
      },
    }
  })

/** Números de página a mostrar: siempre la primera y la última, y las vecinas a la actual. */
const paginasVisibles = (actual: number, total: number): Array<number | '…'> => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i)
  const vecinas = [actual - 1, actual, actual + 1].filter(p => p > 0 && p < total - 1)
  const paginas: Array<number | '…'> = [0]
  if (vecinas[0] > 1) paginas.push('…')
  paginas.push(...vecinas)
  if (vecinas[vecinas.length - 1] < total - 2) paginas.push('…')
  paginas.push(total - 1)
  return paginas
}

/** Filtro rápido sobre la tabla: un botón con su cantidad arriba de las filas. */
export interface QuickFilter<TData> {
  id: string
  label: string
  predicate: (row: TData) => boolean
}

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
  /** Filtros rápidos; "Todos" se agrega solo. */
  quickFilters?: QuickFilter<TData>[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = 'Buscar...',
  onDeleteSelected,
  bulkActions,
  getRowLabel,
  quickFilters,
}: DataTableProps<TData, TValue>) {
  const [filtroRapido, setFiltroRapido] = useState<string | null>(null)
  const filtroActivo = quickFilters?.find(filtro => filtro.id === filtroRapido)
  const filas = useMemo(() => (filtroActivo ? data.filter(filtroActivo.predicate) : data), [data, filtroActivo])
  const conteos = useMemo(
    () => Object.fromEntries((quickFilters ?? []).map(filtro => [filtro.id, data.filter(filtro.predicate).length])),
    [data, quickFilters]
  )
  const searchColumns = Array.isArray(searchKey) ? searchKey : [searchKey]
  const [globalFilter, setGlobalFilter] = useState('')
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 })
  const [sorting, setSorting] = useState<SortingState>([])
  const columnasConOrden = useMemo(() => conOrden(columns), [columns])
  const [pendingAction, setPendingAction] = useState<BulkAction<TData> | null>(null)
  const [running, setRunning] = useState(false)

  const table = useReactTable({
    data: filas,
    columns: columnasConOrden,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
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
      sorting,
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
  const totalFiltrado = table.getFilteredRowModel().rows.length

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
            className='h-9 bg-white pl-9 pr-9'
          />
          {globalFilter && (
            <button
              type='button'
              onClick={() => setGlobalFilter('')}
              aria-label='Borrar búsqueda'
              className='absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded text-slate-400 hover:bg-slate-100 hover:text-slate-700'
            >
              <LuX className='h-3.5 w-3.5' />
            </button>
          )}
        </div>
        <span className='text-sm tabular-nums text-slate-500'>
          {totalFiltrado === filas.length && !filtroActivo ? (
            <>{data.length} en total</>
          ) : (
            <>
              <b className='font-semibold text-slate-800'>{totalFiltrado}</b> de {data.length}
            </>
          )}
        </span>

        {/* La barra de acciones aparece solo con filas tildadas y se destaca del resto. */}
        {actions.length > 0 && selectedRows.length > 0 && (
          <div className='flex w-full flex-wrap items-center gap-2 rounded-lg bg-[#151a20] px-3 py-1.5 sm:ml-auto sm:w-auto'>
            <span className='whitespace-nowrap pr-1 text-sm font-semibold text-white'>
              {selectedRows.length} seleccionado{selectedRows.length > 1 ? 's' : ''}
            </span>
            {actions.map(action => (
              <Button
                key={action.label}
                variant={action.variant ?? 'default'}
                size='sm'
                disabled={running}
                onClick={() => handleActionClick(action)}
                // Sobre la barra oscura, botones bloque de color uno al lado del otro pesaban
                // demasiado: van translúcidos y solo el borrado conserva el rojo, en el texto.
                className={cn(
                  'shadow-none',
                  action.variant === 'destructive'
                    ? 'bg-transparent text-red-300 hover:bg-red-500/15 hover:text-red-200'
                    : 'bg-white/10 text-white hover:bg-white/20'
                )}
              >
                {action.icon}
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>
      {quickFilters?.length ? (
        <div className='flex gap-1.5 overflow-x-auto border-b border-slate-200 px-4 py-2.5' role='group' aria-label='Filtros rápidos'>
          {[{ id: null as string | null, label: 'Todos', count: data.length }, ...quickFilters.map(f => ({ id: f.id as string | null, label: f.label, count: conteos[f.id] }))].map(
            chip => {
              const activo = filtroRapido === chip.id
              return (
                <button
                  key={chip.id ?? 'todos'}
                  type='button'
                  aria-pressed={activo}
                  onClick={() => {
                    setFiltroRapido(chip.id)
                    table.setPageIndex(0)
                  }}
                  disabled={chip.id !== null && chip.count === 0}
                  className={cn(
                    'inline-flex shrink-0 items-center gap-1.5 rounded-md border px-2.5 py-1 text-sm font-medium transition-colors disabled:cursor-default disabled:opacity-40',
                    activo
                      ? 'border-[#151a20] bg-[#151a20] text-white'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900'
                  )}
                >
                  {chip.label}
                  <span className={cn('text-xs tabular-nums', activo ? 'text-[#f5b301]' : 'text-slate-400')}>{chip.count}</span>
                </button>
              )
            }
          )}
        </div>
      ) : null}
      <div className='overflow-x-auto'>
        <Table>
          <TableHeader>
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
                      {header.isPlaceholder ? null : header.column.getCanSort() ? (
                        <button
                          type='button'
                          onClick={header.column.getToggleSortingHandler()}
                          className={cn(
                            'inline-flex items-center gap-1 rounded py-0.5 transition-colors hover:bg-slate-200/60 hover:text-slate-900',
                            // En columnas alineadas a la derecha la flecha va a la izquierda del
                            // título, así el texto termina justo donde terminan las cifras.
                            (header.column.columnDef.meta as any)?.align === 'right'
                              ? '-mr-1 flex-row-reverse pl-1 pr-1'
                              : '-ml-1 px-1',
                            header.column.getIsSorted() && 'text-slate-900'
                          )}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {header.column.getIsSorted() === 'asc' ? (
                            <LuArrowUp className='h-3.5 w-3.5' aria-label='orden ascendente' />
                          ) : header.column.getIsSorted() === 'desc' ? (
                            <LuArrowDown className='h-3.5 w-3.5' aria-label='orden descendente' />
                          ) : (
                            <LuChevronsUpDown className='h-3.5 w-3.5 text-slate-400' aria-hidden />
                          )}
                        </button>
                      ) : (
                        flexRender(header.column.columnDef.header, header.getContext())
                      )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'} className='group transition-colors'>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id} className={colVisibility(cell.column.columnDef)}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className='hover:bg-transparent'>
                <TableCell colSpan={columns.length} className='py-14'>
                  <div className='flex flex-col items-center gap-2 text-center'>
                    <span className='flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500'>
                      <LuSearchX className='h-5 w-5' />
                    </span>
                    <p className='font-semibold text-slate-900'>{globalFilter ? 'Sin resultados' : 'Todavía no hay nada cargado'}</p>
                    {globalFilter && (
                      <>
                        <p className='text-sm text-slate-500'>No encontramos nada para “{globalFilter}”.</p>
                        <Button variant='outline' size='sm' className='mt-1' onClick={() => setGlobalFilter('')}>
                          Limpiar búsqueda
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className='flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-4 py-3'>
        <div className='flex items-center gap-3 text-sm text-slate-500'>
          <span className='tabular-nums'>
            {totalFiltrado === 0 ? (
              '0 resultados'
            ) : (
              <>
                <b className='font-semibold text-slate-800'>
                  {pagination.pageIndex * pagination.pageSize + 1}–
                  {Math.min((pagination.pageIndex + 1) * pagination.pageSize, totalFiltrado)}
                </b>{' '}
                de {totalFiltrado}
              </>
            )}
          </span>
          {/* Con más de mil productos, 10 por página obliga a paginar demasiado. */}
          <Select value={String(pagination.pageSize)} onValueChange={value => table.setPageSize(Number(value))}>
            <SelectTrigger className='h-8 w-[120px] shrink-0 whitespace-nowrap bg-white text-sm' aria-label='Filas por página'>
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
        {pageCount > 1 && (
          <nav className='flex items-center gap-1' aria-label='Paginación'>
            <Button
              variant='ghost'
              size='icon'
              className='h-8 w-8'
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              aria-label='Página anterior'
            >
              <LuChevronLeft className='h-4 w-4' />
            </Button>
            {paginasVisibles(pagination.pageIndex, pageCount).map((pagina, i) =>
              pagina === '…' ? (
                <span key={`gap-${i}`} className='w-6 text-center text-sm text-slate-400'>
                  …
                </span>
              ) : (
                <button
                  key={pagina}
                  type='button'
                  onClick={() => table.setPageIndex(pagina)}
                  aria-current={pagina === pagination.pageIndex ? 'page' : undefined}
                  className={cn(
                    'h-8 min-w-[2rem] rounded-md px-2 text-sm font-semibold tabular-nums transition-colors',
                    pagina === pagination.pageIndex ? 'bg-[#151a20] text-white' : 'text-slate-600 hover:bg-slate-100'
                  )}
                >
                  {pagina + 1}
                </button>
              )
            )}
            <Button
              variant='ghost'
              size='icon'
              className='h-8 w-8'
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              aria-label='Página siguiente'
            >
              <LuChevronRight className='h-4 w-4' />
            </Button>
          </nav>
        )}
      </div>
      </div>
    </div>
  )
}
