'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/utils/utils'
import { Brand } from '@/types'
import SearchForm from './search-form'

interface IMainNav {
  data: Brand[]
}

function MainNav({ data }: IMainNav) {
  const pathname = usePathname()

  const links = [
    { href: '/combos', label: 'Combos' },
    { href: '/brands', label: 'Marcas' },
  ]

  return (
    <div className='hidden flex-1 items-center gap-8 md:flex'>
      <SearchForm className='w-full max-w-md' />

      <nav className='ml-auto flex items-center gap-1'>
        {links.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'rounded-md px-3 py-2 text-sm font-bold uppercase tracking-wide transition-colors',
              pathname.startsWith(link.href) ? 'bg-white/5 text-[#f5b301]' : 'text-slate-300 hover:text-white'
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  )
}

export default MainNav
