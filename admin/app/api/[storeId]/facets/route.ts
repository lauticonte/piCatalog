import { NextResponse } from 'next/server'
import prismadb from '@/lib/prismadb'
import { findProductFacets } from '@/lib/product-queries'

// Conteos para el catálogo de la tienda: total de resultados y cuántos productos hay por
// categoría y por marca para la búsqueda y los filtros actuales. Público, como /products.
export async function GET(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q') || undefined
    const categoryId = searchParams.get('categoryId') || undefined
    const brandId = searchParams.get('brandId') || undefined

    if (!params.storeId) {
      return new NextResponse('Store id is required', { status: 400 })
    }

    const facets = await findProductFacets({ storeId: params.storeId, q, categoryId, brandId })

    const [categories, brands] = await Promise.all([
      prismadb.category.findMany({
        where: { storeId: params.storeId, id: { in: facets.categories.map(item => item.id) } },
        select: { id: true, name: true },
      }),
      prismadb.brand.findMany({
        where: { storeId: params.storeId, id: { in: facets.brands.map(item => item.id) } },
        select: { id: true, name: true, imageUrl: true },
      }),
    ])

    const countOf = (list: Array<{ id: string; count: number }>) => new Map(list.map(item => [item.id, item.count]))
    const categoryCounts = countOf(facets.categories)
    const brandCounts = countOf(facets.brands)

    return NextResponse.json({
      total: facets.total,
      // Más productos primero: lo más relevante para la búsqueda queda adelante.
      categories: categories
        .map(category => ({ ...category, productsCount: categoryCounts.get(category.id) ?? 0 }))
        .sort((a, b) => b.productsCount - a.productsCount),
      brands: brands
        .map(brand => ({ ...brand, productsCount: brandCounts.get(brand.id) ?? 0 }))
        .sort((a, b) => b.productsCount - a.productsCount),
    })
  } catch (error) {
    console.log('[FACETS_GET]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
