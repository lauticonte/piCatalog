import { getBillboards } from '@/actions/get-billboards'
import { getProducts } from '@/actions/get-products'
import ProductList from '@/components/product/product-list'
import Billboard from '@/components/ui/billboard'
import Container from '@/components/ui/container'
import BlurImage from '@/components/blur-image'
import Image from 'next/image'

const srcImage = 'https://images.unsplash.com/photo-1632216820004-4b3b3b3b3b3b'

export default async function Home() {
  const billboard = await getBillboards('6602115b567a6fa1743446d6')  
  let products = await getProducts({ isFeatured: true })

  const srcImage = 'https://assets-global.website-files.com/5a9ee6416e90d20001b20038/64f5984389fc94d2acfcbf86_Rectangle%20(13).svg'

  products = products.sort(() => Math.random() - 0.5);


  return (
    <Container>
    <div className='rounded-xl w-full bg-custom'>
  <div className='relative w-full h-[250px] sm:h-[500px] new-leaf-gradient'>
    <p></p>
  </div>
</div>


      <div className='space-y-10 pt-10 pb-10 bg-custom'>
        <div className='flex flex-col gap-y-8 px-4 sm:px-6 lg:px-0'>
          <ProductList title='Productos Destacados' items={products} />
        </div>
      </div>
    </Container>
  )
}