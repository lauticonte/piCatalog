'use client'

import React, { memo } from 'react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'

function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()
  const params = useParams()

  const routes: IRoutes[] = [
    {
      href: `/${params.storeId}`,
      label: 'Panel',
      active: pathname === `/${params.storeId}`,
    },
    {
      href: `/${params.storeId}/billboards`,
      label: 'Billboards',
      active: pathname.includes(`/${params.storeId}/billboards`),
    },
    {
      href: `/${params.storeId}/categories`,
      label: 'Categorías',
      active: pathname.includes(`/${params.storeId}/categories`),
    },
    {
      href: `/${params.storeId}/brands`,
      label: 'Marcas',
      active: pathname.includes(`/${params.storeId}/brands`),
    },
    {
      href: `/${params.storeId}/products`,
      label: 'Productos',
      active: pathname.includes(`/${params.storeId}/products`),
    }
    // {
    //   href: `/${params.storeId}/orders`,
    //   label: 'Orders',
    //   active: pathname.includes(`/${params.storeId}/orders`),
    // },
    // {
    //   href: `/${params.storeId}/settings`,
    //   label: 'Settings',
    //   active: pathname === `/${params.storeId}/settings`,
    // },
  ]

  return (
    <div className={cn('flex items-center space-x-4 lg:space-x-6 overscroll-none', className)} {...props}>
      {routes?.map(route => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            'text-sm font-bold uppercase transition-colors hover:text-primary hover:underline focus:outline-none focus:underline',
            route.active ? 'text-black dark:text-white' : 'text-muted-foreground'
          )}
        >
          {route.label}
        </Link>
      ))}
    </div>
  )
}

export default memo(MainNav)
