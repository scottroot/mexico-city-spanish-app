import './globals.css'
import { Inter } from 'next/font/google'
import Layout from '../components/Layout'
import { LanguageProvider } from '../contexts/LanguageContext'
import { createClient } from '@/utils/supabase/server'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: '¡Español Divertido! - Aprende Español Latinoamericano',
  description: 'Aprende español latinoamericano de forma divertida con juegos interactivos de vocabulario, gramática y pronunciación.',
}

export default async function RootLayout({ children }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <html lang="es">
      <body className={inter.className}>
        <LanguageProvider>
          <Layout user={user}>
            {children}
          </Layout>
        </LanguageProvider>
      </body>
    </html>
  )
}