'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { LuArrowRight, LuChevronDown } from 'react-icons/lu'
import { cn } from '@/utils/utils'
import type { MenuData } from '@/actions/get-menu'
import SearchForm from './search-form'
import { cantidadProductos as cantidad, formatearNombre } from './menu-utils'

type Menu = 'productos' | 'marcas'

// Margen para pasar el mouse del botón al panel sin que se cierre en el camino.
const CIERRE_MS = 150

function MainNav({ menu }: { menu: MenuData }) {
  const pathname = usePathname()
  const [abierto, setAbierto] = useState<Menu | null>(null)
  const cierre = useRef<ReturnType<typeof setTimeout>>()
  const navRef = useRef<HTMLDivElement>(null)

  const abrir = (cual: Menu) => {
    clearTimeout(cierre.current)
    setAbierto(cual)
  }
  const cerrarConDemora = () => {
    clearTimeout(cierre.current)
    cierre.current = setTimeout(() => setAbierto(null), CIERRE_MS)
  }

  // Al navegar (búsqueda, links de afuera del panel) el panel no tiene que quedar abierto.
  useEffect(() => setAbierto(null), [pathname])

  useEffect(() => {
    if (!abierto) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setAbierto(null)
    const onClick = (e: MouseEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setAbierto(null)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onClick)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onClick)
    }
  }, [abierto])

  useEffect(() => () => clearTimeout(cierre.current), [])

  // Cada opción es una pestaña del alto de la barra, con una barra amarilla pegada al
  // borde inferior del header cuando está activa o abierta.
  const contenidoTab = (label: string, resaltado: boolean, conFlecha?: boolean, girada?: boolean) => (
    <>
      <span
        className={cn(
          'flex items-center gap-1 text-[13px] font-black uppercase tracking-[0.06em] transition-colors',
          resaltado ? 'text-white' : 'text-slate-300 group-hover:text-white'
        )}
      >
        {label}
        {conFlecha && (
          <LuChevronDown
            className={cn('h-3.5 w-3.5 transition-transform duration-200', resaltado ? 'text-[#f5b301]' : 'text-slate-500', girada && 'rotate-180')}
            strokeWidth={3}
            aria-hidden
          />
        )}
      </span>
      <span
        className={cn(
          'absolute inset-x-3 bottom-0 h-[3px] rounded-t-sm bg-[#f5b301] transition-transform duration-200 motion-reduce:transition-none',
          resaltado ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
        )}
        aria-hidden
      />
    </>
  )

  const claseTab = 'group relative flex h-[72px] items-center justify-center px-5'

  const botonMenu = (cual: Menu, label: string, activo: boolean) => (
    <button
      type='button'
      className={claseTab}
      aria-expanded={abierto === cual}
      aria-controls={`menu-${cual}`}
      onClick={() => (abierto === cual ? setAbierto(null) : abrir(cual))}
      onMouseEnter={() => abrir(cual)}
      onMouseLeave={cerrarConDemora}
    >
      {contenidoTab(label, activo || abierto === cual, true, abierto === cual)}
    </button>
  )

  return (
    <div ref={navRef} className='hidden flex-1 items-center gap-8 md:flex'>
      {/* El buscador va centrado en el espacio libre y las pestañas juntas a la derecha. */}
      <div className='flex min-w-0 flex-1 justify-center'>
        <SearchForm className='w-full max-w-xl' />
      </div>

      <nav className='flex items-stretch divide-x divide-white/[0.07] border-l border-white/[0.07]'>
        {botonMenu('productos', 'Productos', pathname.startsWith('/productos') || pathname.startsWith('/category'))}
        <Link href='/combos' className={claseTab}>
          {contenidoTab('Combos', pathname.startsWith('/combos'))}
        </Link>
        {botonMenu('marcas', 'Marcas', pathname.startsWith('/brand'))}
      </nav>

      {/* El panel ocupa el ancho de la barra: se posiciona contra la fila relativa del
          header (navbar/index.tsx), no contra el botón. */}
      {abierto && (
        <div
          id={`menu-${abierto}`}
          className='absolute inset-x-4 top-full z-40 grid grid-cols-[200px_1fr] items-start gap-6 rounded-b-2xl border border-t-0 border-white/10 bg-[#151a20] p-5 shadow-2xl shadow-black/60 duration-150 animate-in fade-in-0 slide-in-from-top-1 motion-reduce:animate-none sm:inset-x-6 lg:inset-x-8'
          onMouseEnter={() => abrir(abierto)}
          onMouseLeave={cerrarConDemora}
          // Entre categorías solo cambia ?categoryId y el pathname no, así que el efecto de
          // arriba no alcanza: se cierra al elegir cualquier link del panel.
          onClick={e => (e.target as HTMLElement).closest('a') && setAbierto(null)}
        >
          {abierto === 'productos' ? (
            <>
              <Atajo
                href='/productos'
                titulo='Ver todo el catálogo'
                detalle={`${cantidad(menu.total)} en ${menu.categories.length} categorías`}
              />
              <ul className='grid grid-cols-2 gap-x-2 gap-y-1 lg:grid-cols-3'>
                {menu.categories.map(category => (
                  <li key={category.id}>
                    <Link
                      href={`/productos?categoryId=${category.id}`}
                      className='group flex items-center gap-3 rounded-xl p-1.5 transition-colors hover:bg-white/5'
                    >
                      <span className='relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-white'>
                        {category.imageUrl && (
                          <Image src={category.imageUrl} alt='' fill sizes='44px' className='object-contain p-1' />
                        )}
                      </span>
                      <span className='min-w-0'>
                        <span className='line-clamp-2 text-sm font-semibold leading-tight text-slate-100 transition-colors group-hover:text-[#f5b301]'>
                          {formatearNombre(category.name)}
                        </span>
                        <span className='mt-0.5 block text-xs text-slate-400'>{cantidad(category.productsCount)}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <>
              <Atajo href='/brands' titulo='Ver todas las marcas' detalle={`${menu.brands.length} marcas`} />
              <ul className='grid grid-cols-4 gap-3'>
                {menu.brands.map(brand => (
                  <li key={brand.id}>
                    <Link href={`/brand/${brand.id}`} aria-label={brand.name} className='group block'>
                      <span className='relative block h-16 rounded-xl bg-white ring-2 ring-transparent transition group-hover:ring-[#f5b301]'>
                        <Image src={brand.imageUrl} alt='' fill sizes='180px' className='object-contain px-3 py-2' />
                      </span>
                      {brand.productsCount !== undefined && (
                        <span className='mt-1.5 block text-center text-xs text-slate-400 transition-colors group-hover:text-slate-200'>
                          {cantidad(brand.productsCount)}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  )
}

/** Bloque amarillo de la izquierda del panel: el atajo a la lista completa. */
function Atajo({ href, titulo, detalle }: { href: string; titulo: string; detalle: string }) {
  return (
    <Link
      href={href}
      className='group flex flex-col justify-between rounded-xl bg-[#f5b301] p-5 text-[#1D232A] transition active:scale-[0.98]'
    >
      <span>
        <span className='block text-xl font-black leading-tight'>{titulo}</span>
        <span className='mt-2 block text-sm font-medium text-[#1D232A]/75'>{detalle}</span>
      </span>
      <span className='mt-6 flex h-10 w-10 items-center justify-center rounded-full bg-[#1D232A] text-[#f5b301] transition-transform group-hover:translate-x-1'>
        <LuArrowRight className='h-5 w-5' aria-hidden />
      </span>
    </Link>
  )
}

export default MainNav
