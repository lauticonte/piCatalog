import { NextResponse } from 'next/server'

import prismadb from '@/lib/prismadb'
import { auth } from '@clerk/nextjs'

export async function GET(req: Request, { params }: { params: { comboId: string } }) {
  try {
    if (!params.comboId) {
      return new NextResponse('Combo id is required', { status: 400 })
    }

    const combo = await prismadb.combo.findUnique({
      where: {
        id: params.comboId,
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: true,
                category: true,
                brand: true,
                color: true,
              },
            },
          },
        },
      },
    })

    if (!combo) {
      return NextResponse.json(null)
    }

    return NextResponse.json({
      id: combo.id,
      name: combo.name,
      desc: combo.desc,
      imageUrl: combo.imageUrl,
      products: combo.items.map(item => item.product),
    })
  } catch (error) {
    console.log('[COMBO_GET]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: { comboId: string; storeId: string } }) {
  try {
    const { userId } = auth()
    const body = await req.json()

    const { name, desc, imageUrl } = body

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 403 })
    }

    if (!name) {
      return new NextResponse('Name is required', { status: 400 })
    }

    if (!params.comboId) {
      return new NextResponse('Combo id is required', { status: 400 })
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    })

    if (!storeByUserId) {
      return new NextResponse('Unauthorized', { status: 405 })
    }

    const combo = await prismadb.combo.update({
      where: {
        id: params.comboId,
      },
      data: {
        name,
        desc: desc || '',
        imageUrl: imageUrl || '',
      },
    })

    return NextResponse.json(combo)
  } catch (error) {
    console.log('[COMBO_PATCH]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { comboId: string; storeId: string } }) {
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 403 })
    }

    if (!params.comboId) {
      return new NextResponse('Combo id is required', { status: 400 })
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    })

    if (!storeByUserId) {
      return new NextResponse('Unauthorized', { status: 405 })
    }

    // Las filas de ComboProduct se borran solas por el onDelete: Cascade del schema.
    // Los productos en sí no se tocan.
    const combo = await prismadb.combo.delete({
      where: {
        id: params.comboId,
      },
    })

    return NextResponse.json(combo)
  } catch (error) {
    console.log('[COMBO_DELETE]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
