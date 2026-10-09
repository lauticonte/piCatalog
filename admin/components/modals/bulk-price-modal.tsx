'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { Modal } from '../modal'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { cn, formatter } from '@/lib/utils'
import {
  applyPriceChange,
  BulkPriceChange,
  BulkPriceMode,
  BulkPriceRounding,
  ManualPrice,
  parsePrecio,
  precioManualValido,
  ROUNDING_OPTIONS,
  validatePriceChange,
} from '@/lib/bulk-price'

export interface BulkPriceProduct {
  id: string
  name: string
  priceValue: number
}

/** Lo que se envía al confirmar: una fórmula para todos o un precio por producto. */
export type BulkPricePayload = BulkPriceChange | { prices: ManualPrice[] }

interface IBulkPriceModal {
  isOpen: boolean
  onClose: () => void
  onConfirm: (payload: BulkPricePayload) => Promise<void>
  products: BulkPriceProduct[]
}

type Modo = BulkPriceMode | 'manual'

const MODOS: Array<{ value: Modo; label: string }> = [
  { value: 'increase', label: 'Aumentar %' },
  { value: 'decrease', label: 'Bajar %' },
  { value: 'set', label: 'Precio fijo' },
  { value: 'manual', label: 'Uno por uno' },
]

const etiquetaRedondeo = (rounding: BulkPriceRounding) =>
  rounding === 0 ? 'Sin redondeo' : `Al ${formatter.format(rounding)} más cercano`

const plural = (n: number, singular: string, varios: string) => `${n} ${n === 1 ? singular : varios}`

