'use client'

import ConfirmModal from '@/components/modals/confirm-modal'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form'
import Heading from '@/components/ui/heading'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { ProductFormSchema } from '@/lib/validation-schemas'
import { Category, Color, Image, Product, Brand } from '@prisma/client'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React, { Fragment, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { BiTrash } from 'react-icons/bi'
import { z } from 'zod'
import ImageUpload from '@/components/ui/image-upload'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'

type ProductFormValues = z.infer<typeof ProductFormSchema>

interface IProductForm {
  initialData:
    | (Product & {
        images: Image[]
      })
    | null

  categories: Category[]
  brands: Brand[]
  colors: Color[]
}

function ProductForm({ initialData, categories, brands, colors }: IProductForm) {
  const params = useParams()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const title = initialData ? 'Editar producto' : 'Subir producto'
  const description = initialData ? 'Editar un producto' : 'Agregar un nuevo producto a la base de datos'
  const toastMessage = initialData ? 'Producto actualizado' : 'Producto creado'
  const action = initialData ? 'Guardar cambios' : 'Crear producto'

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: initialData
      ? {
          ...initialData,
        }
      : {
          name: '',
          desc: '',
          SKU: '',
          images: [],
          price: 0,
          categoryId: '',
          colorId: '65ec0abd6702c9c0e4c08960',
          brandId: '',
          isFeatured: false,
          isArchived: false,
        },
  })

  const handleSubmit = async (data: ProductFormValues) => {
    try {
      setLoading(true)
      if (initialData) {
        await axios.patch(`/api/${params.storeId}/products/${params.productId}`, data)
      } else {
        await axios.post(`/api/${params.storeId}/products`, data)
      }
      router.refresh()
      router.push(`/${params.storeId}/products`)
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
      await axios.delete(`/api/${params.storeId}/products/${params.productId}`)
      router.refresh()
      router.push(`/${params.storeId}/products`)
      toast.success('Product deleted')
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
      setOpen(false)
    }
  }

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
          <FormField
            control={form.control}
            name='images'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Imágenes</FormLabel>
                <FormControl>
                  <ImageUpload
                    values={field.value.map(image => image.url)}
                    disabled={loading}
                    onChange={url => field.onChange([...field.value, { url }])}
                    onRemove={url => field.onChange([...field.value.filter(current => current.url !== url)])}
                  />
                </FormControl>
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
                    <Input disabled={loading} placeholder='Nombre...' {...field} />
                  </FormControl>
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
                    <Input disabled={loading} placeholder='Descripción...' {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='SKU'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Modelo</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder='SKU...' {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='price'
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Precio</FormLabel>
                    <FormControl>
                      <Input disabled={loading} placeholder='Precio...' {...field} />
                    </FormControl>
                  </FormItem>
                )
              }}
            />
<FormField
  control={form.control}
  name='categoryId'
  render={({ field }) => (
    <FormItem>
      <FormLabel>Categoría</FormLabel>
      <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
        <FormControl>
          <SelectTrigger>
            <SelectValue defaultValue={field.value} placeholder='Seleccioná una categoria...' />
          </SelectTrigger>
        </FormControl>
        <SelectContent style={{ maxHeight: '200px', overflowY: 'auto' }}> {/* Estilo añadido */}
          {categories?.map(category => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormItem>
  )}
/>
            <FormField
              control={form.control}
              name='brandId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Marca</FormLabel>
                  <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder='Seleccioná una marca...' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {brands?.map(brand => (
                        <SelectItem key={brand.id} value={brand.id}>
                          {brand.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            
          </div>
          <div className='grid grid-cols-3 gap-8'>
            <FormField
              control={form.control}
              name='isFeatured'
              render={({ field }) => {
                return (
                  <FormItem className='flex flex-rwo items-start space-x-3 space-y-0 rounded-md border p-4'>
                    <FormControl>
                      <Checkbox className='mt-1' checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className='space-y-1 leading-none'>
                      <FormLabel>Destacado</FormLabel>
                      <FormDescription>Este producto va a aparecer en el inicio.</FormDescription>
                    </div>
                  </FormItem>
                )
              }}
            />
            <FormField
              control={form.control}
              name='isArchived'
              render={({ field }) => {
                return (
                  <FormItem className='flex flex-rwo items-start space-x-3 space-y-0 rounded-md border p-4'>
                    <FormControl>
                      <Checkbox className='mt-1' checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className='space-y-1 leading-none'>
                      <FormLabel>Archivado</FormLabel>
                      <FormDescription>Este producto desaparecerá de la tienda.</FormDescription>
                    </div>
                  </FormItem>
                )
              }}
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

export default ProductForm
