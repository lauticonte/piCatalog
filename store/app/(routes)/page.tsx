import { getBillboards } from '@/actions/get-billboards'
import { getProducts } from '@/actions/get-products'
import ProductList from '@/components/product/product-list'
import Billboard from '@/components/ui/billboard'
import Container from '@/components/ui/container'

export default async function Home() {
  const billboard = await getBillboards(`65ec0a796702c9c0e4c0895f`)
  const products = await getProducts({ isFeatured: true })

  return (
    <Container>
      <div className='space-y-10 pb-10'>
        <Billboard data={billboard} />
        <div className='flex flex-col gap-y-8 mt-4 px-4 sm:px-6 lg:px-8'>
          <ProductList title='Featured Products' items={products} />
        </div>
      </div>
    </Container>
  )
}
