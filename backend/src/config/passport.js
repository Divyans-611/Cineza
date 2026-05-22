import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import config from './index.js'
import User from '../models/User.js'

// Avoid crash during startup if keys are not defined yet by using dummy defaults
const clientID = config.googleClientId || 'dummy_google_client_id'
const clientSecret = config.googleClientSecret || 'dummy_google_client_secret'
const callbackURL = config.googleCallbackUrl || 'http://localhost:5000/api/auth/google/callback'

passport.use(
  new GoogleStrategy(
    {
      clientID,
      clientSecret,
      callbackURL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // 1. Check if user already exists with googleId
        let user = await User.findOne({ googleId: profile.id })
        if (user) {
          return done(null, user)
        }

        // 2. If not found by googleId, check by email
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null
        if (email) {
          user = await User.findOne({ email })
          if (user) {
            // User registered locally, link googleId
            user.googleId = profile.id
            await user.save()
            return done(null, user)
          }
        }

        // 3. Create new user with authProvider: "google"
        const username = profile.username || (email ? email.split('@')[0] : `user_${profile.id.substring(0, 8)}`)
        
        // Clean username to be alphanumeric + underscores only
        const cleanUsername = username.toLowerCase().replace(/[^a-z0-9_]/g, '')

        // Ensure cleanUsername is unique (add random suffix if needed)
        let uniqueUsername = cleanUsername
        let userExists = await User.findOne({ username: uniqueUsername })
        while (userExists) {
          uniqueUsername = `${cleanUsername}_${Math.floor(Math.random() * 1000)}`
          userExists = await User.findOne({ username: uniqueUsername })
        }

        user = await User.create({
          name: profile.displayName || 'Google User',
          username: uniqueUsername,
          email: email || `${profile.id}@google.cineza.com`, // Fallback email
          googleId: profile.id,
          authProvider: 'google',
          avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : '',
        })

        return done(null, user)
      } catch (error) {
        return done(error, null)
      }
    }
  )
)

// Session support
passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id)
    done(null, user)
  } catch (error) {
    done(error, null)
  }
})

export default passport
