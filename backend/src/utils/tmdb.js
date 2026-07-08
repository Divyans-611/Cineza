// Utility file to handle communication with the TMDB API
import config from '../config/index.js'

/**
 * Fetches data from the TMDB API
 * @param {string} endpoint - The TMDB API endpoint (e.g., '/movie/popular')
 * @param {Object} params - Additional query parameters to send
 * @returns {Promise<Object>} - The JSON response from TMDB
 */
export const fetchFromTMDB = async (endpoint, params = {}) => {
  const TMDB_API_KEY = config.tmdbApiKey
  const TMDB_BASE_URL = config.tmdbBaseUrl

  // Handle missing environment variables
  if (!TMDB_API_KEY) {
    throw new Error('TMDB_API_KEY is not defined in environment variables')
  }
  if (!TMDB_BASE_URL) {
    throw new Error('TMDB_BASE_URL is not defined in environment variables')
  }

  // Construct URL and automatically append the API key
  const url = new URL(`${TMDB_BASE_URL}${endpoint}`)
  url.searchParams.append('api_key', TMDB_API_KEY)

  // Append any additional parameters (like search queries or page numbers)
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.append(key, value)
  }

  try {
    // Native fetch is available in modern Node.js (18+)
    const response = await fetch(url.toString())

    // If the request failed, try to extract TMDB's error message
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const errorMessage = errorData.status_message || `TMDB API error: ${response.status}`
      console.error('TMDB API Error:', {
        status: response.status,
        body: errorData,
        url: url.toString()
      })
      throw new Error(errorMessage)
    }

    return await response.json()
  } catch (error) {
    console.error(`Error fetching from TMDB endpoint ${endpoint}:`, error)
    throw error // Re-throw so the controller can pass it to the error handler
  }
}
