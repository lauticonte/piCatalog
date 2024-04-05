import { Product } from '@/types'
import { persist, createJSONStorage } from 'zustand/middleware'
import { create } from 'zustand'
import { toast } from 'react-hot-toast'
import Currency from '@/components/ui/currency'
import { formatter } from '@/utils/utils'

interface CartStore {
  items: Product[]
  addItem: (data: Product) => void
  removeItem: (id: string) => void
  removeAll: () => void
}

export const useCart = create(
  persist<CartStore>(
    (set, get) => ({
      items: [],
      addItem: (data: Product) => {
        const model = data.name.split(' • ')[1];
        const name = data.name.split(' • ')[0];
        const price = formatter.format(Number(data.price));
        const link =`https://mhgarage.ar/product/${data.id}`;
        const msg = encodeURIComponent(`Hola, quiero consultar por el siguiente artículo:\n\n*${name}*\n- _Modelo: *"${model}"*_\n- _Precio: *${price}*_\n> _${link}_`);
        const wp = '+541168851595'; // Reemplaza esto con tu número de WhatsApp
        const urlWp = `https://wa.me/${wp}/?text=${msg}`;
        window.location.href = urlWp;

        // No necesitas limpiar el carrito aquí, a menos que desees eliminar todos los artículos del carrito cuando se agregue uno nuevo.
        // set({ items: [] })

        // Agrega el artículo al carrito sin limpiar los artículos existentes
        // set({ items: [...get().items, data] })
      },
      removeItem: (id: string) => {
        set({
          items: [...get().items.filter(item => item.id !== id)],
        })
        toast.success(`Item removed from the cart`)
      },
      removeAll: () => set({ items: [] }),
    }),
    {
      name: 'cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

