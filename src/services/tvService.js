// Base URL for the Cineza backend API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const fetchAPI = async (endpoint) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    const json = await response.json();

    if (!json.success) {
      throw new Error(json.message || 'The API request failed.');
    }

    return json.data;
  } catch (error) {
    console.error(`Error in tvService for ${endpoint}:`, error.message);
    throw error;
  }
};

// ==========================================
// EXPORTED TV SERVICE FUNCTIONS
// ==========================================

// Get trending TV shows for the week
export const getTrendingTv = () => fetchAPI('/api/tv/trending');

// Get popular TV shows
export const getPopularTv = () => fetchAPI('/api/tv/popular');

// Search for TV shows by title
export const searchTv = (query) => {
  if (!query) return Promise.resolve([]);
  return fetchAPI(`/api/tv/search?query=${encodeURIComponent(query)}`);
};

// Get full details of a specific TV show by its ID
export const getTvDetails = (id) => fetchAPI(`/api/tv/${id}`);

// Get cast and crew (credits) for a specific TV show
export const getTvCredits = (id) => fetchAPI(`/api/tv/${id}/credits`);

// Get videos (trailers, teasers) for a specific TV show
export const getTvVideos = (id) => fetchAPI(`/api/tv/${id}/videos`);

// Get TMDB recommendations for a specific TV show
export const getTvRecommendations = (id) => fetchAPI(`/api/tv/${id}/recommendations`);

// Get top-rated TV shows
export const getTopRatedTv = () => fetchAPI('/api/tv/top-rated');
