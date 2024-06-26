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
