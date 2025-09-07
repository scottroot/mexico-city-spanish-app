import { createClient } from '@/utils/supabase/client'

export interface ProgressData {
  id?: string
  user_id?: string
  game_type: 'grammar' | 'vocabulary' | 'pronunciation' | 'custom_quiz' | 'unknown'
  game_id: string
  score: number
  max_score?: number
  completed: boolean
  time_spent: number
  completion_time?: number
  mistakes?: number
  achievements: any[]
  created_at?: string
  updated_at?: string
}

export interface ProgressCreateData {
  game_id: string
  score: number
  max_score?: number
  completion_time: number
  mistakes?: number
  achievements?: any[]
}

export interface ProgressResult<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export class Progress {
  public id?: string
  public user_id?: string
  public game_type: 'grammar' | 'vocabulary' | 'pronunciation' | 'custom_quiz' | 'unknown'
  public game_id: string
  public score: number
  public max_score: number
  public completed: boolean
  public time_spent: number
  public completion_time: number
  public mistakes: number
  public achievements: any[]
  public created_at?: string
  public updated_at?: string

  constructor(data: ProgressData) {
    this.id = data.id
    this.user_id = data.user_id
    this.game_type = data.game_type
    this.game_id = data.game_id
    this.score = data.score || 0
    this.max_score = data.max_score || 10
    this.completed = data.completed || false
    this.time_spent = data.time_spent || 0
    this.completion_time = data.completion_time || data.time_spent || 0
    this.mistakes = data.mistakes || 0
    this.achievements = data.achievements || []
    this.created_at = data.created_at
    this.updated_at = data.updated_at
  }

  // Create a new progress record
  static async create(progressData: ProgressCreateData): Promise<ProgressResult<Progress>> {
    try {
      const supabase = createClient()
      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        console.log('User not authenticated - progress will not be saved to database')
        // Return success but don't save to database for unauthenticated users
        return { success: true, data: undefined, message: 'Progress not saved - user not authenticated' }
      }

      // Ensure user profile exists before saving progress
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single()

      if (profileError || !profile) {
        console.log('Profile does not exist, creating profile for user:', user.id)
        
        // Create profile with proper error handling
        const { data: newProfile, error: createProfileError } = await supabase
          .from('profiles')
          .insert([{
            id: user.id,
            email: user.email,
            name: user.user_metadata?.name || user.email?.split('@')[0] || 'User'
          }])
          .select()
          .single()

        if (createProfileError) {
          console.error('Error creating profile:', createProfileError)
          // If it's a duplicate key error, the profile might already exist
          if (createProfileError.code === '23505') {
            console.log('Profile already exists, continuing...')
          } else {
            return { success: false, error: `Failed to create user profile: ${createProfileError.message}` }
          }
        } else {
          console.log('Profile created successfully:', newProfile)
        }

        // Create user stats
        const { error: createStatsError } = await supabase
          .from('user_stats')
          .insert([{
            user_id: user.id
          }])

        if (createStatsError) {
          console.error('Error creating user stats:', createStatsError)
          // Don't fail the progress save if stats creation fails
        } else {
          console.log('User stats created successfully')
        }
      }

      // Determine game type from game_id
      const gameType = Progress.getGameTypeFromId(progressData.game_id)
      
      // Prepare data for database (only include columns that exist)
      const dbData = {
        user_id: user.id,
        game_type: gameType,
        game_id: progressData.game_id,
        score: progressData.score || 0,
        completed: true, // Assume completed if we're saving progress
        time_spent: progressData.completion_time || 0,
        achievements: progressData.achievements || []
      }

      const { data, error } = await supabase
        .from('progress')
        .insert([dbData])
        .select()
        .single()

      if (error) {
        console.error('Error creating progress:', error)
        // If table doesn't exist, just log and return success (no-op)
        if (error.message.includes('relation "progress" does not exist')) {
          console.log('Progress table does not exist yet, skipping save')
          return { success: true, data: undefined }
        }
        // If it's a foreign key constraint error, provide more specific feedback
        if (error.code === '23503') {
          console.error('Foreign key constraint error - user profile may not exist')
          return { success: false, error: 'User profile not found. Please try logging out and back in.' }
        }
        return { success: false, error: error.message }
      }

      console.log('Progress created successfully:', data)
      return { success: true, data: new Progress(data) }
    } catch (error) {
      console.error('Error in Progress.create:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  // Get all progress for current user
  static async list(): Promise<ProgressResult<Progress[]>> {
    try {
      console.log('Progress.list: Starting...')
      const supabase = createClient()
      console.log('Progress.list: Supabase client created')
      
      // Get current user
      console.log('Progress.list: Getting user...')
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      console.log('Progress.list: User result:', { user: user?.id, error: userError })
      
      if (userError || !user) {
        console.error('Error getting user:', userError)
        return { success: false, error: 'User not authenticated', data: [] }
      }

      console.log('Progress.list: Fetching progress for user:', user.id)
      const { data, error } = await supabase
        .from('progress')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      console.log('Progress.list: Database result:', { data: data?.length, error })

      if (error) {
        console.error('Error fetching progress:', error)
        // If table doesn't exist, return empty array instead of error
        if (error.code === 'PGRST116' || error.message.includes('relation "progress" does not exist')) {
          console.log('Progress table does not exist yet, returning empty array')
          return { success: true, data: [] }
        }
        return { success: false, error: error.message, data: [] }
      }

      const progressList = data.map(item => new Progress(item))
      console.log('Progress.list: Returning progress list:', progressList.length, 'items')
      return { success: true, data: progressList }
    } catch (error) {
      console.error('Error in Progress.list:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error', data: [] }
    }
  }

  // Get progress for a specific game
  static async getByGameId(gameId: string): Promise<ProgressResult<Progress | null>> {
    try {
      const supabase = createClient()
      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        console.error('Error getting user:', userError)
        return { success: false, error: 'User not authenticated', data: null }
      }

      const { data, error } = await supabase
        .from('progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('game_id', gameId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows found
          return { success: true, data: null }
        }
        console.error('Error fetching progress for game:', error)
        return { success: false, error: error.message, data: null }
      }

      return { success: true, data: new Progress(data) }
    } catch (error) {
      console.error('Error in Progress.getByGameId:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error', data: null }
    }
  }

