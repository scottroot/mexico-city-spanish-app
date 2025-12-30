import './globals.css'
import { Rubik } from 'next/font/google'
import clsx from 'clsx'
import { Toaster } from 'sonner'
import MainNavigation from '@/components/Nav/MainNavigation'
import { getUser } from "@/utils/supabase/auth"

const rubik = Rubik({ subsets: ['latin'] })

export const metadata = {
  title: 'Capital Spanish! - Learn Mexico City Spanish',
  description: 'Learn Spanish of Mexico City in a fun way with interactive games of vocabulary, grammar and pronunciation.',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser()

  return (
    <html lang="es">
      <body className={rubik.className}>
        <MainNavigation user={user} />
        <main
          className={clsx(
            "h-screen min-h-fit flex flex-col max-w-full overscroll-none",
            "max-md:pb-16", // MobileBottomNav padding (h-16)
            "md:pl-[86px]", // md+ desktop sidebar padding
            "xl:pl-64"
          )}
        >
          {children}
        </main>
        <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{
            duration: 4000,
          }}
        />
      </body>
    </html>
  )
}