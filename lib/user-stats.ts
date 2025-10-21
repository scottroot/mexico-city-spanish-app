import { createClient } from '@/utils/supabase/server'

export interface UserStats {
  current_streak: number
  total_score: number
  total_games_completed: number
  longest_streak: number
  last_played: string | null
}

export interface DailyProgress {
  gamesCompletedToday: number
  dailyGoal: number
  progressPercentage: number
}

export interface RecentActivity {
  id: string
  gameType: string
  score: number
  completedAt: string
  gameTitle?: string
}

export interface UserProgressData {
  userStats: UserStats | null
  dailyProgress: DailyProgress
  recentActivity: RecentActivity[]
  isLoading: boolean
  error: string | null
}

/**
 * Fetch user statistics from the user_stats table
 */
export async function getUserStats(userId: string): Promise<UserStats | null> {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      console.error('Error fetching user stats:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error in getUserStats:', error)
    return null
  }
}

/**
 * Calculate daily progress by counting games completed today
 */
export async function getDailyProgress(userId: string): Promise<DailyProgress> {
  try {
    const supabase = await createClient()
    
    // Get start and end of today
    const today = new Date()
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
    
    // Count games completed today
    const { data: todayProgress, error } = await supabase
      .from('progress')
      .select('id')
      .eq('user_id', userId)
      .eq('completed', true)
      .gte('created_at', startOfDay.toISOString())
      .lt('created_at', endOfDay.toISOString())

    if (error) {
      console.error('Error fetching daily progress:', error)
      return {
        gamesCompletedToday: 0,
        dailyGoal: 5, // Default daily goal
        progressPercentage: 0
      }
    }

    const gamesCompletedToday = todayProgress?.length || 0
    const dailyGoal = 5 // Could be made configurable later
    const progressPercentage = Math.min((gamesCompletedToday / dailyGoal) * 100, 100)

    return {
      gamesCompletedToday,
      dailyGoal,
      progressPercentage
    }
  } catch (error) {
    console.error('Error in getDailyProgress:', error)
    return {
      gamesCompletedToday: 0,
      dailyGoal: 5,
      progressPercentage: 0
    }
  }
}

/**
 * Fetch recent activity for the user
 */
export async function getRecentActivity(userId: string): Promise<RecentActivity[]> {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('progress')
      .select('id, game_type, score, created_at, game_id')
      .eq('user_id', userId)
      .eq('completed', true)
      .order('created_at', { ascending: false })
      .limit(3)

    if (error) {
      console.error('Error fetching recent activity:', error)
      return []
    }

    return data?.map(item => ({
      id: item.id,
      gameType: item.game_type,
      score: item.score,
      completedAt: item.created_at,
      gameTitle: item.game_id
    })) || []
  } catch (error) {
    console.error('Error in getRecentActivity:', error)
    return []
  }
}

/**
 * Fetch comprehensive user progress data for sidebar cards
 */
export async function getUserProgressData(userId: string): Promise<UserProgressData> {
  try {
    const [userStats, dailyProgress, recentActivity] = await Promise.all([
      getUserStats(userId),
      getDailyProgress(userId),
      getRecentActivity(userId)
    ])

    return {
      userStats,
      dailyProgress,
      recentActivity,
      isLoading: false,
      error: null
    }
  } catch (error) {
    console.error('Error in getUserProgressData:', error)
    return {
      userStats: null,
      dailyProgress: {
        gamesCompletedToday: 0,
        dailyGoal: 5,
        progressPercentage: 0
      },
      recentActivity: [],
      isLoading: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}
