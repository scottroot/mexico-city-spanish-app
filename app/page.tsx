import { createClient } from '@/utils/supabase/server'
import Homepage from './Homepage'
import Link from "next/link";
import { navigationItems } from '@/components/Nav/navigation-items';
import { getUserProgressData, UserStats, DailyProgress, RecentActivity } from '@/lib/user-stats';


const PremiumFeatureCard = ({ user, dailyProgress }: { user: any, dailyProgress: DailyProgress }) => {
  if (user) {
    // Show CTA for logged-in users
    const hasCompletedToday = dailyProgress.gamesCompletedToday > 0;
    const isGoalReached = dailyProgress.gamesCompletedToday >= dailyProgress.dailyGoal;
    
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-start justify-between mb-4">
          <div className="bg-gradient-to-r from-green-500 to-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold">
            {isGoalReached ? 'GOAL REACHED!' : 'KEEP GOING!'}
          </div>
        </div>
        
        {isGoalReached ? (
          <>
            <h3 className="text-lg font-bold text-gray-800 mb-2">🎉 Daily Goal Complete!</h3>
            <p className="text-sm text-gray-600 mb-4">
              Great job! You've completed {dailyProgress.gamesCompletedToday} lessons today. 
              Ready for more practice?
            </p>
            <div className="space-y-2">
              <Link 
                href="/quiz"
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 px-4 rounded-lg font-semibold text-sm text-center block hover:from-green-600 hover:to-blue-600 transition-colors"
              >
                🧠 START QUIZ
              </Link>
              <Link 
                href="/stories"
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-lg font-semibold text-sm text-center block hover:from-purple-600 hover:to-pink-600 transition-colors"
              >
                📚 READ STORIES
              </Link>
            </div>
          </>
        ) : hasCompletedToday ? (
          <>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Keep the momentum!</h3>
            <p className="text-sm text-gray-600 mb-4">
              You've completed {dailyProgress.gamesCompletedToday} of {dailyProgress.dailyGoal} lessons today. 
              Just {dailyProgress.dailyGoal - dailyProgress.gamesCompletedToday} more to reach your goal!
            </p>
            <div className="space-y-2">
              <Link 
                href="/games"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-4 rounded-lg font-semibold text-sm text-center block hover:from-blue-600 hover:to-purple-600 transition-colors"
              >
                🎮 PLAY GAMES
              </Link>
              <Link 
                href="/quiz"
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 px-4 rounded-lg font-semibold text-sm text-center block hover:from-orange-600 hover:to-red-600 transition-colors"
              >
                🧠 TAKE QUIZ
              </Link>
            </div>
          </>
        ) : (
          <>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Start your learning!</h3>
            <p className="text-sm text-gray-600 mb-4">
              Complete {dailyProgress.dailyGoal} lessons today to build your streak and improve your Spanish!
            </p>
            <div className="space-y-2">
              <Link 
                href="/games"
                className="w-full bg-gradient-to-br from-teal-600 to-teal-500 text-white py-3 px-4 rounded-lg font-semibold text-sm text-center block hover:from-green-600 hover:to-blue-600 transition-colors"
              >
                <span className="mr-2">🎮</span> START PLAYING
              </Link>
              <Link 
                href="/quiz"
                className="w-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white py-2 px-4 rounded-lg font-semibold text-sm text-center block hover:from-purple-600 hover:to-pink-600 transition-colors"
              >
                <span className="mr-2">🧠</span> TRY QUIZ
              </Link>
            </div>
          </>
        )}
      </div>
    );
  }

  // Show signup prompt for non-logged-in users
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 h-56">
      <div className="flex items-start justify-between mb-4">
        <div className="bg-gradient-to-r from-green-500 to-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold">
          USER
        </div>
      </div>
      <h3 className="text-lg font-bold text-gray-800 mb-2">Sign up for free</h3>
      <p className="text-sm text-gray-600 mb-4">Track your progress, get personalized practice, and unlock unlimited access!</p>
      <Link 
        href="/auth/signup"
        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-4 rounded-lg font-semibold text-sm text-center block hover:from-blue-600 hover:to-purple-600 transition-colors"
      >
        REGISTER ACCOUNT
      </Link>
    </div>
  );
}

const DailyProgressCard = ({ user, dailyProgress }: { user: any, dailyProgress: DailyProgress }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Daily Progress</h3>
        {user ? (
          <span className="text-blue-600 text-sm font-medium">VIEW ALL</span>
        ) : (
          <span className="text-gray-500 text-sm font-medium">SIGN UP TO TRACK</span>
        )}
      </div>
    <div className="space-y-3">
      {user 
        ? (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-yellow-800 text-sm">⚡</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">Complete {dailyProgress.dailyGoal} lessons</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div 
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-300" 
                    style={{width: `${dailyProgress.progressPercentage}%`}}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {dailyProgress.gamesCompletedToday} / {dailyProgress.dailyGoal} completed
                </p>
              </div>
            </div>
          )
        : (
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-gray-400 text-lg">📊</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">Track your daily progress and build learning streaks!</p>
              <Link 
                href="/auth/signup"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-colors"
              >
                Sign up to start tracking
              </Link>
            </div>
          )
      }
    </div>
  </div>
)

const StatsCard = ({ user, userStats }: { user: any, userStats: UserStats | null }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Stats</h3>
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">Streak</span>
        <span className="text-lg font-bold text-orange-500">
          {userStats?.current_streak || 0} days
        </span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">XP Earned</span>
        <span className="text-lg font-bold text-blue-500">
          {userStats?.total_score?.toLocaleString() || 0}
        </span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">Lessons</span>
        <span className="text-lg font-bold text-green-500">
          {userStats?.total_games_completed || 0}
        </span>
      </div>
    </div>
  </div>
)


export default async function Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch user progress data if user is authenticated
  let userProgressData = null;
  if (user) {
    try {
      userProgressData = await getUserProgressData(user.id);
    } catch (error) {
      console.error('Error fetching user progress data:', error);
    }
  }
  
  const { data: games, error: gamesError } = await supabase
    .from('games')
    .select('*')
    .order('sort_order', { ascending: true })
    .limit(4);

  const { data: stories, error: storiesError } = await supabase
    .from('stories')
    .select('*')
    .order('created_at', { ascending: true })
    .limit(4);
  
  if (gamesError) {
    console.error('Error fetching games:', gamesError)
  }

  if (storiesError) {
    console.error('Error fetching stories:', storiesError)
  }


  return (
    <div className="flex w-full min-h-full flex-col">
      <div 
        className="mx-auto flex w-full max-w-7xl items-start gap-x-8 px-4 py-10 sm:px-6 lg:px-8"
      >
        <main className="flex-1">
          <Homepage games={games || []} stories={stories || []} />
        </main>

        <aside className="sticky -top-1/2 hidden w-80 xl:w-96 shrink-0 lg:flex lg:flex-col gap-8">
          <PremiumFeatureCard 
            user={user} 
            dailyProgress={userProgressData?.dailyProgress || { gamesCompletedToday: 0, dailyGoal: 5, progressPercentage: 0 }}
          />
          <DailyProgressCard 
            user={user} 
            dailyProgress={userProgressData?.dailyProgress || { gamesCompletedToday: 0, dailyGoal: 5, progressPercentage: 0 }}
          />
          <StatsCard 
            user={user} 
            userStats={userProgressData?.userStats || null}
          />
          <div className="flex justify-center mt-4">
            {navigationItems.map((item) => (
              <Link key={item.href} href={item.href} className="font-medium text-gray-500 hover:text-primary-coral transition-all duration-200 mx-2.5 mb-3">
                {item.name}
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}
