'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import qs from 'query-string';
import Button from '@/components/ui/button';
import { BsPlus } from 'react-icons/bs';

interface LoadMoreProps {
  defaultLimit: number;
}

function LoadMore({ defaultLimit }: LoadMoreProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleLoadMore = () => {
    // Guardar la posición de desplazamiento actual
    setScrollPosition(window.scrollY);

    const current = qs.parse(searchParams.toString());
    const currentLimit = parseInt(current.limit as string, 10) || defaultLimit;
    const newLimit = currentLimit + 6; // Incrementar en 6 cada vez que se presiona
    current['limit'] = newLimit.toString();
    const url = qs.stringifyUrl({ url: window.location.href, query: current }, { skipNull: true });

    // Navegar a la nueva URL
    router.push(url);
  };

  useEffect(() => {
    // Restaurar la posición de desplazamiento
    if (scrollPosition !== 0) {
      window.scrollTo(0, scrollPosition);
    }
  }, [searchParams]);

  return (
    <div className="flex justify-center bottom-full right-0 mt-6">
      <Button onClick={handleLoadMore} className="flex items-center gap-3 rounded-full bg-black border-transparent px-6 py-3 disabled:cursor-not-allowed disabled:opacity-50 text-white font-semibold hover:opacity-75 transition">
        Cargar
        <BsPlus size={20} className='-ml-2' />
      </Button>
    </div>
  );
}

export default LoadMore;
