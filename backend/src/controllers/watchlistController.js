import Watchlist from '../models/Watchlist.js'

// @desc    Get user's watchlist
// @route   GET /api/watchlist
// @access  Private
export const getWatchlist = async (req, res, next) => {
  try {
    const watchlist = await Watchlist.find({ user: req.user._id }).sort({ createdAt: -1 })
    res.status(200).json({
      success: true,
      count: watchlist.length,
      data: watchlist,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Add movie to watchlist
// @route   POST /api/watchlist
// @access  Private
export const addToWatchlist = async (req, res, next) => {
  try {
    const {
      movieId,
      title,
      posterPath = "",
      backdropPath = "",
      releaseDate = "",
      rating = 0,
      overview = "",
      genres = [],
      mediaType = "movie"
    } = req.body || {};

    if (!movieId || !title) {
      return res.status(400).json({
        success: false,
        message: "ID and title are required"
      });
    }

    // Check if media already exists in user's watchlist
    const existingItem = await Watchlist.findOne({ user: req.user._id, movieId, mediaType })
    
    if (existingItem) {
      res.status(409)
      const error = new Error('Media already in watchlist')
      return next(error)
    }

    const watchlistItem = await Watchlist.create({
      user: req.user._id,
      movieId,
      title,
      posterPath,
      backdropPath,
      releaseDate,
      rating,
      overview,
      genres,
      mediaType,
    })

    res.status(201).json({
      success: true,
      message: 'Added to watchlist',
      data: watchlistItem,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Remove movie/tv from watchlist
// @route   DELETE /api/watchlist/:movieId
// @access  Private
export const removeFromWatchlist = async (req, res, next) => {
  try {
    const { movieId } = req.params
    const mediaType = req.query.mediaType || "movie"

    const watchlistItem = await Watchlist.findOneAndDelete({ user: req.user._id, movieId, mediaType })

    if (!watchlistItem) {
      res.status(404)
      const error = new Error('Item not found in watchlist')
      return next(error)
    }

    res.status(200).json({
      success: true,
      message: 'Removed from watchlist',
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Check if movie/tv is in watchlist
// @route   GET /api/watchlist/check/:movieId
// @access  Private
export const checkWatchlist = async (req, res, next) => {
  try {
    const { movieId } = req.params
    const mediaType = req.query.mediaType || "movie"

    const watchlistItem = await Watchlist.findOne({ user: req.user._id, movieId, mediaType })

    res.status(200).json({
      success: true,
      inWatchlist: !!watchlistItem,
    })
  } catch (error) {
    next(error)
  }
}
