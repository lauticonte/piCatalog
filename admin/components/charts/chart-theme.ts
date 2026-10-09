/**
 * Color y formato compartidos por los gráficos del Panel.
 *
 * El amarillo de MH (#f5b301) no llega al contraste mínimo de 3:1 contra el fondo
 * blanco para una marca de dato; el ámbar #d97706 es el paso más cercano que pasa el
 * validador de paleta (banda de luminosidad, croma y contraste). Una sola serie por
 * gráfico, así que un solo color.
 */
export const CHART_COLOR = '#d97706'

export const CHART_THEME = {
  foreground: '#334155',
  muted: '#64748b',
  grid: '#eef1f4',
}

const numberFormat = new Intl.NumberFormat('es-AR')
export const formatNumber = (value: number) => numberFormat.format(value)

const dayFormat = new Intl.DateTimeFormat('es-AR', { day: 'numeric', month: 'short', timeZone: 'UTC' })
/** "2026-10-08" -> "8 oct". */
export const formatDay = (day: string) => dayFormat.format(new Date(`${day}T00:00:00Z`)).replace('.', '')
