'use client'

import React, { memo, useEffect, useState } from 'react'
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi'
import { ChangelogLink } from '@/components/changelog/changelog-seen'
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
      {/* Pestañas del alto de la barra, como en la tienda: la activa lleva la barra amarilla
          pegada al borde inferior y el resto la muestra al pasar el mouse. */}
      <nav className={cn('hidden items-stretch self-stretch md:flex', className)} {...props}>
        {routes?.map(route => (
          <Link
            key={route.href}
            href={route.href}
            aria-current={route.active ? 'page' : undefined}
            className='group relative flex items-center whitespace-nowrap px-3 lg:px-4'
          >
            <span
              className={cn(
                'text-xs font-black uppercase tracking-[0.06em] transition-colors',
                route.active ? 'text-white' : 'text-slate-400 group-hover:text-white'
              )}
            >
              {route.label}
            </span>
            <span
              className={cn(
                'absolute inset-x-2 bottom-0 h-[3px] rounded-t-sm bg-[#f5b301] transition-transform duration-200 motion-reduce:transition-none',
                route.active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
              )}
              aria-hidden
            />
          </Link>
        ))}
      </nav>

      {/* Mobile: las seis secciones no entran en una fila (quedaban cortadas y había que
          adivinar que se podía deslizar). Se muestra la sección actual y un menú desplegable. */}
      <div className='flex min-w-0 flex-1 items-center justify-end md:hidden'>
        <span className='mr-auto truncate text-xs font-black uppercase tracking-[0.06em] text-white'>
          {current?.label ?? (pathname.endsWith('/novedades') ? 'Novedades' : '')}
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
          <nav className='relative border-t border-white/10 bg-[#151a20] px-3 pb-4 pt-2 shadow-xl'>
            {routes.map(route => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  'relative flex items-center rounded-lg px-4 py-3.5 text-sm font-black uppercase tracking-[0.04em] transition-colors',
                  route.active ? 'bg-white/5 text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white'
                )}
              >
                {route.active && <span className='absolute inset-y-3 left-0 w-[3px] rounded-r-sm bg-[#f5b301]' aria-hidden />}
                {route.label}
              </Link>
            ))}
            <div className='mt-2 border-t border-white/10 px-4 pt-3'>
              <ChangelogLink label='Novedades' className='text-sm font-semibold text-slate-300' />
            </div>
          </nav>
        </div>
      )}
    </>
  )
}

export default memo(MainNav)
