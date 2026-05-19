import dotenv from 'dotenv'

// Central place for environment-based settings
dotenv.config()

const config = {
  port: process.env.PORT || 5000,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  tmdbApiKey: process.env.TMDB_API_KEY,
  tmdbBaseUrl: process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3'
}

export default config
