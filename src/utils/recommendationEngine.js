/**
 * Cineza Director's Cut — Recommendation Engine
 *
 * A lightweight, rule-based recommendation engine that creates
 * personalized-feeling movie recommendations from TMDB data.
 *
 * Strategy:
 *   1. Analyze the user's watchlist to extract genre frequency & highest-rated movie.
 *   2. Fetch TMDB recommendations for the top-rated watchlist movie.
 *   3. Fetch TMDB genre-discover for the user's top 2 favorite genres.
 *   4. Merge, de-duplicate, and annotate each recommendation with an explanation.
 *   5. Return 8–10 unique recommendations sorted by relevance.
 *
 * For users without a watchlist, fall back to a curated mix of
 * trending + top-rated + popular with genre diversity.
 */

import {
  getMovieRecommendations,
  getTrendingMovies,
  getTopRatedMovies,
  getPopularMovies,
  getMoviesByGenre,
} from '../services/movieService';
import { normalizeTMDBMovie } from './movieUtils';

// ─── Genre ID ↔ Name Map ────────────────────────────────────────────
const GENRE_MAP = {
  28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy',
  80: 'Crime', 99: 'Documentary', 18: 'Drama', 10751: 'Family',
  14: 'Fantasy', 36: 'History', 27: 'Horror', 10402: 'Music',
  9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi', 10770: 'TV Movie',
  53: 'Thriller', 10752: 'War', 37: 'Western',
};

// Map genre name → genre ID (reverse)
const GENRE_NAME_TO_ID = Object.fromEntries(
  Object.entries(GENRE_MAP).map(([id, name]) => [name, Number(id)])
);

// Simple session-level cache so repeated calls don't re-fetch
let _cache = { key: null, data: null, ts: 0 };
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Analyze a user's watchlist to extract genre preferences.
 * Returns { genreFreq, topGenres, highestRatedMovie, directorHint }.
 */
function analyzeWatchlist(watchlist) {
  const genreFreq = {};
  let highestRatedMovie = null;
  let highestRating = 0;

  for (const item of watchlist) {
    // Count genres
    const genres = item.genres || [];
    for (const g of genres) {
      genreFreq[g] = (genreFreq[g] || 0) + 1;
    }

    // Track highest-rated
    const rating = Number(item.rating) || 0;
    if (rating > highestRating) {
      highestRating = rating;
      highestRatedMovie = item;
    }
  }

  // Sort genres by frequency descending
  const topGenres = Object.entries(genreFreq)
    .sort((a, b) => b[1] - a[1])
    .map(([genre]) => genre);

  return { genreFreq, topGenres, highestRatedMovie };
}

/**
 * Generate a human-readable explanation for why a movie was recommended.
 */
function generateExplanation(movie, context) {
  const { reason, genreName, sourceTitle } = context;

  switch (reason) {
    case 'similar':
      return sourceTitle
        ? `Because you enjoyed "${sourceTitle}"`
        : 'Based on movies you love';

    case 'genre':
      return genreName
        ? `Recommended for ${genreName} fans`
        : 'Matches your taste profile';

    case 'top-genre':
      return genreName
        ? `Highly rated in your favourite genre: ${genreName}`
        : 'Top pick from your favourite genre';

    case 'trending':
      return 'Trending this week — don\'t miss it';

    case 'top-rated':
      return 'One of the highest-rated films of all time';

    case 'popular':
      return 'Popular among cinephiles right now';

    case 'diverse':
      return genreName
        ? `Explore something new in ${genreName}`
        : 'A fresh genre to expand your horizons';

    default:
      return 'Handpicked for your cinematic journey';
  }
}

/**
 * De-duplicate movies by ID and exclude any already in the watchlist.
 */
function deduplicateAndExclude(movies, excludeIds) {
  const seen = new Set(excludeIds);
  const result = [];

  for (const movie of movies) {
    if (movie && movie.id && !seen.has(movie.id)) {
      seen.add(movie.id);
      result.push(movie);
    }
  }

  return result;
}

/**
 * MAIN: Get personalized Director's Cut recommendations.
 *
 * @param {Array|null} watchlist — user's watchlist items (or null/empty)
 * @returns {Promise<Array>} — up to 10 recommendations, each with `.reason` string
 */
export async function getDirectorsCutRecommendations(watchlist) {
  const hasWatchlist = watchlist && watchlist.length > 0;
  const cacheKey = hasWatchlist
    ? `personalized-${watchlist.map(w => w.movieId).sort().join(',')}`
    : 'guest';

  // Return cached data if still fresh
  if (_cache.key === cacheKey && Date.now() - _cache.ts < CACHE_TTL) {
    return _cache.data;
  }

  let recommendations;

  if (hasWatchlist) {
    recommendations = await getPersonalizedRecs(watchlist);
  } else {
    recommendations = await getGuestRecs();
  }

  // Store in cache
  _cache = { key: cacheKey, data: recommendations, ts: Date.now() };

  return recommendations;
}

