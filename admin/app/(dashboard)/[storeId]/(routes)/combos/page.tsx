import prismadb from '@/lib/prismadb'
import { formatDate } from '@/lib/utils'
import React from 'react'
import CombosClient from './components/combos-client'
import { ComboColumn } from './components/columns'

async function CombosPage({ params }: { params: { storeId: string } }) {
  const combos = await prismadb.combo.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      _count: {
        select: { items: true },
      },
    },
    orderBy: {
      name: 'asc',
    },
  })

  const transformedCombos: Array<ComboColumn> = combos.map(item => ({
    id: item.id,
    name: item.name,
    image: item.imageUrl || null,
    desc: item.desc,
    productsCount: item._count.items,
    createdAt: formatDate(item.createdAt),
  }))

  return (
    <div className='flex flex-col'>
      <div className='flex-1 space-y-4 px-4 pt-2 sm:px-8'>
        <CombosClient data={transformedCombos} />
      </div>
    </div>
  )
}

export default CombosPage
