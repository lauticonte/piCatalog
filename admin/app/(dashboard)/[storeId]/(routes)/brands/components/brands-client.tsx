'use client'

import ApiList from '@/components/ui/api-list'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import Heading from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { useParams, useRouter } from 'next/navigation'
import React, { Fragment } from 'react'
import { FiPlus } from 'react-icons/fi'
import { BrandColumn, columns } from './columns'

interface IBrand {
  data: Array<BrandColumn>
}

function BrandsClient({ data }: IBrand) {
  const router = useRouter()
  const params = useParams()

  return (
    <Fragment>
      <Heading
        title='Marcas'
        badge={data.length}
        description='Gestioná las marcas de tu negocio'
        action={
          <Button size='lg' onClick={() => router.push(`/${params.storeId}/brands/new`)}>
            <FiPlus className='mr-2 h-4 w-4' />
            Agregar marca
          </Button>
        }
      />

      <DataTable searchKey='name' columns={columns} data={data} />
      <Separator />

      <Heading title='API' description='Endpoints para marcas' />

      <ApiList entityName='brands' entityIdName='brandId' />
    </Fragment>
  )
}

export default BrandsClient
