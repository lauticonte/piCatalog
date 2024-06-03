'use client'

import React from 'react';
import Link from 'next/link';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';
import { navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { Category } from '@/types';

interface IMobileNav {
  brands: Category[];
}

function MobileNav({ brands }: IMobileNav) {
  const longestCategoryLength = Math.max(...brands.map(brand => brand.name.length));
  const minWidth = `${longestCategoryLength * 0.75}ch`; // Ajusta el valor según tus necesidades
  const maxWidth = '25rem'; // Ajusta el valor según tus necesidades

  return (
    <NavigationMenu>
      <NavigationMenuList className='group flex flex-1 list-none justify-start space-x-1'>
        <NavigationMenuItem>
          <Link href='/brands' passHref>
          <NavigationMenuTrigger className='bg-transparent flex items-center justify-center'>Marcas</NavigationMenuTrigger>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export default MobileNav;
