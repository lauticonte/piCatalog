import Link from 'next/link'
import React, { Fragment } from 'react'
import Container from '../ui/container'
import MainNav from './main-nav'
import Mobilenav from './mobile-nav'
import Image from 'next/image'
import { getMenuData } from '@/actions/get-menu'
import SearchForm from './search-form'
import { LuCreditCard, LuHeadphones, LuPackageCheck, LuStore, LuTag, LuTruck, LuWrench } from 'react-icons/lu'

// Mensajes de la franja superior. Se repiten en bucle, así que conviene que sean
// cortos y que ninguno dependa del anterior.
const MENSAJES = [
  { icon: LuTruck, texto: 'Envíos a todo el país' },
  { icon: LuStore, texto: 'Retiro sin cargo' },
  { icon: LuCreditCard, texto: 'Cuotas fijas' },
  { icon: LuTag, texto: 'Precios mayoristas' },
  { icon: LuWrench, texto: 'Asesoramiento técnico' },
  { icon: LuPackageCheck, texto: 'Más de 1.000 productos' },
  { icon: LuHeadphones, texto: 'Consultas y pedidos por WhatsApp' },
]

async function Navbar() {
  const menu = await getMenuData()

  return (
    <Fragment>
      {/* sticky en vez de fixed: así el header ocupa su lugar en el flujo y nada
          queda tapado. Con fixed hacía falta un espaciador de altura fija que se
          desajustaba en cada breakpoint (en mobile suma la fila del buscador). */}
      <header className='sticky top-0 z-30 w-full text-white'>
        {/* Franja de servicio en marquesina. El contenido va duplicado a propósito:
            la animación desplaza el track un 50% y vuelve al inicio sin corte. */}
        {/* Amarilla con texto oscuro: la franja gris con puntitos era la de cualquier
            plantilla; el amarillo es el color de MH y del rubro herramientas. */}
        <div className='overflow-hidden bg-[#f5b301] text-[#1D232A]'>
          <div className='marquee-track flex py-1.5'>
            {[0, 1].map(copia => (
              <div key={copia} className='flex shrink-0 items-center' aria-hidden={copia === 1}>
                {/* Cada mitad repite los mensajes 3 veces: con una sola vuelta la mitad era
                    más angosta que un monitor ancho y quedaba un hueco al final del ciclo. */}
                {[0, 1, 2].flatMap(vuelta => MENSAJES.map(mensaje => ({ ...mensaje, vuelta }))).map(({ icon: Icono, texto, vuelta }) => (
                  <span key={`${vuelta}-${texto}`} className='flex items-center whitespace-nowrap text-[12px] font-semibold'>
                    <Icono className='mr-1.5 h-3.5 w-3.5 shrink-0' strokeWidth={2.25} />
                    {texto}
                    {/* Separador fino entre mensajes, a igual distancia de ambos lados. */}
                    <span className='mx-6 h-3 w-px bg-[#1D232A]/25' aria-hidden />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Fondo sólido: el anterior era translúcido y se comía el borde del hero. */}
        <div className='border-b border-white/10 bg-[#151a20]'>
          <Container>
            {/* relative: el panel desplegable del menú se ubica contra esta fila. */}
            <div className='relative flex h-[72px] items-center gap-3 px-4 sm:px-6 md:gap-4 lg:gap-6 lg:px-8'>
              {/* En mobile van en una sola fila el isotipo MH, el buscador y el menú
                  hamburguesa; el logo completo no entraba a un tamaño legible. */}
              <Link href='/' className='shrink-0' aria-label='MH Garage'>
                <Image src='/logo.png' width={48} height={40} unoptimized alt='MH Garage' className='h-10 w-auto md:hidden' priority />
                <Image src='/logo-full.png' width={115} height={40} unoptimized alt='MH Garage' className='hidden h-10 w-auto md:block' priority />
              </Link>

              <SearchForm className='min-w-0 flex-1 md:hidden' placeholder='Buscar productos' />

              <MainNav menu={menu} />

              <div className='-mr-2 md:hidden'>
                <Mobilenav menu={menu} />
              </div>
            </div>
          </Container>
        </div>
      </header>
    </Fragment>
  )
}

export default Navbar
