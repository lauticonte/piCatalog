import React, { memo } from 'react'

function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className='bg-white border-t mt-[50px]  w-full'>
      <div className='mx-auto py-7'>

        <a href='https://contelautaro.com.ar/' target='blank'>
          <p className='text-center text-sm text-black customfont'>Conte</p>    
        
        </a>


        <p className='text-center text-sm text-black'>&copy; {year}, todos los derechos reservados.</p>
      </div>
    </footer>
  )
}

export default memo(Footer)
