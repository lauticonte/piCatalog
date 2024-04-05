'use client'

import { useCart } from '@/hooks/use-cart'
import { useRouter } from 'next/navigation'
import React, { MouseEventHandler, useEffect, useState } from 'react'
import { AiOutlineSearch } from 'react-icons/ai'
import Button from '../ui/button'

function NavActions() {
  const router = useRouter()
  const { items } = useCart()
  const [isMounted, setIsMounted] = useState(false)


  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <div className='ml-auto flex items-center gap-x-4'>
      <Button
        
        className='flex items-center rounded-full px-6 py-2 lg:hidden'
        aria-label='shopping cart button'
        role='button'
      >
        <AiOutlineSearch size={20} color='white' />
      </Button>
    </div>
  )
}

export default NavActions
