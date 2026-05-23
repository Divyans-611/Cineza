import express from 'express'
import {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  checkWatchlist,
} from '../controllers/watchlistController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

// All watchlist routes are protected
router.use(protect)

router.route('/')
  .get(getWatchlist)
  .post(addToWatchlist)

router.route('/:movieId')
  .delete(removeFromWatchlist)

router.route('/check/:movieId')
  .get(checkWatchlist)

export default router
