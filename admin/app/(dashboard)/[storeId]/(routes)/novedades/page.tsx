import React from 'react'
import Heading from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { CHANGELOG, ChangeType } from '@/lib/changelog'
import { MarkChangelogSeen } from '@/components/changelog/changelog-seen'
import { cn } from '@/lib/utils'

export const metadata = { title: 'Novedades — MH Garage' }

const TYPE_STYLES: Record<ChangeType, { label: string; className: string }> = {
  nuevo: { label: 'Nuevo', className: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
  mejora: { label: 'Mejora', className: 'bg-sky-50 text-sky-700 ring-sky-200' },
  arreglo: { label: 'Arreglo', className: 'bg-amber-50 text-amber-700 ring-amber-200' },
}

const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']

// Se arma a mano desde "AAAA-MM-DD": con new Date() la zona horaria podía correr el día.
const formatDay = (date: string) => {
  const [year, month, day] = date.split('-').map(Number)
  return `${day} ${MONTHS[month - 1]} ${year}`
}

function NovedadesPage() {
  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 px-4 pt-2 sm:px-8'>
        <MarkChangelogSeen />
        <Heading title='Novedades' description='Qué cambió en el panel y en la tienda con cada versión' />
        <Separator />

        <ol className='relative mx-auto max-w-3xl pb-12'>
          {/* Línea de tiempo: la versión más nueva arriba. */}
          <span className='absolute bottom-12 left-[7px] top-2 w-px bg-slate-200' aria-hidden />
          {CHANGELOG.map((entry, index) => (
            <li key={entry.version} className='relative pb-8 pl-8'>
              <span
                className={cn(
                  'absolute left-0 top-1.5 h-[15px] w-[15px] rounded-full border-2 bg-white',
                  index === 0 ? 'border-[#3aa17e] ring-4 ring-emerald-100' : 'border-slate-300'
                )}
                aria-hidden
              />
              <div className='flex flex-wrap items-center gap-x-3 gap-y-1'>
                <span
                  className={cn(
                    'rounded-md px-2 py-0.5 font-mono text-xs font-bold',
                    index === 0 ? 'bg-[#1D232A] text-white' : 'bg-slate-100 text-slate-600'
                  )}
                >
                  v{entry.version}
                </span>
                <time dateTime={entry.date} className='text-xs text-slate-400'>
                  {formatDay(entry.date)}
                </time>
                {index === 0 && (
                  <span className='text-[10px] font-bold uppercase tracking-wider text-[#3aa17e]'>Versión actual</span>
                )}
              </div>
              <h2 className='mt-2 text-lg font-extrabold leading-snug text-slate-900'>{entry.title}</h2>
              <ul className='mt-3 space-y-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm'>
                {entry.changes.map(change => (
                  <li key={change.text} className='flex items-start gap-3 text-sm leading-relaxed text-slate-600'>
                    <span
                      className={cn(
                        'mt-0.5 w-16 shrink-0 rounded-full py-0.5 text-center text-[10px] font-bold uppercase tracking-wide ring-1',
                        TYPE_STYLES[change.type].className
                      )}
                    >
                      {TYPE_STYLES[change.type].label}
                    </span>
                    <span>{change.text}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

export default NovedadesPage
