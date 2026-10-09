import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import prismadb from '@/lib/prismadb'
import { findProducts } from '@/lib/product-queries'
import { applyPriceChange, BulkPriceChange, precioManualValido, validatePriceChange } from '@/lib/bulk-price'

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

    // El storeId acota el borrado a la tienda del usuario autenticado.
    const { count: deleted } = await prismadb.product.deleteMany({
      where: {
        id: { in: ids },
        storeId: params.storeId,
      },
    })

    return NextResponse.json({ deleted })
  } catch (error) {
    console.log('[PRODUCTS_DELETE]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

// Cambio masivo de precios. El precio nuevo se calcula acá sobre el guardado, con la misma
// función que la vista previa del modal: si alguien lo cambió mientras tanto, no se pisa
// con un valor viejo.
export async function PATCH(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 403 })
    }

    const body = await req.json()
    const { ids, mode, value, rounding, prices } = body

    // Dos formas: { prices: [{ id, price }] } con un precio por producto ("Uno por uno"),
    // o { ids, mode, value, rounding } con la misma fórmula para todos.
    const manual = Array.isArray(prices)

    if (manual) {
      if (prices.length === 0) {
        return new NextResponse('Prices are required', { status: 400 })
      }
      if (!prices.every((item: any) => typeof item?.id === 'string' && precioManualValido(item?.price))) {
        return new NextResponse('Every price must be a number above zero', { status: 400 })
      }
    } else if (!Array.isArray(ids) || ids.length === 0) {
      return new NextResponse('Product ids are required', { status: 400 })
    }

    const change = { mode, value: Number(value), rounding: Number(rounding) }
    const invalid = manual ? null : validatePriceChange(change)

    if (invalid) {
      return new NextResponse(invalid, { status: 400 })
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

    const targetIds: string[] = manual ? prices.map((item: { id: string }) => item.id) : ids

    // El storeId acota el cambio a la tienda del usuario autenticado: un id ajeno se ignora.
    const products = await prismadb.product.findMany({
      where: { id: { in: targetIds }, storeId: params.storeId },
      select: { id: true, price: true },
    })

    const manualById = new Map<string, number>(manual ? prices.map((item: { id: string; price: number }) => [item.id, item.price]) : [])

    const updates = products.map(product => ({
      id: product.id,
      price: manual ? (manualById.get(product.id) as number) : applyPriceChange(product.price, change as BulkPriceChange),
    }))

    if (updates.some(update => update.price <= 0)) {
      return new NextResponse('Some prices would end up at zero or below', { status: 400 })
    }

    // Todo o nada: si falla uno, no queda la mitad de la lista con precios nuevos.
    await prismadb.$transaction(
      updates.map(update => prismadb.product.update({ where: { id: update.id }, data: { price: update.price } }))
    )

    return NextResponse.json({ updated: updates.length })
  } catch (error) {
    console.log('[PRODUCTS_PATCH]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
