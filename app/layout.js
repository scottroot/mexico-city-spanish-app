import './globals.css'
import { Rubik } from 'next/font/google'
// import Layout from '../components/Layout'
import { LanguageProvider } from '../contexts/LanguageContext'
import { createClient } from '@/utils/supabase/server'
import MainLayout from '@/components/MainLayout'

const rubik = Rubik({ subsets: ['latin'] })

export const metadata = {
  title: 'Capital Spanish! - Learn Mexico City Spanish',
  description: 'Learn Spanish of Mexico City in a fun way with interactive games of vocabulary, grammar and pronunciation.',
}

export default async function RootLayout({ children }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <html lang="es">
      <body className={rubik.className}>
        <LanguageProvider>
        <MainLayout user={user}>
          {children}
          </MainLayout>
        </LanguageProvider>
      </body>
    </html>
  )
}