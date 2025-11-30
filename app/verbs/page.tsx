import { createClient } from '@/utils/supabase/server';
import VerbsPage from './VerbsPage';


export default async function Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Get billing status using the existing API route with caching
  let billingData = { hasAccess: false, subscription: undefined }
  if (user) {
    try {
      const baseUrl = process.env.SITE_URL || 'http://localhost:3000'
      const response = await fetch(`${baseUrl}/api/billing/status`, {
        headers: {
          'Cookie': '', // Server will handle auth via cookies
        },
        next: { 
          revalidate: 300, // 5 minutes
          tags: ['billing'] 
        }
      })
      
      if (response.ok) {
        billingData = await response.json()
      }
    } catch (error) {
      console.error('Error fetching billing data:', error)
    }
  }

  const userWithBilling = user ? {
    id: user.id,
    email: user.email || '',
    hasAccess: billingData.hasAccess,
    subscription: billingData.subscription
  } : null

  return (
    <div className="relative flex-1 flex flex-col md:flex-row h-full">
      <VerbsPage user={userWithBilling} />
    </div>
  )
}