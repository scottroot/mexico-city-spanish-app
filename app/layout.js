import './globals.css'
import { Inter } from 'next/font/google'
import Layout from '../components/Layout'
import { LanguageProvider } from '../contexts/LanguageContext'
import { createClient } from '@/utils/supabase/server'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Capital Spanish! - Learn Mexico City Spanish',
  description: 'Learn Spanish of Mexico City in a fun way with interactive games of vocabulary, grammar and pronunciation.',
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