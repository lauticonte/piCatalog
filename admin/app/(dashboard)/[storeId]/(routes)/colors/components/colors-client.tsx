'use client'

import { useParams, useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { Separator } from '@/components/ui/separator'
import { FiPlus } from 'react-icons/fi'
import { columns, ColorColumn } from './columns'
import Heading from '@/components/ui/heading'
import ApiList from '@/components/ui/api-list'

interface ColorClientProps {
  data: ColorColumn[]
}

export const ColorClient: React.FC<ColorClientProps> = ({ data }) => {
  const params = useParams()
  const router = useRouter()

  return (
    <>
      <Heading
        title='Colores'
        badge={data.length}
        description='Gestioná los colores de tus productos'
        action={
          <Button size='lg' onClick={() => router.push(`/${params.storeId}/colors/new`)}>
            <FiPlus className='mr-2 h-4 w-4' />
            Agregar color
          </Button>
        }
      />
      <DataTable searchKey='name' columns={columns} data={data} />
      <Heading title='API' description='API Calls for Colors' />
      <Separator />
      <ApiList entityName='colors' entityIdName='colorId' />
    </>
  )
}
