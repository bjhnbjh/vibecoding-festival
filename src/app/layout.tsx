import type { Metadata } from 'next'
import { Inter, Poppins, Playfair_Display } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { Header } from '@/components/header'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins'
})
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair'
})

export const metadata: Metadata = {
  title: 'FestivalHub - 대학 축제 정보 플랫폼',
  description: '전국 대학생들이 모든 대학 축제 정보를 한 곳에서 쉽게 찾고 참여할 수 있는 통합 플랫폼',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" className={`${inter.variable} ${poppins.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased bg-gradient-to-br from-festival-50 via-sunset-50 to-ocean-50 dark:from-gray-900 dark:via-festival-950 dark:to-gray-900">
        <AuthProvider>
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  )
}
