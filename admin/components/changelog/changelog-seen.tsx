'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { LATEST_VERSION } from '@/lib/changelog'
import { cn } from '@/lib/utils'

const STORAGE_KEY = 'mh-changelog-visto'

// Guardado en el navegador: alcanza para avisar "hay algo nuevo" sin tocar la base.
const readSeen = () => {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return LATEST_VERSION
  }
}

/** Marca como vista la última versión al entrar a Novedades. */
export function MarkChangelogSeen() {
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, LATEST_VERSION)
      window.dispatchEvent(new Event(STORAGE_KEY))
    } catch {}
  }, [])
  return null
}

/** Número de versión que lleva a Novedades, con un punto si hay una que no se vio. */
export function ChangelogLink({ className, label }: { className?: string; label?: string }) {
  const params = useParams()
  const [unseen, setUnseen] = useState(false)

  useEffect(() => {
    const update = () => setUnseen(readSeen() !== LATEST_VERSION)
    update()
    window.addEventListener(STORAGE_KEY, update)
    return () => window.removeEventListener(STORAGE_KEY, update)
  }, [])

  return (
    <Link
      href={`/${params.storeId}/novedades`}
      title={`Novedades · commit ${process.env.NEXT_PUBLIC_COMMIT_SHA}`}
      className={cn('relative inline-flex items-center gap-1.5 transition-colors hover:text-white', className)}
    >
      {label && <span>{label}</span>}
      <span>v{process.env.NEXT_PUBLIC_APP_VERSION}</span>
      {unseen && (
        <span className='flex items-center gap-1 rounded-full bg-[#3aa17e] px-1.5 py-0.5 text-[9px] font-bold uppercase leading-none text-white'>
          Nuevo
        </span>
      )}
    </Link>
  )
}
