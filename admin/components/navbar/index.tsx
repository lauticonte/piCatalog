import prismadb from '@/lib/prismadb'
import { auth, UserButton } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import React from 'react'
import MainNav from './main-nav'
import Image from 'next/image'
import Link from 'next/link'
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
      {/* Barra oscura con la identidad de la tienda, en lugar del blanco por defecto. */}
      <header className='fixed top-0 left-0 z-40 w-full bg-[#1D232A] text-white shadow-sm'>
        <div className='flex h-16 items-center gap-6 px-4 sm:px-6'>
          <Link href={`/${stores[0]?.id ?? ''}`} className='flex shrink-0 items-center gap-2'>
            <Image src='/logo.png' alt='MH Garage' width={34} height={34} className='rounded-md' priority />
            <span className='hidden text-sm font-extrabold uppercase tracking-wider sm:block'>
              MH <span className='text-[#3aa17e]'>Garage</span>
            </span>
          </Link>

          <MainNav className='flex-1' />

          <div className='flex shrink-0 items-center gap-3'>
            <span className='hidden text-[11px] text-slate-400 sm:block' title={`commit ${process.env.NEXT_PUBLIC_COMMIT_SHA}`}>
              v{process.env.NEXT_PUBLIC_APP_VERSION} · {process.env.NEXT_PUBLIC_COMMIT_SHA}
            </span>
            <UserButton afterSignOutUrl='/' />
          </div>
        </div>
      </header>
      <div className='h-16' />
    </>
  )
}

export default Navbar
