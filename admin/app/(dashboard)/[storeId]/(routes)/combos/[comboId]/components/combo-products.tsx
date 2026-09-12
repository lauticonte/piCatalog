'use client'

import { DataTable } from '@/components/ui/data-table'
import Heading from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React, { Fragment } from 'react'
import { toast } from 'react-hot-toast'
import { BiMinusCircle } from 'react-icons/bi'
import { ComboProductColumn, productColumns } from './product-columns'

interface IComboProducts {
  data: Array<ComboProductColumn>
}

function ComboProducts({ data }: IComboProducts) {
  const router = useRouter()
  const params = useParams()

  const onRemoveSelected = async (rows: ComboProductColumn[]) => {
    try {
      const response = await axios.delete(`/api/${params.storeId}/combos/${params.comboId}/products`, {
        data: { productIds: rows.map(row => row.id) },
      })

      const { removed } = response.data

      toast.success(`${removed} producto${removed > 1 ? 's' : ''} quitado${removed > 1 ? 's' : ''} del combo`)
      router.refresh()
    } catch (error) {
      toast.error('No se pudieron quitar los productos del combo')
    }
  }

  return (
    <Fragment>
      <Separator />

      <Heading
        isDetail
        title={`Productos del combo (${data.length})`}
        description='Para agregar productos, seleccionalos en la pantalla de Productos y usá "Agregar a combo"'
      />

      <DataTable
        searchKey={['name', 'SKU']}
        searchPlaceholder='Buscar por nombre o SKU...'
        columns={productColumns}
        data={data}
        getRowLabel={product => `${product.name} (SKU ${product.SKU})`}
        bulkActions={[
          {
            label: 'Quitar del combo',
            icon: <BiMinusCircle className='mr-2 h-4 w-4' />,
            variant: 'destructive',
            confirm: true,
            // Se aclara que no borra el producto, para no confundirlo con el borrado real.
            confirmTitle: rows => `¿Quitar ${rows.length} producto${rows.length > 1 ? 's' : ''} del combo?`,
            onRun: onRemoveSelected,
          },
        ]}
      />
    </Fragment>
  )
}

export default ComboProducts
