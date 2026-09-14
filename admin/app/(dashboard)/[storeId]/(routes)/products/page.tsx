import prismadb from '@/lib/prismadb'
import { format } from 'date-fns'
import React from 'react'
import ProductClient from './components/product-client'
import { ProductColumn } from './components/columns'
import { formatter, formatDate } from '@/lib/utils'

async function ProductsPage({ params }: { params: { storeId: string } }) {
  const products = await prismadb.product.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      category: true,
      brand: true,
      color: true,
      // La miniatura es lo que hace que cada fila se reconozca de un vistazo.
      images: { take: 1 },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  const transformedProducts: ProductColumn[] = products.map(item => ({
    id: item.id,
    name: item.name.toUpperCase(),
    desc: item.desc,
    SKU: item.SKU,
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    price: formatter.format(item.price),
    category: item.category.name,
    brand: item.brand.name,
    color: item.color.value,
    image: item.images[0]?.url ?? null,
    createdAt: formatDate(item.createdAt),
  }))

  return (
    <div className='flex flex-col overscroll-none'>
      <div className='flex-1 space-y-4 px-4 pt-2 sm:px-8 overscroll-none'>
        <ProductClient data={transformedProducts} />
      </div>
    </div>
  )
}

export default ProductsPage
