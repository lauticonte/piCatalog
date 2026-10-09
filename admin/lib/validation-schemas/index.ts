import { z } from 'zod'

export const StoreModalFormSchema = z.object({
  name: z.string().min(1),
})

export const SettingFormSchema = z.object({
  name: z.string().min(1),
})

export const BillboardFormSchema = z.object({
  label: z.string().min(1),
  imageUrl: z.string().min(1),
})

export const CategoryFormSchema = z.object({
  name: z.string().min(1),
})

export const BrandFormSchema = z.object({
  name: z.string().min(1),
  value: z.string().min(1),
  billboardId: z.string().min(1),
  imageUrl: z.string().min(1),
})

export const ColorFormSchema = z.object({
  name: z.string().min(2),
  value: z.string().min(4).max(9).regex(/^#/, {
    message: 'String must be a valid hex code',
  }),
})

// Los mensajes se muestran debajo de cada campo del formulario: sin ellos el formulario
// no guardaba y no decía por qué.
export const ProductFormSchema = z.object({
  name: z.string().trim().min(1, 'Ingresá el nombre'),
  desc: z.string().trim().min(1, 'Ingresá una descripción'),
  SKU: z.string().trim().min(1, 'Ingresá el modelo o código'),
  images: z.object({ url: z.string() }).array(),
  price: z.coerce.number({ invalid_type_error: 'Ingresá un número' }).min(1, 'El precio tiene que ser mayor a cero'),
  categoryId: z.string().min(1, 'Elegí una categoría'),
  colorId: z.string().min(1),
  brandId: z.string().min(1, 'Elegí una marca'),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
})

export const ComboFormSchema = z.object({
  name: z.string().min(1),
  desc: z.string().optional(),
  imageUrl: z.string().optional(),
})
