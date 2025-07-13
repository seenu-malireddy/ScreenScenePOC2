// User related types
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  createdAt: string
}

export interface SignInData {
  email: string
  password: string
}

export interface SignUpData {
  email: string
  password: string
  firstName: string
  lastName: string
}

export interface SignUpFormData extends SignUpData {
  confirmPassword: string
}

// TMDb API types
export interface Genre {
  id: number
  name: string
}

export interface Movie {
  id: string
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
  genre_ids: number[]
  adult: boolean
  original_language: string
  original_title: string
  popularity: number
  video: boolean
  media_type?: 'movie'
}

export interface TVShow {
  id: number
  name: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  first_air_date: string
  vote_average: number
  vote_count: number
  genre_ids: number[]
  origin_country: string[]
  original_language: string
  original_name: string
  popularity: number
  media_type?: 'tv'
}

export interface MovieDetails extends Movie {
  runtime: number
  budget: number
  revenue: number
  status: string
  tagline: string
  homepage: string
  imdb_id: string
  genres: Genre[]
  production_companies: ProductionCompany[]
  production_countries: ProductionCountry[]
  spoken_languages: SpokenLanguage[]
  credits: Credits
  videos: Videos
  reviews: ReviewsResponse
  similar: APIResponse<Movie>
}

export interface TVShowDetails extends TVShow {
  created_by: Creator[]
  episode_run_time: number[]
  homepage: string
  in_production: boolean
  languages: string[]
  last_air_date: string
  last_episode_to_air: Episode | null
  next_episode_to_air: Episode | null
  networks: Network[]
  number_of_episodes: number
  number_of_seasons: number
  production_companies: ProductionCompany[]
  production_countries: ProductionCountry[]
  seasons: Season[]
  spoken_languages: SpokenLanguage[]
  status: string
  tagline: string
  type: string
  credits: Credits
  videos: Videos
  reviews: ReviewsResponse
  similar: APIResponse<TVShow>
}

export interface ProductionCompany {
  id: number
  logo_path: string | null
  name: string
  origin_country: string
}

export interface ProductionCountry {
  iso_3166_1: string
  name: string
}

export interface SpokenLanguage {
  english_name: string
  iso_639_1: string
  name: string
}

export interface Creator {
  id: number
  credit_id: string
  name: string
  gender: number
  profile_path: string | null
}

export interface Episode {
  air_date: string
  episode_number: number
  id: number
  name: string
  overview: string
  production_code: string
  runtime: number
  season_number: number
  show_id: number
  still_path: string | null
  vote_average: number
  vote_count: number
}

export interface Network {
  id: number
  logo_path: string | null
  name: string
  origin_country: string
}

export interface Season {
  air_date: string
  episode_count: number
  id: number
  name: string
  overview: string
  poster_path: string | null
  season_number: number
}

export interface Credits {
  cast: CastMember[]
  crew: CrewMember[]
}

export interface CastMember {
  adult: boolean
  gender: number | null
  id: number
  known_for_department: string
  name: string
  original_name: string
  popularity: number
  profile_path: string | null
  cast_id: number
  character: string
  credit_id: string
  order: number
}

export interface CrewMember {
  adult: boolean
  gender: number | null
  id: number
  known_for_department: string
  name: string
  original_name: string
  popularity: number
  profile_path: string | null
  credit_id: string
  department: string
  job: string
}

export interface Videos {
  results: Video[]
}

export interface Video {
  iso_639_1: string
  iso_3166_1: string
  name: string
  key: string
  site: string
  size: number
  type: string
  official: boolean
  published_at: string
  id: string
}

export interface ReviewsResponse {
  page: number
  results: TMDbReview[]
  total_pages: number
  total_results: number
}

export interface TMDbReview {
  author: string
  author_details: {
    name: string
    username: string
    avatar_path: string | null
    rating: number | null
  }
  content: string
  created_at: string
  id: string
  updated_at: string
  url: string
}

// API Response types
export interface APIResponse<T> {
  page: number
  results: T[]
  total_pages: number
  total_results: number
}

export type MediaItem = Movie | TVShow
export type MediaDetails = MovieDetails | TVShowDetails

// Review types (our custom reviews)
export interface Review {
  id: string
  userId: string
  itemId: number
  mediaType: 'movie' | 'tv'
  rating: number
  title: string
  content: string
  createdAt: string
  updatedAt: string
  helpful: number
  notHelpful: number
}

export interface ReviewData {
  rating: number
  title?: string
  content?: string
  helpful?: number
  notHelpful?: number
}

export interface ReviewStats {
  totalReviews: number
  averageRating: number
  ratingDistribution: Record<number, number>
}

// Favorites type
export interface FavoriteItem {
  id: number
  title?: string
  name?: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date?: string
  first_air_date?: string
  vote_average: number
  vote_count: number
  genre_ids: number[]
  popularity: number
  media_type: 'movie' | 'tv'
  addedAt: string
}

// Filter types
export interface Filters {
  genre: string
  year: string
  sortBy: string
  page?: number
  minRating?: number
  maxRating?: number
}

// Component prop types
export interface MovieCardProps {
  item: MediaItem & { media_type: 'movie' | 'tv' }
  onFavoriteChange?: (item: MediaItem, isFavorite: boolean) => void
}

export interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large'
  message?: string | null
}

export interface ErrorMessageProps {
  message: string
  onRetry?: () => void
}

// Auth context types
export interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<User>
  signUp: (userData: SignUpData) => Promise<User>
  signOut: () => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<User>
  isAuthenticated: boolean
}

// Image size types
export type ImageSizeType = 'poster' | 'backdrop' | 'profile'
export type ImageSize = 'small' | 'medium' | 'large' | 'original'

// Language types
export type Language = 'en' | 'ar'