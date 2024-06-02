'use client'

import React, {useState} from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils/utils';
import { Brand } from '@/types';

interface IMainNav {
  data: Brand[];
}

function MainNav({ data }: IMainNav) {
  const pathname = usePathname();
  const [searchTerm, setSearchTerm] = useState('');

    // Función para manejar cambios en el campo de búsqueda
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
    };
  
    // Función para realizar la búsqueda
    const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      // Aquí podrías implementar la lógica de búsqueda y redirigir a la página de resultados
      console.log('Realizar búsqueda con término:', searchTerm);
    };

    //Barra de busqueda a la derecha:

    return (
      <div className='hidden md:flex mx-6 items-center space-x-4 lg:space-x-6'>
        {/* Formulario de búsqueda */}
        <form onSubmit={handleSearchSubmit}>
          <input
            type='text'
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder='Buscar productos...'
            
            className='w-48 sm:w-64 px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-black placeholder-gray-400 transition-colors'
          />
        </form>
  
        {/* Menú desplegable de categorías */}
        <div className='relative group'>
          <button className='text-sm font-medium transition-colors hover:text-primary hover:underline focus:outline-none focus:underline'>
            Marcas
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5 ml-1 inline-block'
              viewBox='0 0 20 20'
              fill='currentColor'
            >
            <path
              fillRule='evenodd'
              d='M10 3a1 1 0 0 1 .707.293l4 4a1 1 0 0 1-1.414 1.414L10 5.414 6.707 8.707a1 1 0 0 1-1.414-1.414l4-4A1 1 0 0 1 10 3zM10 17a1 1 0 0 1-.707-.293l-4-4a1 1 0 1 1 1.414-1.414L10 14.586l3.293-3.293a1 1 0 0 1 1.414 1.414l-4 4A1 1 0 0 1 10 17z'
            />
          </svg>
        </button>
        <ul className='absolute hidden bg-white border border-gray-200 py-1 px-2 mt-1 rounded-lg group-hover:block min-w-[24rem]'>
          {data.map(route => (
            <li key={route.id}>
              <Link href={`/brand/${route.id}`}>
                <span className={cn(
                  'text-sm font-medium transition-colors hover:text-primary hover:underline focus:outline-none focus:underline',
                  pathname === `/brand/${route.id}` ? 'text-black' : 'text-muted-foreground'
                )}>
                  {route.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default MainNav;
