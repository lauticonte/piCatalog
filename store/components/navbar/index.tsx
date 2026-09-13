import Link from 'next/link'
import React, { Fragment } from 'react'
import Container from '../ui/container'
import MainNav from './main-nav'
import Mobilenav from './mobile-nav'
import Image from 'next/image'
import { getBrands } from '@/actions/get-brands'
import SearchForm from './search-form'

// Mensajes de la franja superior. Se repiten en bucle, así que conviene que sean
// cortos y que ninguno dependa del anterior.
const MENSAJES = [
  'Envíos a todo el país',
  'Consultas y pedidos por WhatsApp',
  'Más de 1.000 productos en catálogo',
  'Bremen · Lusqtoff · Eurotech · Ingco · Laser',
  'Asesoramiento técnico',
  'Precios mayoristas',
]

async function Navbar() {
  const brands = await getBrands()

  return (
    <Fragment>
      {/* sticky en vez de fixed: así el header ocupa su lugar en el flujo y nada
          queda tapado. Con fixed hacía falta un espaciador de altura fija que se
          desajustaba en cada breakpoint (en mobile suma la fila del buscador). */}
      <header className='sticky top-0 z-30 w-full text-white'>
        {/* Franja de servicio en marquesina. El contenido va duplicado a propósito:
            la animación desplaza el track un 50% y vuelve al inicio sin corte. */}
        <div className='overflow-hidden border-b border-white/5 bg-[#0f1418]'>
          <div className='marquee-track flex py-2'>
            {[0, 1].map(copia => (
              <div key={copia} className='flex shrink-0 items-center' aria-hidden={copia === 1}>
                {MENSAJES.map(mensaje => (
                  // El punto va pegado a su propio texto y la separación entre mensajes
                  // se da con el padding derecho: antes quedaba más cerca del mensaje anterior.
                  <span
                    key={mensaje}
                    className='flex items-center gap-2 whitespace-nowrap pr-12 text-[11px] font-semibold uppercase tracking-wider text-slate-300'
                  >
                    <span className='h-1 w-1 shrink-0 rounded-full bg-[#f5b301]' />
                    {mensaje}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Fondo sólido: el anterior era translúcido y se comía el borde del hero. */}
        <div className='border-b border-white/10 bg-[#151a20]'>
          <Container>
            <div className='flex h-[68px] items-center gap-4 px-4 sm:px-6 lg:gap-8 lg:px-8'>
              <Link href='/' className='shrink-0' aria-label='MH Garage'>
                <Image src='/logo-full.png' width={150} height={70} alt='MH Garage' className='h-8 w-auto' priority />
              </Link>

              <MainNav data={brands} />

              <div className='ml-auto block md:hidden'>
                <Mobilenav brands={brands} />
              </div>
            </div>

            {/* En mobile el buscador no entra en la misma fila que el logo y el menú,
                así que baja a una fila propia en vez de desaparecer. */}
            <div className='px-4 pb-3 md:hidden'>
              <SearchForm />
            </div>
          </Container>
        </div>
      </header>
    </Fragment>
  )
}

export default Navbar
