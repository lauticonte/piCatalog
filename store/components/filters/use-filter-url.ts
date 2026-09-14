'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'
import qs from 'query-string'

// Lectura y cambio de filtros en la URL, compartido por el panel de desktop y el de mobile.
export function useFilterUrl() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [pending, setPending] = useState<{ key: string; id: string | null } | null>(null)

  const navigate = (query: Record<string, string | null>) => {
    // Cambiar de filtro vuelve al primer lote: el "limit" acumulado de "Ver más"
    // correspondía al listado anterior.
    const url = qs.stringifyUrl(
      { url: pathname, query: { ...qs.parse(searchParams.toString()), ...query, limit: null } },
      { skipNull: true }
    )
    // La página es del servidor y tarda un momento: la transición permite marcar la
    // opción tocada mientras llega el listado nuevo.
    startTransition(() => router.push(url, { scroll: false }))
  }

  return {
    selected: (key: string) => searchParams.get(key),
    select: (key: string, id: string | null) => {
      setPending({ key, id })
      navigate({ [key]: id })
    },
    clear: (keys: string[]) => {
      setPending(null)
      navigate(Object.fromEntries(keys.map(key => [key, null])))
    },
    isPending,
    isLoading: (key: string, id: string | null) => isPending && pending?.key === key && pending?.id === id,
  }
}
