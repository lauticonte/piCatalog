import prismadb from '@/lib/prismadb'
import { formatter } from '@/lib/utils'
import { format } from 'date-fns'
import React from 'react'
import ConsultationsClient from './components/consultations-client'
import { RankingColumn } from './components/ranking-columns'
import { HistoryColumn } from './components/history-columns'

async function ConsultationsPage({ params }: { params: { storeId: string } }) {
  // Ranking: cuántos visitantes distintos preguntaron por cada producto.
  const grouped = await prismadb.consultation.groupBy({
    by: ['productId'],
    where: { storeId: params.storeId },
    _count: { productId: true },
    _max: { createdAt: true },
  })

  const products = await prismadb.product.findMany({
    where: { id: { in: grouped.map(item => item.productId) } },
    include: { brand: true, category: true },
  })

  const byId = new Map(products.map(product => [product.id, product]))

  const ranking: Array<RankingColumn> = grouped
    .map(item => {
      const product = byId.get(item.productId)
      return {
        id: item.productId,
        name: product ? product.name.toUpperCase() : '(producto eliminado)',
        SKU: product?.SKU ?? '-',
        brand: product?.brand.name ?? '-',
        price: product ? formatter.format(product.price) : '-',
        total: item._count.productId,
        last: item._max.createdAt ? format(item._max.createdAt, 'dd/MM/yyyy HH:mm') : '-',
      }
    })
    .sort((a, b) => b.total - a.total)

  // Historial: las últimas consultas, para ver cuándo hay movimiento.
  const recent = await prismadb.consultation.findMany({
    where: { storeId: params.storeId },
    include: { product: { include: { brand: true } } },
    orderBy: { createdAt: 'desc' },
    take: 200,
  })

  const history: Array<HistoryColumn> = recent.map(item => ({
    id: item.id,
    name: item.product.name.toUpperCase(),
    SKU: item.product.SKU,
    brand: item.product.brand.name,
    createdAt: format(item.createdAt, 'dd/MM/yyyy HH:mm'),
  }))

  const totalConsultations = await prismadb.consultation.count({ where: { storeId: params.storeId } })

  return (
    <div className='flex flex-col'>
      <div className='flex-1 space-y-4 px-8 pt-2'>
        <ConsultationsClient ranking={ranking} history={history} total={totalConsultations} />
      </div>
    </div>
  )
}

export default ConsultationsPage
