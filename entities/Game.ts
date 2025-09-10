// Removed direct Supabase client import - now using API routes

export interface GameContent {
  questions: Array<{
    question?: string
    instruction?: string
    sentence?: string
    type?: string
    phrase?: string
    options?: string[]
    correct_answer: string
    hint?: string
    explanation: string
  }>
}

export interface GameData {
  id: string
  title: string
  type: 'grammar' | 'vocabulary' | 'pronunciation' | 'shopping'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  content: GameContent
  created_at?: string
  updated_at?: string
}

export class Game {
  public id: string
  public title: string
  public type: 'grammar' | 'vocabulary' | 'pronunciation' | 'shopping'
  public difficulty: 'beginner' | 'intermediate' | 'advanced'
  public content: GameContent
  public created_at?: string
  public updated_at?: string

  constructor(data: GameData) {
    this.id = data.id
    this.title = data.title
    this.type = data.type
    this.difficulty = data.difficulty
    this.content = data.content
    this.created_at = data.created_at
    this.updated_at = data.updated_at
  }

  // Get all games
  static async list(): Promise<Game[]> {
    try {
      console.log('Game.list: Starting...')
      
      const response = await fetch('/api/games', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        console.error('Error fetching games:', response.status)
        return []
      }

      const result = await response.json()
      const gamesList = result.data.map((item: any) => new Game(item))
      console.log('Game.list: Returning games list:', gamesList.length, 'items')
      return gamesList
    } catch (error) {
      console.error('Error in Game.list:', error)
      return []
    }
  }

  // Get a specific game by ID
  static async get(id: string): Promise<Game | null> {
    try {
      const response = await fetch(`/api/games/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        if (response.status === 404) {
          return null
        }
        console.error('Error fetching game:', response.status)
        return null
      }

      const result = await response.json()
      return new Game(result.data)
    } catch (error) {
      console.error('Error in Game.get:', error)
      return null
    }
  }

  // Create a new game (admin function)
  static async create(gameData: Omit<GameData, 'created_at' | 'updated_at'>): Promise<{ success: boolean; data?: Game; error?: string }> {
    try {
      const response = await fetch('/api/games', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gameData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        return { success: false, error: errorData.error || 'Failed to create game' }
      }

      const result = await response.json()
      return { success: true, data: new Game(result.data) }
    } catch (error) {
      console.error('Error in Game.create:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  // Update an existing game (admin function)
  async update(updateData: Partial<GameData>): Promise<{ success: boolean; data?: Game; error?: string }> {
    try {
      const response = await fetch(`/api/games/${this.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        return { success: false, error: errorData.error || 'Failed to update game' }
      }

      const result = await response.json()
      // Update local instance
      Object.assign(this, result.data)
      return { success: true, data: this }
    } catch (error) {
      console.error('Error in Game.update:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  // Delete a game (admin function)
  async delete(): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`/api/games/${this.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        return { success: false, error: errorData.error || 'Failed to delete game' }
      }

      return { success: true }
    } catch (error) {
      console.error('Error in Game.delete:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }
}
