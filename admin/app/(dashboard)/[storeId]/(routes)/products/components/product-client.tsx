'use client'

import ApiList from '@/components/ui/api-list'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import Heading from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { useParams, useRouter } from 'next/navigation'
import React, { Fragment } from 'react'
import { FiPlus } from 'react-icons/fi'
import { ProductColumn, columns } from './columns'

interface IProductClient {
  data: Array<ProductColumn>
}

function ProductClient({ data }: IProductClient) {
  const router = useRouter()
  const params = useParams()

  return (
    <Fragment>
      <div className='flex items-center justify-between overscroll-none'>
        <Heading title={`Productos (${data.length})`} description='Gestioná tus productos, buscalos por CÓDIGO (SKU)' />
        <Button onClick={() => router.push(`/${params.storeId}/products/new`)}>
          <FiPlus className='mr-2 w-4- h4' />
          Agregar
        </Button>
      </div>
      <Separator />
      <DataTable searchKey='SKU' columns={columns} data={data} />
      {/* <Separator />

      <Heading title='API' description='API calls for Products' />

      <ApiList entityName='products' entityIdName='productId' /> */}
    </Fragment>
  )
}

export default ProductClient
