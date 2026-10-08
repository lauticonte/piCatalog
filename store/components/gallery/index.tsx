'use client'

import type { Image as ImageType } from '@/types'
import { Tab } from '@headlessui/react'
import Image from 'next/image'
import React, { useEffect, useRef } from 'react'
import GalleryTab from './gallery-tab'
import { useMarkReady } from './reveal'

interface IGallery {
  images: ImageType[]
}

const Gallery = ({ images }: IGallery) => {
  const markReady = useMarkReady()

  // La ficha se muestra cuando cargaron la foto principal y todas las miniaturas.
  // Un Set y no un contador: onLoad puede dispararse más de una vez por imagen.
  const loaded = useRef(new Set<string>())
  const needed = images.length + 1

  const handleLoaded = (key: string) => () => {
    loaded.current.add(key)
    if (loaded.current.size >= needed) markReady?.()
  }

  useEffect(() => {
    if (!images.length) markReady?.()
  }, [images.length, markReady])

  return (
    <Tab.Group as='div' className='flex flex-col-reverse'>
      <div className='mt-6 w-full max-w-2xl sm:block lg:max-w-none'>
        <Tab.List className='grid grid-cols-4 gap-6'>
          {images?.map(image => (
            <GalleryTab key={image.id} image={image} onLoad={handleLoaded(`tab-${image.id}`)} />
          ))}
        </Tab.List>
      </div>
      <Tab.Panels className='aspect-square w-full'>
        {images.map((image, index) => (
          // unmount={false}: todas las fotos se descargan de entrada y cambiar de pestaña
          // es instantáneo, en vez de recién ahí empezar a bajar la imagen.
          <Tab.Panel key={image.id} unmount={false} className=''>
            <div className='aspect-square relative h-full w-auto rounded-lg overflow-hidden shadow-lg shadow-black'>
              <Image
                priority={index === 0}
                fetchPriority={index === 0 ? 'high' : 'low'}
                loading={index === 0 ? undefined : 'eager'}
                onLoad={index === 0 ? handleLoaded('main') : undefined}
                onError={index === 0 ? handleLoaded('main') : undefined}
                fill
                sizes='(max-width: 1024px) 100vw, 50vw'
                src={image.url}
                alt='Product'
                className='object-center object-contain bg-white'
                quality={85}
              />
            </div>
          </Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  )
}

export default Gallery
