import prismadb from '@/lib/prismadb'
import React from 'react'
import BillboardForm from './components/product-form'

async function ProductPage({ params }: { params: { storeId: string; productId: string } }) {
  const product =
    params.productId.length < 24
      ? null
      : await prismadb.product.findUnique({
          where: {
            id: params.productId,
          },
          include: {
            images: true,
          },
        })

  const categories = await prismadb.category.findMany({
    where: {
      storeId: params.storeId,
    },
  })

  const brands = await prismadb.brand.findMany({
    where: {
      storeId: params.storeId,
    },
  })

  const colors = await prismadb.color.findMany({
    where: {
      storeId: params.storeId,
    },
  })

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 px-8 pt-2'>
        <BillboardForm initialData={product} categories={categories} brands={brands} colors={colors} />
      </div>
    </div>
  )
}

export default ProductPage
