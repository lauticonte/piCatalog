import { CHART_COLOR, formatNumber } from './chart-theme'

export interface BarListRow {
  label: string
  visitors: number
}

const percentFormat = new Intl.NumberFormat('es-AR', { style: 'percent', maximumFractionDigits: 0 })

/**
 * Ranking de una sola medida (visitantes), de mayor a menor, con la cifra a la vista.
 * Reemplaza a un gráfico de barras: con dos a seis filas, un eje y un tooltip ocupaban
 * el doble y escondían el número detrás del mouse.
 */
export function BarList({ rows, ariaLabel }: { rows: BarListRow[]; ariaLabel: string }) {
  const max = Math.max(...rows.map(row => row.visitors), 1)
  const total = rows.reduce((sum, row) => sum + row.visitors, 0)

  return (
    <ul className='space-y-3' aria-label={ariaLabel}>
      {rows.map(row => (
        <li key={row.label}>
          <div className='flex items-baseline justify-between gap-3 text-sm'>
            <span className='truncate font-medium text-slate-800'>{row.label}</span>
            <span className='shrink-0 tabular-nums'>
              <span className='font-semibold text-slate-900'>{formatNumber(row.visitors)}</span>
              <span className='ml-2 inline-block w-10 text-right text-slate-500'>
                {total ? percentFormat.format(row.visitors / total) : '—'}
              </span>
            </span>
          </div>
          <div className='mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100' aria-hidden>
            <div
              className='h-full rounded-full'
              style={{ width: `${(row.visitors / max) * 100}%`, backgroundColor: CHART_COLOR }}
            />
          </div>
        </li>
      ))}
    </ul>
  )
}
