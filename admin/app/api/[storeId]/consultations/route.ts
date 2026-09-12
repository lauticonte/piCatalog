import { NextResponse } from 'next/server'

import prismadb from '@/lib/prismadb'

/**
 * Registra un clic en "Consultar" de la tienda.
 *
 * Llega por `navigator.sendBeacon` justo antes de que el navegador se vaya a
 * WhatsApp, así que:
 *  - El cuerpo viaja como text/plain: con application/json el navegador haría un
 *    preflight OPTIONS entre dominios y el beacon se perdería.
 *  - La respuesta no la lee nadie; lo único que importa es que la escritura ocurra.
 */

// La tienda vive en otro dominio que el panel.
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS })
}

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const raw = await req.text()
    const { productId, visitorId } = JSON.parse(raw || '{}')

    if (!params.storeId) {
      return new NextResponse('Store id is required', { status: 400, headers: CORS })
    }

    if (!productId || !visitorId) {
      return new NextResponse('Product id and visitor id are required', { status: 400, headers: CORS })
    }

    // Solo se registran productos que existan en esta tienda: evita que el endpoint
    // público ensucie los datos con ids inventados.
    const product = await prismadb.product.findFirst({
      where: {
        id: productId,
        storeId: params.storeId,
      },
      select: { id: true },
    })

    if (!product) {
      return new NextResponse('Product not found', { status: 404, headers: CORS })
    }

    // Una consulta por visitante, producto y día: mide cuánta gente distinta
    // preguntó, no cuántas veces dudó la misma persona.
    const day = new Date().toISOString().slice(0, 10)

    await prismadb.consultation.upsert({
      where: {
        productId_visitorId_day: { productId, visitorId, day },
      },
      create: {
        storeId: params.storeId,
        productId,
        visitorId,
        day,
      },
      update: {},
    })

    return new NextResponse(null, { status: 204, headers: CORS })
  } catch (error) {
    console.log('[CONSULTATIONS_POST]', error)
    return new NextResponse('Internal error', { status: 500, headers: CORS })
  }
}
