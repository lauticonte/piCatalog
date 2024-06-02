'use client'

import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { FaDeleteLeft } from 'react-icons/fa6'

function ClearFilter() {
  const router = useRouter()
  const params = useParams()

  return (
    <>
      <p
        onClick={() => router.push(`/brand/${params.brandId}`)}
        role='button'
        aria-hidden
        className='
        flex items-center gap-2
            text-md font-bold group cursor-pointer text-white'
      >
        <span className=''>Limpiar filtros</span> <FaDeleteLeft className='' size={20} />
      </p>
      <hr className='my-4' />
    </>
  )
}

export default ClearFilter
