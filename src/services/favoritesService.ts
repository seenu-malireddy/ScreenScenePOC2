import { FavoriteItem, MediaItem } from '../types'

export const favoritesService = {
  getFavorites: (userId: string): FavoriteItem[] => {
    if (!userId) return []
    
    try {
      const favorites = localStorage.getItem(`screenscene_favorites_${userId}`)
      return favorites ? JSON.parse(favorites) : []
    } catch (error) {
      console.error('Error getting favorites:', error)
      return []
    }
  },

  addToFavorites: (userId: string, item: MediaItem & { media_type?: 'movie' | 'tv' }): boolean => {
    if (!userId || !item) return false
    
    try {
      const favorites = favoritesService.getFavorites(userId)
      
      const exists = favorites.some(fav => 
        fav.id === item.id && fav.media_type === item.media_type
      )
      
      if (exists) return false
      const favoriteItem: FavoriteItem = {
        ...item,
        title: 'title' in item ? item.title : undefined,
        name: 'name' in item ? item.name : undefined,
        release_date: 'release_date' in item ? item.release_date : undefined,
        first_air_date: 'first_air_date' in item ? item.first_air_date : undefined,
        media_type: item.media_type || ('title' in item ? 'movie' : 'tv'),
        addedAt: new Date().toISOString()
      }
      
      const updatedFavorites = [favoriteItem, ...favorites]
      localStorage.setItem(
        `screenscene_favorites_${userId}`, 
        JSON.stringify(updatedFavorites)
      )
      
      return true
    } catch (error) {
      console.error('Error adding to favorites:', error)
      return false
    }
  },

  removeFromFavorites: (userId: string, itemId: number, mediaType: 'movie' | 'tv'): boolean => {
    if (!userId || !itemId) return false
    
    try {
      const favorites = favoritesService.getFavorites(userId)
      const updatedFavorites = favorites.filter(fav => 
        !(fav.id === itemId && fav.media_type === mediaType)
      )
      
      localStorage.setItem(
        `screenscene_favorites_${userId}`, 
        JSON.stringify(updatedFavorites)
      )
      
      return true
    } catch (error) {
      console.error('Error removing from favorites:', error)
      return false
    }
  },

  // Check if item is in favorites
  isFavorite: (userId: string, itemId: number, mediaType: 'movie' | 'tv'): boolean => {
    if (!userId || !itemId) return false
    
    const favorites = favoritesService.getFavorites(userId)
    return favorites.some(fav => 
      fav.id === itemId && fav.media_type === mediaType
    )
  },

  // Get favorites count
  getFavoritesCount: (userId: string): number => {
    return favoritesService.getFavorites(userId).length
  },

  // Clear all favorites
  clearFavorites: (userId: string): boolean => {
    if (!userId) return false
    
    try {
      localStorage.removeItem(`screenscene_favorites_${userId}`)
      return true
    } catch (error) {
      console.error('Error clearing favorites:', error)
      return false
    }
  },

  // Get favorites by type
  getFavoritesByType: (userId: string, mediaType: 'movie' | 'tv'): FavoriteItem[] => {
    const favorites = favoritesService.getFavorites(userId)
    return favorites.filter(fav => fav.media_type === mediaType)
  },

  // Export favorites (for backup/sharing)
  exportFavorites: (userId: string) => {
    const favorites = favoritesService.getFavorites(userId)
    return {
      userId,
      exportDate: new Date().toISOString(),
      favorites,
      count: favorites.length
    }
  },

  // Import favorites (from backup)
  importFavorites: (userId: string, favoritesData: { favorites: FavoriteItem[] }): boolean => {
    if (!userId || !favoritesData || !Array.isArray(favoritesData.favorites)) {
      return false
    }
    
    try {
      localStorage.setItem(
        `screenscene_favorites_${userId}`, 
        JSON.stringify(favoritesData.favorites)
      )
      return true
    } catch (error) {
      console.error('Error importing favorites:', error)
      return false
    }
  }
}

export default favoritesService