'use client'

import { CldUploadWidget } from 'next-cloudinary'
import { useEffect, useState } from 'react'
import { LuImagePlus, LuX } from 'react-icons/lu'
import BlurImage from './blur-image'

interface ImageUploadProps {
  disabled?: boolean
  onChange: (value: string) => void
  onRemove: (value: string) => void
  values: string[]
}

const ImageUpload: React.FC<ImageUploadProps> = ({ disabled, onChange, onRemove, values }) => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const onUpload = (result: any) => {
    onChange(result.info.secure_url)
  }

  if (!isMounted) {
    return null
  }

  return (
    // Miniaturas en grilla y un recuadro punteado para sumar más: el botón suelto de antes
    // no dejaba claro dónde iban a aparecer las fotos ni cuántas había.
    <div className='grid grid-cols-[repeat(auto-fill,minmax(112px,1fr))] gap-3'>
      {values.map((url, index) => (
        <div key={url} className='group relative aspect-square overflow-hidden rounded-lg border border-slate-200 bg-white'>
          <BlurImage fill className='object-contain p-1.5' alt='' src={url} />
          {index === 0 && (
            <span className='absolute left-1.5 top-1.5 rounded bg-[#151a20] px-1.5 py-0.5 text-[10px] font-semibold text-white'>
              Principal
            </span>
          )}
          <button
            type='button'
            onClick={() => onRemove(url)}
            disabled={disabled}
            aria-label='Quitar imagen'
            className='absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/95 text-slate-600 opacity-100 shadow ring-1 ring-slate-200 transition hover:bg-red-50 hover:text-red-600 sm:opacity-0 sm:focus-visible:opacity-100 sm:group-hover:opacity-100'
          >
            <LuX className='h-4 w-4' />
          </button>
        </div>
      ))}
      <CldUploadWidget onSuccess={onUpload} uploadPreset='nhgarage'>
        {({ open }) => (
          <button
            type='button'
            disabled={disabled}
            onClick={() => open()}
            className='flex aspect-square flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 text-slate-500 transition-colors hover:border-[#f5b301] hover:bg-amber-50/50 hover:text-slate-800 disabled:pointer-events-none disabled:opacity-50'
          >
            <LuImagePlus className='h-6 w-6' />
            <span className='text-xs font-semibold'>{values.length ? 'Agregar otra' : 'Subir imagen'}</span>
          </button>
        )}
      </CldUploadWidget>
    </div>
  )
}

export default ImageUpload
