'use client'

import React from 'react';
import Link from 'next/link';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';
import { navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { Category } from '@/types';

interface IMobileNav {
  categories: Category[];
}

function MobileNav({ categories }: IMobileNav) {
  const longestCategoryLength = Math.max(...categories.map(category => category.name.length));
  const minWidth = `${longestCategoryLength * 0.75}ch`; // Ajusta el valor según tus necesidades
  const maxWidth = '25rem'; // Ajusta el valor según tus necesidades

  return (
    <NavigationMenu>
      <NavigationMenuList className='group flex flex-1 list-none justify-start space-x-1'>
        <NavigationMenuItem>
          <NavigationMenuTrigger className='bg-transparent flex items-center justify-center'>Categorías</NavigationMenuTrigger>
          <NavigationMenuContent
            className='p-2 bg-gray-900 border border-gray-400 rounded-md shadow-md'
            style={{ minWidth, maxWidth }}
          >
            <ul className='overflow-y-scroll max-h-60'>
              {categories?.map(cate => (
                <li key={cate.id} className='mb-1 divide-dashed'>
                  <Link href={`/category/${cate.id}`} passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>{cate.name}</NavigationMenuLink>
                  </Link>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export default MobileNav;
