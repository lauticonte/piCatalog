import { getBillboards } from '@/actions/get-billboards';
import { getProducts } from '@/actions/get-products';
import { getBrands } from '@/actions/get-brands';
import ProductList from '@/components/product/product-list';
import Container from '@/components/ui/container';
import Image from 'next/image';

const srcImage = 'https://images.unsplash.com/photo-1632216820004-4b3b3b3b3b3b';

async function getProductsLimited() {
  // Step 1: Get all brands
  const brands = await getBrands();

  // Step 2: Collect products by brand
  let allProducts = [];
  for (const brand of brands) {
    const brandProducts = await getProducts({isFeatured: true, brandId: brand.id, limit: 4});
    if (brandProducts.length > 0) {
      allProducts.push(...brandProducts);
    }
  }

  // Step 3: Ensure at least one product per brand
  const productsByBrand = brands.reduce((acc, brand) => {
    const brandProducts = allProducts.filter(product => product.brandId === brand.id);
    if (brandProducts.length > 0) {
      acc.push(brandProducts[0]);
    }
    return acc;
  }, []);

  // Step 4: Add more products to reach at least 32
  if (productsByBrand.length < 32) {
    const additionalProducts = allProducts.slice(0, 50 - productsByBrand.length);
    productsByBrand.push(...additionalProducts);
  }

  // Step 5: Randomize the list and pick 8
  const shuffledProducts = productsByBrand.sort(() => 0.3 - Math.random());
  return shuffledProducts.slice(0, 8);
}

export default async function Home() {
  const billboard = await getBillboards('6602115b567a6fa1743446d6');
  const productsLimited = await getProductsLimited();

  return (
    <Container>
      <div className='rounded-xl w-full bg-custom'>
        <div className='relative w-full h-[250px] lg:h-[350px] 2xl:h-[500px] new-leaf-gradient rounded-b-lg'>
          <Image src="/banner.gif" unoptimized={true} layout='fill' alt='Banner' className='rounded-b-lg object-cover 2xl:object-cover ' />
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
