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
      <div className='flex items-center justify-between'>
        <Heading
          title={`Combos (${data.length})`}
          description='Creá el combo acá y después cargale productos desde la pantalla de Productos'
        />
        <Button onClick={() => router.push(`/${params.storeId}/combos/new`)}>
          <FiPlus className='mr-2 w-4- h4' />
          Agregar
        </Button>
      </div>
      <Separator />

      <DataTable searchKey='name' columns={columns} data={data} />
    </Fragment>
  )
}

export default CombosClient
