import prismadb from '@/lib/prismadb'
import { auth, UserButton } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import React from 'react'
import MainNav from './main-nav'
import Image from 'next/image'
import Link from 'next/link'
import { ChangelogLink } from '@/components/changelog/changelog-seen'

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
      {/* Misma barra que la tienda: fondo oscuro, logo de MH y pestañas con barra amarilla
          bajo la sección activa, así el panel se reconoce como parte de la marca. */}
      <header className='fixed left-0 top-0 z-40 w-full border-b border-white/10 bg-[#151a20] text-white'>
        <div className='flex h-16 items-center gap-4 px-4 sm:px-6 lg:gap-6'>
          <Link href={`/${stores[0]?.id ?? ''}`} className='flex shrink-0 items-center' aria-label='MH Garage, inicio del panel'>
            <Image src='/logo-mark.png' alt='' width={46} height={38} unoptimized className='h-9 w-auto xl:hidden' priority />
            <Image src='/logo-full.png' alt='' width={104} height={36} unoptimized className='hidden h-9 w-auto xl:block' priority />
          </Link>

          <MainNav className='h-full flex-1' />

          <div className='flex shrink-0 items-center gap-4'>
            <ChangelogLink className='hidden text-xs font-semibold text-slate-400 lg:inline-flex' />
            <UserButton afterSignOutUrl='/' />
          </div>
        </div>
      </header>
      <div className='h-16' />
    </>
  )
}

export default Navbar
