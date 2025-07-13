import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import { Movie, Genre } from '../types'
import { api, filterHelpers } from '../services/tmdbApi'
import MovieCard from '../components/MovieCard'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import { Search, Filter, X } from 'lucide-react'

const Home = () => {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('')
  const [selectedYear, setSelectedYear] = useState('')
  const [genres, setGenres] = useState<Genre[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const observer = useRef<IntersectionObserver>()

  const fetchMovies = useCallback(async (pageNum: number, append: boolean = false) => {
    try {
      setLoadingMore(true)
      setError(null)
      
      let response
      if (searchQuery.trim()) {
        response = await api.searchMovies(searchQuery, pageNum)
      } else {
        const filters = {
          genre: selectedGenre,
          year: selectedYear,
          page: pageNum,
          sortBy: 'popularity.desc'
        }
        const params = filterHelpers.buildDiscoverParams(filters)
        response = await api.discoverMovies(params)
      }
      
      const newMovies = response.data.results
      
      if (append) {
        setMovies(prev => [...prev, ...newMovies])
      } else {
        setMovies(newMovies)
      }
      
      setHasMore(pageNum < response.data.total_pages)
    } catch (err) {
      setError(t('error'))
      console.error('Error fetching movies:', err)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [searchQuery, selectedGenre, selectedYear])

  const fetchGenres = async () => {
    try {
      const response = await api.getMovieGenres()
      setGenres(response.data.genres)
    } catch (err) {
      console.error('Error fetching genres:', err)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    setMovies([])
    fetchMovies(1, false)
  }

  const handleFilterChange = () => {
    setPage(1)
    setMovies([])
    fetchMovies(1, false)
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedGenre('')
    setSelectedYear('')
    setPage(1)
    setMovies([])
    fetchMovies(1, false)
  }

  useEffect(() => {
    fetchMovies(1, false)
  }, [fetchMovies])

  useEffect(() => {
    fetchGenres()
  }, [])

  const lastMovieRef = useCallback((node: HTMLDivElement) => {
    if (loadingMore) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        const nextPage = page + 1
        setPage(nextPage)
        fetchMovies(nextPage, true)
      }
    })
    if (node) observer.current.observe(node)
  }, [loadingMore, hasMore, page, fetchMovies])

  if (loading) {
    return <LoadingSpinner message={t('loading')} />
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={() => fetchMovies(1, false)} />
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className="text-center mb-6">
        <p className="text-gray-600 dark:text-gray-400">
          {t('browseAndSearch')}
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-6">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-4">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              {/* <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" /> */}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchMovies')}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            {/* <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {t('search')}
            </button> */}
          </div>
        </form>

        {/* Filter Toggle */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
          >
            <Filter className="h-4 w-4" />
            {t('filters')}
          </button>
          
          {(searchQuery || selectedGenre || selectedYear) && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              <X className="h-4 w-4" />
              {t('clear')}
            </button>
          )}
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-800 mb-4">
            {/* Genre Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('genres')}
              </label>
              <select
                value={selectedGenre}
                onChange={(e) => {
                  setSelectedGenre(e.target.value)
                  handleFilterChange()
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">{t('allGenres')}</option>
                {genres.map(genre => (
                  <option key={genre.id} value={genre.id.toString()}>
                    {genre.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Year Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('year')}
              </label>
              <select
                value={selectedYear}
                onChange={(e) => {
                  setSelectedYear(e.target.value)
                  handleFilterChange()
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">{t('allYears')}</option>
                {filterHelpers.getYearOptions().map(year => (
                  <option key={year} value={year.toString()}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Movies Grid */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          {searchQuery ? `Search Results for "${searchQuery}"` : 'Movies'}
        </h2>
        
        {movies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {movies.map((movie, index) => {
              if (movies.length === index + 1) {
                return (
                  <div key={movie.id} ref={lastMovieRef}>
                    <MovieCard
                      item={{ ...movie, media_type: 'movie' }}
                    />
                  </div>
                )
              } else {
                return (
                  <MovieCard
                    key={movie.id}
                    item={{ ...movie, media_type: 'movie' }}
                  />
                )
              }
            })}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            No movies available at the moment.
          </p>
        )}
        
        {loadingMore && (
          <div className="flex justify-center mt-8">
            <LoadingSpinner message="Loading more movies..." />
          </div>
        )}
      </div>


    </div>
  )
}

export default Home 