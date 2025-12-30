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
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(progressData),
      })

      const result = await response.json()

      if (!response.ok) {
        console.error('Error creating progress:', result.error)
        return { success: false, error: result.error || 'Failed to create progress' }
      }

      // Handle unauthenticated users
      if (result.success && !result.data) {
        return { success: true, data: undefined, message: result.message }
      }

      console.log('Progress created successfully:', result.data)
      return { success: true, data: result.data ? new Progress(result.data) : undefined }
    } catch (error) {
      console.error('Error in Progress.create:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  // Get all progress for current user
  static async list(): Promise<ProgressResult<Progress[]>> {
    try {
      console.log('Progress.list: Starting...')

      const response = await fetch('/api/progress')
      const result = await response.json()

      if (!response.ok) {
        console.info('Error fetching progress:', result.error)
        return { success: false, error: result.error || 'Failed to fetch progress', data: [] }
      }

      const progressList = result.data.map((item: any) => new Progress(item))
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
      const response = await fetch(`/api/progress/game/${gameId}`)
      const result = await response.json()

      if (!response.ok) {
        console.error('Error fetching progress for game:', result.error)
        return { success: false, error: result.error || 'Failed to fetch progress', data: null }
      }

      return { success: true, data: result.data ? new Progress(result.data) : null }
    } catch (error) {
      console.error('Error in Progress.getByGameId:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error', data: null }
    }
  }

  // Update existing progress
  async update(updateData: Partial<ProgressData>): Promise<ProgressResult<Progress>> {
    try {
      if (!this.id) {
        return { success: false, error: 'Progress ID is required for update' }
      }

      const response = await fetch(`/api/progress/${this.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })

      const result = await response.json()

      if (!response.ok) {
        console.error('Error updating progress:', result.error)
        return { success: false, error: result.error || 'Failed to update progress' }
      }

      // Update local instance
      Object.assign(this, result.data)
      return { success: true, data: this }
    } catch (error) {
      console.error('Error in Progress.update:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  // Delete progress record
  async delete(): Promise<ProgressResult<void>> {
    try {
      if (!this.id) {
        return { success: false, error: 'Progress ID is required for delete' }
      }

      const response = await fetch(`/api/progress/${this.id}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (!response.ok) {
        console.error('Error deleting progress:', result.error)
        return { success: false, error: result.error || 'Failed to delete progress' }
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
      const response = await fetch('/api/progress/stats')
      const result = await response.json()

      if (!response.ok) {
        console.error('Error fetching user stats:', result.error)
        return { success: false, error: result.error || 'Failed to fetch user stats', data: null }
      }

      return { success: true, data: result.data }
    } catch (error) {
      console.error('Error in Progress.getUserStats:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error', data: null }
    }
  }
}
