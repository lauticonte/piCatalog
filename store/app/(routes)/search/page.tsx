import { redirect } from 'next/navigation'

interface ISearchPage {
  searchParams: {
    q?: string
  }
}

// La búsqueda vive ahora en el catálogo, con filtros y resultados mientras se escribe.
// Se mantiene la ruta para no romper links viejos.
function SearchPage({ searchParams }: ISearchPage) {
  const q = searchParams.q?.trim()
  redirect(q ? `/productos?q=${encodeURIComponent(q)}` : '/productos')
}

export default SearchPage
