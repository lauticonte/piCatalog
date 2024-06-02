import { Product } from '@/types';

// Esta función simula la obtención de productos desde una fuente de datos
const getAllProducts = async (): Promise<Product[]> => {
    const URL = `https://admin.mhgarage.ar/api/65ec0a796702c9c0e4c0895f/products`
    const res = await fetch(URL, {
        next: {
            revalidate: 10,
        },
    })
    return res.json()
}

export const getProducts = async ({ page = 1, pageSize = 12 }: { page?: number, pageSize?: number }): Promise<Product[]> => {
  // Obtener todos los productos
  const allProducts = await getAllProducts();

  // Calcular el índice del primer y último producto en la página actual
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  // Filtrar los productos para obtener solo los de la página actual
  const pageProducts = allProducts.slice(startIndex, endIndex);

  return pageProducts;
}
