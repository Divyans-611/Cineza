import { fetchFromTMDB } from '../utils/tmdb.js'

// Get trending TV shows for the week
export const getTrendingTv = async (req, res, next) => {
  try {
    const data = await fetchFromTMDB('/trending/tv/week')
    res.json({ success: true, data })
  } catch (error) {
    next(error)
  }
}

// Get popular TV shows
export const getPopularTv = async (req, res, next) => {
  try {
    const data = await fetchFromTMDB('/tv/popular')
    res.json({ success: true, data })
  } catch (error) {
    next(error)
  }
}

// Search TV shows by title
export const searchTv = async (req, res, next) => {
  try {
    const { query } = req.query
    if (!query) {
      return res.status(400).json({ success: false, message: 'Query parameter is required' })
    }
    const data = await fetchFromTMDB('/search/tv', { query })
    res.json({ success: true, data })
  } catch (error) {
    next(error)
  }
}

// Get details of a specific TV show
export const getTvDetails = async (req, res, next) => {
  try {
    const { id } = req.params
    const data = await fetchFromTMDB(`/tv/${id}`)
    res.json({ success: true, data })
  } catch (error) {
    next(error)
  }
}

// Get credits (cast and crew) for a TV show
export const getTvCredits = async (req, res, next) => {
  try {
    const { id } = req.params
    const data = await fetchFromTMDB(`/tv/${id}/credits`)
    res.json({ success: true, data })
  } catch (error) {
    next(error)
  }
}

// Get videos (trailers, teasers) for a TV show
export const getTvVideos = async (req, res, next) => {
  try {
    const { id } = req.params
    const data = await fetchFromTMDB(`/tv/${id}/videos`)
    res.json({ success: true, data })
  } catch (error) {
    next(error)
  }
}

// Get TMDB recommendations for a specific TV show
export const getTvRecommendations = async (req, res, next) => {
  try {
    const { id } = req.params
    const data = await fetchFromTMDB(`/tv/${id}/recommendations`)
    res.json({ success: true, data })
  } catch (error) {
    next(error)
  }
}

// Get top-rated TV shows
export const getTopRatedTv = async (req, res, next) => {
  try {
    const data = await fetchFromTMDB('/tv/top_rated')
    res.json({ success: true, data })
  } catch (error) {
    next(error)
  }
}
