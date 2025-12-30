'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { User, Mail, CheckCircle, XCircle } from 'lucide-react'
import type { UserData } from '@/app/types'

interface AccountFormProps {
  user: UserData
}

export default function AccountForm({ user }: AccountFormProps) {
  const [name, setName] = useState(user?.name || '')
  const [isUpdating, setIsUpdating] = useState(false)

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast.error('Name cannot be empty')
      return
    }

    setIsUpdating(true)

    try {
      const response = await fetch('/api/account/update-profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() })
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Profile updated successfully')
      } else {
        toast.error(data.error || 'Failed to update profile')
      }
    } catch (error) {
      toast.error('An error occurred while updating your profile')
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Account Settings</h1>
          <p className="text-gray-600">Manage your account information</p>
        </div>

        {/* Profile Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              {/* Name Field - Editable */}
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10"
                    placeholder="Your full name"
                  />
                </div>
              </div>

              {/* Email Field - Read Only */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="email"
                    type="email"
                    value={user.email}
                    disabled
                    className="pl-10 bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-gray-500">Email cannot be changed</p>
              </div>

              {/* Email Verification Status */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Email Verification
                </label>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  {user.emailVerified ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm text-green-700 font-medium">Verified</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-orange-500" />
                      <span className="text-sm text-orange-700 font-medium">Not verified</span>
                    </>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                disabled={isUpdating || !name.trim() || name === user?.name}
                className="w-full sm:w-auto bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500"
              >
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Account Details Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Account Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  User ID
                </label>
                <code className="text-xs bg-gray-100 px-3 py-2 rounded-md block font-mono text-gray-600">
                  {user.id}
                </code>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
