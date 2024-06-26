import { Billboard } from '@/types'

const URL = `https://admin.mhgarage.ar/api/65ec0a796702c9c0e4c0895f/billboards`

export const getBillboards = async (id: string): Promise<Billboard> => {
  const res = await fetch(`${URL}/${id}`, {
    next: {
      revalidate: 3,
    },
  })
  return res.json()
}
