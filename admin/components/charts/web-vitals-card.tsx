import { LuAlertTriangle, LuCheckCircle2, LuXCircle } from 'react-icons/lu'
import type { WebVitals } from '@/lib/posthog'
import { cn } from '@/lib/utils'

/**
 * Umbrales de Google para el percentil 75 (web.dev/vitals). El estado va con ícono y
 * texto, nunca solo con color.
 */
const METRICS = [
  {
    key: 'lcp',
    name: 'Carga',
    hint: 'Cuánto tarda en verse lo principal',
    good: 2500,
    poor: 4000,
    format: (v: number) => `${(v / 1000).toFixed(1).replace('.', ',')} s`,
  },
  {
    key: 'inp',
    name: 'Respuesta',
    hint: 'Cuánto tarda en reaccionar al tocar algo',
    good: 200,
    poor: 500,
    format: (v: number) => `${Math.round(v)} ms`,
  },
  {
    key: 'cls',
    name: 'Estabilidad',
    hint: 'Cuánto se mueve la página mientras carga',
    good: 0.1,
    poor: 0.25,
    format: (v: number) => v.toFixed(2).replace('.', ','),
  },
] as const

const STATUS = {
  good: { label: 'Bueno', Icon: LuCheckCircle2, className: 'bg-emerald-50 text-emerald-700' },
  needs: { label: 'Mejorable', Icon: LuAlertTriangle, className: 'bg-amber-50 text-amber-800' },
  poor: { label: 'Malo', Icon: LuXCircle, className: 'bg-red-50 text-red-700' },
}

// Con pocas mediciones el percentil 75 cambia mucho de un día a otro: se avisa.
const MIN_SAMPLES = 20

const statusOf = (metric: (typeof METRICS)[number], value: number | null) =>
  value == null ? null : STATUS[value <= metric.good ? 'good' : value <= metric.poor ? 'needs' : 'poor']

/**
 * Una fila por dispositivo y una columna por métrica: la versión anterior, con una caja
 * por métrica, ocupaba media pantalla para decir casi siempre lo mismo ("Bueno").
 */
export function WebVitalsCard({ rows }: { rows: WebVitals[] }) {
  return (
    <div className='-mx-5 overflow-x-auto px-5'>
      <table className='w-full min-w-[560px] text-sm'>
        <thead>
          <tr className='border-b border-slate-100 text-left align-bottom'>
            <th className='pb-2 pr-4 text-xs font-semibold text-slate-500'>Dispositivo</th>
            {METRICS.map(metric => (
              <th key={metric.key} className='pb-2 pr-4 font-normal'>
                <span className='block text-xs font-semibold text-slate-500'>{metric.name}</span>
                <span className='block text-xs text-slate-400'>{metric.hint}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.device} className='border-b border-slate-100 last:border-0'>
              <td className='py-3 pr-4 align-top'>
                <span className='block font-medium text-slate-900'>{row.device}</span>
                <span className='block text-xs text-slate-500'>
                  {row.samples} {row.samples === 1 ? 'medición' : 'mediciones'}
                  {row.samples < MIN_SAMPLES && ' · todavía pocas'}
                </span>
              </td>
              {METRICS.map(metric => {
                const value = row[metric.key]
                const s = statusOf(metric, value)
                return (
                  <td key={metric.key} className='py-3 pr-4 align-top'>
                    <span className='flex flex-wrap items-center gap-x-2 gap-y-1'>
                      <span className='text-base font-bold tabular-nums text-slate-900'>
                        {value == null ? '—' : metric.format(value)}
                      </span>
                      {s ? (
                        <span className={cn('inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-semibold', s.className)}>
                          <s.Icon className='h-3.5 w-3.5' aria-hidden />
                          {s.label}
                        </span>
                      ) : (
                        <span className='text-xs text-slate-400'>Sin datos</span>
                      )}
                    </span>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {rows.some(row => row.samples < MIN_SAMPLES) && (
        <p className='mt-3 text-xs text-slate-500'>Con pocas mediciones el valor todavía puede variar bastante.</p>
      )}
    </div>
  )
}
