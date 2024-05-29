import React, { memo } from 'react'

function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className='bg-gray-900 w-full z-50'>
      <div className='mx-auto py-7 text-white text-center '>

        <a href='https://contelautaro.com.ar/' target='blank'>
          <span className='text-center text-sm'>Desarrollado por
          <span className='text-center text-sm customfont ml-1'>Conte</span>
          </span>  
        
        </a>


        <p className='text-center text-sm'>&copy; {year} MH GARAGE, todos los derechos reservados.</p>
      </div>
    </footer>
  )
}

export default memo(Footer)
