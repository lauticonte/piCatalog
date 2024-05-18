import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'

import prismadb from '@/lib/prismadb'

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const { userId } = auth()

    const body = await req.json()

    const { name, desc, price, categoryId, colorId, SKU, brandId, images, isFeatured, isArchived } = body

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 403 })
    }

    if (!name) {
      return new NextResponse('Name is required', { status: 400 })
    }

    if (!desc) {
      return new NextResponse('Description is required', { status: 400 })
    }

    if (!images || !images.length) {
      return new NextResponse('Images are required', { status: 400 })
    }

    if (!price) {
      return new NextResponse('Price is required', { status: 400 })
    }

    if (!categoryId) {
      return new NextResponse('Category id is required', { status: 400 })
    }

    if (!colorId) {
      return new NextResponse('Color id is required', { status: 400 })
    }

    if (!brandId) {
      return new NextResponse('Brand id is required', { status: 400 })
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

    const product = await prismadb.product.create({
      data: {
        name,
        desc,
        price,
        isFeatured,
        isArchived,
        categoryId,
        colorId,
        brandId,
        SKU,
        storeId: params.storeId,
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.log('[PRODUCTS_POST]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function GET(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const { searchParams } = new URL(req.url)
    const categoryId = searchParams.get('categoryId') || undefined
    const colorId = searchParams.get('colorId') || undefined
    const brandId = searchParams.get('brandId') || undefined
    const isFeatured = searchParams.get('isFeatured')

    // Parámetros de paginación
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '15', 10)
    const skip = (page - 1) * limit

    if (!params.storeId) {
      return new NextResponse('Store id is required', { status: 400 })
    }

    const products = await prismadb.product.findMany({
      where: {
        storeId: params.storeId,
        categoryId,
        colorId,
        brandId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
      },
      include: {
        images: true,
        category: true,
        color: true,
        brand: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip, // Omitir los productos anteriores
      take: limit, // Limitar el número de productos obtenidos
    })

    return NextResponse.json(products)
  } catch (error) {
    console.log('[PRODUCTS_GET]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
