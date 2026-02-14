/**
 * Image Helper Utility
 * Convert relative image paths to absolute URLs
 */

const BACKEND_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

/**
 * Get full image URL from relative path
 * @param {string} path - Relative path like /uploads/image.jpg
 * @returns {string} - Full URL like http://localhost:5000/uploads/image.jpg
 */
export const getImageUrl = (path) => {
  if (!path) return '';

  // If already a full URL, return as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;

  // Return full URL
  return `${BACKEND_URL}/${cleanPath}`;
};

export default getImageUrl;
