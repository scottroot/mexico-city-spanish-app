'use client'
import { useState } from 'react'
import { login } from '@/app/auth/login/actions'
import Link from 'next/link'
import Image from "next/image";
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { BookOpen, Mail, Lock, Eye, EyeOff } from 'lucide-react'

export default function LoginForm({ redirectTo }) {
  const [showPassword, setShowPassword] = useState(false)
  const [isPending, setIsPending] = useState(false)

  const handleSubmit = async (formData) => {
    setIsPending(true)
    await login(formData, redirectTo)
    setIsPending(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-teal-50 p-4">
      <Card className="w-full max-w-md p-8 shadow-xl">
        <div className="text-center mb-8">
          {/* <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full flex items-center justify-center shadow-lg mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-white" />
          </div> */}
          <Image 
            src="/images/coyote-short-sitting-centered.webp"
            width={64}
            height={64}
            alt="Coyote Character"
            className="object-contain mb-4 mx-auto"
          />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome back!</h1>
          <p className="text-gray-600">Sign in to continue learning</p>
        </div>

        <form action={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Your password"
                className="pl-10 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Link 
              href="/auth/forgot-password" 
              className="text-sm text-orange-600 hover:text-orange-700 font-medium"
            >
              Forgot your password?
            </Link>
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500 text-white font-medium py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {isPending ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link 
              href="/auth/signup" 
              className="text-orange-600 hover:text-orange-700 font-medium"
            >
              Sign up here
            </Link>
          </p>
        </div>
      </Card>
    </div>
  )
}
