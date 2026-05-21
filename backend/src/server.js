import dotenv from 'dotenv'
import app from './app.js'
import config from './config/index.js'
import { connectDB } from './config/db.js'

// Load variables from .env (create your own from .env.example)
dotenv.config()

const PORT = config.port

const startServer = async () => {
  await connectDB()

  app.listen(PORT, () => {
    console.log(`Cineza backend running on http://localhost:${PORT}`)
    console.log(`Health check: http://localhost:${PORT}/api/health`)
  })
}

startServer()
