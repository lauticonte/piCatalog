'use client'

import React, { Suspense, useEffect, useRef, useState, useTransition } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import qs from 'query-string'
import { AiOutlineClose, AiOutlineSearch } from 'react-icons/ai'
import { cn } from '@/utils/utils'

interface ISearchForm {
  className?: string
}

const CATALOG = '/productos'

// En el catálogo busca mientras se escribe; en cualquier otra página lleva al catálogo.
// Es el mismo input en los dos casos, así no hay dos buscadores compitiendo en pantalla.
function SearchForm({ className }: ISearchForm) {
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
    <form onSubmit={handleSubmit} className={className} role='search'>
      <div className='relative'>
        <AiOutlineSearch
          className={cn(
            'pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2',
            isPending ? 'animate-pulse text-[#f5b301]' : 'text-slate-400'
          )}
        />
        <input
          ref={inputRef}
          type='search'
          value={term}
          onChange={event => setTerm(event.target.value)}
          placeholder='Buscar...'
          aria-label='Buscar productos'
          enterKeyHint='search'
          className='w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-9 pr-9 text-sm text-white placeholder:text-slate-500 focus:border-[#f5b301]/60 focus:outline-none [&::-webkit-search-cancel-button]:hidden'
        />
        {term && (
          <button
            type='button'
            onClick={() => {
              setTerm('')
              inputRef.current?.focus()
            }}
            aria-label='Borrar búsqueda'
            className='absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 hover:bg-white/10 hover:text-white'
          >
            <AiOutlineClose className='h-3.5 w-3.5' />
          </button>
        )}
      </div>
    </form>
  )
}

// El header vive en el layout raíz: leer la URL sin un Suspense obligaría a renderizar
// todas las páginas del lado del cliente.
function SearchFormBoundary(props: ISearchForm) {
  return (
    <Suspense fallback={<div className={cn('h-9 rounded-lg border border-white/10 bg-white/5', props.className)} />}>
      <SearchForm {...props} />
    </Suspense>
  )
}

export default SearchFormBoundary
