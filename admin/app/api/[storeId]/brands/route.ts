import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import prismadb from '@/lib/prismadb'

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const { userId } = auth()
    const body = await req.json()

    const { name, value, billboardId, imageUrl } = body

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 403 })
    }

    if (!name) {
      return new NextResponse('Name is required', { status: 400 })
    }

    if (!value) {
      return new NextResponse('Value is required', { status: 400 })
    }

    
    if (!billboardId) {
      return new NextResponse('Billboard is required', { status: 400 })
    }

    if (!imageUrl) {
      return new NextResponse('Image is required', { status: 400 })
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

    const brand = await prismadb.brand.create({
      data: {
        name,
        value,
        storeId: params.storeId,
        billboardId,
        imageUrl,
      },
    })

    return NextResponse.json(brand)
  } catch (error) {
    console.log('[SIZES_POST]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function GET(req: Request, { params }: { params: { storeId: string } }) {
  try {
    if (!params.storeId) {
      return new NextResponse('Store id is required', { status: 400 })
    }

    // Con ?categoryId= devuelve solo las marcas que tienen productos publicados en esa
    // categoría, con la cantidad: la tienda las usa como filtro y no tiene sentido
    // ofrecer una opción que no muestra nada.
    const categoryId = new URL(req.url).searchParams.get('categoryId')

    if (categoryId) {
      const counts = await prismadb.product.groupBy({
        by: ['brandId'],
        where: { storeId: params.storeId, categoryId, isArchived: false },
        _count: { _all: true },
      })
      const countById = new Map(counts.map(item => [item.brandId, item._count._all]))

      const brands = await prismadb.brand.findMany({
        where: { storeId: params.storeId, id: { in: Array.from(countById.keys()) } },
        orderBy: { name: 'asc' },
      })

      return NextResponse.json(brands.map(brand => ({ ...brand, productsCount: countById.get(brand.id) ?? 0 })))
    }

    const brands = await prismadb.brand.findMany({
      where: {
        storeId: params.storeId,
      },
    })

    return NextResponse.json(brands)
  } catch (error) {
    console.log('[SIZES_GET]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
