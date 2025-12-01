import { getUser, UserData } from '@/utils/supabase/auth';
import { redirect } from 'next/navigation'


export default async function AccountPage() {
  const user: UserData = await getUser();

  if (!user?.isLoggedIn) {
    redirect('/auth/login?redirect=/account')
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Account Settings</h1>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={user.email}
                disabled
                className="form-input w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                value={user?.name || 'Not set'}
                disabled
                className="form-input w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User ID
              </label>
              <input
                type="text"
                value={user.id}
                disabled
                className="form-input w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Confirmed
              </label>
              <input
                type="checkbox"
                checked={
                  user.emailVerified ?? false
                  // false
                }
                disabled
                readOnly
                className="form-checkbox size-10 border border-gray-300 rounded-md bg-gray-50
                checked:border-orange-500 checked:bg-orange-500 
                indeterminate:border-orange-500 indeterminate:bg-orange-500 
                focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 
                disabled:opacity-50 disabled:cursor-not-allowed
                "
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}