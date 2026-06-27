// Review routes for Cineza
import express from 'express';
import {
  createReview,
  getMovieReviews,
  getMyReviews,
  updateReview,
  deleteReview,
} from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create a new review (protected)
router.post('/', protect, createReview);

// Get all reviews for a specific movie (public)
router.get('/movie/:movieId', getMovieReviews);

// Get logged‑in user's reviews (protected)
router.get('/user/me', protect, getMyReviews);

// Update a review (protected, owner only)
router.put('/:reviewId', protect, updateReview);

// Delete a review (protected, owner only)
router.delete('/:reviewId', protect, deleteReview);

export default router;
