// Review controller for Cineza
import Review from '../models/reviewModel.js';

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req, res, next) => {
  try {
    const { movieId, movieTitle, moviePoster = '', rating, review } = req.body || {};
    // Validate required fields
    if (!movieId || !movieTitle || rating === undefined || review === undefined) {
      return res.status(400).json({
        success: false,
        message: 'movieId, movieTitle, rating and review are required',
      });
    }
    // Rating range check
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5',
      });
    }
    // Review non‑empty check
    if (!review || !review.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Review text cannot be empty',
      });
    }

    // Prevent duplicate review by same user for same movie
    const existing = await Review.findOne({ user: req.user._id, movieId });
    if (existing) {
      res.status(409);
      const err = new Error('User has already reviewed this movie');
      return next(err);
    }

    const newReview = await Review.create({
      user: req.user._id,
      movieId,
      movieTitle,
      moviePoster,
      rating,
      review: review.trim(),
    });

    return res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: newReview,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reviews for a movie
// @route   GET /api/reviews/:movieId
// @access  Public
export const getMovieReviews = async (req, res, next) => {
  try {
    const { movieId } = req.params;
    const reviews = await Review.find({ movieId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged‑in user's reviews
// @route   GET /api/reviews/me
// @access  Private
export const getMyReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private (owner only)
export const updateReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, review } = req.body || {};
    const existing = await Review.findById(id);
    if (!existing) {
      res.status(404);
      const err = new Error('Review not found');
      return next(err);
    }
    // Ownership check
    if (existing.user.toString() !== req.user._id.toString()) {
      res.status(403);
      const err = new Error('Not authorized to modify this review');
      return next(err);
    }
    // Validate inputs if supplied
    if (rating !== undefined) {
      if (rating < 1 || rating > 5) {
        return res.status(400).json({
          success: false,
          message: 'Rating must be between 1 and 5',
        });
      }
      existing.rating = rating;
    }
    if (review !== undefined) {
      if (!review.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Review cannot be empty',
        });
      }
      existing.review = review.trim();
    }
    await existing.save();
    return res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      data: existing,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private (owner only)
export const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await Review.findById(id);
    if (!existing) {
      res.status(404);
      const err = new Error('Review not found');
      return next(err);
    }
    if (existing.user.toString() !== req.user._id.toString()) {
      res.status(403);
      const err = new Error('Not authorized to delete this review');
      return next(err);
    }
    await Review.findByIdAndDelete(id);
    return res.status(200).json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
