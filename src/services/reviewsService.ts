import { Review, ReviewData, ReviewStats } from '../types'

export const reviewsService = {
  getReviews: (itemId: number, mediaType: 'movie' | 'tv'): Review[] => {
    if (!itemId || !mediaType) return []
    
    try {
      const reviews = localStorage.getItem(`screenscene_reviews_${mediaType}_${itemId}`)
      return reviews ? JSON.parse(reviews) : []
    } catch (error) {
      console.error('Error getting reviews:', error)
      return []
    }
  },

  // Get user's review for a specific item
  getUserReview: (userId: string, itemId: number, mediaType: 'movie' | 'tv'): Review | null => {
    if (!userId || !itemId || !mediaType) return null
    
    const reviews = reviewsService.getReviews(itemId, mediaType)
    return reviews.find(review => review.userId === userId) || null
  },

  // Add or update a review
  addReview: (userId: string, itemId: number, mediaType: 'movie' | 'tv', reviewData: ReviewData): Review | false => {
    if (!userId || !itemId || !mediaType || !reviewData) return false
    
    try {
      const reviews = reviewsService.getReviews(itemId, mediaType)
      const existingReviewIndex = reviews.findIndex(review => review.userId === userId)
      
      const review: Review = {
        id: existingReviewIndex !== -1 ? reviews[existingReviewIndex].id : Date.now().toString(),
        userId,
        itemId,
        mediaType,
        rating: reviewData.rating,
        title: reviewData.title || '',
        content: reviewData.content || '',
        createdAt: existingReviewIndex !== -1 ? reviews[existingReviewIndex].createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        helpful: reviewData.helpful || 0,
        notHelpful: reviewData.notHelpful || 0
      }
      
      if (existingReviewIndex !== -1) {
        // Update existing review
        reviews[existingReviewIndex] = review
      } else {
        // Add new review
        reviews.unshift(review)
      }
      
      localStorage.setItem(
        `screenscene_reviews_${mediaType}_${itemId}`, 
        JSON.stringify(reviews)
      )
      
      // Also store in user's reviews
      reviewsService._addToUserReviews(userId, review)
      
      return review
    } catch (error) {
      console.error('Error adding/updating review:', error)
      return false
    }
  },

  // Delete a review
  deleteReview: (userId: string, itemId: number, mediaType: 'movie' | 'tv', reviewId: string): boolean => {
    if (!userId || !itemId || !mediaType || !reviewId) return false
    
    try {
      const reviews = reviewsService.getReviews(itemId, mediaType)
      const updatedReviews = reviews.filter(review => 
        !(review.id === reviewId && review.userId === userId)
      )
      
      localStorage.setItem(
        `screenscene_reviews_${mediaType}_${itemId}`, 
        JSON.stringify(updatedReviews)
      )
      
      // Also remove from user's reviews
      reviewsService._removeFromUserReviews(userId, reviewId)
      
      return true
    } catch (error) {
      console.error('Error deleting review:', error)
      return false
    }
  },

  // Get all reviews by a user
  getUserReviews: (userId: string): Review[] => {
    if (!userId) return []
    
    try {
      const reviews = localStorage.getItem(`screenscene_user_reviews_${userId}`)
      return reviews ? JSON.parse(reviews) : []
    } catch (error) {
      console.error('Error getting user reviews:', error)
      return []
    }
  },

  // Get review statistics for an item
  getReviewStats: (itemId: number, mediaType: 'movie' | 'tv'): ReviewStats => {
    const reviews = reviewsService.getReviews(itemId, mediaType)
    
    if (reviews.length === 0) {
      return {
        totalReviews: 0,
        averageRating: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      }
    }
    
    const ratings = reviews.map(review => review.rating)
    const averageRating = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
    
    const ratingDistribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    ratings.forEach(rating => {
      ratingDistribution[rating] = (ratingDistribution[rating] || 0) + 1
    })
    
    return {
      totalReviews: reviews.length,
      averageRating: Math.round(averageRating * 10) / 10,
      ratingDistribution
    }
  },

  // Mark review as helpful/not helpful
  markReviewHelpful: (reviewId: string, itemId: number, mediaType: 'movie' | 'tv', isHelpful: boolean, userId: string): boolean => {
    if (!reviewId || !itemId || !mediaType || !userId) return false
    
    try {
      const reviews = reviewsService.getReviews(itemId, mediaType)
      const reviewIndex = reviews.findIndex(review => review.id === reviewId)
      
      if (reviewIndex === -1) return false
      
      // Get or create helpfulness tracking
      const helpfulnessKey = `screenscene_helpfulness_${reviewId}`
      const helpfulness: Record<string, boolean> = JSON.parse(localStorage.getItem(helpfulnessKey) || '{}')
      
      // Check if user already voted
      if (helpfulness[userId]) return false
      
      // Update review helpfulness
      if (isHelpful) {
        reviews[reviewIndex].helpful = (reviews[reviewIndex].helpful || 0) + 1
      } else {
        reviews[reviewIndex].notHelpful = (reviews[reviewIndex].notHelpful || 0) + 1
      }
      
      // Mark user as voted
      helpfulness[userId] = isHelpful
      
      // Save updates
      localStorage.setItem(
        `screenscene_reviews_${mediaType}_${itemId}`, 
        JSON.stringify(reviews)
      )
      localStorage.setItem(helpfulnessKey, JSON.stringify(helpfulness))
      
      return true
    } catch (error) {
      console.error('Error marking review helpful:', error)
      return false
    }
  },

  // Private helper methods
  _addToUserReviews: (userId: string, review: Review): void => {
    try {
      const userReviews = reviewsService.getUserReviews(userId)
      const existingIndex = userReviews.findIndex(r => r.id === review.id)
      
      if (existingIndex !== -1) {
        userReviews[existingIndex] = review
      } else {
        userReviews.unshift(review)
      }
      
      localStorage.setItem(`screenscene_user_reviews_${userId}`, JSON.stringify(userReviews))
    } catch (error) {
      console.error('Error adding to user reviews:', error)
    }
  },

  _removeFromUserReviews: (userId: string, reviewId: string): void => {
    try {
      const userReviews = reviewsService.getUserReviews(userId)
      const updatedReviews = userReviews.filter(review => review.id !== reviewId)
      localStorage.setItem(`screenscene_user_reviews_${userId}`, JSON.stringify(updatedReviews))
    } catch (error) {
      console.error('Error removing from user reviews:', error)
    }
  },

  // Search reviews by content
  searchReviews: (itemId: number, mediaType: 'movie' | 'tv', query: string): Review[] => {
    const reviews = reviewsService.getReviews(itemId, mediaType)
    if (!query) return reviews
    
    const searchQuery = query.toLowerCase()
    return reviews.filter(review => 
      review.title.toLowerCase().includes(searchQuery) ||
      review.content.toLowerCase().includes(searchQuery)
    )
  },

  // Sort reviews
  sortReviews: (reviews: Review[], sortBy: 'newest' | 'oldest' | 'highest-rating' | 'lowest-rating' | 'most-helpful' = 'newest'): Review[] => {
    const sorted = [...reviews]
    
    switch (sortBy) {
      case 'newest':
        return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      case 'highest-rating':
        return sorted.sort((a, b) => b.rating - a.rating)
      case 'lowest-rating':
        return sorted.sort((a, b) => a.rating - b.rating)
      case 'most-helpful':
        return sorted.sort((a, b) => (b.helpful || 0) - (a.helpful || 0))
      default:
        return sorted
    }
  }
}

export default reviewsService