import express from 'express'
import cors from 'cors'
import config from './config/index.js'
import healthRoutes from './routes/healthRoutes.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'

const app = express()

// Allow the Vite frontend to call this API during development
app.use(
  cors({
    origin: config.clientUrl,
  }),
)

// Parse JSON request bodies
app.use(express.json())

// API routes
app.use('/api', healthRoutes)

// Unknown routes and errors (order matters)
app.use(notFound)
app.use(errorHandler)

export default app
