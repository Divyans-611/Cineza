import { fetchFromTMDB } from '../utils/tmdb.js'

// Get trending movies for the week
export const getTrendingMovies = async (req, res, next) => {
  try {
    const data = await fetchFromTMDB('/trending/movie/week')
    res.json({ success: true, data })
  } catch (error) {
    next(error)
  }
}

// Get popular movies
export const getPopularMovies = async (req, res, next) => {
  try {
    const data = await fetchFromTMDB('/movie/popular')
    res.json({ success: true, data })
  } catch (error) {
    next(error)
  }
}

// Search movies by title
export const searchMovies = async (req, res, next) => {
  try {
    const { query } = req.query
    if (!query) {
      return res.status(400).json({ success: false, message: 'Query parameter is required' })
    }
    const data = await fetchFromTMDB('/search/movie', { query })
    res.json({ success: true, data })
  } catch (error) {
    next(error)
  }
}

// Get details of a specific movie
export const getMovieDetails = async (req, res, next) => {
  try {
    const { id } = req.params
    const data = await fetchFromTMDB(`/movie/${id}`)
    res.json({ success: true, data })
  } catch (error) {
    next(error)
  }
}

// Get credits (cast and crew) for a movie
export const getMovieCredits = async (req, res, next) => {
  try {
    const { id } = req.params
    const data = await fetchFromTMDB(`/movie/${id}/credits`)
    res.json({ success: true, data })
  } catch (error) {
    next(error)
  }
}

// Get videos (trailers, teasers) for a movie
export const getMovieVideos = async (req, res, next) => {
  try {
    const { id } = req.params
    const data = await fetchFromTMDB(`/movie/${id}/videos`)
    res.json({ success: true, data })
  } catch (error) {
    next(error)
  }
}

// Get TMDB recommendations for a specific movie
export const getMovieRecommendations = async (req, res, next) => {
  try {
    const { id } = req.params
    const data = await fetchFromTMDB(`/movie/${id}/recommendations`)
    res.json({ success: true, data })
  } catch (error) {
    next(error)
  }
}

// Get top-rated movies
export const getTopRatedMovies = async (req, res, next) => {
  try {
    const data = await fetchFromTMDB('/movie/top_rated')
    res.json({ success: true, data })
  } catch (error) {
    next(error)
  }
}

// Discover movies by genre
export const discoverByGenre = async (req, res, next) => {
  try {
    const { genreId } = req.params
    const data = await fetchFromTMDB('/discover/movie', {
      with_genres: genreId,
      sort_by: 'vote_average.desc',
      'vote_count.gte': '200',
    })
    res.json({ success: true, data })
  } catch (error) {
    next(error)
  }
}

// Multi-search (movies + tv shows)
export const multiSearch = async (req, res, next) => {
  try {
    const { query } = req.query
    if (!query) {
      return res.status(400).json({ success: false, message: 'Query parameter is required' })
    }
    const data = await fetchFromTMDB('/search/multi', { query })
    res.json({ success: true, data })
  } catch (error) {
    next(error)
  }
}
