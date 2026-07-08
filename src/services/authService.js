const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

/**
 * Handle API responses, parsing JSON and throwing clean errors on failure
 */
const handleResponse = async (res) => {
  let json;
  try {
    json = await res.json();
  } catch (error) {
    throw new Error('Server returned an invalid response.', { cause: error });
  }

  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Authentication request failed.');
  }
  return json;
};

/**
 * Register a new user with email and password
 */
export const registerUser = async (formData) => {
  const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });
  return handleResponse(res);
};

/**
 * Log in a user with email and password
 */
export const loginUser = async (formData) => {
  const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });
  return handleResponse(res);
};

/**
 * Get details of the currently logged-in user using a JWT token
 */
export const getCurrentUser = async (token) => {
  const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return handleResponse(res);
};

/**
 * Get the Google OAuth backend login URL
 */
export const getGoogleAuthUrl = () => {
  return `${API_BASE_URL}/api/auth/google`;
};
