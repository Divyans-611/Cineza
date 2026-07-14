const API_BASE = import.meta.env.VITE_API_BASE_URL;

/**
 * Helper to handle fetch responses
 */
const handleResponse = async (response) => {
  const data = await response.json()
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Something went wrong')
  }
  return data
}

/**
 * Get user's watchlist
 * @param {string} token - JWT auth token
 */
export const getWatchlist = async (token) => {
  const response = await fetch(`${API_BASE}/api/watchlist`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return handleResponse(response)
}

/**
 * Add movie to watchlist
 * @param {Object} movieData - Formatted movie data
 * @param {string} token - JWT auth token
 */
export const addToWatchlist = async (movieData, token) => {
  const response = await fetch(`${API_BASE}/api/watchlist`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(movieData),
  })
  return handleResponse(response)
}

/**
 * Remove movie from watchlist
 * @param {number|string} movieId - TMDB Movie ID
 * @param {string} token - JWT auth token
 * @param {string} mediaType - 'movie' or 'tv'
 */
export const removeFromWatchlist = async (movieId, token, mediaType = 'movie') => {
  const response = await fetch(`${API_BASE}/api/watchlist/${movieId}?mediaType=${mediaType}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return handleResponse(response)
}

/**
 * Check if movie is in watchlist
 * @param {number|string} movieId - TMDB Movie ID
 * @param {string} token - JWT auth token
 * @param {string} mediaType - 'movie' or 'tv'
 */
export const checkWatchlist = async (movieId, token, mediaType = 'movie') => {
  const response = await fetch(`${API_BASE}/api/watchlist/check/${movieId}?mediaType=${mediaType}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return handleResponse(response)
}
