import { Product } from '@/types'
import { persist, createJSONStorage } from 'zustand/middleware'
import { create } from 'zustand'
import { toast } from 'react-hot-toast'
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
        const raise = Math.round(Number(data.price) * 1.3);
        const newValue = Math.round(Number(raise) / 50) * 50;
        const price = formatter.format(Number(newValue));
    
        const model = data.SKU;
        const name = data.name.split(' • ')[0];
        const marca = data.brand.name;
        
        const link =`https://mhgarage.ar/product/${data.id}`;
        const msg = encodeURIComponent(`Hola, quiero consultar por el siguiente artículo:\n\n*${name}*\n- _Marca: *"${marca}"*_\n- _Modelo: *"${model}"*_\n- _Precio: *${price}*_\n> _${link}_`);
        const wp = '+541156977161'; // Reemplaza esto con tu número de WhatsApp
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

