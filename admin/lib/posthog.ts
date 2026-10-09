/**
 * Lecturas de PostHog para el Panel. La tienda manda las visitas a PostHog
 * (store/providers/posthog-provider.tsx) y acá se consultan con HogQL a través de su
 * API, con una clave personal de solo lectura (`query:read`). Solo se importa desde
 * componentes de servidor: la clave no debe llegar nunca al navegador.
 */

const HOST = process.env.POSTHOG_HOST || 'https://us.posthog.com'
const PROJECT_ID = process.env.POSTHOG_PROJECT_ID
const API_KEY = process.env.POSTHOG_PERSONAL_API_KEY

// Las fechas se agrupan en el día argentino: con UTC, las visitas de las 21 a las 24
// caerían en el día siguiente.
const TZ = 'America/Argentina/Buenos_Aires'

// Una vista de página de la tienda. Todas las consultas parten de acá.
const PAGEVIEW = "event = '$pageview'"

export const isPostHogConfigured = () => Boolean(PROJECT_ID && API_KEY)

/** Período del Panel. Solo estos valores llegan a las consultas, nunca texto libre. */
export const PERIODS = [7, 30, 90] as const
export type Period = (typeof PERIODS)[number]

export const parsePeriod = (value: string | string[] | undefined): Period => {
  const n = Number(Array.isArray(value) ? value[0] : value)
  return (PERIODS as readonly number[]).includes(n) ? (n as Period) : 30
}

async function hogql<TRow extends unknown[]>(query: string): Promise<TRow[] | null> {
  if (!isPostHogConfigured()) return null

  try {
    const res = await fetch(`${HOST}/api/projects/${PROJECT_ID}/query/`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: { kind: 'HogQLQuery', query } }),
      // Cinco minutos alcanzan para un panel de visitas y cuidan el límite de la API.
      next: { revalidate: 300 },
    })

    if (!res.ok) {
      console.log('[POSTHOG_QUERY]', res.status, await res.text())
      return null
    }

    const data = await res.json()
    return data.results as TRow[]
  } catch (error) {
    console.log('[POSTHOG_QUERY]', error)
    return null
  }
}

// Ventana [desde, hasta) en días hacia atrás desde ahora: el período actual es (days, 0)
// y el anterior, para comparar, es (2 * days, days).
const window = (fromDaysAgo: number, toDaysAgo: number) =>
  `timestamp >= now() - interval ${fromDaysAgo} day and timestamp < now() - interval ${toDaysAgo} day`

export interface Totals {
  visitors: number
  pageviews: number
  productVisitors: number
}

const totals = async (fromDaysAgo: number, toDaysAgo: number): Promise<Totals | null> => {
  const rows = await hogql<[number, number, number]>(`
    select
      uniq(distinct_id),
      count(),
      uniqIf(distinct_id, properties.$pathname like '/product/%')
    from events
    where ${PAGEVIEW} and ${window(fromDaysAgo, toDaysAgo)}
  `)
  if (!rows?.[0]) return null
  const [visitors, pageviews, productVisitors] = rows[0]
  return { visitors, pageviews, productVisitors }
}

export const getTotals = (days: Period) => totals(days, 0)
export const getPreviousTotals = (days: Period) => totals(days * 2, days)

export interface DailyVisits {
  /** AAAA-MM-DD en hora argentina. */
  day: string
  visitors: number
  pageviews: number
}

/** Visitantes por día, con los días sin visitas completados en cero. */
export const getDailyVisits = async (days: Period): Promise<DailyVisits[] | null> => {
  const rows = await hogql<[string, number, number]>(`
    select toString(toDate(toTimeZone(timestamp, '${TZ}'))) as day, uniq(distinct_id), count()
    from events
    where ${PAGEVIEW} and ${window(days, 0)}
    group by day
    order by day
  `)
  if (!rows) return null

  const byDay = new Map(rows.map(([day, visitors, pageviews]) => [day, { visitors, pageviews }]))
  const todayAR = new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(new Date())
  const result: DailyVisits[] = []
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(`${todayAR}T12:00:00Z`)
    date.setUTCDate(date.getUTCDate() - i)
    const day = date.toISOString().slice(0, 10)
    result.push({ day, ...(byDay.get(day) ?? { visitors: 0, pageviews: 0 }) })
  }
  return result
}

