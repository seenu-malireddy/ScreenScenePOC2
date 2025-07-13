import axios, { AxiosResponse } from 'axios'
import { 
  APIResponse, 
  Movie, 
  TVShow, 
  MovieDetails, 
  TVShowDetails, 
  Genre,
  Filters,
  ImageSizeType,
  ImageSize
} from '../types'

const BASE_URL = 'https://api.themoviedb.org/3'
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'

// TMDb API key
const API_KEY = '628d2272f107f1dff3aa874b00ad2c8b'

const tmdbApi = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
})

// Image size configurations
export const IMAGE_SIZES: Record<ImageSizeType, Record<ImageSize, string>> = {
  poster: {
    small: 'w154',
    medium: 'w342',
    large: 'w500',
    original: 'original'
  },
  backdrop: {
    small: 'w300',
    medium: 'w780',
    large: 'w1280',
    original: 'original'
  },
  profile: {
    small: 'w45',
    medium: 'w185',
    large: 'h632',
    original: 'original'
  }
}

// Helper function to get full image URL
export const getImageUrl = (
  path: string | null, 
  size: ImageSize = 'medium', 
  type: ImageSizeType = 'poster'
): string | null => {
  if (!path) return null
  return `${IMAGE_BASE_URL}/${IMAGE_SIZES[type][size]}${path}`
}

interface DiscoverParams {
  page?: number
  sort_by?: string
  with_genres?: string | number
  primary_release_year?: string | number
  first_air_date_year?: string | number
  'vote_average.gte'?: number
  'vote_average.lte'?: number
  [key: string]: string | number | undefined
}

// API functions
export const api = {
  // Movies
  getPopularMovies: (page: number = 1): Promise<AxiosResponse<APIResponse<Movie>>> => 
    tmdbApi.get('/movie/popular', { params: { page } }),
    
  getTopRatedMovies: (page: number = 1): Promise<AxiosResponse<APIResponse<Movie>>> => 
    tmdbApi.get('/movie/top_rated', { params: { page } }),
    
  getUpcomingMovies: (page: number = 1): Promise<AxiosResponse<APIResponse<Movie>>> => 
    tmdbApi.get('/movie/upcoming', { params: { page } }),
    
  getNowPlayingMovies: (page: number = 1): Promise<AxiosResponse<APIResponse<Movie>>> => 
    tmdbApi.get('/movie/now_playing', { params: { page } }),
    
  getMovieDetails: (movieId: string | number): Promise<AxiosResponse<MovieDetails>> => 
    tmdbApi.get(`/movie/${movieId}`, { 
      params: { 
        append_to_response: 'credits,videos,reviews,similar' 
      } 
    }),
    
  // TV Shows
  getPopularTVShows: (page: number = 1): Promise<AxiosResponse<APIResponse<TVShow>>> => 
    tmdbApi.get('/tv/popular', { params: { page } }),
    
  getTopRatedTVShows: (page: number = 1): Promise<AxiosResponse<APIResponse<TVShow>>> => 
    tmdbApi.get('/tv/top_rated', { params: { page } }),
    
  getOnTheAirTVShows: (page: number = 1): Promise<AxiosResponse<APIResponse<TVShow>>> => 
    tmdbApi.get('/tv/on_the_air', { params: { page } }),
    
  getTVShowDetails: (tvId: string | number): Promise<AxiosResponse<TVShowDetails>> => 
    tmdbApi.get(`/tv/${tvId}`, { 
      params: { 
        append_to_response: 'credits,videos,reviews,similar' 
      } 
    }),
    
  // Search
  searchMulti: (query: string, page: number = 1): Promise<AxiosResponse<APIResponse<Movie | TVShow>>> => 
    tmdbApi.get('/search/multi', { params: { query, page } }),
    
  searchMovies: (query: string, page: number = 1): Promise<AxiosResponse<APIResponse<Movie>>> => 
    tmdbApi.get('/search/movie', { params: { query, page } }),
    
  searchTVShows: (query: string, page: number = 1): Promise<AxiosResponse<APIResponse<TVShow>>> => 
    tmdbApi.get('/search/tv', { params: { query, page } }),
    
  // Discover
  discoverMovies: (params: DiscoverParams = {}): Promise<AxiosResponse<APIResponse<Movie>>> => 
    tmdbApi.get('/discover/movie', { params }),
    
  discoverTVShows: (params: DiscoverParams = {}): Promise<AxiosResponse<APIResponse<TVShow>>> => 
    tmdbApi.get('/discover/tv', { params }),
    
  // Genres
  getMovieGenres: (): Promise<AxiosResponse<{ genres: Genre[] }>> => 
    tmdbApi.get('/genre/movie/list'),
    
  getTVGenres: (): Promise<AxiosResponse<{ genres: Genre[] }>> => 
    tmdbApi.get('/genre/tv/list'),
    
  // Configuration
  getConfiguration: (): Promise<AxiosResponse<any>> => 
    tmdbApi.get('/configuration'),
    
  // Trending
  getTrending: (
    mediaType: 'all' | 'movie' | 'tv' = 'all', 
    timeWindow: 'day' | 'week' = 'day'
  ): Promise<AxiosResponse<APIResponse<Movie | TVShow>>> => 
    tmdbApi.get(`/trending/${mediaType}/${timeWindow}`),
}

// Helper functions for filtering and sorting
export const filterHelpers = {
  // Get years for filter dropdown
  getYearOptions: (): number[] => {
    const currentYear = new Date().getFullYear()
    const years: number[] = []
    for (let year = currentYear; year >= 1900; year--) {
      years.push(year)
    }
    return years
  },
  
  // Build discover parameters
  buildDiscoverParams: (filters: Filters = {} as Filters): DiscoverParams => {
    const params: DiscoverParams = {
      page: filters.page || 1,
      sort_by: filters.sortBy || 'popularity.desc',
    }
    
    if (filters.genre) {
      params.with_genres = filters.genre
    }
    
    if (filters.year) {
      params.primary_release_year = filters.year // for movies
      params.first_air_date_year = filters.year // for TV shows
    }
    
    if (filters.minRating) {
      params['vote_average.gte'] = filters.minRating
    }
    
    if (filters.maxRating) {
      params['vote_average.lte'] = filters.maxRating
    }
    
    return params
  }
}

// Helper functions for common API calls
export const getTrendingMovies = async (): Promise<Movie[]> => {
  try {
    const response = await api.getTrending('movie', 'day')
    return response.data.results.filter(item => 'title' in item) as Movie[]
  } catch (error) {
    console.error('Error fetching trending movies:', error)
    return []
  }
}

export const getTrendingTVShows = async (): Promise<TVShow[]> => {
  try {
    const response = await api.getTrending('tv', 'day')
    return response.data.results.filter(item => 'name' in item) as TVShow[]
  } catch (error) {
    console.error('Error fetching trending TV shows:', error)
    return []
  }
}

export default api