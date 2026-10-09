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

export function WebVitalsCard({ rows }: { rows: WebVitals[] }) {
  return (
    <div className='space-y-5'>
      {rows.map(row => (
        <div key={row.device}>
          <div className='mb-2 flex items-baseline justify-between gap-3'>
            <h3 className='text-sm font-semibold text-slate-900'>{row.device}</h3>
            <span className='text-xs text-slate-500'>
              {row.samples} {row.samples === 1 ? 'medición' : 'mediciones'}
              {row.samples < MIN_SAMPLES && ' · todavía pocas, el valor puede variar'}
            </span>
          </div>
          <div className='grid gap-3 sm:grid-cols-3'>
            {METRICS.map(metric => {
              const value = row[metric.key]
              const status = value == null ? null : value <= metric.good ? 'good' : value <= metric.poor ? 'needs' : 'poor'
              const s = status ? STATUS[status] : null
              return (
                <div key={metric.key} className='rounded-lg border border-slate-200 p-3.5'>
                  <p className='text-sm font-medium text-slate-700'>{metric.name}</p>
                  <p className='mt-1 text-2xl font-extrabold tracking-tight text-slate-900'>
                    {value == null ? '—' : metric.format(value)}
                  </p>
                  {s ? (
                    <span className={cn('mt-1.5 inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-semibold', s.className)}>
                      <s.Icon className='h-3.5 w-3.5' aria-hidden />
                      {s.label}
                    </span>
                  ) : (
                    <span className='mt-1.5 inline-block text-xs text-slate-400'>Sin datos</span>
                  )}
                  <p className='mt-1.5 text-xs text-slate-500'>{metric.hint}</p>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
