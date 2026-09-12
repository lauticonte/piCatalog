'use client'

import React, { useEffect, useState } from 'react'
import { Modal } from '../modal'
import { Button } from '../ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import axios from 'axios'
import { useParams } from 'next/navigation'
import { toast } from 'react-hot-toast'

interface ComboOption {
  id: string
  name: string
}

interface IAddToComboModal {
  isOpen: boolean
  onClose: () => void
  onConfirm: (comboId: string) => Promise<void>
  productCount: number
}

function AddToComboModal({ isOpen, onClose, onConfirm, productCount }: IAddToComboModal) {
  const params = useParams()
  const [combos, setCombos] = useState<ComboOption[]>([])
  const [comboId, setComboId] = useState('')
  const [fetching, setFetching] = useState(false)
  const [saving, setSaving] = useState(false)

  // Los combos se cargan al abrir: /products no tiene por qué conocerlos antes.
  useEffect(() => {
    if (!isOpen) return

    const loadCombos = async () => {
      try {
        setFetching(true)
        const response = await axios.get(`/api/${params.storeId}/combos`)
        setCombos(response.data)
      } catch (error) {
        toast.error('No se pudieron cargar los combos')
      } finally {
        setFetching(false)
      }
    }

    loadCombos()
  }, [isOpen, params.storeId])

  const handleConfirm = async () => {
    if (!comboId) return

    try {
      setSaving(true)
      await onConfirm(comboId)
      setComboId('')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      title={`Agregar ${productCount} producto${productCount > 1 ? 's' : ''} a un combo`}
      description='Elegí el combo de destino. Los productos que ya estén dentro se ignoran.'
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className='space-y-4'>
        {fetching ? (
          <p className='text-sm text-muted-foreground'>Cargando combos...</p>
        ) : combos.length === 0 ? (
          <p className='text-sm text-muted-foreground'>
            Todavía no hay combos creados. Creá uno desde la sección Combos y volvé.
          </p>
        ) : (
          <Select value={comboId} onValueChange={setComboId} disabled={saving}>
            <SelectTrigger>
              <SelectValue placeholder='Elegí un combo' />
            </SelectTrigger>
            <SelectContent style={{ maxHeight: '250px', overflowY: 'auto' }}>
              {combos.map(combo => (
                <SelectItem key={combo.id} value={combo.id}>
                  {combo.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <div className='pt-2 space-x-2 flex items-center justify-end w-full'>
          <Button disabled={saving} variant='outline' onClick={onClose}>
            Cancelar
          </Button>
          <Button disabled={saving || !comboId} onClick={handleConfirm}>
            {saving ? 'Agregando...' : 'Agregar al combo'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default AddToComboModal
