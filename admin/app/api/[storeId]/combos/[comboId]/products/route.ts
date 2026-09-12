import { NextResponse } from 'next/server'

import prismadb from '@/lib/prismadb'
import { auth } from '@clerk/nextjs'

// Valida sesión, pertenencia de la tienda y existencia del combo.
// Devuelve un NextResponse de error, o null si está todo bien.
const verifyAccess = async (storeId: string, comboId: string) => {
  const { userId } = auth()

  if (!userId) {
    return new NextResponse('Unauthenticated', { status: 403 })
  }

  if (!comboId) {
    return new NextResponse('Combo id is required', { status: 400 })
  }

  const storeByUserId = await prismadb.store.findFirst({
    where: {
      id: storeId,
      userId,
    },
  })

  if (!storeByUserId) {
    return new NextResponse('Unauthorized', { status: 405 })
  }

  const combo = await prismadb.combo.findFirst({
    where: {
      id: comboId,
      storeId,
    },
  })

  if (!combo) {
    return new NextResponse('Combo not found', { status: 404 })
  }

  return null
}

export async function POST(req: Request, { params }: { params: { comboId: string; storeId: string } }) {
  try {
    const error = await verifyAccess(params.storeId, params.comboId)

    if (error) {
      return error
    }

    const body = await req.json()
    const { productIds } = body

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return new NextResponse('Product ids are required', { status: 400 })
    }

    // Solo productos de esta tienda: evita colar ids de otra.
    const validProducts = await prismadb.product.findMany({
      where: {
        id: { in: productIds },
        storeId: params.storeId,
      },
      select: { id: true },
    })

    const existing = await prismadb.comboProduct.findMany({
      where: {
        comboId: params.comboId,
        productId: { in: validProducts.map(product => product.id) },
      },
      select: { productId: true },
    })

    const alreadyIn = existing.map(item => item.productId)
    const toAdd = validProducts.map(product => product.id).filter(id => !alreadyIn.includes(id))

    if (toAdd.length > 0) {
      await prismadb.comboProduct.createMany({
        data: toAdd.map(productId => ({ comboId: params.comboId, productId })),
      })
    }

    return NextResponse.json({ added: toAdd.length, alreadyIn: alreadyIn.length })
  } catch (error) {
    console.log('[COMBO_PRODUCTS_POST]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { comboId: string; storeId: string } }) {
  try {
    const error = await verifyAccess(params.storeId, params.comboId)

    if (error) {
      return error
    }

    const body = await req.json()
    const { productIds } = body

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return new NextResponse('Product ids are required', { status: 400 })
    }

    // Saca los productos del combo; los productos en sí quedan intactos.
    const result = await prismadb.comboProduct.deleteMany({
      where: {
        comboId: params.comboId,
        productId: { in: productIds },
      },
    })

    return NextResponse.json({ removed: result.count })
  } catch (error) {
    console.log('[COMBO_PRODUCTS_DELETE]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
