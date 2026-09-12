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
import ConfirmModal from '@/components/modals/confirm-modal'
import { BiTrash } from 'react-icons/bi'

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
      <div className='flex items-center gap-2 py-4'>
        <Input
          placeholder={searchPlaceholder}
          value={globalFilter}
          onChange={event => {
            setGlobalFilter(event.target.value)
            // Al filtrar el resultado se achica: volvemos al principio para no
            // caer en una página fuera de rango.
            table.setPageIndex(0)
          }}
          className='max-w-sm'
        />
        {actions.length > 0 && selectedRows.length > 0 && (
          <>
            <span className='text-sm text-muted-foreground whitespace-nowrap'>
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
          </>
        )}
      </div>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead key={header.id}>
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
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-24 text-center'>
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className='flex items-center justify-end space-x-2 py-4'>
        <span className='text-sm text-muted-foreground'>
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
  )
}
