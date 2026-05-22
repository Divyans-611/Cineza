import jwt from 'jsonwebtoken'
import config from '../config/index.js'

export const generateToken = (userId) => {
  const secret = config.jwtSecret
  if (!secret) {
    throw new Error('JWT_SECRET is missing from configuration')
  }

  return jwt.sign({ id: userId }, secret, {
    expiresIn: config.jwtExpiresIn || '7d',
  })
}

export default generateToken
