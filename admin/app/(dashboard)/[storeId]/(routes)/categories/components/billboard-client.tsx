'use client'

import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import Heading from '@/components/ui/heading'
import { useParams, useRouter } from 'next/navigation'
import React, { Fragment } from 'react'
import { FiPlus } from 'react-icons/fi'
import { CategoryColumn, columns } from './columns'

interface IBillboardClient {
  data: Array<CategoryColumn>
}

function BillboardClient({ data }: IBillboardClient) {
  const router = useRouter()
  const params = useParams()

  return (
    <Fragment>
      <Heading
        title='Categorías'
        badge={data.length}
        description='Gestioná las categorías de tu negocio'
        action={
          <Button size='lg' onClick={() => router.push(`/${params.storeId}/categories/new`)}>
            <FiPlus className='mr-2 h-4 w-4' />
            Agregar categoría
          </Button>
        }
      />

      <DataTable
        searchKey='name'
        columns={columns}
        data={data}
        quickFilters={[
          { id: 'con-productos', label: 'Con productos', predicate: category => category.productsCount > 0 },
          { id: 'vacias', label: 'Vacías', predicate: category => category.productsCount === 0 },
        ]}
      />
    </Fragment>
  )
}

export default BillboardClient
