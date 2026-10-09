import prismadb from '@/lib/prismadb'
import { formatShortDate } from '@/lib/utils'
import React from 'react'
import BillboardClient from './components/billboard-client'
import { BillboardColumn } from './components/columns'

async function BillboardsPage({ params }: { params: { storeId: string } }) {
  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  const transformedBillboards: BillboardColumn[] = billboards.map(item => ({
    id: item.id,
    label: item.label,
    image: item.imageUrl || null,
    createdAt: formatShortDate(item.createdAt),
    createdAtValue: item.createdAt.getTime(),
  }))

  return (
    <div className='flex flex-col'>
      <div className='flex-1 space-y-4 px-4 pt-2 sm:px-8'>
        <BillboardClient data={transformedBillboards} />
      </div>
    </div>
  )
}

export default BillboardsPage
