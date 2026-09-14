'use client'

import React, { memo, useEffect, useState } from 'react'
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'

function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()
  const params = useParams()

  const routes: IRoutes[] = [
    {
      href: `/${params.storeId}`,
      label: 'Panel',
      active: pathname === `/${params.storeId}`,
    },
    {
      href: `/${params.storeId}/products`,
      label: 'Productos',
      active: pathname.includes(`/${params.storeId}/products`),
    },
    {
      href: `/${params.storeId}/categories`,
      label: 'Categorías',
      active: pathname.includes(`/${params.storeId}/categories`),
    },
    {
      href: `/${params.storeId}/brands`,
      label: 'Marcas',
      active: pathname.includes(`/${params.storeId}/brands`),
    },
    {
      href: `/${params.storeId}/billboards`,
      label: 'Billboards',
      active: pathname.includes(`/${params.storeId}/billboards`),
    },
    {
      href: `/${params.storeId}/combos`,
      label: 'Combos',
      active: pathname.includes(`/${params.storeId}/combos`),
    }

    // {
    //   href: `/${params.storeId}/orders`,
    //   label: 'Orders',
    //   active: pathname.includes(`/${params.storeId}/orders`),
    // },
    // {
    //   href: `/${params.storeId}/settings`,
    //   label: 'Settings',
    //   active: pathname === `/${params.storeId}/settings`,
    // },
  ]

  const [open, setOpen] = useState(false)
  const current = routes.find(route => route.active)

  // Al navegar se cierra el menú mobile: si no, queda tapando la pantalla nueva.
  useEffect(() => setOpen(false), [pathname])

  return (
    <>
      <nav className={cn('hidden items-center gap-1 md:flex', className)} {...props}>
        {routes?.map(route => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              'whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-semibold uppercase tracking-wide transition-colors',
              // La pestaña activa se marca con un fondo propio, no solo con el color del texto.
              route.active ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'
            )}
          >
            {route.label}
          </Link>
        ))}
      </nav>

      {/* Mobile: las seis secciones no entran en una fila (quedaban cortadas y había que
          adivinar que se podía deslizar). Se muestra la sección actual y un menú desplegable. */}
      <div className='flex min-w-0 flex-1 items-center justify-end md:hidden'>
        <span className='mr-auto truncate text-sm font-semibold uppercase tracking-wide text-slate-300'>
          {current?.label}
        </span>
        <button
          type='button'
          onClick={() => setOpen(value => !value)}
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
          className='flex h-10 w-10 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/10'
        >
          {open ? <HiOutlineX className='h-6 w-6' /> : <HiOutlineMenu className='h-6 w-6' />}
        </button>
      </div>

      {open && (
        <div className='fixed inset-x-0 bottom-0 top-16 z-40 md:hidden'>
          <button type='button' aria-label='Cerrar menú' className='absolute inset-0 bg-black/40' onClick={() => setOpen(false)} />
          <nav className='relative border-t border-white/10 bg-[#1D232A] px-3 pb-4 pt-2 shadow-xl'>
            {routes.map(route => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  'flex items-center rounded-lg px-4 py-3.5 text-base font-semibold transition-colors',
                  route.active ? 'bg-white/10 text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white'
                )}
              >
                {route.active && <span className='mr-3 h-5 w-1 rounded-full bg-[#3aa17e]' />}
                {route.label}
              </Link>
            ))}
            <p className='mt-2 border-t border-white/10 px-4 pt-3 text-[11px] text-slate-500'>
              v{process.env.NEXT_PUBLIC_APP_VERSION} · {process.env.NEXT_PUBLIC_COMMIT_SHA}
            </p>
          </nav>
        </div>
      )}
    </>
  )
}

export default memo(MainNav)
