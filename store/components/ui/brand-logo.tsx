'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

// Parte del recuadro (ya descontado el margen) que ocupa cada logo.
const AREA = 0.5

/**
 * Logo de marca dentro de un recuadro blanco con `position: relative`.
 *
 * El margen va en porcentaje del recuadro, y cada logo se dimensiona para ocupar la misma
 * superficie sin importar su forma: si solo se lo encajara en el recuadro, en uno ancho
 * (el menú) todos quedarían limitados por el alto y uno alargado como INGCO se vería
 * enorme al lado de uno compacto como PZ Force; en uno alto pasaría lo contrario.
 */
export function BrandLogo({ src, sizes }: { src: string; sizes: string }) {
  const boxRef = useRef<HTMLSpanElement>(null)
  const [ratio, setRatio] = useState<number | null>(null)
  const [box, setBox] = useState<{ width: number; height: number } | null>(null)

  useEffect(() => {
    const el = boxRef.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) =>
      setBox({ width: entry.contentRect.width, height: entry.contentRect.height })
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Ancho y alto con la misma superficie para cualquier proporción, sin salirse del recuadro.
  let size: React.CSSProperties = { width: '100%', height: '100%' }
  if (ratio && box?.width && box.height) {
    const area = AREA * box.width * box.height
    const width = Math.min(Math.sqrt(area * ratio), box.width, box.height * ratio)
    size = { width, height: width / ratio }
  }

  return (
    <span ref={boxRef} className='absolute inset-x-[10%] inset-y-[16%] flex items-center justify-center'>
      <span className='relative block' style={size}>
        <Image
          src={src}
          alt=''
          fill
          sizes={sizes}
          className='object-contain'
          onLoad={event => {
            const { naturalWidth, naturalHeight } = event.currentTarget
            if (naturalWidth && naturalHeight) setRatio(naturalWidth / naturalHeight)
          }}
        />
      </span>
    </span>
  )
}