  // Update existing progress
  async update(updateData: Partial<ProgressData>): Promise<ProgressResult<Progress>> {
    try {
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from('progress')
        .update(updateData)
        .eq('id', this.id)
        .select()
        .single()

      if (error) {
        console.error('Error updating progress:', error)
        return { success: false, error: error.message }
      }

      // Update local instance
      Object.assign(this, data)
      return { success: true, data: this }
    } catch (error) {
      console.error('Error in Progress.update:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  // Delete progress record
  async delete(): Promise<ProgressResult<void>> {
    try {
      const supabase = createClient()
      
      const { error } = await supabase
        .from('progress')
        .delete()
        .eq('id', this.id)

      if (error) {
        console.error('Error deleting progress:', error)
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      console.error('Error in Progress.delete:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  // Helper method to determine game type from game ID
  static getGameTypeFromId(gameId: string): 'grammar' | 'vocabulary' | 'pronunciation' | 'custom_quiz' | 'unknown' {
    if (gameId.includes('grammar')) return 'grammar'
    if (gameId.includes('vocab')) return 'vocabulary'
    if (gameId.includes('pronunciation')) return 'pronunciation'
    if (gameId === 'custom_quiz') return 'custom_quiz'
    return 'unknown'
  }

  // Get user statistics
  static async getUserStats(): Promise<ProgressResult<any>> {
    try {
      const supabase = createClient()
      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        console.error('Error getting user:', userError)
        return { success: false, error: 'User not authenticated', data: null }
      }

      const { data, error } = await supabase
        .from('user_progress_summary')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error) {
        console.error('Error fetching user stats:', error)
        return { success: false, error: error.message, data: null }
      }

      return { success: true, data }
    } catch (error) {
      console.error('Error in Progress.getUserStats:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error', data: null }
    }
  }
}
