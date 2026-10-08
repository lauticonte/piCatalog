'use client'

import React, { Suspense, useEffect, useRef, useState, useTransition } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import qs from 'query-string'
import { AiOutlineClose, AiOutlineSearch } from 'react-icons/ai'
import { cn } from '@/utils/utils'

interface ISearchForm {
  className?: string
  /** En mobile el campo es angosto y el ejemplo largo se corta. */
  placeholder?: string
}

const CATALOG = '/productos'

// En el catálogo busca mientras se escribe; en cualquier otra página lleva al catálogo.
// Es el mismo input en los dos casos, así no hay dos buscadores compitiendo en pantalla.
function SearchForm({ className, placeholder = 'Buscá soldadoras, llaves...' }: ISearchForm) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const urlTerm = searchParams.get('q') ?? ''
  const inCatalog = pathname === CATALOG

  const inputRef = useRef<HTMLInputElement>(null)
  const [term, setTerm] = useState(inCatalog ? urlTerm : '')
  const [isPending, startTransition] = useTransition()

  // Si la URL cambia desde afuera (quitar el filtro de texto, volver atrás) el input la
  // sigue; mientras se está escribiendo no, para no pisar lo que todavía no se envió.
  useEffect(() => {
    if (document.activeElement !== inputRef.current) setTerm(inCatalog ? urlTerm : '')
  }, [urlTerm, inCatalog])

  const catalogUrl = (value: string) =>
    qs.stringifyUrl(
      // Otra búsqueda vuelve al primer lote; los filtros elegidos se conservan.
      { url: CATALOG, query: { ...(inCatalog ? qs.parse(searchParams.toString()) : {}), q: value.trim() || null, limit: null } },
      { skipNull: true }
    )

  // Búsqueda viva con 300 ms de espera: sin pausa se pediría una página por tecla.
  useEffect(() => {
    if (!inCatalog || term.trim() === urlTerm.trim()) return
    const timer = setTimeout(() => {
      startTransition(() => router.replace(catalogUrl(term), { scroll: false }))
    }, 300)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [term, inCatalog])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    inputRef.current?.blur()
    startTransition(() => router.push(catalogUrl(term)))
  }

  return (
    <form onSubmit={handleSubmit} className={cn('flex', className)} role='search'>
      {/* Input y botón forman una sola barra: el botón va pegado al costado, no flotando
          dentro del campo. */}
      <div className='relative min-w-0 flex-1'>
        <input
          ref={inputRef}
          type='search'
          value={term}
          onChange={event => setTerm(event.target.value)}
          placeholder={placeholder}
          aria-label='Buscar productos'
          enterKeyHint='search'
          className={cn(
            'h-10 w-full rounded-l-md border border-r-0 border-transparent bg-white/[0.07] pl-3.5 text-[15px] text-white placeholder:text-slate-400 transition-colors hover:bg-white/[0.09] focus:border-[#f5b301] focus:bg-[#0f1318] focus:outline-none [&::-webkit-search-cancel-button]:hidden',
            // Lugar para la cruz de borrar solo cuando hay algo escrito.
            term ? 'pr-9' : 'pr-3'
          )}
        />
        {term && (
          <button
            type='button'
            onClick={() => {
              setTerm('')
              inputRef.current?.focus()
            }}
            aria-label='Borrar búsqueda'
            className='absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center text-slate-400 hover:text-white'
          >
            <AiOutlineClose className='h-3.5 w-3.5' />
          </button>
        )}
      </div>
      <button
        type='submit'
        aria-label='Buscar'
        className='flex h-10 shrink-0 items-center gap-2 rounded-r-md bg-[#f5b301] px-4 text-sm font-bold text-[#1D232A] transition-colors hover:bg-[#ffc21a]'
      >
        <AiOutlineSearch className={cn('h-[18px] w-[18px]', isPending && 'animate-pulse')} />
        <span className='hidden sm:inline'>Buscar</span>
      </button>
    </form>
  )
}

// El header vive en el layout raíz: leer la URL sin un Suspense obligaría a renderizar
// todas las páginas del lado del cliente.
function SearchFormBoundary(props: ISearchForm) {
  return (
    <Suspense fallback={<div className={cn('h-10 rounded-md bg-white/[0.07]', props.className)} />}>
      <SearchForm {...props} />
    </Suspense>
  )
}

export default SearchFormBoundary