function BulkPriceModal({ isOpen, onClose, onConfirm, products }: IBulkPriceModal) {
  const [mode, setMode] = useState<Modo>('increase')
  const [value, setValue] = useState('')
  const [rounding, setRounding] = useState<BulkPriceRounding>(0)
  /** Modo "Uno por uno": el texto de cada campo, por id de producto. */
  const [manual, setManual] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  // Cada apertura arranca limpia: un porcentaje de la vez anterior aplicado sin mirar es
  // justo el error que este modal tiene que evitar.
  useEffect(() => {
    if (isOpen) {
      setMode('increase')
      setValue('')
      setRounding(0)
      setManual(Object.fromEntries(products.map(product => [product.id, String(product.priceValue)])))
    }
  }, [isOpen, products])

  const esManual = mode === 'manual'

  // Modo fórmula: el mismo cálculo que hace la API, para cada producto.
  // El precio fijo se escribe en formato argentino ("150.000"); el porcentaje admite
  // decimales con punto o coma ("7.5" o "7,5").
  const valorNumerico = mode === 'set' ? parsePrecio(value) : Number(value.replace(',', '.'))
  const change: BulkPriceChange | null = esManual ? null : { mode, value: valorNumerico, rounding }
  const errorFormula = change && value !== '' ? validatePriceChange(change) : null
  const formulaLista = !!change && value !== '' && !errorFormula

  const nuevos = useMemo(() => {
    if (esManual) return products.map(product => parsePrecio(manual[product.id] ?? ''))
    if (!formulaLista || !change) return products.map(() => null)
    return products.map(product => applyPriceChange(product.priceValue, change))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, esManual, manual, formulaLista, mode, value, rounding])

  // Modo manual: solo viajan los que cambiaron, y todos tienen que ser precios válidos.
  const cambiosManuales: ManualPrice[] = esManual
    ? products.flatMap((product, i) => {
        const precio = nuevos[i] as number
        return precioManualValido(precio) && precio !== product.priceValue ? [{ id: product.id, price: precio }] : []
      })
    : []
  const invalidosManuales = esManual ? products.filter((_, i) => !precioManualValido(nuevos[i])).length : 0

  const algunoEnCero = !esManual && nuevos.some(nuevo => nuevo !== null && nuevo <= 0)

  const cantidadAGuardar = esManual ? cambiosManuales.length : products.length
  const puedeGuardar = esManual ? cambiosManuales.length > 0 && invalidosManuales === 0 : formulaLista && !algunoEnCero

  const handleConfirm = async () => {
    if (!puedeGuardar) return
    try {
      setSaving(true)
      await onConfirm(esManual ? { prices: cambiosManuales } : (change as BulkPriceChange))
    } finally {
      setSaving(false)
    }
  }

  const n = products.length

  return (
    <Modal
      title={`Editar precio de ${plural(n, 'producto', 'productos')}`}
      description='Revisá los precios antes de confirmar: el cambio se ve en la tienda apenas se guarda.'
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className='space-y-4'>
        <div className='grid grid-cols-2 gap-1 rounded-lg bg-slate-100 p-1 sm:grid-cols-4' role='radiogroup' aria-label='Tipo de cambio'>
          {MODOS.map(modo => (
            <button
              key={modo.value}
              type='button'
              role='radio'
              aria-checked={mode === modo.value}
              disabled={saving}
              onClick={() => setMode(modo.value)}
              className={cn(
                'rounded-md px-2 py-1.5 text-sm font-medium transition-colors',
                mode === modo.value ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
              )}
            >
              {modo.label}
            </button>
          ))}
        </div>

        {!esManual && (
          <div className='grid grid-cols-2 gap-3'>
            <div className='space-y-2'>
              <Label htmlFor='bulk-price-value'>{mode === 'set' ? 'Precio nuevo' : 'Porcentaje'}</Label>
              <div className='relative'>
                <span className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400'>
                  {mode === 'set' ? '$' : '%'}
                </span>
                <Input
                  id='bulk-price-value'
                  inputMode='decimal'
                  autoFocus
                  value={value}
                  onChange={event => setValue(event.target.value.replace(/[^\d.,]/g, ''))}
                  placeholder={mode === 'set' ? '150000' : '10'}
                  disabled={saving}
                  className='pl-7'
                />
              </div>
            </div>
            <div className='space-y-2'>
              <Label>Redondeo</Label>
              <Select value={String(rounding)} onValueChange={v => setRounding(Number(v) as BulkPriceRounding)} disabled={saving}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROUNDING_OPTIONS.map(option => (
                    <SelectItem key={option} value={String(option)}>
                      {etiquetaRedondeo(option)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {esManual && <p className='text-sm text-slate-500'>Cambiá los precios que quieras. Solo se guardan los que modifiques.</p>}

        {errorFormula && <p className='text-sm text-red-600'>{errorFormula}</p>}
        {algunoEnCero && <p className='text-sm text-red-600'>Algún precio quedaría en $0 o menos. Revisá el valor.</p>}
        {invalidosManuales > 0 && (
          <p className='text-sm text-red-600'>
            {plural(invalidosManuales, 'precio no es válido', 'precios no son válidos')}: tienen que ser números mayores a cero.
          </p>
        )}

        <div className='rounded-lg border'>
          <div className='flex items-center justify-between border-b bg-slate-50 px-3 py-2 text-xs font-medium text-slate-500'>
            <span>Producto</span>
            <span>{esManual ? 'Precio' : 'Actual → Nuevo'}</span>
          </div>
          <ul className='max-h-72 divide-y overflow-y-auto'>
            {products.map((product, i) => {
              const nuevo = nuevos[i]
              const cambiado = esManual && precioManualValido(nuevo) && nuevo !== product.priceValue
              const invalido = esManual && !precioManualValido(nuevo)
              return (
                <li key={product.id} className='flex items-center justify-between gap-3 px-3 py-2 text-sm'>
                  <span className='min-w-0'>
                    <span className='block truncate text-slate-700' title={product.name}>
                      {product.name}
                    </span>
                    {cambiado && (
                      <span className='block text-xs tabular-nums text-slate-400'>
                        Antes {formatter.format(product.priceValue)}
                      </span>
                    )}
                  </span>
                  {esManual ? (
                    <div className='relative w-36 shrink-0'>
                      <span className='pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-slate-400'>$</span>
                      <Input
                        inputMode='decimal'
                        aria-label={`Precio de ${product.name}`}
                        value={manual[product.id] ?? ''}
                        onChange={event =>
                          setManual(prev => ({ ...prev, [product.id]: event.target.value.replace(/[^\d.,]/g, '') }))
                        }
                        disabled={saving}
                        className={cn(
                          'h-9 pl-6 text-right tabular-nums',
                          cambiado && 'border-amber-400 bg-amber-50',
                          invalido && 'border-red-500 bg-red-50'
                        )}
                      />
                    </div>
                  ) : (
                    <span className='shrink-0 tabular-nums'>
                      <span className={cn(nuevo !== null ? 'text-slate-400 line-through' : 'text-slate-900')}>
                        {formatter.format(product.priceValue)}
                      </span>
                      {nuevo !== null && (
                        <span className={cn('ml-2 font-semibold', nuevo <= 0 ? 'text-red-600' : 'text-slate-900')}>
                          {formatter.format(nuevo)}
                        </span>
                      )}
                    </span>
                  )}
                </li>
              )
            })}
          </ul>
        </div>

        <div className='flex w-full items-center justify-end space-x-2 pt-2'>
          <Button disabled={saving} variant='outline' onClick={onClose}>
            Cancelar
          </Button>
          <Button disabled={saving || !puedeGuardar} onClick={handleConfirm}>
            {saving
              ? 'Guardando...'
              : esManual && cantidadAGuardar === 0
                ? 'Sin cambios'
                : `Actualizar ${plural(cantidadAGuardar, 'precio', 'precios')}`}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default BulkPriceModal
