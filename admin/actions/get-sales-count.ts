import prismadb from "@/lib/prismadb";

// Antes contaba pedidos pagados, que en este negocio no existen: siempre daba 0.
// La señal real es la consulta por WhatsApp.
export const getSalesCount = async (storeId: string) => {
  const salesCount = await prismadb.consultation.count({
    where: {
      storeId,
    },
  });

  return salesCount;
};
