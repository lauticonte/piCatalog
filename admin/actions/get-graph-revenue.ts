import prismadb from '@/lib/prismadb'

interface GraphData {
  name: string
  total: number
}

// Valor de los productos consultados mes a mes, para ver la evolución del interés.
export const getGraphRevenue = async (storeId: string): Promise<GraphData[]> => {
  const consultations = await prismadb.consultation.findMany({
    where: {
      storeId,
    },
    include: {
      product: true,
    },
  })

  const monthlyTotals: { [key: number]: number } = {}

  for (const consultation of consultations) {
    const month = consultation.createdAt.getMonth()
    monthlyTotals[month] = (monthlyTotals[month] || 0) + consultation.product.price
  }

  const graphData: GraphData[] = [
    { name: 'Ene', total: 0 },
    { name: 'Feb', total: 0 },
    { name: 'Mar', total: 0 },
    { name: 'Abr', total: 0 },
    { name: 'May', total: 0 },
    { name: 'Jun', total: 0 },
    { name: 'Jul', total: 0 },
    { name: 'Ago', total: 0 },
    { name: 'Sep', total: 0 },
    { name: 'Oct', total: 0 },
    { name: 'Nov', total: 0 },
    { name: 'Dic', total: 0 },
  ]

  for (const [month, total] of Object.entries(monthlyTotals)) {
    graphData[Number(month)].total = total
  }

  return graphData
}
