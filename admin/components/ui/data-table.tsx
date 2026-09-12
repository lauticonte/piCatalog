'use client'

import { Button } from './button'
import {
  ColumnDef,
  ColumnFiltersState,
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

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchKey: string
  onDeleteSelected?: (rows: TData[]) => Promise<void> | void
  /** Cómo nombrar cada fila en el modal de confirmación del borrado múltiple. */
  getRowLabel?: (row: TData) => string
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  onDeleteSelected,
  getRowLabel,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 })
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    // Sin esto la tabla vuelve a la página 1 cada vez que cambia la referencia de `data`
    // (p. ej. después del router.refresh() que dispara un borrado).
    autoResetPageIndex: false,
    // Identifica las filas por id de entidad y no por índice, así la selección
    // sobrevive a un refresh y no se "corre" al reordenarse los datos.
    getRowId: (row: any, index) => row?.id ?? String(index),
    state: {
      columnFilters,
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

  const handleDeleteSelected = async () => {
    if (!onDeleteSelected) return

    try {
      setDeleting(true)
      await onDeleteSelected(selectedRows.map(row => row.original))
      setRowSelection({})
    } finally {
      setDeleting(false)
      setConfirmOpen(false)
    }
  }

  return (
    <div>
      <ConfirmModal
        loading={deleting}
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDeleteSelected}
        title={`¿Eliminar ${selectedRows.length} elemento${selectedRows.length > 1 ? 's' : ''}?`}
        description='Esta acción no se puede deshacer.'
        items={getRowLabel ? selectedRows.map(row => getRowLabel(row.original)) : undefined}
      />
      <div className='flex items-center gap-2 py-4'>
        <Input
          placeholder='Buscar...'
          value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ''}
          onChange={event => {
            table.getColumn(searchKey)?.setFilterValue(event.target.value)
            // Al filtrar el resultado se achica: volvemos al principio para no
            // caer en una página fuera de rango.
            table.setPageIndex(0)
          }}
          className='max-w-sm'
        />
        {onDeleteSelected && selectedRows.length > 0 && (
          <>
            <span className='text-sm text-muted-foreground whitespace-nowrap'>
              {selectedRows.length} seleccionado{selectedRows.length > 1 ? 's' : ''}
            </span>
            <Button variant='destructive' size='sm' disabled={deleting} onClick={() => setConfirmOpen(true)}>
              <BiTrash className='mr-2 h-4 w-4' />
              Eliminar seleccionados
            </Button>
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
