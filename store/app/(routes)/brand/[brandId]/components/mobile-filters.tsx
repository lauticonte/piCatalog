'use client'

import { Color, Brand, Category } from '@/types'
import React from 'react'
import { BsPlus } from 'react-icons/bs'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import Filter from './filter'
import ClearFilter from './clear-filter'

interface IMobileFilters {
  categories: Category[]
}

function MobileFilters({ categories }: IMobileFilters) {
  return (
    <Sheet>
      <SheetTrigger className='lg:hidden flex items-center gap-3 rounded-full bg-black border-transparent px-5 py-3 disabled:cursor-not-allowed disabled:opacity-50 text-white font-semibold hover:opacity-75 transition'>
        Filtros
        <BsPlus size={20} />
      </SheetTrigger>
      <SheetContent>
        <div className='p-4 text-white'>
          

          {/* Muestra todas las marcas para poder filtrar por ellas */}
          <Filter valueKey='categoryId' name='CATEGORÍAS' data={categories} />
          <ClearFilter />
        </div>
      </SheetContent>
    </Sheet>
  );
}



export default MobileFilters
