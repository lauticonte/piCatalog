import { getBrands } from "@/actions/get-brands";
import Link from "next/link";
import React from "react";
import Container from '@/components/ui/container';
import Footer from '@/components/footer';

// Componente para las tarjetas de marca
const BrandCard = ({ brand }) => {
  const logoSrc = 'https://mpsa.com.ar/wp-content/uploads/2021/06/logo-lusqtoff-alpha.png';
  
  return (
    <Link href={`/brand/${brand.id}`} className="w-full w-auto">
      <div className="group border-0 flex lg:w-56 lg:h-40 w-36 h-28 flex-col self-center overflow-hidden rounded-xl bg-gray-700 shadow-xl shadow-black">
        <div className="relative mx-auto my-3 px-3 lg:h-32 lg:w-48 w-36 h-24 overflow-hidden rounded-lg">
          <img src={brand.imageUrl} alt={brand.name} className="h-full w-full object-contain bg-white rounded-lg" />
        </div>
        {/* <div className="mt-4 px-5 pb-5 text-center">
          <h3 className="text-xl uppercase font-medium text-ellipsis overflow-hidden text-white">{brand.name}</h3>
        </div> */}
      </div>
    </Link>
  );
}

async function BrandsPage() {
  const brands = await getBrands();

  return (
    <div className='bg-gray-900 flex flex-col bg-custom'>
      <Container>
        <div className='px-4 px-8 lg:pb-80 pb-20'>
          <h2 className='text-center text-2xl font-bold my-8 text-white'>NUESTRAS MARCAS</h2>
          <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center'>
            {brands.map(brand => (
              <BrandCard key={brand.id} brand={brand} />
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}

export default BrandsPage;
