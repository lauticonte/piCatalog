import prismadb from '@/lib/prismadb'
import { format } from 'date-fns'
import React from 'react'
import BrandsClient from './components/brands-client'
import { BrandColumn } from './components/columns'

async function CategoriesPage({ params }: { params: { storeId: string } }) {
  const brands = await prismadb.brand.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      billboard: true,
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
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }))

  return (
    <div className='flex flex-col'>
      <div className='flex-1 space-y-4 px-8 pt-2'>
        <BrandsClient data={transformedBrands} />
      </div>
    </div>
  )
}

export default CategoriesPage
