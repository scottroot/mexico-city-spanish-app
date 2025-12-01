import LoginForm from '@/components/auth/LoginForm'

export const metadata = {
  title: 'Iniciar Sesión - ¡Español Divertido!',
  description: 'Inicia sesión en tu cuenta para continuar aprendiendo español latinoamericano.',
}

export default async function LoginPage({ searchParams }) {
  const redirectTo = (await searchParams)?.redirect || null;
  return <LoginForm redirectTo={redirectTo} />
}
