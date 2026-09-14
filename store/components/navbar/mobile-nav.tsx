'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/utils/utils'
import { Category } from '@/types'

interface IMobileNav {
  brands: Category[]
}

const LINKS = [
  { href: '/productos', label: 'Productos' },
  { href: '/combos', label: 'Combos' },
  { href: '/brands', label: 'Marcas' },
]

// Links simples y compactos: con el menú desplegable de antes (flecha y padding) los
// tres no entraban al lado del logo y la página se ensanchaba.
function MobileNav(_props: IMobileNav) {
  const pathname = usePathname()

  return (
    <nav className='flex items-center'>
      {LINKS.map(link => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            'rounded-md px-2 py-2 text-[13px] font-bold transition-colors',
            pathname.startsWith(link.href) ? 'text-[#f5b301]' : 'text-white'
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  )
}

export default MobileNav
