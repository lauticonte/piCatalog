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
      <div className='flex items-center justify-between'>
        <Heading title={`Marcas (${data.length})`} description='Gestioná las marcas de tu negocio' />
        <Button onClick={() => router.push(`/${params.storeId}/brands/new`)}>
          <FiPlus className='mr-2 w-4- h4' />
          Agregar
        </Button>
      </div>
      <Separator />

      <DataTable searchKey='name' columns={columns} data={data} />
      <Separator />

      <Heading title='API' description='Endpoints para marcas' />

      <ApiList entityName='brands' entityIdName='brandId' />
    </Fragment>
  )
}

export default BrandsClient
