import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Star, Heart, Calendar, Play } from 'lucide-react'
import { getImageUrl } from '../services/tmdbApi'
import { useAuth } from '../context/AuthContext'
import { favoritesService } from '../services/favoritesService'
import { MovieCardProps } from '../types'
import toast from 'react-hot-toast'

const MovieCard = ({ item, onFavoriteChange }: MovieCardProps) => {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [isFavorite, setIsFavorite] = useState(
    user ? favoritesService.isFavorite(user.id, typeof item.id === 'string' ? parseInt(item.id) : item.id, item.media_type) : false
  )

  const title = 'title' in item ? item.title : item.name
  const releaseDate = 'release_date' in item ? item.release_date : item.first_air_date
  const mediaType = item.media_type
  const detailPath = mediaType === 'movie' ? `/movie/${item.id}` : `/tv/${item.id}`

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!user) {
      toast.error('Please sign in to add favorites')
      return
    }

    let success
    if (isFavorite) {
      success = favoritesService.removeFromFavorites(user.id, typeof item.id === 'string' ? parseInt(item.id) : item.id, mediaType)
      if (success) {
        setIsFavorite(false)
        toast.success(t('removedFromFavorites'))
        onFavoriteChange?.(item, false)
      }
    } else {
      success = favoritesService.addToFavorites(user.id, { ...item, media_type: 'movie' })
      if (success) {
        setIsFavorite(true)
        toast.success(t('addedToFavorites'))
        onFavoriteChange?.(item, true)
      }
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    return new Date(dateString).getFullYear()
  }

  const formatRating = (rating: number) => {
    return rating ? rating.toFixed(1) : 'N/A'
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded overflow-hidden">
      <Link to={detailPath} className="block">
        {/* Poster Image */}
        <div className="relative">
          {item.poster_path ? (
            <img
              src={getImageUrl(item.poster_path, 'medium', 'poster') || ''}
              alt={title}
              className="w-full h-auto"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <Play className="h-12 w-12 text-gray-400" />
            </div>
          )}
          
          {/* Favorite Button */}
          <button
            onClick={handleFavoriteClick}
            className={`absolute top-2 right-2 p-1 rounded ${
              isFavorite
                ? 'bg-red-500 text-white'
                : 'bg-black bg-opacity-50 text-white hover:bg-red-500'
            }`}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart 
              className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} 
            />
          </button>

          {/* Rating */}
          {item.vote_average > 0 && (
            <div className="absolute top-2 left-2 bg-black bg-opacity-75 rounded px-1 py-1 flex items-center">
              <Star className="h-3 w-3 text-yellow-400 fill-current" />
              <span className="text-white text-xs ml-1">
                {formatRating(item.vote_average)}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3">
          <h3 className="font-medium text-gray-900 dark:text-white text-sm mb-1 line-clamp-2">
            {title}
          </h3>
          
          {releaseDate && (
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {formatDate(releaseDate)}
            </div>
          )}
        </div>
      </Link>
    </div>
  )
}

export default MovieCard