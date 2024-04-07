import { getCategories } from '@/actions/get-categories'
import Link from 'next/link'
import React, { Fragment } from 'react'
import Container from '../ui/container'
import MainNav from './main-nav'
import Mobilenav from './mobile-nav'
import NavActions from './nav-actions'

async function Navbar() {
  const categories = await getCategories()
  

  return (
    <Fragment>
      <div className='border-b bg-black-900/10 backdrop-blur-md fixed left-0 w-full top-0 z-30 text-white '>
        <Container>
          <div className='relative px-4 sm:px-6 lg:px-8 flex h-16 items-center'>
            <Link
              href='/'
              className='ml-4 flex lg:ml-0 gap-x-2 text-xl font-bold hover:text-white focus:text-white focus:outline-none'
            >
              mhGarage
            </Link>
            <MainNav data={categories} />
            <div className='block md:hidden ml-3'>
              <Mobilenav categories={categories} />
            </div>
            <NavActions />
          </div>
        </Container>
      </div>
      <div className='h-[60px]' />
    </Fragment>
  )
}

export default Navbar
