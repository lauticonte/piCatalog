'use client'

import React, { Fragment, Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useSearchParams } from 'next/navigation'
import { Dialog, Transition } from '@headlessui/react'
import { LuMenu, LuX } from 'react-icons/lu'
import { cn } from '@/utils/utils'
import type { MenuData } from '@/actions/get-menu'
import { cantidadProductos, formatearNombre } from './menu-utils'

// match: rutas que cuentan como esa sección (la ficha de una marca está en /brand/[id]).
const LINKS = [
  { href: '/productos', label: 'Productos', match: ['/productos', '/category'] },
  { href: '/combos', label: 'Combos', match: ['/combos'] },
  { href: '/brands', label: 'Marcas', match: ['/brand'] },
]

/**
 * Menú hamburguesa de mobile: panel lateral con las secciones, las categorías y las
 * marcas. El Dialog de headlessui se encarga del foco, de Esc y de bloquear el scroll.
 */
function MobileNav({ menu }: { menu: MenuData }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [abierto, setAbierto] = useState(false)

  // Al navegar se cierra. Va también con los parámetros: elegir otra categoría estando en
  // /productos solo cambia ?categoryId.
  useEffect(() => setAbierto(false), [pathname, searchParams])

  return (
    <>
      <button
        type='button'
        onClick={() => setAbierto(true)}
        aria-label='Abrir menú'
        className='flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-white transition-colors hover:bg-white/5 active:scale-95'
      >
        <LuMenu className='h-6 w-6' strokeWidth={2.25} />
      </button>

      <Transition show={abierto} as={Fragment}>
        <Dialog onClose={setAbierto} className='relative z-50 md:hidden'>
          <Transition.Child
            as={Fragment}
            enter='transition-opacity duration-200 motion-reduce:transition-none'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='transition-opacity duration-150 motion-reduce:transition-none'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-black/60' aria-hidden />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter='transition-transform duration-200 ease-out motion-reduce:transition-none'
            enterFrom='translate-x-full'
            enterTo='translate-x-0'
            leave='transition-transform duration-150 ease-in motion-reduce:transition-none'
            leaveFrom='translate-x-0'
            leaveTo='translate-x-full'
          >
            <Dialog.Panel className='fixed inset-y-0 right-0 flex w-[88%] max-w-sm flex-col bg-[#151a20] text-white shadow-2xl shadow-black/60'>
              <div className='flex h-[72px] shrink-0 items-center justify-between border-b border-white/10 px-4'>
                <Dialog.Title className='text-[13px] font-black uppercase tracking-[0.06em] text-slate-300'>Menú</Dialog.Title>
                <button
                  type='button'
                  onClick={() => setAbierto(false)}
                  aria-label='Cerrar menú'
                  className='-mr-1 flex h-10 w-10 items-center justify-center rounded-md hover:bg-white/5'
                >
                  <LuX className='h-6 w-6' strokeWidth={2.25} />
                </button>
              </div>

              <div className='flex-1 overflow-y-auto overscroll-contain'>
                <nav className='border-b border-white/10 py-2'>
                  {LINKS.map(link => {
                    const activo = link.match.some(prefijo => pathname.startsWith(prefijo))
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setAbierto(false)}
                        aria-current={activo ? 'page' : undefined}
                        className={cn(
                          'relative flex h-12 items-center px-5 text-[15px] font-black uppercase tracking-[0.04em]',
                          activo ? 'text-white' : 'text-slate-300'
                        )}
                      >
                        {activo && <span className='absolute inset-y-3 left-0 w-[3px] rounded-r-sm bg-[#f5b301]' aria-hidden />}
                        {link.label}
                      </Link>
                    )
                  })}
                </nav>

                <section className='border-b border-white/10 px-2 py-4'>
                  <h2 className='px-3 pb-2 text-xs font-bold text-slate-400'>Categorías</h2>
                  <ul>
                    {menu.categories.map(category => (
                      <li key={category.id}>
                        <Link
                          href={`/productos?categoryId=${category.id}`}
                          onClick={() => setAbierto(false)}
                          className='flex items-center justify-between gap-3 rounded-md px-3 py-2.5 text-sm text-slate-200 active:bg-white/5'
                        >
                          <span>{formatearNombre(category.name)}</span>
                          <span className='shrink-0 text-xs text-slate-500'>{category.productsCount}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>

                <section className='px-5 py-4'>
                  <h2 className='pb-3 text-xs font-bold text-slate-400'>Marcas</h2>
                  <ul className='grid grid-cols-3 gap-2'>
                    {menu.brands.map(brand => (
                      <li key={brand.id}>
                        <Link
                          href={`/brand/${brand.id}`}
                          onClick={() => setAbierto(false)}
                          aria-label={`${brand.name}, ${cantidadProductos(brand.productsCount ?? 0)}`}
                          className='relative block h-12 rounded-md bg-white'
                        >
                          <Image src={brand.imageUrl} alt='' fill sizes='120px' className='object-contain px-2 py-1.5' />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  )
}

// useSearchParams en el layout raíz necesita un Suspense, si no todas las páginas pasan a
// renderizarse del lado del cliente. El fallback es el mismo botón, sin panel.
function MobileNavBoundary(props: { menu: MenuData }) {
  return (
    <Suspense fallback={<span className='h-10 w-10 shrink-0' aria-hidden />}>
      <MobileNav {...props} />
    </Suspense>
  )
}

export default MobileNavBoundary
