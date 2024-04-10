import { getProducts } from '@/actions/get-products'
import { getServerSideSitemap } from 'next-sitemap'

interface IProductPage {
  params: {
    productId: string
  }
}

export const getServerSideProps = async (ctx: any, { params }: IProductPage) => {
  const products = await getProducts({ isFeatured: true })

  const dynamicRoutes = products.map(prod => `localhost:3001/product/${prod.id}`)

  const fields = [
    {
      loc: `localhost:3001/product/${dynamicRoutes}`,
      lastmod: new Date().toISOString(),
    },
  ]

  return getServerSideSitemap(ctx, fields)
}

// Default export to prevent next.js errors
export default function SitemapIndex() {}
