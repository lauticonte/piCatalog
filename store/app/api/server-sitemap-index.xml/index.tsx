import React from 'react';
import { getProducts } from '@/actions/get-products';
import { getProductsCount } from '@/actions/get-products-count';
import { getServerSideSitemap } from 'next-sitemap';


export const getServerSideProps = async (ctx: any) => {

  const fields = [];

  // Obtener los productos según el límite actual
  const products = await getProducts({ isFeatured: true });

  products.forEach(product => {
    fields.push({
      loc: `http://localhost:3001/product/${product.id}`,
      lastmod: new Date().toISOString(),
    });
  });

  return getServerSideSitemap(ctx, fields);
};

// Default export to prevent next.js errors
export default function SitemapIndex() {}
