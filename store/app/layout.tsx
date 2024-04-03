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
  title: 'mhGarage',
  description: 'mhGarage',
  icons: {
    icon: '/logo.png',
  },
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
