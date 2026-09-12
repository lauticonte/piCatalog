import prismadb from '@/lib/prismadb'
import { formatter } from '@/lib/utils'
import React from 'react'
import ComboForm from './components/combo-form'
import ComboProducts from './components/combo-products'
import { ComboProductColumn } from './components/product-columns'

async function ComboPage({ params }: { params: { comboId: string; storeId: string } }) {
  const combo =
    params.comboId.length < 24
      ? null
      : await prismadb.combo.findUnique({
          where: {
            id: params.comboId,
          },
          include: {
            items: {
              include: {
                product: {
                  include: {
                    category: true,
                    brand: true,
                  },
                },
              },
            },
          },
        })

  const products: Array<ComboProductColumn> =
    combo?.items.map(item => ({
      id: item.product.id,
      name: item.product.name.toUpperCase(),
      SKU: item.product.SKU,
      price: formatter.format(item.product.price),
      category: item.product.category.name,
      brand: item.product.brand.name,
    })) ?? []

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 px-8 pt-2'>
        <ComboForm initialData={combo} />
        {combo ? <ComboProducts data={products} /> : null}
      </div>
    </div>
  )
}

export default ComboPage
