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
      {/* El banner sale del margen en mobile: con 2048x700 cada píxel de ancho cuenta,
          y los márgenes laterales lo achicaban todavía más. */}
      <div className='-mx-4 w-auto bg-custom sm:mx-0 sm:w-full sm:rounded-xl'>
        {/* El contenedor toma la proporción real del banner (2048x700). Con alto fijo,
            object-cover agrandaba la imagen para llenarlo y recortaba los costados,
            que en mobile se comía el texto y los logos de la derecha. */}
        {/* Dos recortes del mismo banner. El original es 2048x700 (casi 3:1): mostrado
            entero en un celular queda de 140px de alto, y recortado por object-cover
            perdía el texto y los logos. El recorte para mobile es 1229x700 y conserva
            todo el contenido. Cada uno se oculta por CSS, así el navegador descarga
            solo el que corresponde. */}
        <div className='relative w-full aspect-[1229/700] max-h-[500px] new-leaf-gradient sm:hidden'>
          <Image src='/banner-mobile.png' fill priority sizes='100vw' unoptimized alt='Banner' className='object-cover' />
        </div>
        <div className='relative hidden w-full aspect-[2048/700] max-h-[500px] new-leaf-gradient sm:block sm:rounded-b-lg'>
          {/* Es el elemento LCP: priority lo precarga en vez de dejar que el navegador lo
              descubra tarde, que era el retraso de 1,5s que marcaba PageSpeed.
              Se mantiene unoptimized a propósito: la conversión degrada la resolución. */}
          <Image src="/banner.gif" fill priority sizes="100vw" unoptimized alt='Banner' className='object-cover sm:rounded-b-lg' />
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
