import prismadb from '@/lib/prismadb'
import React from 'react'
import BrandForm from './components/brand-form'

async function BrandPage({ params }: { params: { brandId: string; storeId: string } }) {
  const brand =
    params.brandId.length < 24
      ? null
      : await prismadb.brand.findUnique({
          where: {
            id: params.brandId,
          },
        })

        const billboards = await prismadb.billboard.findMany({
          where: {
            storeId: params.storeId,
          },
        })

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 px-4 pt-2 sm:px-8'>
        <BrandForm initialData={brand} billboards={billboards} />
      </div>
    </div>
  )
}

export default BrandPage
