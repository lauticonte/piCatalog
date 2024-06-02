import { getCategory } from '@/actions/get-category'
import { getColors } from '@/actions/get-colors'
import { getProducts } from '@/actions/get-products'
import { getBrands } from '@/actions/get-brands'
import ProductCard from '@/components/product/product-card'
import Billboard from '@/components/ui/billboard'
import Container from '@/components/ui/container'
import NoResults from '@/components/ui/no-result'
import React from 'react'
import ClearFilter from './components/clear-filter'
import Filter from './components/filter'
import MobileFilters from './components/mobile-filters'
import LoadMore from './components/load-more'
import { getCategories } from '@/actions/get-categories'
import { getBrand } from '@/actions/get-brand'

interface IBrandPage {
  params: {
    brandId: string
  }
  searchParams: {
    categoryId?: string
    limit?: number
  }
}

async function BrandPage({ params, searchParams }: IBrandPage) {
  const { brandId } = params;
  const { categoryId, limit } = searchParams;

  const products = await getProducts({
    categoryId,
    brandId,
    limit: limit || 6 // Default to 6 if limit is not provided
  });

  const categories = await getCategories();
  const brand = await getBrand(brandId);

  return (
    <div className='bg-custom'>
      <Container>

      
        <Billboard data={brand.billboard} />
        <div className='px-4 sm:px-6 lg:px-8 pb-16'>
        
          <div className='lg:grid lg:grid-cols-5 lg:gap-x-8'>
            <MobileFilters categories={categories} />          
            
            <div className='hidden lg:block text-white'>
              <ClearFilter />
              <Filter valueKey='categoryId' name='Categorías' data={categories} />
            </div>

            <div className='mt-6 lg:col-span-4 lg:mt-0'>
              {products.length === 0 && <NoResults />}

              <div className='grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 gap-4 justify-items-center'>
                {products.map(item => (
                  <ProductCard key={item.id} data={item} />
                ))}
                
              </div>
              <LoadMore defaultLimit={12} />
              
            </div>
            
          </div>
          
        </div>
      </Container>
    </div>
  );
}

export default BrandPage;
