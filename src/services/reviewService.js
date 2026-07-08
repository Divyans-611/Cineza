// src/services/reviewService.js
// Service layer for Review API calls

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

/** Helper to build Authorization header if token is provided */
const authHeaders = (token) => (token ? { Authorization: `Bearer ${token}` } : {});

export const getMovieReviews = async (movieId) => {
  const response = await fetch(`${API_BASE_URL}/api/reviews/movie/${movieId}`);
  const json = await response.json();
  if (!json.success) {
    throw new Error(json.message || 'Failed to fetch reviews');
  }
  return json.data;
};

export const createReview = async (reviewData, token) => {
  const response = await fetch(`${API_BASE_URL}/api/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(token),
    },
    body: JSON.stringify(reviewData),
  });
  const json = await response.json();
  if (!json.success) {
    throw new Error(json.message || 'Failed to create review');
  }
  return json.data;
};

export const updateReview = async (reviewId, updateData, token) => {
  const response = await fetch(`${API_BASE_URL}/api/reviews/${reviewId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(token),
    },
    body: JSON.stringify(updateData),
  });
  const json = await response.json();
  if (!json.success) {
    throw new Error(json.message || 'Failed to update review');
  }
  return json.data;
};

export const deleteReview = async (reviewId, token) => {
  const response = await fetch(`${API_BASE_URL}/api/reviews/${reviewId}`, {
    method: 'DELETE',
    headers: {
      ...authHeaders(token),
    },
  });
  const json = await response.json();
  if (!json.success) {
    throw new Error(json.message || 'Failed to delete review');
  }
  return json.data;
};
