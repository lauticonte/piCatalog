'use client'

import React, { useEffect, useState } from 'react'
import { Modal } from '../modal'
import { Button } from '../ui/button'

interface IConfirmModal {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  loading: boolean
  title?: string
  description?: string
  /** Nombres de los elementos a eliminar, para que se vea qué se está por borrar. */
  items?: string[]
}

// Se muestran unos pocos y el resto se resume, para que el modal no crezca sin control.
const MAX_VISIBLE_ITEMS = 8

function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  loading,
  title = '¿Estás seguro?',
  description = 'Esta acción no se puede deshacer.',
  items,
}: IConfirmModal) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  const visibleItems = items?.slice(0, MAX_VISIBLE_ITEMS)
  const hiddenCount = items ? items.length - (visibleItems?.length ?? 0) : 0

  return (
    <Modal title={title} description={description} isOpen={isOpen} onClose={onClose}>
      {visibleItems && visibleItems.length > 0 && (
        <div className='w-full min-w-0 max-h-48 overflow-y-auto rounded-md border bg-muted/40 p-3'>
          <ul className='space-y-1 text-sm'>
            {visibleItems.map((item, index) => (
              <li key={`${item}-${index}`} className='flex gap-2'>
                <span aria-hidden>•</span>
                <span className='min-w-0 truncate'>{item}</span>
              </li>
            ))}
          </ul>
          {hiddenCount > 0 && <p className='pt-2 text-sm text-muted-foreground'>y {hiddenCount} más...</p>}
        </div>
      )}
      <div className='pt-6 space-x-2 flex items-center justify-end w-full'>
        <Button disabled={loading} variant='outline' onClick={onClose}>
          Cancelar
        </Button>
        <Button disabled={loading} variant='destructive' onClick={onConfirm}>
          {loading ? 'Eliminando...' : 'Eliminar'}
        </Button>
      </div>
    </Modal>
  )
}

export default ConfirmModal
