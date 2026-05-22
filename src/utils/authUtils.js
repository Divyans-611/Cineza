/**
 * Extract the first name from a full name string
 */
export const getFirstName = (name) => {
  if (!name) return 'User';
  return name.trim().split(/\s+/)[0];
};

/**
 * Get initials from name (maximum 2 characters)
 */
export const getInitials = (name) => {
  if (!name) return '👤';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

/**
 * Format provider string into user friendly badge label
 */
export const getAuthProviderLabel = (provider) => {
  if (provider === 'google') return 'Google Account';
  return 'Email Account';
};
