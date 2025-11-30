export interface FavoriteData {
  id?: string
  user_id: string
  verb_infinitive: string
  created_at?: string
}

export interface FavoritesResult<T> {
  success: boolean
  data?: T
  error?: string
}

export class Favorites {
  public id?: string
  public user_id: string
  public verb_infinitive: string
  public created_at?: string

  constructor(data: FavoriteData) {
    this.id = data.id
    this.user_id = data.user_id
    this.verb_infinitive = data.verb_infinitive
    this.created_at = data.created_at
  }

  // Add a verb to favorites
  static async addFavorite(verbInfinitive: string): Promise<FavoritesResult<FavoriteData>> {
    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ verbInfinitive }),
      })

      const result = await response.json()

      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 401) {
          console.log('User not authenticated - favorites will not be saved')
          return { success: true, data: undefined, error: 'User not authenticated' }
        }
        if (response.status === 400 && result.error === 'Already favorited') {
          return { success: true, data: undefined, error: 'Already favorited' }
        }
        if (response.status === 503 && result.error === 'Table not ready') {
          console.log('User favorites table does not exist yet, skipping save')
          return { success: true, data: undefined, error: 'Table not ready' }
        }
        console.error('Error adding favorite:', result.error)
        return { success: false, error: result.error || 'Failed to add favorite' }
      }

      return { success: true, data: result.data }
    } catch (error) {
      console.error('Error in addFavorite:', error)
      return { success: false, error: 'Failed to add favorite' }
    }
  }

  // Remove a verb from favorites
  static async removeFavorite(verbInfinitive: string): Promise<FavoritesResult<null>> {
    try {
      const response = await fetch('/api/favorites', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ verbInfinitive }),
      })

      const result = await response.json()

      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 401) {
          console.log('User not authenticated - favorites will not be saved')
          return { success: true, data: undefined, error: 'User not authenticated' }
        }
        console.error('Error removing favorite:', result.error)
        return { success: false, error: result.error || 'Failed to remove favorite' }
      }

      return { success: true, data: null }
    } catch (error) {
      console.error('Error in removeFavorite:', error)
      return { success: false, error: 'Failed to remove favorite' }
    }
  }

  // Get all user favorites
  static async getUserFavorites(): Promise<FavoritesResult<string[]>> {
    try {
      const response = await fetch('/api/favorites')
      const result = await response.json()

      if (!response.ok) {
        console.error('Error getting favorites:', result.error)
        return { success: false, error: result.error || 'Failed to get favorites' }
      }

      return { success: true, data: result.favorites || [] }
    } catch (error) {
      console.error('Error in getUserFavorites:', error)
      return { success: false, error: 'Failed to get favorites' }
    }
  }

  // Check if a verb is favorited
  static async isFavorited(verbInfinitive: string): Promise<boolean> {
    try {
      const result = await Favorites.getUserFavorites()
      if (!result.success || !result.data) {
        return false
      }
      return result.data.includes(verbInfinitive)
    } catch (error) {
      console.error('Error checking if favorited:', error)
      return false
    }
  }
}
