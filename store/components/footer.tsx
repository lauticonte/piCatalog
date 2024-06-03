import React, { memo } from 'react';
import { AiFillHeart } from 'react-icons/ai';
import { IoHammerSharp } from "react-icons/io5";

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-gray-900 w-full z-50">
      <div className="mx-auto py-7 text-white text-center flex flex-col items-center">
        <a href="https://contelautaro.com.ar/" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1">
          <span className="text-sm">Desarrollado por</span>
          <span className="text-sm customfont ml-1">Conte</span>
        </a>
        <div className="flex items-center mt-2">
          <p className="text-sm">&copy; {year} MH GARAGE, todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

export default memo(Footer);
