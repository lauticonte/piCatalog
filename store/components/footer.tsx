import Image from 'next/image'
import React from 'react'
import { AiOutlineWhatsApp } from 'react-icons/ai'
import { LuClock, LuCreditCard, LuStore, LuTag, LuTruck } from 'react-icons/lu'

const WHATSAPP = { href: 'https://wa.me/+541156977161', numero: '11 5697-7161' }

// Los mismos diferenciales de la franja superior: acá se leen quietos y completos.
const BENEFICIOS = [
  { icon: LuTruck, texto: 'Envíos a todo el país' },
  { icon: LuStore, texto: 'Retiro sin cargo' },
  { icon: LuCreditCard, texto: 'Cuotas fijas' },
  { icon: LuTag, texto: 'Precios mayoristas' },
]

function Titulo({ children }: { children: React.ReactNode }) {
  return <h3 className='text-[11px] font-bold uppercase tracking-wider text-[#f5b301]'>{children}</h3>
}

function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className='w-full border-t border-white/10 bg-[#151a20] text-white'>
      <div className='mx-auto max-w-6xl px-6 py-12'>
        <div className='grid items-center gap-10 lg:grid-cols-[1fr_minmax(0,380px)] lg:gap-16'>
          <div>
            <Image src='/logo-full.png' width={150} height={70} alt='MH Garage' className='h-10 w-auto' />
            <p className='mt-4 max-w-xs text-sm leading-relaxed text-slate-400'>
              Distribuidora de herramientas y equipamiento para taller, con las marcas que usan los profesionales.
            </p>
            <ul className='mt-5 grid grid-cols-2 gap-x-4 gap-y-2.5'>
              {BENEFICIOS.map(({ icon: Icono, texto }) => (
                <li key={texto} className='flex items-center gap-2 text-[13px] text-slate-300'>
                  <Icono className='h-4 w-4 shrink-0 text-[#f5b301]' />
                  {texto}
                </li>
              ))}
            </ul>
          </div>

          <div className='rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center'>
            <Titulo>Contacto</Titulo>
            <p className='mt-3 text-sm text-slate-400'>Consultas, presupuestos y pedidos por WhatsApp.</p>
            <a
              href={WHATSAPP.href}
              target='_blank'
              rel='noopener noreferrer'
              className='mt-3 block text-xl font-extrabold tracking-tight text-white hover:text-[#25D366]'
            >
              {WHATSAPP.numero}
            </a>
            <a
              href={WHATSAPP.href}
              target='_blank'
              rel='noopener noreferrer'
              className='mt-4 flex h-10 items-center justify-center gap-2 rounded-lg bg-[#25D366] text-[12px] font-extrabold uppercase leading-none tracking-wide text-[#0b2e1a] transition hover:brightness-110'
            >
              <AiOutlineWhatsApp className='h-5 w-5 shrink-0' />
              <span className='leading-none'>Escribinos</span>
            </a>
            <p className='mt-4 flex items-center justify-center gap-2 text-[13px] text-slate-400'>
              <LuClock className='h-4 w-4 shrink-0 text-slate-500' />
              Lunes a sábados de 9 a 18 h
            </p>
          </div>
        </div>
      </div>

      {/* Barra inferior: la firma mantiene la tipografía de la marca personal. */}
      <div className='border-t border-white/10'>
        <div className='mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-4 text-center sm:flex-row sm:text-left'>
          <p className='text-xs text-slate-500'>&copy; {year} MH Garage. Todos los derechos reservados.</p>
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

export default Footer
