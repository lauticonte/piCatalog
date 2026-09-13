import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import prismadb from '@/lib/prismadb'
import { findProducts } from '@/lib/product-queries'

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
    const { searchParams } = new URL(req.url);

    const categoryId = searchParams.get('categoryId') || undefined;
    const colorId = searchParams.get('colorId') || undefined;
    const brandId = searchParams.get('brandId') || undefined;
    const isFeatured = searchParams.get('isFeatured');
    const q = searchParams.get('q') || undefined;

    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '12'; // Asegúrate que '3' es el valor por defecto deseado

    const limitInt = parseInt(limit, 10);
    const pageInt = parseInt(page, 10);

    const skip = (pageInt - 1) * limitInt;

    if (!params.storeId) {
      return new NextResponse('Store id is required', { status: 400 });
    }

    // Resuelto con una sola consulta en vez de cinco: ver lib/product-queries.ts
    const products = await findProducts({
      storeId: params.storeId,
      categoryId,
      colorId,
      brandId,
      isFeatured: Boolean(isFeatured),
      q,
      skip,
      take: limitInt,
    });

    return NextResponse.json(products);
  } catch (error) {
    console.log('[PRODUCTS_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 403 })
    }

    const body = await req.json()
    const { ids } = body

    if (!Array.isArray(ids) || ids.length === 0) {
      return new NextResponse('Product ids are required', { status: 400 })
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

    // Un producto referenciado por un pedido no se puede borrar: lo apartamos para
    // que un solo producto trabado no haga fallar todo el lote.
    const orderItems = await prismadb.orderItem.findMany({
      where: {
        productId: { in: ids },
      },
      select: {
        productId: true,
      },
    })

    const blocked = Array.from(new Set(orderItems.map(item => item.productId)))
    const deletable = ids.filter((id: string) => !blocked.includes(id))

    let deleted = 0

    if (deletable.length > 0) {
      // El storeId acota el borrado a la tienda del usuario autenticado.
      const result = await prismadb.product.deleteMany({
        where: {
          id: { in: deletable },
          storeId: params.storeId,
        },
      })

      deleted = result.count
    }

    return NextResponse.json({ deleted, blocked })
  } catch (error) {
    console.log('[PRODUCTS_DELETE]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
