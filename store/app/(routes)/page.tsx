import { getBillboards } from '@/actions/get-billboards';
import { getProducts } from '@/actions/page-product';
import ProductList from '@/components/product/product-list';
import Container from '@/components/ui/container';
import Button from '@/components/ui/button';
import Link from 'next/link';

const srcImage = 'https://images.unsplash.com/photo-1632216820004-4b3b3b3b3b3b';

export default async function Home() {
  const billboard = await getBillboards('6602115b567a6fa1743446d6');
  const products = await getProducts({ page: 1, pageSize: 12 });

  const shuffledProducts = products.sort(() => Math.random() - 0.5);
  const limitedProducts = shuffledProducts.slice(0, 8);

  const page = 1; // Definir el número de página actual
  const pageSize = 12; // Definir el tamaño de página

  const href = `/products/page=${page + 1}&pageSize=${pageSize}`;

  return (
    <Container>
      <div className='rounded-xl w-full bg-custom'>
        <div className='relative w-full h-[250px] sm:h-[500px] new-leaf-gradient rounded-b-lg'>
          <p></p>
        </div>
      </div>

      <div className='space-y-10 pt-10 pb-10 bg-custom'>
        <div className='text-white flex flex-col gap-y-8 px-4 sm:px-6 lg:px-0'>
          <ProductList title='Productos Destacados' items={shuffledProducts} />
        </div>
      </div>
    </Container>
  );
}
