import express from 'express'
import {
  getTrendingTv,
  getPopularTv,
  searchTv,
  getTvDetails,
  getTvCredits,
  getTvVideos,
  getTvRecommendations,
  getTopRatedTv,
} from '../controllers/tvController.js'

const router = express.Router()

// Define TV routes
router.get('/trending', getTrendingTv)
router.get('/popular', getPopularTv)
router.get('/top-rated', getTopRatedTv)
router.get('/search', searchTv)

// Specific subroutes must be defined before the generic ':id' route
router.get('/:id/credits', getTvCredits)
router.get('/:id/videos', getTvVideos)
router.get('/:id/recommendations', getTvRecommendations)
router.get('/:id', getTvDetails)

export default router
