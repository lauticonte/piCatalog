import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import prismadb from '@/lib/prismadb'

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
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

    if (!params.storeId) {
      return new NextResponse('Store id is required', { status: 400 })
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

    const combo = await prismadb.combo.create({
      data: {
        name,
        desc: desc || '',
        imageUrl: imageUrl || '',
        storeId: params.storeId,
      },
    })

    return NextResponse.json(combo)
  } catch (error) {
    console.log('[COMBOS_POST]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function GET(req: Request, { params }: { params: { storeId: string } }) {
  try {
    if (!params.storeId) {
      return new NextResponse('Store id is required', { status: 400 })
    }

    const combos = await prismadb.combo.findMany({
      where: {
        storeId: params.storeId,
        isActive: true,
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
      orderBy: {
        name: 'asc',
      },
    })

    // La tienda no tiene por qué conocer la tabla intermedia: se aplana a `products`.
    const response = combos.map(combo => ({
      id: combo.id,
      name: combo.name,
      desc: combo.desc,
      imageUrl: combo.imageUrl,
      products: combo.items.map(item => item.product),
    }))

    return NextResponse.json(response)
  } catch (error) {
    console.log('[COMBOS_GET]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
