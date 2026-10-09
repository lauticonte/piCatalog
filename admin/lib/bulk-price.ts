/**
 * Cálculo del cambio masivo de precios. Lo usan la vista previa del modal y la API, así
 * lo que se ve antes de confirmar es exactamente lo que se guarda.
 */

export type BulkPriceMode = 'increase' | 'decrease' | 'set'

/** Redondeo al múltiplo más cercano; 0 = sin redondeo. */
export const ROUNDING_OPTIONS = [0, 10, 100, 1000] as const
export type BulkPriceRounding = (typeof ROUNDING_OPTIONS)[number]

export interface BulkPriceChange {
  mode: BulkPriceMode
  /** Porcentaje (increase / decrease) o precio final (set). */
  value: number
  rounding: BulkPriceRounding
}

export const applyPriceChange = (price: number, { mode, value, rounding }: BulkPriceChange) => {
  const raw = mode === 'set' ? value : mode === 'increase' ? price * (1 + value / 100) : price * (1 - value / 100)
  return rounding > 0 ? Math.round(raw / rounding) * rounding : Math.round(raw)
}

/**
 * null si el cambio es válido; si no, el motivo para mostrar. Recibe datos sin tipar
 * porque también valida el cuerpo crudo que llega a la API.
 */
export const validatePriceChange = (change: { mode?: unknown; value?: unknown; rounding?: unknown }): string | null => {
  const { mode, value, rounding } = change
  if (mode !== 'increase' && mode !== 'decrease' && mode !== 'set') return 'Elegí qué cambio aplicar'
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
    return mode === 'set' ? 'Ingresá un precio mayor a cero' : 'Ingresá un porcentaje mayor a cero'
  }
  if (mode === 'decrease' && value >= 100) return 'No se puede bajar 100% o más'
  if (mode === 'increase' && value > 1000) return 'El aumento no puede superar el 1000%'
  if (!ROUNDING_OPTIONS.includes(rounding as BulkPriceRounding)) return 'Redondeo inválido'
  return null
}

/** Precio cargado a mano para un producto, en el modo "Uno por uno". */
export interface ManualPrice {
  id: string
  price: number
}

/**
 * Interpreta un precio escrito a mano en formato argentino: el punto separa miles y la
 * coma los decimales ("1.361.100" o "1361100,50"). NaN si no es un número.
 */
export const parsePrecio = (texto: string) => {
  const limpio = texto.trim().replace(/\s|\$/g, '').replace(/\./g, '').replace(',', '.')
  return limpio === '' ? NaN : Number(limpio)
}

export const precioManualValido = (price: unknown): price is number =>
  typeof price === 'number' && Number.isFinite(price) && price > 0
