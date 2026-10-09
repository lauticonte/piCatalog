'use client'

import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import Heading from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { useParams, useRouter } from 'next/navigation'
import React, { Fragment } from 'react'
import { FiPlus } from 'react-icons/fi'
import { ComboColumn, columns } from './columns'

interface ICombosClient {
  data: Array<ComboColumn>
}

function CombosClient({ data }: ICombosClient) {
  const router = useRouter()
  const params = useParams()

  return (
    <Fragment>
      <Heading
        title='Combos'
        badge={data.length}
        description='Creá el combo acá y después cargale productos desde la pantalla de Productos'
        action={
          <Button size='lg' onClick={() => router.push(`/${params.storeId}/combos/new`)}>
            <FiPlus className='mr-2 h-4 w-4' />
            Agregar combo
          </Button>
        }
      />

      <DataTable
        searchKey='name'
        columns={columns}
        data={data}
        quickFilters={[
          { id: 'sin-cargar', label: 'Sin cargar', predicate: combo => combo.productsCount === 0 },
          { id: 'sin-imagen', label: 'Sin imagen', predicate: combo => !combo.image },
        ]}
      />
    </Fragment>
  )
}

export default CombosClient
