'use client'

import { useMemo } from 'react'
import { barX, defineChart } from '@tanstack/charts'
import { scaleBand } from '@tanstack/charts/scales/band'
import { scaleLinear } from '@tanstack/charts/scales/linear'
import { tooltip } from '@tanstack/charts/tooltip'
import { Chart } from '@tanstack/charts/react'
import { CHART_COLOR, CHART_THEME, formatNumber } from './chart-theme'

export interface BarListRow {
  label: string
  visitors: number
}

/** Ranking horizontal de una sola medida (visitantes), de mayor a menor. */
export function BarListChart({ rows, ariaLabel }: { rows: BarListRow[]; ariaLabel: string }) {
  const definition = useMemo(
    () =>
      defineChart({
        marks: [
          barX(rows, {
            x: 'visitors',
            y: 'label',
            fill: CHART_COLOR,
            maxThickness: 24,
            radius: { end: 4 },
          }),
        ],
        scales: {
          y: { scale: () => scaleBand<string>().padding(0.35), axis: { line: false, ticks: { size: 0 } } },
          x: {
            scale: scaleLinear,
            nice: true,
            grid: true,
            axis: { line: false, ticks: { size: 0, count: 4, format: (value: number) => formatNumber(value) } },
          },
        },
        theme: CHART_THEME,
        tooltip: {
          use: tooltip,
          items: [
            { id: 'label', label: 'Origen', text: point => point.datum.label },
            { id: 'visitors', label: 'Visitantes', text: point => formatNumber(point.datum.visitors) },
          ],
        },
      }),
    [rows]
  )

  // Alto según la cantidad de filas: con pocas, el gráfico no queda con aire de sobra.
  return <Chart definition={definition} ariaLabel={ariaLabel} height={56 + rows.length * 40} initialWidth={480} />
}
