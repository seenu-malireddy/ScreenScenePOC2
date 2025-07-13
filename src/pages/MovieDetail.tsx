import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Star, Heart, Calendar, Clock, Play } from 'lucide-react'
import { getImageUrl, api } from '../services/tmdbApi'
import { useAuth } from '../context/AuthContext'
import { favoritesService } from '../services/favoritesService'
import { MovieDetails } from '../types'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import toast from 'react-hot-toast'

const MovieDetail = () => {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const [movie, setMovie] = useState<MovieDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (!id) return
      
      try {
        setLoading(true)
        setError(null)
        
        const response = await api.getMovieDetails(id)
        setMovie(response.data)
        
        // Check if movie is in favorites
        if (user && id) {
          setIsFavorite(favoritesService.isFavorite(user.id, parseInt(id), 'movie'))
        }
      } catch (err) {
        setError(t('error'))
        console.error('Error fetching movie details:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchMovieDetails()
  }, [id, user])

  const handleFavoriteClick = () => {
    if (!user) {
      toast.error(t('signInToAddFavorites'))
      return
    }

    if (!movie) return

    let success
    if (isFavorite) {
      success = favoritesService.removeFromFavorites(user.id, parseInt(movie.id), 'movie')
      if (success) {
        setIsFavorite(false)
        toast.success(t('removedFromFavorites'))
      }
    } else {
      success = favoritesService.addToFavorites(user.id, { ...movie, media_type: 'movie' })
      if (success) {
        setIsFavorite(true)
        toast.success(t('addedToFavorites'))
      }
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const formatCurrency = (amount: number) => {
    if (amount === 0) return 'N/A'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  if (loading) {
    return <LoadingSpinner message={t('loading')} />
  }

  if (error || !movie) {
    return <ErrorMessage message={error || t('movieNotFound')} onRetry={() => window.location.reload()} />
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-4">
      {/* Back Button */}
      <div className="mb-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('backToMovies')}
        </Link>
      </div>

      {/* Movie Header */}
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        {/* Poster */}
        <div className="flex-shrink-0">
          <img
            src={getImageUrl(movie.poster_path, 'large', 'poster') || ''}
            alt={movie.title}
            className="w-48 h-auto rounded border"
          />
        </div>

        {/* Movie Info */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{movie.title}</h1>
            <button
              onClick={handleFavoriteClick}
              className={`p-2 rounded ${
                isFavorite
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-red-500 hover:text-white'
              }`}
            >
              <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>
          
          <div className="flex items-center gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
            {movie.release_date && (
              <div className="flex items-center gap-1">
                {/* <Calendar className="h-4 w-4" /> */}
                <span>{formatDate(movie.release_date)}</span>
              </div>
            )}
            
            {movie.runtime > 0 && (
              <div className="flex items-center gap-1">
                {/* <Clock className="h-4 w-4" /> */}
                <span>{formatRuntime(movie.runtime)}</span>
              </div>
            )}
            
            {movie.vote_average > 0 && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span>{movie.vote_average.toFixed(1)}</span>
              </div>
            )}
          </div>

          {/* Genres
          {movie.genres && movie.genres.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {movie.genres.map(genre => (
                <span
                  key={genre.id}
                  className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded text-sm"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          )} */}

          {/* Overview */}
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {movie.overview}
          </p>
        </div>
      </div>

      {/* Cast */}
      {movie.credits?.cast && movie.credits.cast.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{t('cast')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {movie.credits.cast.slice(0, 9).map(actor => (
              <div key={actor.id} className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded">
                {/* <img
                  src={getImageUrl(actor.profile_path, 'small', 'profile') || ''}
                  alt={actor.name}
                  className="w-12 h-12 rounded object-cover"
                /> */}
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">{actor.name}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{actor.character}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Movie Info */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Movie Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {movie.status && (
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
              <p className="font-medium text-gray-900 dark:text-white">{movie.status}</p>
            </div>
          )}
          
          {movie.budget > 0 && (
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Budget</p>
              <p className="font-medium text-gray-900 dark:text-white">{formatCurrency(movie.budget)}</p>
            </div>
          )}
          
          {movie.revenue > 0 && (
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Revenue</p>
              <p className="font-medium text-gray-900 dark:text-white">{formatCurrency(movie.revenue)}</p>
            </div>
          )}
          
          {movie.original_language && (
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Original Language</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {movie.original_language.toUpperCase()}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MovieDetail