import Link from 'next/link'
import Image from 'next/image'
import { LuArrowDownRight, LuArrowUpRight, LuBarChart3, LuImageOff } from 'react-icons/lu'

import { formatDateTime, formatter, cn } from '@/lib/utils'
import Heading from '@/components/ui/heading'
import prismadb from '@/lib/prismadb'
import {
  PERIODS,
  getDailyVisits,
  getDevices,
  getPreviousTotals,
  getReferrers,
  getTopProducts,
  getTotals,
  getTrackingStart,
  getWebVitals,
  isPostHogConfigured,
  parsePeriod,
  type Period,
} from '@/lib/posthog'
import { VisitsChart } from '@/components/charts/visits-chart'
import { BarList } from '@/components/charts/bar-list'
import { WebVitalsCard } from '@/components/charts/web-vitals-card'
import { formatDay } from '@/components/charts/chart-theme'
import ConsultationsTables from './components/consultations-tables'
import { PanelCard as Card } from './components/panel-card'
import { HistoryColumn } from './components/history-columns'

interface DashboardPageProps {
  params: { storeId: string }
  searchParams: { dias?: string }
}

const numberFormat = new Intl.NumberFormat('es-AR')
const percentFormat = new Intl.NumberFormat('es-AR', { style: 'percent', maximumFractionDigits: 1 })

/** Variación contra el período anterior; null si antes no había con qué comparar. */
const delta = (current: number, previous: number | undefined) =>
  previous ? (current - previous) / previous : null

function PeriodFilter({ storeId, period }: { storeId: string; period: Period }) {
  return (
    <nav className='inline-flex rounded-lg border border-slate-200 bg-white p-1' aria-label='Período'>
      {PERIODS.map(days => (
        <Link
          key={days}
          href={`/${storeId}?dias=${days}`}
          aria-current={days === period ? 'page' : undefined}
          className={cn(
            'rounded-md px-3 py-1.5 text-sm font-semibold transition-colors',
            days === period ? 'bg-[#151a20] text-white' : 'text-slate-600 hover:text-slate-900'
          )}
        >
          {days} días
        </Link>
      ))}
    </nav>
  )
}

function StatTile({
  label,
  value,
  hint,
  change,
}: {
  label: string
  value: string
  hint: string
  change?: number | null
}) {
  return (
    <div className='rounded-xl border border-slate-200 bg-white p-5 shadow-sm'>
      <p className='text-sm font-medium text-slate-600'>{label}</p>
      <p className='mt-2 text-3xl font-extrabold tracking-tight text-slate-900'>{value}</p>
      <div className='mt-1 flex items-center gap-2 text-xs text-slate-500'>
        {change != null && Number.isFinite(change) && (
          <span
            className={cn(
              'inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 font-semibold',
              change >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
            )}
          >
            {change >= 0 ? <LuArrowUpRight className='h-3.5 w-3.5' /> : <LuArrowDownRight className='h-3.5 w-3.5' />}
            {percentFormat.format(Math.abs(change))}
          </span>
        )}
        <span>{hint}</span>
      </div>
    </div>
  )
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex flex-col items-center gap-2 py-10 text-center'>
      <span className='flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500'>
        <LuBarChart3 className='h-5 w-5' />
      </span>
      <p className='max-w-sm text-sm text-slate-500'>{children}</p>
    </div>
  )
}

