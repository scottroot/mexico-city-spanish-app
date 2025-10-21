import { createClient } from '@/utils/supabase/client'
import Homepage from './Homepage'
import Link from "next/link";



function BodyContent({ games, stories }: { games: any[], stories: any[] }) {
  return (
    <>
      <div 
        className="flex-1 min-w-0 h-full pt-6"
      >
        <Homepage 
          games={games || []}
          stories={stories || []}
        />
      </div>
    </>
  )
}

function RightSidebarContent({ user }: { user: any }) {
  const PremiumFeatureCard = () => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-start justify-between mb-4">
        <div className="bg-gradient-to-r from-green-500 to-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold">
          USER
        </div>
      </div>
      <h3 className="text-lg font-bold text-gray-800 mb-2">Sign up for free</h3>
      <p className="text-sm text-gray-600 mb-4">Track your progress, get personalized practice, and unlock unlimited access!</p>
      <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-4 rounded-lg font-semibold text-sm">
        REGISTER ACCOUNT
      </button>
    </div>
  )

  const DailyProgressCard = () => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Daily Progress</h3>
        {user ? (
          <span className="text-blue-600 text-sm font-medium">VIEW ALL</span>
        ) : (
          <span className="text-gray-500 text-sm font-medium">SIGN UP TO TRACK</span>
        )}
      </div>
      <div className="space-y-3">
        {user ? (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
              <span className="text-yellow-800 text-sm">⚡</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">Complete 5 lessons</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div className="bg-yellow-400 h-2 rounded-full" style={{width: '60%'}}></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">3 / 5 completed</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-gray-400 text-xl">📊</span>
            </div>
            <p className="text-sm text-gray-600 mb-3">Track your daily progress and build learning streaks!</p>
            <Link 
              href="/auth/signup"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-colors"
            >
              Sign up to start tracking
            </Link>
          </div>
        )}
      </div>
    </div>
  )
  return (
    
        <div className="pt-6 h-full pointer-events-auto space-y-6">
          {/* Premium Feature Card */}
          <PremiumFeatureCard />
          

          {/* Daily Progress Card */}
          <DailyProgressCard />

          {/* Stats Card */}
          {/* <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Streak</span>
                <span className="text-lg font-bold text-orange-500">7 days</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">XP Earned</span>
                <span className="text-lg font-bold text-blue-500">1,250</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Lessons</span>
                <span className="text-lg font-bold text-green-500">42</span>
              </div>
            </div>
          </div> */}

      </div>
  )
}


export default async function Page() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  
  const { data: games, error: gamesError } = (await supabase
    .from('games')
    .select('*')
    .order('sort_order', { ascending: true })
    .limit(4)
  );

  const { data: stories, error: storiesError } = (await supabase
    .from('stories')
    .select('*')
    .order('created_at', { ascending: true })
    .limit(4)
  )
  
  if (gamesError) {
    console.error('Error fetching games:', gamesError)
  }

  if (storiesError) {
    console.error('Error fetching stories:', storiesError)
  }

  return (
    <div className="flex w-full gap-12 px-6 lg:max-w-6xl lg:mx-auto">
      <div className="flex-1">
        <Homepage 
          games={games || []}
          stories={stories || []}
        />
      </div>
      {/* <BodyContent games={games || []} stories={stories || []} /> */}

      <div className="relative flex-none max-lg:hidden w-xs">
        <aside className="fixed w-xs shrink-0 top-6 right-6">
          <RightSidebarContent user={user} />
        </aside>
      </div>
    </div>
  )
}
