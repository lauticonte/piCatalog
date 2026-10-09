import prismadb from '@/lib/prismadb'
import { formatName, formatShortDate } from '@/lib/utils'
import React from 'react'
import BillboardClient from './components/billboard-client'
import { CategoryColumn } from './components/columns'

async function CategoriesPage({ params }: { params: { storeId: string } }) {
  const categories = await prismadb.category.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      // Cuántos productos cuelgan de cada categoría: es el dato que uno busca acá.
      _count: { select: { products: true } },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  const transformedCategoreis: CategoryColumn[] = categories.map(item => ({
    id: item.id,
    // Los nombres vienen con mayúsculas desparejas ("iNYECCIÓN", "Limpieza y Mantenimiento").
    name: formatName(item.name),
    productsCount: item._count.products,
    createdAt: formatShortDate(item.createdAt),
    createdAtValue: item.createdAt.getTime(),
  }))

  return (
    <div className='flex flex-col'>
      <div className='flex-1 space-y-4 px-4 pt-2 sm:px-8'>
        <BillboardClient data={transformedCategoreis} />
      </div>
    </div>
  )
}

export default CategoriesPage
