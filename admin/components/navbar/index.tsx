import prismadb from '@/lib/prismadb'
import { auth, UserButton } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import React from 'react'
import MainNav from './main-nav'
import StoreSwitcher from './store-switcher'

async function Navbar() {
  const { userId } = auth()

  if (!userId) {
    redirect(`/sign-in`)
  }

  const stores = await prismadb.store.findMany({
    where: {
      userId,
    },
  })

  return (
    <>
      <div className='border-b h-16 items-center backdrop-blur-md fixed top-0 left-0 w-full z-40 '>
        <div className='flex h-16  '>
          {/* <StoreSwitcher items={stores} /> */}
          <div className='ml-2 flex items-center space-x-2'>
            <UserButton afterSignOutUrl='/' />
          </div>
          <MainNav className='mx-4' />

        </div>
      </div>
      <div className='h-[60px]' />
    </>
  )
}

export default Navbar
