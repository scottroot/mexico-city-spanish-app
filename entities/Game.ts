import { createClient } from '@/utils/supabase/client'

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
      const supabase = createClient()
      console.log('Game.list: Supabase client created')
      
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .order('created_at', { ascending: true })

      console.log('Game.list: Database result:', { data: data?.length, error })

      if (error) {
        console.error('Error fetching games:', error)
        return []
      }

      const gamesList = data.map(item => new Game(item))
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
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error fetching game:', error)
        return null
      }

      return new Game(data)
    } catch (error) {
      console.error('Error in Game.get:', error)
      return null
    }
  }

  // Create a new game (admin function)
  static async create(gameData: Omit<GameData, 'created_at' | 'updated_at'>): Promise<{ success: boolean; data?: Game; error?: string }> {
    try {
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from('games')
        .insert([gameData])
        .select()
        .single()

      if (error) {
        console.error('Error creating game:', error)
        return { success: false, error: error.message }
      }

      return { success: true, data: new Game(data) }
    } catch (error) {
      console.error('Error in Game.create:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  // Update an existing game (admin function)
  async update(updateData: Partial<GameData>): Promise<{ success: boolean; data?: Game; error?: string }> {
    try {
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from('games')
        .update(updateData)
        .eq('id', this.id)
        .select()
        .single()

      if (error) {
        console.error('Error updating game:', error)
        return { success: false, error: error.message }
      }

      // Update local instance
      Object.assign(this, data)
      return { success: true, data: this }
    } catch (error) {
      console.error('Error in Game.update:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  // Delete a game (admin function)
  async delete(): Promise<{ success: boolean; error?: string }> {
    try {
      const supabase = createClient()
      
      const { error } = await supabase
        .from('games')
        .delete()
        .eq('id', this.id)

      if (error) {
        console.error('Error deleting game:', error)
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      console.error('Error in Game.delete:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }
}
