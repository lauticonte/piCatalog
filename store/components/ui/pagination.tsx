// F:\GitHub\piCatalog\store\components\ui\pagination.tsx
"use client"; // Añadir esta línea

import React from 'react';
import { useRouter } from 'next/router';

interface PaginationProps {
  currentLimit: number;
  onLimitChange: (limit: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentLimit, onLimitChange }) => {
  const router = useRouter();

  const handleLimitChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newLimit = parseInt(event.target.value);
    onLimitChange(newLimit);
    router.push(`?limit=${newLimit}`);
  };

  return (
    <div>
      <select value={currentLimit} onChange={handleLimitChange}>
        <option value="12">12</option>
        <option value="18">18</option>
        <option value="24">24</option>
      </select>
    </div>
  );
};

export default Pagination;
