import Link from 'next/link'
import React, { Fragment } from 'react'
import Container from '../ui/container'
import MainNav from './main-nav'
import Mobilenav from './mobile-nav'
import NavActions from './nav-actions'
import Image from 'next/image'
import { getBrands } from '@/actions/get-brands'

async function Navbar() {
  const brands = await getBrands()
  

  return (
    <Fragment>
      <div className='border-b bg-black-900/10 backdrop-blur-md fixed left-0 w-full top-0 z-30 text-white '>
        <Container>
          <div className='relative px-0 sm:px-6 lg:px-8 flex h-16 items-center'>
            <Link
              href='/'
              className='ml-4 flex lg:ml-0 gap-x-2 text-xl font-bold hover:text-white focus:text-white focus:outline-none '
            >
              <Image src='/logo-full.png' width={150} height={70} alt='logo' />

            </Link>
            <MainNav data={brands} />
            <div className='block md:hidden ml-3'>
              <Mobilenav brands={brands} />
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
