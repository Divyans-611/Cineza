import express from 'express'
import {
  getTrendingMovies,
  getPopularMovies,
  searchMovies,
  getMovieDetails,
  getMovieCredits,
  getMovieVideos,
  getMovieRecommendations,
  getTopRatedMovies,
  discoverByGenre,
} from '../controllers/movieController.js'

const router = express.Router()

// Define movie routes
router.get('/trending', getTrendingMovies)
router.get('/popular', getPopularMovies)
router.get('/top-rated', getTopRatedMovies)
router.get('/search', searchMovies)
router.get('/genre/:genreId', discoverByGenre)
// Specific subroutes must be defined before the generic ':id' route
router.get('/:id/credits', getMovieCredits)
router.get('/:id/videos', getMovieVideos)
router.get('/:id/recommendations', getMovieRecommendations)
router.get('/:id', getMovieDetails)

export default router
