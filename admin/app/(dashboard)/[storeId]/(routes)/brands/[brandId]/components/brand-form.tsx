'use client'

import ConfirmModal from '@/components/modals/confirm-modal'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import Heading from '@/components/ui/heading'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { BrandFormSchema } from '@/lib/validation-schemas'
import { Brand, Billboard } from '@prisma/client'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React, { Fragment, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { BiTrash } from 'react-icons/bi'
import { z } from 'zod'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import ImageUpload from '@/components/ui/image-upload'

type BrandFormValues = z.infer<typeof BrandFormSchema>

interface IBrandForm {
  initialData: Brand | null
  billboards: Billboard[]
}

function BrandForm({ initialData, billboards }: IBrandForm) {
  const params = useParams()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const title = initialData ? 'Editar marca' : 'Crear marca'
  const description = initialData ? 'Editar una marca' : 'Agregar una marca'
  const toastMessage = initialData ? 'Marca actualizada' : 'Marca creada'
  const action = initialData ? 'Guardar cambios' : 'Crear marca'

  const form = useForm<BrandFormValues>({
    resolver: zodResolver(BrandFormSchema),
    defaultValues: initialData || {
      name: '',
      value: '',
      billboardId: '',
    },
  })

  const handleSubmit = async (data: BrandFormValues) => {
    try {
      setLoading(true)
      if (initialData) {
        await axios.patch(`/api/${params.storeId}/brands/${params.brandId}`, data)
      } else {
        await axios.post(`/api/${params.storeId}/brands`, data)
      }
      router.refresh()
      router.push(`/${params.storeId}/brands`)
      toast.success(toastMessage)
    } catch (error) {
      toast.error(`Something went wrong`)
    } finally {
      setLoading(false)
    }
  }

  const onDelete = async () => {
    try {
      setOpen(true)
      await axios.delete(`/api/${params.storeId}/brands/${params.brandId}`)
      router.refresh()
      router.push(`/${params.storeId}/brands`)
      toast.success('Brand deleted')
    } catch (error) {
      toast.error('Make sure you removed all products using this size first.')
    } finally {
      setLoading(false)
      setOpen(false)
    }
  }

  console.log('loading', loading)

  return (
    <Fragment>
      <ConfirmModal isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete} loading={loading} />

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
          <div className='grid grid-cols-3 gap-8'>
          <FormField
            control={form.control}
            name='imageUrl'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Logo de la marca</FormLabel>
                <FormControl>
                  <ImageUpload
                    values={field.value ? [field.value] : []}
                    disabled={loading}
                    onChange={url => field.onChange(url)}
                    onRemove={() => field.onChange('')}
                  />
                </FormControl>
              </FormItem>
            )}
          />
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Marca</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder='Marca' {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='value'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder='Marca value' {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='billboardId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billboard</FormLabel>
                  <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder='Select a billboard' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {billboards?.map(billboard => (
                        <SelectItem key={billboard.id} value={billboard.id}>
                          {billboard.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className='ml-auto' type='submit'>
            {action}
          </Button>
        </form>
      </Form>

      <Separator />
    </Fragment>
  )
}

export default BrandForm
