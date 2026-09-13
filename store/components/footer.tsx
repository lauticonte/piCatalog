import Link from 'next/link'
import Image from 'next/image'
import React, { memo } from 'react'
import { AiOutlineWhatsApp } from 'react-icons/ai'

const ENLACES = [
  { href: '/combos', label: 'Combos por rubro' },
  { href: '/brands', label: 'Marcas' },
]

function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className='w-full border-t border-white/10 bg-[#151a20] text-white'>
      <div className='mx-auto max-w-6xl px-6 py-10'>
        <div className='grid gap-8 sm:grid-cols-2 lg:grid-cols-3'>
          <div>
            <Image src='/logo-full.png' width={150} height={70} alt='MH Garage' className='h-8 w-auto' />
            <p className='mt-3 max-w-xs text-sm leading-relaxed text-slate-400'>
              Distribuidora de herramientas y equipamiento para taller. Envíos a todo el país.
            </p>
          </div>

          <div>
            <h3 className='text-[11px] font-bold uppercase tracking-widest text-[#f5b301]'>Catálogo</h3>
            <ul className='mt-3 space-y-2'>
              {ENLACES.map(enlace => (
                <li key={enlace.href}>
                  <Link href={enlace.href} className='text-sm text-slate-400 transition-colors hover:text-white'>
                    {enlace.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className='text-[11px] font-bold uppercase tracking-widest text-[#f5b301]'>Contacto</h3>
            <a
              href='https://wa.me/+541156977161'
              target='_blank'
              rel='noopener noreferrer'
              className='mt-3 inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-4 py-2 text-sm font-bold text-[#0b2e1a] transition hover:brightness-110'
            >
              <AiOutlineWhatsApp className='h-5 w-5' />
              Consultar por WhatsApp
            </a>
            <p className='mt-3 text-sm text-slate-400'>Atención de lunes a viernes</p>
          </div>
        </div>
      </div>

      {/* Barra inferior: la firma mantiene la tipografía de la marca personal. */}
      <div className='border-t border-white/10'>
        <div className='mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-4 text-center sm:flex-row sm:text-left'>
          <p className='text-xs text-slate-500'>
            &copy; {year} MH Garage. Todos los derechos reservados.
          </p>
          {/* La versión va bajo la firma, con el violeta de la marca Conte. */}
          <div className='flex flex-col items-center sm:items-end'>
            <a
              href='https://contelautaro.com.ar/'
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center gap-1 text-xs text-slate-500 transition-colors hover:text-white'
            >
              <span>Desarrollado por</span>
              <span className='customfont text-sm'>Conte</span>
            </a>
            <span className='text-[10px] font-semibold text-[#624AD9]' title={`commit ${process.env.NEXT_PUBLIC_COMMIT_SHA}`}>
              v{process.env.NEXT_PUBLIC_APP_VERSION}
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default memo(Footer)
