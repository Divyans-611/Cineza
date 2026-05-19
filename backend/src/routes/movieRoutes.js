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
router.get('/trending', getTrendingMovies)
router.get('/popular', getPopularMovies)
router.get('/search', searchMovies)
router.get('/:id', getMovieDetails)
router.get('/:id/credits', getMovieCredits)
router.get('/:id/videos', getMovieVideos)

export default router
