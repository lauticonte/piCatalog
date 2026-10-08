'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { Loader } from '@/components/ui/loader'
import { cn } from '@/utils/utils'

// Tope para no dejar la ficha oculta si una imagen nunca termina de cargar.
const MAX_ESPERA_MS = 5000

const RevealContext = createContext<(() => void) | null>(null)

/** Avisa que el contenido está listo para mostrarse. Fuera de ProductReveal es null. */
export const useMarkReady = () => useContext(RevealContext)

/**
 * Muestra la ficha del producto (galería + info) toda junta, cuando la galería avisa que
 * sus imágenes cargaron. Sin esto el texto aparecía primero y las fotos de a una después.
 */
export function ProductReveal({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false)
  const markReady = useCallback(() => setReady(true), [])

  useEffect(() => {
    const timer = setTimeout(markReady, MAX_ESPERA_MS)
    return () => clearTimeout(timer)
  }, [markReady])

  return (
    <RevealContext.Provider value={markReady}>
      <div className='relative' aria-busy={!ready}>
        {!ready && (
          <div className='absolute inset-x-0 top-32 flex justify-center'>
            <Loader />
          </div>
        )}
        <div className={cn('transition-opacity duration-300', ready ? 'opacity-100' : 'opacity-0')}>{children}</div>
      </div>
    </RevealContext.Provider>
  )
}