const DashboardPage = async ({ params, searchParams }: DashboardPageProps) => {
  const period = parsePeriod(searchParams.dias)
  const since = new Date(Date.now() - period * 24 * 60 * 60 * 1000)
  const previousSince = new Date(Date.now() - period * 2 * 24 * 60 * 60 * 1000)
  const configured = isPostHogConfigured()

  const [totals, previous, daily, topProducts, referrers, devices, webVitals, consultations, previousConsultations, trackingStart] =
    await Promise.all([
      getTotals(period),
      getPreviousTotals(period),
      getDailyVisits(period),
      getTopProducts(period),
      getReferrers(period),
      getDevices(period),
      getWebVitals(period),
      prismadb.consultation.groupBy({
        by: ['productId'],
        where: { storeId: params.storeId, createdAt: { gte: since } },
        _count: { productId: true },
      }),
      prismadb.consultation.count({
        where: { storeId: params.storeId, createdAt: { gte: previousSince, lt: since } },
      }),
      getTrackingStart(),
    ])

  const consultationCount = consultations.reduce((sum, item) => sum + item._count.productId, 0)

  // Tasa de consulta: de cada 100 personas que vieron un producto, cuántas preguntaron.
  // Las dos cifras salen de PostHog: los clics de la base cuentan consultas, no personas,
  // e incluyen las de antes de medir visitas, así que la tasa pasaba del 100 %.
  const rate = totals?.productVisitors ? totals.consulters / totals.productVisitors : null

  const topIds = topProducts?.map(item => item.productId) ?? []
  const products = topIds.length
    ? await prismadb.product.findMany({
        where: { id: { in: topIds }, storeId: params.storeId },
        select: {
          id: true,
          name: true,
          price: true,
          SKU: true,
          brand: { select: { name: true } },
          images: { take: 1, select: { url: true } },
        },
      })
    : []
  const productById = new Map(products.map(product => [product.id, product]))
  const hayVisitas = Boolean(totals && totals.pageviews > 0)

  // Los días anteriores al comienzo de la medición no tuvieron cero visitas: no se midieron.
  // Se recortan del gráfico, dejando al menos dos puntos para que se dibuje la línea.
  const startIndex = daily && trackingStart ? daily.findIndex(row => row.day >= trackingStart) : 0
  const chartRows = daily && startIndex > 0 ? daily.slice(Math.min(startIndex, daily.length - 2)) : daily
  const measuredSincePeriodStart = !(chartRows && daily && chartRows.length < daily.length)

  // Mientras el período anterior no esté medido completo, la variación de visitas compararía
  // 30 días contra unos pocos: se oculta y se avisa desde cuándo va a aparecer.
  const comparisonFrom =
    trackingStart && new Date(`${trackingStart}T03:00:00Z`) > previousSince
      ? (() => {
          const date = new Date(`${trackingStart}T12:00:00Z`)
          date.setUTCDate(date.getUTCDate() + period * 2)
          return date.toISOString().slice(0, 10)
        })()
      : null

  // Registro propio de consultas (anterior a PostHog), para la tabla del final.
  const recent = await prismadb.consultation.findMany({
    where: { storeId: params.storeId },
    include: { product: { include: { brand: true } } },
    orderBy: { createdAt: 'desc' },
    take: 200,
  })
  const history: Array<HistoryColumn> = recent.map(item => ({
    id: item.id,
    href: `/${params.storeId}/products/${item.productId}`,
    name: item.product.name.toUpperCase(),
    SKU: item.product.SKU,
    brand: item.product.brand.name,
    createdAt: formatDateTime(item.createdAt),
  }))

  return (
    <div className='flex-col overflow-hidden'>
      <div className='flex-1 space-y-6 p-4 pt-4 sm:p-8 sm:pt-6'>
        <Heading
          title='Panel'
          description='Cuánta gente visita la tienda, qué mira y cuántos consultan'
          action={<PeriodFilter storeId={params.storeId} period={period} />}
        />

        {!configured && (
          <div className='rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900'>
            Las visitas no están configuradas: faltan <code className='font-mono'>POSTHOG_PROJECT_ID</code> y{' '}
            <code className='font-mono'>POSTHOG_PERSONAL_API_KEY</code>.
          </div>
        )}

        <div className='grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4'>
          <StatTile
            label='Visitantes'
            value={totals ? numberFormat.format(totals.visitors) : '—'}
            hint={`personas distintas, últimos ${period} días`}
            change={totals && !comparisonFrom ? delta(totals.visitors, previous?.visitors) : null}
          />
          <StatTile
            label='Páginas vistas'
            value={totals ? numberFormat.format(totals.pageviews) : '—'}
            hint={totals?.visitors ? `${(totals.pageviews / totals.visitors).toFixed(1).replace('.', ',')} por visitante` : 'en la tienda'}
            change={totals && !comparisonFrom ? delta(totals.pageviews, previous?.pageviews) : null}
          />
          <StatTile
            label='Consultas'
            value={numberFormat.format(consultationCount)}
            hint='clics en "Consultar" por WhatsApp'
            change={delta(consultationCount, previousConsultations)}
          />
          <StatTile
            label='Tasa de consulta'
            value={rate != null ? percentFormat.format(rate) : '—'}
            hint='de quienes vieron un producto, consultaron'
          />
        </div>

        <Card
          title='Visitantes por día'
          description={
            measuredSincePeriodStart || !trackingStart
              ? `Últimos ${period} días, en hora argentina`
              : `Desde el ${formatDay(trackingStart)}, cuando empezó la medición de visitas · en hora argentina`
          }
        >
          {hayVisitas && chartRows ? (
            <VisitsChart rows={chartRows} />
          ) : (
            <Empty>
              Todavía no hay visitas registradas. Se empiezan a contar cuando la tienda se publica con la medición de
              visitas activa.
            </Empty>
          )}
        </Card>

        <Card title='Productos más vistos' description='Por personas distintas que entraron a la ficha'>
          {topProducts?.length ? (
            <table className='w-full text-sm'>
              <thead>
                <tr className='border-b border-slate-100 text-left text-xs font-semibold text-slate-500'>
                  <th className='pb-2 font-semibold'>Producto</th>
                  <th className='w-24 pb-2 pl-4 text-right font-semibold'>Visitantes</th>
                  <th className='hidden w-28 pb-2 pl-4 text-right font-semibold sm:table-cell'>Consultaron</th>
                  <th className='w-20 pb-2 pl-4 text-right font-semibold'>Tasa</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map(item => {
                  const product = productById.get(item.productId)
                  const asked = item.consulters
                  return (
                    <tr key={item.productId} className='border-b border-slate-100 last:border-0'>
                      <td className='py-2.5 pr-3'>
                        <div className='flex items-center gap-3'>
                          <div className='relative h-9 w-9 shrink-0 overflow-hidden rounded-md bg-white ring-1 ring-slate-200'>
                            {product?.images[0] ? (
                              <Image src={product.images[0].url} alt='' fill sizes='36px' className='object-contain p-0.5' />
                            ) : (
                              <div className='flex h-full w-full items-center justify-center text-slate-300'>
                                <LuImageOff className='h-3.5 w-3.5' />
                              </div>
                            )}
                          </div>
                          <div className='min-w-0'>
                            <Link
                              href={`/${params.storeId}/products/${item.productId}`}
                              className='block truncate font-medium text-slate-900 hover:underline'
                            >
                              {product ? product.name.toUpperCase() : 'Producto eliminado'}
                            </Link>
                            {product && (
                            <p className='truncate text-xs tabular-nums text-slate-500'>
                              {[product.SKU, product.brand.name, formatter.format(product.price)].filter(Boolean).join(' · ')}
                            </p>
                          )}
                          </div>
                        </div>
                      </td>
                      <td className='py-2.5 pl-4 text-right font-semibold tabular-nums text-slate-900'>
                        {numberFormat.format(item.visitors)}
                      </td>
                      <td className='hidden py-2.5 pl-4 text-right tabular-nums text-slate-700 sm:table-cell'>
                        {numberFormat.format(asked)}
                      </td>
                      <td className='py-2.5 pl-4 text-right tabular-nums text-slate-700'>
                        {item.visitors ? percentFormat.format(asked / item.visitors) : '—'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          ) : (
            <Empty>Acá van a aparecer los productos que más gente mira.</Empty>
          )}
        </Card>

        {/* Lado a lado y con la misma altura: apiladas junto a "Productos más vistos"
            dejaban un hueco grande debajo de la tabla cuando había pocos productos. */}
        <div className='grid gap-6 md:grid-cols-2'>
          <Card title='De dónde llegan' description='Sitio desde el que entraron los visitantes'>
            {referrers?.length ? (
              <BarList rows={referrers} ariaLabel='Visitantes según de dónde llegan' />
            ) : (
              <Empty>Google, Instagram, WhatsApp o directo: se completa con las primeras visitas.</Empty>
            )}
          </Card>
          <Card title='Dispositivos' description='Desde qué equipo entraron los visitantes'>
            {devices?.length ? (
              <BarList rows={devices} ariaLabel='Visitantes según dispositivo' />
            ) : (
              <Empty>Celular o computadora: se completa con las primeras visitas.</Empty>
            )}
          </Card>
        </div>

        <Card
          title='Velocidad de la tienda'
          description='Cómo la perciben tus visitantes reales: el 75 % tiene esta experiencia o una mejor'
        >
          {webVitals?.length ? (
            <WebVitalsCard rows={webVitals} />
          ) : (
            <Empty>Se completa con las primeras visitas: carga, respuesta y estabilidad, en celular y computadora.</Empty>
          )}
        </Card>

        <ConsultationsTables history={history} />
      </div>
    </div>
  )
}

export default DashboardPage
