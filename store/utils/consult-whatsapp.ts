import { Product } from '@/types'
import { formatter } from '@/utils/utils'
import { trackConsultation } from '@/utils/track-consultation'

const WHATSAPP_NUMBER = '+541156977161'

/**
 * Abre WhatsApp con la consulta del producto ya escrita.
 *
 * El precio del mensaje es el de la tienda: el del admin más un 30%, redondeado a
 * múltiplos de 50, igual que lo que se muestra en la tarjeta y en la ficha.
 */
export const consultOnWhatsApp = (data: Product) => {
  const raise = Math.round(Number(data.price) * 1.3)
  const price = formatter.format(Math.round(raise / 50) * 50)

  const name = data.name.split(' • ')[0]
  const link = `https://mhgarage.ar/product/${data.id}`
  const msg = encodeURIComponent(
    `Hola, quiero consultar por el siguiente artículo:\n\n*${name}*\n- _Marca: *"${data.brand.name}"*_\n- _Modelo: *"${data.SKU}"*_\n- _Precio: *${price}*_\n> ${link}`,
  )

  // Queda registrado en el panel antes de irnos a WhatsApp.
  trackConsultation(data.id)

  window.location.href = `https://wa.me/${WHATSAPP_NUMBER}/?text=${msg}`
}
