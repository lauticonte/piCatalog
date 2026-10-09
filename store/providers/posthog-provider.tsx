'use client'

import { useEffect } from 'react'
import posthog from 'posthog-js'

const KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY

/**
 * Inicializa PostHog para medir visitas. Sin la clave cargada no hace nada, así la
 * tienda funciona igual en un entorno sin configurar.
 *
 * Modo liviano a propósito: páginas vistas (incluidas las navegaciones internas de
 * Next), Web Vitals y los eventos que se mandan a mano, como la consulta por WhatsApp. Sin
 * grabación de sesiones ni captura automática de clics: así entra cómodo en el plan
 * gratis y no se junta nada que no se vaya a mirar.
 */
export default function PostHogProvider() {
  useEffect(() => {
    // En local no se registra: las pruebas ensuciarían las visitas reales.
    if (!KEY || process.env.NODE_ENV !== 'production' || posthog.__loaded) return

    posthog.init(KEY, {
      // Pasa por la propia tienda (rewrite en next.config.js): los bloqueadores de
      // anuncios cortan los pedidos directos a posthog.com y se perderían visitas.
      api_host: '/ingest',
      ui_host: 'https://us.posthog.com',
      defaults: '2026-08-30',
      capture_pageview: 'history_change',
      capture_pageleave: false,
      autocapture: false,
      disable_session_recording: true,
      // Web Vitals de visitantes reales para la tarjeta "Velocidad de la tienda" del Panel.
      // Solo las tres que se muestran; network_timing es para Session Replay, que no se usa.
      capture_performance: { web_vitals: true, web_vitals_allowed_metrics: ['LCP', 'INP', 'CLS'], network_timing: false },
      // Dead clicks y encuestas venían prendidos por la configuración remota del proyecto:
      // no se miran y suman eventos y scripts a cada visita.
      capture_dead_clicks: false,
      disable_surveys: true,
      person_profiles: 'identified_only',
    })
  }, [])

  return null
}
