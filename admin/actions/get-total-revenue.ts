import prismadb from '@/lib/prismadb'

// Suma el precio de los productos consultados: da una idea del volumen de dinero
// que está moviendo el interés de los visitantes, no de ventas cerradas.
export const getTotalRevenue = async (storeId: string) => {
  const consultations = await prismadb.consultation.findMany({
    where: {
      storeId,
    },
    include: {
      product: true,
    },
  })

  return consultations.reduce((total, consultation) => total + consultation.product.price, 0)
}