/**
 * Personalized recommendations for logged-in users with a watchlist.
 */
async function getPersonalizedRecs(watchlist) {
  const { topGenres, highestRatedMovie } = analyzeWatchlist(watchlist);
  const watchlistIds = new Set(watchlist.map(w => Number(w.movieId)));
  const allRecs = [];

  // 1. Fetch TMDB recommendations for the highest-rated watchlist movie
  if (highestRatedMovie) {
    try {
      const data = await getMovieRecommendations(highestRatedMovie.movieId);
      const results = (data.results || []).slice(0, 8);
      for (const raw of results) {
        const movie = normalizeTMDBMovie(raw);
        movie.reason = generateExplanation(movie, {
          reason: 'similar',
          sourceTitle: highestRatedMovie.title,
        });
        allRecs.push(movie);
      }
    } catch (err) {
      console.warn('Director\'s Cut: TMDB recommendations fetch failed:', err.message);
    }
  }

  // 2. Fetch genre-discover for the top 2 genres
  const genresToFetch = topGenres.slice(0, 2);
  for (const genreName of genresToFetch) {
    const genreId = GENRE_NAME_TO_ID[genreName];
    if (!genreId) continue;

    try {
      const data = await getMoviesByGenre(genreId);
      const results = (data.results || []).slice(0, 6);
      for (const raw of results) {
        const movie = normalizeTMDBMovie(raw);
        movie.reason = generateExplanation(movie, {
          reason: 'top-genre',
          genreName,
        });
        allRecs.push(movie);
      }
    } catch (err) {
      console.warn(`Director's Cut: genre discover failed for ${genreName}:`, err.message);
    }
  }

  // 3. De-duplicate and exclude watchlisted movies
  let unique = deduplicateAndExclude(allRecs, [...watchlistIds]);

  // 4. If we don't have enough, backfill from trending
  if (unique.length < 10) {
    try {
      const data = await getTrendingMovies();
      const results = (data.results || []).slice(0, 6);
      const trendingRecs = results.map(raw => {
        const movie = normalizeTMDBMovie(raw);
        movie.reason = generateExplanation(movie, { reason: 'trending' });
        return movie;
      });
      unique = deduplicateAndExclude([...unique, ...trendingRecs], [...watchlistIds]);
    } catch (err) {
      console.warn('Director\'s Cut: trending backfill failed:', err.message);
    }
  }

  return unique.slice(0, 10);
}

/**
 * Guest/new-user recommendations: curated mix with genre diversity.
 */
async function getGuestRecs() {
  const allRecs = [];

  // Fetch trending, top-rated, and popular in parallel
  const [trendingData, topRatedData, popularData] = await Promise.all([
    getTrendingMovies().catch(() => ({ results: [] })),
    getTopRatedMovies().catch(() => ({ results: [] })),
    getPopularMovies().catch(() => ({ results: [] })),
  ]);

  // Take top slices from each category
  const trending = (trendingData.results || []).slice(0, 5);
  const topRated = (topRatedData.results || []).slice(0, 5);
  const popular = (popularData.results || []).slice(0, 5);

  for (const raw of trending) {
    const movie = normalizeTMDBMovie(raw);
    movie.reason = generateExplanation(movie, { reason: 'trending' });
    allRecs.push(movie);
  }

  for (const raw of topRated) {
    const movie = normalizeTMDBMovie(raw);
    movie.reason = generateExplanation(movie, { reason: 'top-rated' });
    allRecs.push(movie);
  }

  for (const raw of popular) {
    const movie = normalizeTMDBMovie(raw);
    movie.reason = generateExplanation(movie, { reason: 'popular' });
    allRecs.push(movie);
  }

  // De-duplicate and interleave for genre diversity
  const unique = deduplicateAndExclude(allRecs, []);

  // Simple diversity: alternate between categories
  const diversified = [];
  const seenGenres = new Set();
  // First pass: prioritize genre diversity
  for (const movie of unique) {
    if (diversified.length >= 10) break;
    const genre = movie.genre || 'Unknown';
    if (!seenGenres.has(genre)) {
      seenGenres.add(genre);
      diversified.push(movie);
    }
  }
  // Second pass: fill remaining slots
  for (const movie of unique) {
    if (diversified.length >= 10) break;
    if (!diversified.some(d => d.id === movie.id)) {
      diversified.push(movie);
    }
  }

  return diversified;
}

/**
 * Clear the session cache (e.g. when the user logs out or watchlist changes).
 */
export function clearDirectorsCutCache() {
  _cache = { key: null, data: null, ts: 0 };
}
