import express from 'express';
import cors from 'cors';
import session from 'express-session';
import config from './config/index.js';
import passport from './config/passport.js';
import healthRoutes from './routes/healthRoutes.js';
import movieRoutes from './routes/movieRoutes.js';
import tvRoutes from './routes/tvRoutes.js';
import authRoutes from './routes/authRoutes.js';
import watchlistRoutes from './routes/watchlistRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js'; // added review routes
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const app = express();

// Allow the Vite frontend to call this API during development
app.use(
  cors({
    origin: config.clientUrl,
  })
);

// Parse JSON request bodies
app.use(express.json());

// Session configuration (required by passport)
app.use(
  session({
    secret: config.jwtSecret || 'cineza_session_secret',
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize Passport and Session support
app.use(passport.initialize());
app.use(passport.session());

// API routes
app.use('/api', healthRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/tv', tvRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api/reviews', reviewRoutes); // register review routes

// Unknown routes and errors (order matters)
app.use(notFound);
app.use(errorHandler);

export default app;
