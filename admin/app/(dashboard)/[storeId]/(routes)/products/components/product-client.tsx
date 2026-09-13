'use client'

import ApiList from '@/components/ui/api-list'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import Heading from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { useParams, useRouter } from 'next/navigation'
import React, { Fragment, useState } from 'react'
import { FiPlus } from 'react-icons/fi'
import { BiPackage } from 'react-icons/bi'
import { ProductColumn, columns } from './columns'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import AddToComboModal from '@/components/modals/add-to-combo-modal'

interface IProductClient {
  data: Array<ProductColumn>
}

function ProductClient({ data }: IProductClient) {
  const router = useRouter()
  const params = useParams()
  const [comboModalOpen, setComboModalOpen] = useState(false)
  // Se guarda la selección al abrir el modal, porque el DataTable la limpia al terminar la acción.
  const [selectedProducts, setSelectedProducts] = useState<ProductColumn[]>([])

  const onDeleteSelected = async (rows: ProductColumn[]) => {
    try {
      const response = await axios.delete(`/api/${params.storeId}/products`, {
        data: { ids: rows.map(row => row.id) },
      })

      const { deleted, blocked } = response.data

      if (deleted > 0) {
        toast.success(`${deleted} producto${deleted > 1 ? 's' : ''} eliminado${deleted > 1 ? 's' : ''}`)
      }

      if (blocked?.length) {
        toast.error(`${blocked.length} no se pudieron eliminar porque están asociados a un pedido`)
      }

      router.refresh()
    } catch (error) {
      toast.error('No se pudieron eliminar los productos seleccionados')
    }
  }

  const onAddToCombo = async (comboId: string) => {
    try {
      const response = await axios.post(`/api/${params.storeId}/combos/${comboId}/products`, {
        productIds: selectedProducts.map(product => product.id),
      })

      const { added, alreadyIn } = response.data

      if (added > 0) {
        toast.success(`${added} producto${added > 1 ? 's' : ''} agregado${added > 1 ? 's' : ''} al combo`)
      }

      if (alreadyIn > 0) {
        toast(`${alreadyIn} ya estaba${alreadyIn > 1 ? 'n' : ''} en el combo`)
      }

      router.refresh()
    } catch (error) {
      toast.error('No se pudieron agregar los productos al combo')
    } finally {
      setComboModalOpen(false)
      setSelectedProducts([])
    }
  }

  return (
    <Fragment>
      <AddToComboModal
        isOpen={comboModalOpen}
        onClose={() => setComboModalOpen(false)}
        onConfirm={onAddToCombo}
        productCount={selectedProducts.length}
      />
      <Heading
        title='Productos'
        badge={data.length}
        description='Gestioná tu catálogo. Buscá por nombre o código (SKU).'
        action={
          <Button size='lg' onClick={() => router.push(`/${params.storeId}/products/new`)}>
            <FiPlus className='mr-2 h-4 w-4' />
            Agregar producto
          </Button>
        }
      />
      <DataTable
        searchKey={['name', 'SKU']}
        searchPlaceholder='Buscar por nombre o SKU...'
        columns={columns}
        data={data}
        onDeleteSelected={onDeleteSelected}
        getRowLabel={product => `${product.name} (SKU ${product.SKU})`}
        bulkActions={[
          {
            label: 'Agregar a combo',
            icon: <BiPackage className='mr-2 h-4 w-4' />,
            // Sin confirm: el paso de confirmación es el propio modal de selección de combo.
            onRun: rows => {
              setSelectedProducts(rows)
              setComboModalOpen(true)
            },
          },
        ]}
      />
      {/* <Separator />

      <Heading title='API' description='API calls for Products' />

      <ApiList entityName='products' entityIdName='productId' /> */}
    </Fragment>
  )
}

export default ProductClient
