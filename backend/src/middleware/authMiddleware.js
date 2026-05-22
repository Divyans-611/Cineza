import jwt from 'jsonwebtoken'
import config from '../config/index.js'
import User from '../models/User.js'

export const protect = async (req, res, next) => {
  let token

  // Check if token is present in Authorization header and starts with Bearer
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract the token
      token = req.headers.authorization.split(' ')[1]

      const secret = config.jwtSecret
      if (!secret) {
        throw new Error('JWT_SECRET is missing from configuration')
      }

      // Verify the token
      const decoded = jwt.verify(token, secret)

      // Fetch the user from the database and attach to request, exclude password
      req.user = await User.findById(decoded.id)

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized, user not found',
        })
      }

      next()
    } catch (error) {
      console.error('Token verification error:', error.message)
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token invalid',
      })
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, token missing',
    })
  }
}
