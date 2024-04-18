import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Footer from '@/components/footer'
import Navbar from '@/components/navbar'
import ModalProvider from '@/providers/modal-provider'
import ToastProvider from '@/providers/toast-prrovider'
import ProgressBar from '@/components/ui/progress-bar'
import ScrollToTop from '@/components/ui/scroll-to-top'
import ReactQueryProvider from '@/providers/react-query-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MH Garage - Herramientas',
  description: 'Catálogo de herramientas online. Consultas por WhatsApp. Envíos a todo el país.',
  icons: {
    icon: '/logo.png',
  },
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: 'https://mhgarage.ar/',
    title: 'MH Garage - Herramientas',
    description: 'Catálogo de herramientas online. Consultas por WhatsApp.',
    images: [
      {
        url: '/opengraph-image.png',
        alt: 'MH Garage - Herramientas',
      },
    ]},
  authors: {
    name: 'Lautaro Conte',
    url: 'https://contelautaro.com.ar/',
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <ModalProvider />
        <ToastProvider />
        <ProgressBar />
        <ScrollToTop />
        {/* @ts-ignore */}
        <Navbar />
        <ReactQueryProvider>{children}</ReactQueryProvider>
        <Footer />
      </body>
    </html>
  )
}
