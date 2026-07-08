import express from 'express'
import {
  getTrendingMovies,
  getPopularMovies,
  searchMovies,
  getMovieDetails,
  getMovieCredits,
  getMovieVideos,
} from '../controllers/movieController.js'

const router = express.Router()

// Define movie routes
// Define movie routes
router.get('/trending', getTrendingMovies)
router.get('/popular', getPopularMovies)
router.get('/search', searchMovies)
// Specific subroutes must be defined before the generic ':id' route
router.get('/:id/credits', getMovieCredits)
router.get('/:id/videos', getMovieVideos)
router.get('/:id', getMovieDetails)

export default router
