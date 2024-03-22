import { Color } from '@/types'

const URL = `http://localhost:3000/api/65ec0a796702c9c0e4c0895f/colors`

export const getColors = async (): Promise<Color[]> => {
  const res = await fetch(URL, {
    next: {
      revalidate: 3,
    },
  })
  return res.json()
}
