/**
 * Avisa al panel que alguien apretó "Consultar".
 *
 * Se llama justo antes de redirigir a WhatsApp, así que un fetch normal quedaría
 * cancelado al abandonar la página. `sendBeacon` está hecho para este caso: el
 * navegador se encarga de entregarlo aunque el documento ya se haya ido.
 */

import posthog from 'posthog-js'

const ADMIN_API =
  process.env.NEXT_PUBLIC_ADMIN_API_URL || 'https://admin.mhgarage.ar/api/65ec0a796702c9c0e4c0895f'

const VISITOR_KEY = 'mh_visitor'

// Identificador anónimo del navegador: no lleva ningún dato personal, solo sirve
// para no contar diez veces a la misma persona.
const getVisitorId = () => {
  try {
    let id = localStorage.getItem(VISITOR_KEY)
    if (!id) {
      id = crypto.randomUUID()
      localStorage.setItem(VISITOR_KEY, id)
    }
    return id
  } catch {
    // Modo incógnito o almacenamiento bloqueado: se registra igual, sin deduplicar.
    return 'anon'
  }
}

export const trackConsultation = (productId: string) => {
  try {
    const body = JSON.stringify({ productId, visitorId: getVisitorId() })
    // text/plain evita el preflight entre dominios, que perdería el beacon.
    const blob = new Blob([body], { type: 'text/plain;charset=UTF-8' })
    navigator.sendBeacon(`${ADMIN_API}/consultations`, blob)
    // También a PostHog, para cruzar vistas y consultas de cada producto. Si PostHog no
    // se inicializó (local o sin clave), capture no hace nada.
    if (posthog.__loaded) posthog.capture('consulta_whatsapp', { product_id: productId }, { transport: 'sendBeacon' })
  } catch {
    // El registro es secundario: nunca debe impedir que se abra WhatsApp.
  }
}
