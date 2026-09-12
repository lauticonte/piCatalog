import { getBillboards } from '@/actions/get-billboards';
import { getProducts } from '@/actions/get-products';
import { getBrands } from '@/actions/get-brands';
import { Product } from '@/types';
import ProductList from '@/components/product/product-list';
import Container from '@/components/ui/container';
import Image from 'next/image';

const srcImage = 'https://images.unsplash.com/photo-1632216820004-4b3b3b3b3b3b';

async function getProductsLimited() {
  // Step 1: Get all brands
  const brands = await getBrands();

  // Step 2: Collect products by brand
  // En paralelo: antes era un await dentro del for, o sea una llamada por marca
  // esperando a la anterior (~9s con 9 marcas).
  const perBrand = await Promise.all(
    brands.map(brand => getProducts({ isFeatured: true, brandId: brand.id, limit: 4 }))
  );

  const allProducts = perBrand.flat();

  // Step 3: Ensure at least one product per brand
  // El campo es `brand.id`: la API devuelve la marca embebida, no un brandId plano.
  const productsByBrand: Product[] = [];
  for (const brand of brands) {
    const first = allProducts.find(product => product.brand?.id === brand.id);
    if (first) {
      productsByBrand.push(first);
    }
  }

  // Step 4: Add more products to reach at least 32
  if (productsByBrand.length < 32) {
    const chosen = new Set(productsByBrand.map(product => product.id));
    productsByBrand.push(...allProducts.filter(product => !chosen.has(product.id)).slice(0, 50 - productsByBrand.length));
  }

  // Step 5: Randomize the list and pick 8
  const shuffledProducts = productsByBrand.sort(() => 0.3 - Math.random());
  return shuffledProducts.slice(0, 8);
}

export default async function Home() {
  // Las dos ramas son independientes: no tiene sentido encadenarlas.
  const [billboard, productsLimited] = await Promise.all([
    getBillboards('6602115b567a6fa1743446d6'),
    getProductsLimited(),
  ]);

  return (
    <Container>
      <div className='rounded-xl w-full bg-custom'>
        <div className='relative w-full h-[250px] lg:h-[350px] 2xl:h-[500px] new-leaf-gradient rounded-b-lg'>
          {/* Es el elemento LCP: priority lo precarga en vez de dejar que el navegador lo
              descubra tarde, que era el retraso de 1,5s que marcaba PageSpeed.
              Se mantiene unoptimized a propósito: la conversión degrada la resolución. */}
          <Image src="/banner.gif" fill priority sizes="100vw" unoptimized alt='Banner' className='rounded-b-lg object-cover 2xl:object-cover ' />
          <p></p>
        </div>
      </div>

      <div className='space-y-10 pt-10 pb-10 bg-custom'>
        <div className='text-white flex flex-col gap-y-8 px-4 sm:px-6 lg:px-0'>
          <ProductList title='Productos Destacados' items={productsLimited} />
        </div>
      </div>
    </Container>
  );
}
