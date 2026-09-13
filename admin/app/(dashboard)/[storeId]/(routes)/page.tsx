import { BsCreditCard } from 'react-icons/bs'
import { CiDollar } from 'react-icons/ci'
import { GoPackage } from 'react-icons/go'

import { Separator } from '@/components/ui/separator'
import { Overview } from '@/components/overview'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getTotalRevenue } from '@/actions/get-total-revenue'
import { getSalesCount } from '@/actions/get-sales-count'
import { getGraphRevenue } from '@/actions/get-graph-revenue'
import { getStockCount } from '@/actions/get-stock-count'
import { formatter, formatDateTime } from '@/lib/utils'
import Heading from '@/components/ui/heading'
import prismadb from '@/lib/prismadb'
import ConsultationsTables from './components/consultations-tables'
import { RankingColumn } from './components/ranking-columns'
import { HistoryColumn } from './components/history-columns'

interface DashboardPageProps {
  params: {
    storeId: string
  }
}

const DashboardPage = async ({ params }: DashboardPageProps) => {
  const [totalRevenue, graphRevenue, salesCount, stockCount] = await Promise.all([
    getTotalRevenue(params.storeId),
    getGraphRevenue(params.storeId),
    getSalesCount(params.storeId),
    getStockCount(params.storeId),
  ])

  // Ranking: cuántas personas distintas preguntaron por cada producto.
  const grouped = await prismadb.consultation.groupBy({
    by: ['productId'],
    where: { storeId: params.storeId },
    _count: { productId: true },
    _max: { createdAt: true },
  })

  const products = await prismadb.product.findMany({
    where: { id: { in: grouped.map(item => item.productId) } },
    include: { brand: true },
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
        last: item._max.createdAt ? formatDateTime(item._max.createdAt) : '-',
      }
    })
    .sort((a, b) => b.total - a.total)

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
    createdAt: formatDateTime(item.createdAt),
  }))

  return (
    <div className='flex-col overflow-hidden'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <Heading title='Panel' description='Qué están consultando tus clientes' />
        <Separator />
        <div className='grid gap-4 grid-cols-3'>
          <Card className='shadow-sm'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Valor consultado</CardTitle>
              <span className='flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700'><CiDollar className='h-5 w-5' /></span>
            </CardHeader>
            <CardContent>
              <div className='text-3xl font-extrabold tracking-tight'>{formatter.format(totalRevenue)}</div>
              <p className='text-xs text-muted-foreground'>Suma de los productos consultados</p>
            </CardContent>
          </Card>
          <Card className='shadow-sm'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Consultas</CardTitle>
              <span className='flex h-9 w-9 items-center justify-center rounded-lg bg-sky-50 text-sky-700'><BsCreditCard className='h-4 w-4' /></span>
            </CardHeader>
            <CardContent>
              <div className='text-3xl font-extrabold tracking-tight'>{salesCount}</div>
              <p className='text-xs text-muted-foreground'>Clics en "Consultar" por WhatsApp</p>
            </CardContent>
          </Card>
          <Card className='shadow-sm'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Productos en stock</CardTitle>
              <span className='flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700'><GoPackage className='h-4 w-4' /></span>
            </CardHeader>
            <CardContent>
              <div className='text-3xl font-extrabold tracking-tight'>{stockCount}</div>
              <p className='text-xs text-muted-foreground'>Publicados en la tienda</p>
            </CardContent>
          </Card>
        </div>
        <Card className='col-span-4 shadow-sm'>
          <CardHeader>
            <CardTitle>Valor consultado por mes</CardTitle>
          </CardHeader>
          <CardContent className='pl-2'>
            <Overview data={graphRevenue} />
          </CardContent>
        </Card>

        <Separator />

        <ConsultationsTables ranking={ranking} history={history} />
      </div>
    </div>
  )
}

export default DashboardPage
