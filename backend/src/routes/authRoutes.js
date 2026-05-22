import express from 'express'
import passport from 'passport'
import config from '../config/index.js'
import generateToken from '../utils/generateToken.js'
import {
  registerUser,
  loginUser,
  getCurrentUser,
} from '../controllers/authController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/me', protect, getCurrentUser)

// Google OAuth routes
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
)

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${config.clientUrl}/login` }),
  (req, res) => {
    try {
      // Generate token for authenticated user
      const token = generateToken(req.user._id)
      
      // Redirect to frontend auth success page with the token
      res.redirect(`${config.clientUrl}/auth-success?token=${token}`)
    } catch (error) {
      console.error('Google callback error:', error.message)
      res.redirect(`${config.clientUrl}/login?error=auth_failed`)
    }
  }
)

export default router
