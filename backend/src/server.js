import dotenv from 'dotenv'
import app from './app.js'
import config from './config/index.js'

// Load variables from .env (create your own from .env.example)
dotenv.config()

const PORT = config.port

app.listen(PORT, () => {
  console.log(`Cineza backend running on http://localhost:${PORT}`)
  console.log(`Health check: http://localhost:${PORT}/api/health`)
})
