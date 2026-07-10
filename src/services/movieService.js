// Base URL for the Cineza backend API
// This reads from .env in development, or defaults to localhost:5000
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

/**
 * A beginner-friendly helper function to make API calls to our backend.
 * It automatically handles JSON parsing and error checking.
 * 
 * @param {string} endpoint - The backend route to call (e.g., '/api/movies/trending')
 * @returns {Promise<any>} - The 'data' portion of the backend's response
 */
const fetchAPI = async (endpoint) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    const json = await response.json();

    // Check if our backend explicitly returned success: false
    if (!json.success) {
      throw new Error(json.message || 'The API request failed.');
    }

    // If successful, return just the 'data' part, hiding the 'success: true' wrapper
    return json.data;
  } catch (error) {
    // Catch network errors (like the server being offline) or our custom errors
    console.error(`Error in movieService for ${endpoint}:`, error.message);
    throw error; // Re-throw the error so the frontend React components can handle it
  }
};

// ==========================================
// EXPORTED MOVIE SERVICE FUNCTIONS
// ==========================================

// Get trending movies for the week
export const getTrendingMovies = () => fetchAPI('/api/movies/trending');

// Get popular movies
export const getPopularMovies = () => fetchAPI('/api/movies/popular');

// Search for movies by title
export const searchMovies = (query) => {
  if (!query) return Promise.resolve([]);
  
  // Use encodeURIComponent to safely handle spaces and special characters in the search term
  return fetchAPI(`/api/movies/search?query=${encodeURIComponent(query)}`);
};

// Get full details of a specific movie by its ID
export const getMovieDetails = (id) => fetchAPI(`/api/movies/${id}`);

// Get cast and crew (credits) for a specific movie
export const getMovieCredits = (id) => fetchAPI(`/api/movies/${id}/credits`);

// Get videos (trailers, teasers) for a specific movie
export const getMovieVideos = (id) => fetchAPI(`/api/movies/${id}/videos`);

// Get TMDB recommendations for a specific movie
export const getMovieRecommendations = (id) => fetchAPI(`/api/movies/${id}/recommendations`);

// Get top-rated movies
export const getTopRatedMovies = () => fetchAPI('/api/movies/top-rated');

// Discover movies by genre ID
export const getMoviesByGenre = (genreId) => fetchAPI(`/api/movies/genre/${genreId}`);
