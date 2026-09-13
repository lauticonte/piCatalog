import prismadb from '@/lib/prismadb'
import { formatDate } from '@/lib/utils'
import React from 'react'
import BrandsClient from './components/brands-client'
import { BrandColumn } from './components/columns'

async function BrandsPage({ params }: { params: { storeId: string } }) {
  const brands = await prismadb.brand.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      billboard: true,
      _count: { select: { products: true } },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  const transformedBrands: Array<BrandColumn> = brands.map(item => ({
    id: item.id,
    name: item.name,
    value: item.value,
    billboardLabel: item.billboard.label,
    image: item.imageUrl || null,
    productsCount: item._count.products,
    createdAt: formatDate(item.createdAt),
  }))

  return (
    <div className='flex flex-col'>
      <div className='flex-1 space-y-4 px-8 pt-2'>
        <BrandsClient data={transformedBrands} />
      </div>
    </div>
  )
}

export default BrandsPage
