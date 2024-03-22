'use client'

import { Color, Brand } from '@/types'
import React from 'react'
import { BsPlus } from 'react-icons/bs'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import Filter from './filter'
import ClearFilter from './clear-filter'

interface IMobileFilters {
  brands: Brand[]
  colors: Color[]
}

function MobileFilters({ brands, colors }: IMobileFilters) {
  return (
    <Sheet>
      <SheetTrigger className='lg:hidden flex items-center gap-3 rounded-full bg-black border-transparent px-5 py-3 disabled:cursor-not-allowed disabled:opacity-50 text-white font-semibold hover:opacity-75 transition'>
        Filters
        <BsPlus size={20} />
      </SheetTrigger>
      <SheetContent>
        <div className='p-4'>
          <ClearFilter />
          <Filter valueKey='bransId' name='Brands' data={brands} />
          <Filter valueKey='colorId' name='Colors' data={colors} />
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default MobileFilters
