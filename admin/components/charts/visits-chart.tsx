'use client'

import { useMemo } from 'react'
import { areaY, defineChart, lineY } from '@tanstack/charts'
import { crosshair } from '@tanstack/charts/crosshair'
import { scaleLinear } from '@tanstack/charts/scales/linear'
import { scalePoint } from '@tanstack/charts/scales/point'
import { tooltip } from '@tanstack/charts/tooltip'
import { Chart } from '@tanstack/charts/react'
import { CHART_COLOR, CHART_THEME, formatDay, formatNumber } from './chart-theme'

export interface VisitsRow {
  day: string
  visitors: number
  pageviews: number
}

/** Visitantes por día: una sola serie, así que no lleva leyenda (el título la nombra). */
export function VisitsChart({ rows }: { rows: VisitsRow[] }) {
  const definition = useMemo(() => {
    // Con 30 o 90 días no entran todas las fechas: se rotula una de cada N, siempre
    // incluyendo la primera y la última.
    const step = Math.max(1, Math.ceil(rows.length / 8))
    const last = rows.length - 1
    // Si el último rótulo regular queda muy cerca del final, se saca para que no se encimen.
    const tickDays = rows
      .filter((_, i) => i === last || (i % step === 0 && last - i >= step / 2))
      .map(row => row.day)

    return defineChart({
      marks: [
        areaY(rows, { x: 'day', y2: 'visitors', y1: 0, fill: CHART_COLOR, fillOpacity: 0.1 }),
        lineY(rows, { x: 'day', y: 'visitors', stroke: CHART_COLOR, strokeWidth: 2 }),
        crosshair({ x: true, y: false }),
      ],
      scales: {
        x: {
          scale: () => scalePoint<string>().padding(0.02),
          axis: { ticks: { values: tickDays, size: 0, format: formatDay } },
        },
        y: {
          scale: scaleLinear,
          nice: true,
          grid: true,
          axis: { line: false, ticks: { size: 0, format: (value: number) => formatNumber(value) } },
        },
      },
      theme: CHART_THEME,
      focus: 'nearest-x',
      maxFocusDistance: Number.POSITIVE_INFINITY,
      tooltip: {
        use: tooltip,
        items: [
          { id: 'day', label: 'Día', text: point => formatDay(point.datum.day) },
          { id: 'visitors', label: 'Visitantes', text: point => formatNumber(point.datum.visitors) },
          { id: 'pageviews', label: 'Páginas vistas', text: point => formatNumber(point.datum.pageviews) },
        ],
      },
    })
  }, [rows])

  return <Chart definition={definition} ariaLabel='Visitantes por día' height={260} initialWidth={900} />
}
