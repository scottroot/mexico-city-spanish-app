import { getUser } from '@/utils/supabase/auth'
import { createClient } from '@/utils/supabase/client'

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
      const supabase = createClient()
      
      // Get current user
      const { error: userError, ...user } = await getUser();
      if (userError || !user.isLoggedIn) {
        console.log('User not authenticated - favorites will not be saved')
        return { success: true, data: undefined, error: 'User not authenticated' }
      }

      // Check if already favorited
      const { data: existing, error: checkError } = await supabase
        .from('user_favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('verb_infinitive', verbInfinitive)
        .maybeSingle()

      if (checkError) {
        console.error('Error checking existing favorite:', checkError)
        return { success: false, error: checkError.message }
      }

      if (existing) {
        return { success: true, data: undefined, error: 'Already favorited' }
      }

      // Add to favorites
      const { data, error } = await supabase
        .from('user_favorites')
        .insert([{
          user_id: user.id,
          verb_infinitive: verbInfinitive
        }])
        .select()
        .single()

      if (error) {
        // If table doesn't exist yet, return success but don't save (graceful degradation)
        const errorMessage = error.message || error.toString() || ''
        if (errorMessage.includes('relation "user_favorites" does not exist') || 
            errorMessage.includes('does not exist') ||
            errorMessage.includes('relation')) {
          console.log('User favorites table does not exist yet, skipping save')
          return { success: true, data: undefined, error: 'Table not ready' }
        }
        console.error('Error adding favorite:', error)
        return { success: false, error: errorMessage }
      }

      return { success: true, data }
    } catch (error) {
      console.error('Error in addFavorite:', error)
      return { success: false, error: 'Failed to add favorite' }
    }
  }

  // Remove a verb from favorites
  static async removeFavorite(verbInfinitive: string): Promise<FavoritesResult<null>> {
    try {
      const supabase = createClient()
      
      // Get current user
      const { error: userError, ...user } = await getUser();
      if (userError || !user.isLoggedIn) {
        console.log('User not authenticated - favorites will not be saved')
        return { success: true, data: undefined, error: 'User not authenticated' }
      }

      // Remove from favorites
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('verb_infinitive', verbInfinitive)

      if (error) {
        // If table doesn't exist yet, return success but don't save (graceful degradation)
        const errorMessage = error.message || error.toString() || ''
        if (errorMessage.includes('relation "user_favorites" does not exist') || 
            errorMessage.includes('does not exist') ||
            errorMessage.includes('relation')) {
          console.log('User favorites table does not exist yet, skipping remove')
          return { success: true, data: null, error: 'Table not ready' }
        }
        console.error('Error removing favorite:', error)
        return { success: false, error: errorMessage }
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
      const supabase = createClient()
      
      // Get current user
      const { error: userError, ...user } = await getUser();
      if (userError || !user.isLoggedIn) {
        console.log('User not authenticated - returning empty favorites')
        return { success: true, data: [] }
      }

      // Get user favorites
      const { data, error } = await supabase
        .from('user_favorites')
        .select('verb_infinitive')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        // If table doesn't exist yet, return empty favorites (graceful degradation)
        const errorMessage = error.message || error.toString() || ''
        if (errorMessage.includes('relation "user_favorites" does not exist') || 
            errorMessage.includes('does not exist') ||
            errorMessage.includes('relation')) {
          console.log('User favorites table does not exist yet, returning empty favorites')
          return { success: true, data: [] }
        }
        console.error('Error getting favorites:', error)
        return { success: false, error: errorMessage }
      }

      const favorites = data?.map(fav => fav.verb_infinitive) || []
      return { success: true, data: favorites }
    } catch (error) {
      console.error('Error in getUserFavorites:', error)
      return { success: false, error: 'Failed to get favorites' }
    }
  }

  // Check if a verb is favorited
  static async isFavorited(verbInfinitive: string): Promise<boolean> {
    try {
      const supabase = createClient()
      
      // Get current user
      const { error: userError, ...user } = await getUser();
      if (userError || !user.isLoggedIn) {
        return false
      }

      // Check if favorited
      const { data, error } = await supabase
        .from('user_favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('verb_infinitive', verbInfinitive)
        .maybeSingle()

      // If table doesn't exist yet, return false (graceful degradation)
      if (error) {
        const errorMessage = error.message || error.toString() || ''
        if (errorMessage.includes('relation "user_favorites" does not exist') || 
            errorMessage.includes('does not exist') ||
            errorMessage.includes('relation')) {
          console.log('User favorites table does not exist yet, returning false')
          return false
        }
      }
      return !error && !!data
    } catch (error) {
      console.error('Error checking if favorited:', error)
      return false
    }
  }
}
