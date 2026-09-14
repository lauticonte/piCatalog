import prismadb from '@/lib/prismadb'
import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const { userId } = auth()
    const body = await req.json()

    const { name } = body

    if (!userId) {
      return new NextResponse(`Unauthenticated`, { status: 401 })
    }

    if (!name) {
      return new NextResponse(`Name is required`, { status: 400 })
    }

    if (!params.storeId) {
      return new NextResponse(`StoreID is required`, { status: 400 })
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    })

    if (!storeByUserId) {
      return new NextResponse(`Unauthorized`, {
        status: 401,
      })
    }

    const category = await prismadb.category.create({
      data: {
        name,
        storeId: params.storeId,
      },
    })

    return NextResponse.json(category)
  } catch (error) {
    console.error(`CATEGORY POST ERR =>`, error)
    return new NextResponse(`Internal error`, {
      status: 500,
    })
  }
}

export async function GET(req: Request, { params }: { params: { storeId: string } }) {
  try {
    if (!params.storeId) {
      return new NextResponse(`StoreID is required`, { status: 400 })
    }

    // Con ?brandId= devuelve solo las categorías donde esa marca tiene productos
    // publicados, con la cantidad (filtro de la página de marca en la tienda).
    const brandId = new URL(req.url).searchParams.get('brandId')

    if (brandId) {
      const counts = await prismadb.product.groupBy({
        by: ['categoryId'],
        where: { storeId: params.storeId, brandId, isArchived: false },
        _count: { _all: true },
      })
      const countById = new Map(counts.map(item => [item.categoryId, item._count._all]))

      const categories = await prismadb.category.findMany({
        where: { storeId: params.storeId, id: { in: Array.from(countById.keys()) } },
      })

      return NextResponse.json(
        categories
          .map(category => ({ ...category, productsCount: countById.get(category.id) ?? 0 }))
          .sort((a, b) => b.productsCount - a.productsCount)
      )
    }

    const categories = await prismadb.category.findMany({
      where: {
        storeId: params.storeId,
      },
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error(`CATEGORY GET ERR =>`, error)
    return new NextResponse(`Internal error`, {
      status: 500,
    })
  }
}
