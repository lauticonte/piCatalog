import { getCombos } from '@/actions/get-combos'
import Link from 'next/link'
import React from 'react'
import Container from '@/components/ui/container'
import { BsTools } from 'react-icons/bs'

async function CombosPage() {
  const combos = await getCombos()

  return (
    <div className='flex flex-1 flex-col bg-custom'>
      <Container>
        <div className='px-4 pb-16'>
          <h2 className='text-center text-2xl font-bold my-8 text-white'>NUESTROS COMBOS</h2>
          <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center'>
            {combos.map(combo => (
              <Link key={combo.id} href={`/combos/${combo.id}`} className='w-full'>
                <div className='group border-0 flex h-full flex-col overflow-hidden rounded-xl bg-gray-700 shadow-xl shadow-black transition hover:bg-gray-600'>
                  <div className='relative lg:h-40 h-28 w-full overflow-hidden bg-gray-800'>
                    {combo.imageUrl ? (
                      <img
                        src={combo.imageUrl}
                        alt={combo.name}
                        className='h-full w-full object-cover transition group-hover:scale-105'
                      />
                    ) : (
                      // Sin imagen cargada: un marcador sobrio en vez de un hueco vacío.
                      <div className='flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900'>
                        <BsTools className='h-10 w-10 text-gray-500' />
                      </div>
                    )}
                  </div>
                  <div className='px-4 py-3 text-center'>
                    <h3 className='text-base lg:text-lg uppercase font-medium text-white'>{combo.name}</h3>
                    <span className='mt-1 block text-xs text-gray-300'>
                      {combo.products.length} producto{combo.products.length === 1 ? '' : 's'}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </div>
  )
}

export default CombosPage
