'use client'

import ConfirmModal from '@/components/modals/confirm-modal'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import Heading from '@/components/ui/heading'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import ImageUpload from '@/components/ui/image-upload'
import { ComboFormSchema } from '@/lib/validation-schemas'
import { Combo } from '@prisma/client'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React, { Fragment, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { BiTrash } from 'react-icons/bi'
import { z } from 'zod'

type ComboFormValues = z.infer<typeof ComboFormSchema>

interface IComboForm {
  initialData: Combo | null
}

function ComboForm({ initialData }: IComboForm) {
  const params = useParams()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const title = initialData ? 'Editar combo' : 'Crear combo'
  const description = initialData ? 'Editar un combo' : 'Agregar un combo'
  const toastMessage = initialData ? 'Combo actualizado' : 'Combo creado'
  const action = initialData ? 'Guardar cambios' : 'Crear combo'

  const form = useForm<ComboFormValues>({
    resolver: zodResolver(ComboFormSchema),
    defaultValues: initialData
      ? { name: initialData.name, desc: initialData.desc, imageUrl: initialData.imageUrl }
      : { name: '', desc: '', imageUrl: '' },
  })

  const handleSubmit = async (data: ComboFormValues) => {
    try {
      setLoading(true)
      if (initialData) {
        await axios.patch(`/api/${params.storeId}/combos/${params.comboId}`, data)
        router.refresh()
      } else {
        // Recién creado no tiene productos: se vuelve al listado para cargarlos desde Productos.
        await axios.post(`/api/${params.storeId}/combos`, data)
        router.refresh()
        router.push(`/${params.storeId}/combos`)
      }
      toast.success(toastMessage)
    } catch (error) {
      toast.error('Algo salió mal')
    } finally {
      setLoading(false)
    }
  }

  const onDelete = async () => {
    try {
      setLoading(true)
      await axios.delete(`/api/${params.storeId}/combos/${params.comboId}`)
      router.refresh()
      router.push(`/${params.storeId}/combos`)
      toast.success('Combo eliminado')
    } catch (error) {
      toast.error('No se pudo eliminar el combo')
    } finally {
      setLoading(false)
      setOpen(false)
    }
  }

  return (
    <Fragment>
      <ConfirmModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
        title='¿Eliminar este combo?'
        description='Se elimina el combo, no los productos que contiene.'
        items={initialData ? [initialData.name] : undefined}
      />

      <div className='flex items-center justify-between'>
        <Heading isDetail title={title} description={description} />
        {initialData ? (
          <Button variant='destructive' size='sm' onClick={() => setOpen(true)}>
            <BiTrash className='h-4 w-4' />
          </Button>
        ) : null}
      </div>

      <Separator />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-8 w-full'>
          <FormField
            control={form.control}
            name='imageUrl'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Imagen del combo</FormLabel>
                <FormControl>
                  <ImageUpload
                    values={field.value ? [field.value] : []}
                    disabled={loading}
                    onChange={url => field.onChange(url)}
                    onRemove={() => field.onChange('')}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='grid grid-cols-3 gap-8'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder='Ej. Herrería' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='desc'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder='Opcional' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className='ml-auto' type='submit'>
            {action}
          </Button>
        </form>
      </Form>
    </Fragment>
  )
}

export default ComboForm
