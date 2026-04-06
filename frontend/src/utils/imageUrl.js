/**
 * Image URL Helper
 * Constructs full image URLs for both development and production
 * Handles both local relative paths and URLs from the API
 */

// Get backend URL from environment or use relative path for dev
const getBackendUrl = () => {
  const backendUrl = import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace(/\/$/, "") // Remove trailing slash
    : "";

  return backendUrl;
};

/**
 * Convert relative image paths to full URLs
 * @param {string} imagePath - Image path from API (e.g., "/uploads/file.jpg" or full URL)
 * @returns {string} Full image URL or empty string
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) return "";

  // If already a full URL (starts with http/https), return as-is
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // If it's a relative uploads path, construct full URL
  if (imagePath.startsWith("/uploads/")) {
    const backendUrl = getBackendUrl();
    
    // Production: use BACKEND_URL + path
    if (backendUrl) {
      return `${backendUrl}${imagePath}`;
    }
    
    // Development: relative path works as-is (Vite proxy or same domain)
    return imagePath;
  }

  // Fallback: return as-is
  return imagePath;
};

export default getImageUrl;
