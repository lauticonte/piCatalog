import { formatter } from '@/utils/utils'
import React from 'react'

interface ICurrency {
  value?: string | number
  /** Reemplaza el peso por defecto cuando el contexto necesita otro (la tarjeta usa bold). */
  className?: string
}

function Currency({ value, className = 'font-semibold' }: ICurrency) {
  if (!value) return <span className={className}>-</span>

  // Divide el valor por 50 para evitar las centenas
  const raise = Math.round(Number(value) * 1.3);
  const newValue = Math.round(Number(raise) / 50) * 50;
  // El ".-" se sacó: con el importe ya en pesos y la etiqueta "Precio contado"
  // al lado, no aportaba y confundía a quien no conoce la convención.
  return <span className={className}>{formatter.format(Number(newValue))}</span>
}

export default Currency
