import { getCombo } from '@/actions/get-combo'
import ProductCard from '@/components/product/product-card'
import Container from '@/components/ui/container'
import NoResults from '@/components/ui/no-result'
import React from 'react'

interface IComboPage {
  params: {
    comboId: string
  }
}

async function ComboPage({ params }: IComboPage) {
  const combo = await getCombo(params.comboId)

  // ProductCard accede a images[0].url sin guarda: un producto sin imagen rompería la página.
  const products = combo?.products?.filter(product => product.images?.length > 0) ?? []

  return (
    <div className='flex flex-1 flex-col bg-custom'>
      <Container>
        <div className='px-4 sm:px-6 lg:px-8 pb-16'>
          {combo?.imageUrl ? (
            <div className='mt-8 h-40 lg:h-64 w-full overflow-hidden rounded-xl'>
              <img src={combo.imageUrl} alt={combo.name} className='h-full w-full object-cover' />
            </div>
          ) : null}

          <h1 className='text-center text-2xl font-bold mt-8 text-white uppercase'>{combo?.name}</h1>
          {combo?.desc ? <p className='text-center mt-2 mb-8 text-sm text-gray-300'>{combo.desc}</p> : <div className='mb-8' />}

          {products.length === 0 ? (
            <NoResults />
          ) : (
            <div className='grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3'>
              {products.map(product => (
                <ProductCard key={product.id} data={product} />
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  )
}

export default ComboPage
