import { getBillboards } from '@/actions/get-billboards';
import { getProducts } from '@/actions/get-products';
import ProductList from '@/components/product/product-list';
import Container from '@/components/ui/container';
import Button from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

const srcImage = 'https://images.unsplash.com/photo-1632216820004-4b3b3b3b3b3b';

export default async function Home() {
  const billboard = await getBillboards('6602115b567a6fa1743446d6');
  const products = await getProducts({ isFeatured: true });

  const shuffledProducts = products.sort(() => Math.random() - 0.5);
  const limitedProducts = shuffledProducts.slice(0, 12);

  return (
    <Container>
      <div className='rounded-xl w-full bg-custom'>
        <div className='relative w-full h-[250px] lg:h-[350px] 2xl:h-[500px] new-leaf-gradient rounded-b-lg'>
          <Image src="/banner.png" layout='fill' alt='Banner' className='rounded-b-lg object-cover 2xl:object-cover ' />
          <p></p>
        </div>
      </div>

      <div className='space-y-10 pt-10 pb-10 bg-custom'>
        <div className='text-white flex flex-col gap-y-8 px-4 sm:px-6 lg:px-0'>
          <ProductList title='Productos Destacados' items={limitedProducts} />
        </div>
      </div>
    </Container>
  );
}
