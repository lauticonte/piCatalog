'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AiOutlineSearch } from 'react-icons/ai'

interface ISearchForm {
  className?: string
}

function SearchForm({ className }: ISearchForm) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className='relative'>
        <AiOutlineSearch className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' />
        <input
          type='search'
          value={searchTerm}
          onChange={event => setSearchTerm(event.target.value)}
          placeholder='Buscar herramientas, marcas, códigos...'
          className='w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-9 pr-3 text-sm text-white placeholder:text-slate-500 focus:border-[#f5b301]/60 focus:outline-none'
        />
      </div>
    </form>
  )
}

export default SearchForm
