'use client'

import ConfirmModal from '@/components/modals/confirm-modal'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import Heading from '@/components/ui/heading'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ProductFormSchema } from '@/lib/validation-schemas'
import { Category, Color, Image, Product, Brand } from '@prisma/client'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React, { Fragment, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { LuTrash2 } from 'react-icons/lu'
import { z } from 'zod'
import ImageUpload from '@/components/ui/image-upload'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { cn, formatter } from '@/lib/utils'

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

/** Tarjeta de una sección del formulario: título arriba y los campos adentro. */
function Seccion({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className='rounded-xl border border-slate-200 bg-white shadow-sm'>
      <header className='border-b border-slate-100 px-5 py-4'>
        <h2 className='text-[15px] font-semibold text-slate-900'>{title}</h2>
        {description && <p className='mt-0.5 text-sm text-slate-500'>{description}</p>}
      </header>
      <div className='space-y-5 p-5'>{children}</div>
    </section>
  )
}

function ProductForm({ initialData, categories, brands, colors }: IProductForm) {
  const params = useParams()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const title = initialData ? 'Editar producto' : 'Nuevo producto'
  const description = initialData ? 'Los cambios se ven en la tienda apenas los guardás.' : 'Completá los datos y guardalo para publicarlo en la tienda.'
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
      toast.error('No se pudo guardar el producto')
    } finally {
      setLoading(false)
    }
  }

  const onDelete = async () => {
    try {
      setLoading(true)
      await axios.delete(`/api/${params.storeId}/products/${params.productId}`)
      router.refresh()
      router.push(`/${params.storeId}/products`)
      toast.success('Producto eliminado')
    } catch (error) {
      toast.error('No se pudo eliminar el producto')
    } finally {
      setLoading(false)
      setOpen(false)
    }
  }

  const sinGuardar = form.formState.isDirty

  return (
    <Fragment>
      <ConfirmModal isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete} loading={loading} />
      <Heading
        isDetail
        title={title}
        description={description}
        action={
          initialData ? (
            <Button
              type='button'
              variant='outline'
              disabled={loading}
              onClick={() => setOpen(true)}
              className='border-red-200 text-red-600 hover:border-red-300 hover:bg-red-50 hover:text-red-700'
            >
              <LuTrash2 className='mr-2 h-4 w-4' />
              Eliminar
            </Button>
          ) : null
        }
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className='pt-2'>
          <div className='grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]'>
            <div className='space-y-6'>
              <Seccion title='Información'>
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input disabled={loading} placeholder='Ej.: Soldadora inverter 200A' {...field} />
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
                        <Textarea disabled={loading} placeholder='Medidas, potencia, qué incluye...' rows={5} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className='grid gap-5 sm:grid-cols-2'>
                  <FormField
                    control={form.control}
                    name='price'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Precio</FormLabel>
                        <FormControl>
                          <div className='relative'>
                            <span className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400'>$</span>
                            <Input
                              disabled={loading}
                              inputMode='numeric'
                              placeholder='0'
                              className='pl-7 tabular-nums'
                              {...field}
                              value={field.value ? String(field.value) : ''}
                              // Solo dígitos: "1.047.000" pegado con puntos se convierte en 1047000.
                              onChange={event => field.onChange(event.target.value.replace(/\D/g, ''))}
                            />
                          </div>
                        </FormControl>
                        {Number(field.value) > 0 && (
                          <FormDescription className='tabular-nums'>{formatter.format(Number(field.value))}</FormDescription>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='SKU'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Modelo / código</FormLabel>
                        <FormControl>
                          <Input disabled={loading} placeholder='Ej.: LJ-F40' className='font-mono' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </Seccion>

              <Seccion title='Imágenes' description='La primera es la que se muestra en el catálogo.'>
                <FormField
                  control={form.control}
                  name='images'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <ImageUpload
                          values={field.value.map(image => image.url)}
                          disabled={loading}
                          onChange={url => field.onChange([...field.value, { url }])}
                          onRemove={url => field.onChange([...field.value.filter(current => current.url !== url)])}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Seccion>
            </div>

            <div className='space-y-6 lg:sticky lg:top-24'>
              <Seccion title='Organización'>
                <FormField
                  control={form.control}
                  name='categoryId'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoría</FormLabel>
                      <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Elegí una categoría' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className='max-h-64'>
                          {categories?.map(category => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
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
                            <SelectValue placeholder='Elegí una marca' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className='max-h-64'>
                          {brands?.map(brand => (
                            <SelectItem key={brand.id} value={brand.id}>
                              {brand.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Seccion>

              <Seccion title='Visibilidad'>
                {(
                  [
                    { name: 'isFeatured', label: 'Destacado', hint: 'Aparece en "Productos destacados" del inicio.' },
                    { name: 'isArchived', label: 'Archivado', hint: 'Se oculta de la tienda sin borrarlo.' },
                  ] as const
                ).map(opcion => (
                  <FormField
                    key={opcion.name}
                    control={form.control}
                    name={opcion.name}
                    render={({ field }) => (
                      <FormItem
                        className={cn(
                          'flex flex-row items-start gap-3 space-y-0 rounded-lg border p-3.5 transition-colors',
                          field.value ? 'border-amber-300 bg-amber-50/60' : 'border-slate-200'
                        )}
                      >
                        <FormControl>
                          <Checkbox className='mt-0.5' checked={field.value} onCheckedChange={field.onChange} disabled={loading} />
                        </FormControl>
                        <div className='space-y-1 leading-none'>
                          <FormLabel className='cursor-pointer'>{opcion.label}</FormLabel>
                          <FormDescription>{opcion.hint}</FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                ))}
              </Seccion>
            </div>
          </div>

          {/* Barra de guardado fija abajo: en un formulario largo el botón quedaba fuera de
              la pantalla y no se sabía si había cambios sin guardar. */}
          <div className='sticky bottom-0 z-30 -mx-4 mt-8 flex items-center justify-end gap-3 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur sm:-mx-8 sm:px-8'>
            {sinGuardar && (
              <span className='mr-auto flex items-center gap-2 text-sm text-slate-600'>
                <span className='h-2 w-2 rounded-full bg-[#f5b301]' aria-hidden />
                Cambios sin guardar
              </span>
            )}
            <Button type='button' variant='outline' disabled={loading} onClick={() => router.push(`/${params.storeId}/products`)}>
              Cancelar
            </Button>
            <Button type='submit' disabled={loading}>
              {loading ? 'Guardando...' : action}
            </Button>
          </div>
        </form>
      </Form>
    </Fragment>
  )
}

export default ProductForm
