'use client'

import { formatter } from '@/utils/utils'
import React from 'react'

interface ICurrency {
  value?: string | number
}

function Currency({ value }: ICurrency) {
  if (!value) return <div className='font-semibold'>-</div>

  // Divide el valor por 50 para evitar las centenas
  const raise = Math.round(Number(value) * 1.3);
  const newValue = Math.round(Number(raise) / 50) * 50;
  return <div className='font-semibold'>{formatter.format(Number(newValue))}.-</div>
}

export default Currency
