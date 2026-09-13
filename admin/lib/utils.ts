import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Tailwind ClassNames merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Pesos argentinos con formato local: separador de miles con punto y decimales
// con coma. Antes usaba en-US/USD, así que $325.150 se mostraba como "$325,150.00".
export const formatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
})

/**
 * Fechas en hora de Argentina.
 *
 * Tanto Vercel como Mongo trabajan en UTC, así que sin una zona horaria explícita
 * una consulta de las 20:44 se mostraba como 23:44. Estas funciones fijan la zona
 * para que lo que se ve en el panel coincida con la hora real del negocio.
 */
export const TIMEZONE = 'America/Argentina/Buenos_Aires'

export const formatDateTime = (date: Date) =>
  new Intl.DateTimeFormat('es-AR', {
    timeZone: TIMEZONE,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date)

export const formatDate = (date: Date) =>
  new Intl.DateTimeFormat('es-AR', {
    timeZone: TIMEZONE,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)

/**
 * Día calendario argentino en formato YYYY-MM-DD.
 *
 * Se usa como clave de deduplicación. Con el día UTC, el corte caía a las 21:00
 * hora local: alguien que consultaba a las 20:00 y otra vez a las 22:00 contaba
 * dos veces, porque para UTC ya era otro día.
 */
export const getLocalDay = (date: Date = new Date()) =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
