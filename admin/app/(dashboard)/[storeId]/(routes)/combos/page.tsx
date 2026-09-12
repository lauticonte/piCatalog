import prismadb from '@/lib/prismadb'
import { format } from 'date-fns'
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
    productsCount: item._count.items,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }))

  return (
    <div className='flex flex-col'>
      <div className='flex-1 space-y-4 px-8 pt-2'>
        <CombosClient data={transformedCombos} />
      </div>
    </div>
  )
}

export default CombosPage