export interface ProductVisits {
  productId: string
  visitors: number
  pageviews: number
}

export const getTopProducts = async (days: Period, limit = 10): Promise<ProductVisits[] | null> => {
  const rows = await hogql<[string, number, number]>(`
    select extract(properties.$pathname, '^/product/([0-9a-f]{24})') as product, uniq(distinct_id) as visitors, count()
    from events
    where ${PAGEVIEW} and ${window(days, 0)} and product != ''
    group by product
    order by visitors desc
    limit ${limit}
  `)
  return rows?.map(([productId, visitors, pageviews]) => ({ productId, visitors, pageviews })) ?? null
}

export interface Breakdown {
  label: string
  visitors: number
}

/** De dónde llegan: el dominio que trajo a cada visitante, sin contar la propia tienda. */
export const getReferrers = async (days: Period, limit = 6): Promise<Breakdown[] | null> => {
  const rows = await hogql<[string, number]>(`
    select
      multiIf(
        properties.$referring_domain in ('$direct', '') or properties.$referring_domain is null, 'Directo',
        properties.$referring_domain like '%google.%', 'Google',
        properties.$referring_domain like '%instagram.%', 'Instagram',
        properties.$referring_domain like '%facebook.%', 'Facebook',
        properties.$referring_domain like '%whatsapp%', 'WhatsApp',
        replaceRegexpOne(properties.$referring_domain, '^www\\\\.', '')
      ) as source,
      uniq(distinct_id) as visitors
    from events
    where ${PAGEVIEW} and ${window(days, 0)} and properties.$referring_domain not like '%mhgarage%'
    group by source
    order by visitors desc
    limit ${limit}
  `)
  return rows?.map(([label, visitors]) => ({ label, visitors })) ?? null
}

const DEVICE_LABEL: Record<string, string> = { Mobile: 'Celular', Desktop: 'Computadora', Tablet: 'Tablet' }

export const getDevices = async (days: Period): Promise<Breakdown[] | null> => {
  const rows = await hogql<[string, number]>(`
    select properties.$device_type as device, uniq(distinct_id) as visitors
    from events
    where ${PAGEVIEW} and ${window(days, 0)} and device is not null
    group by device
    order by visitors desc
  `)
  return rows?.map(([device, visitors]) => ({ label: DEVICE_LABEL[device] ?? device, visitors })) ?? null
}

export interface WebVitals {
  device: string
  /** Percentil 75 en milisegundos: el criterio de Google para "experiencia real". */
  lcp: number | null
  inp: number | null
  /** Percentil 75, sin unidad. */
  cls: number | null
  samples: number
}

/** Velocidad percibida por visitantes reales (Web Vitals que manda la tienda), por dispositivo. */
export const getWebVitals = async (days: Period): Promise<WebVitals[] | null> => {
  const p75 = (metric: string) =>
    `quantileIf(0.75)(toFloat(properties.$web_vitals_${metric}_value), properties.$web_vitals_${metric}_value is not null)`
  const rows = await hogql<[string, number | null, number | null, number | null, number]>(`
    select
      coalesce(properties.$device_type, 'Otro') as device,
      ${p75('LCP')}, ${p75('INP')}, ${p75('CLS')},
      countIf(properties.$web_vitals_LCP_value is not null) as samples
    from events
    where event = '$web_vitals' and ${window(days, 0)}
    group by device
    order by samples desc
  `)
  return (
    rows?.map(([device, lcp, inp, cls, samples]) => ({
      device: DEVICE_LABEL[device] ?? device,
      // quantileIf devuelve NaN cuando no hubo ninguna medición de esa métrica.
      lcp: Number.isFinite(lcp) ? lcp : null,
      inp: Number.isFinite(inp) ? inp : null,
      cls: Number.isFinite(cls) ? cls : null,
      samples,
    })) ?? null
  )
}
