// Centralized API configuration

// Check if we're in Cloudflare Workers or Node.js environment
const isCloudflareWorkers = typeof process === 'undefined';

// Base URL factory function that accepts environment variables
export function createConfig(env = {}) {
  const BASE_URL = isCloudflareWorkers
    ? (env.BASE_URL || '')
    : (process.env.BASE_URL);

  return {
    BASE_URL,
    API_URL: `${BASE_URL}/api`
  };
}

// Default config for Node.js environments
export const { BASE_URL, API_URL } = createConfig();

// Helper function factory that accepts base URL
export function createHelpers(baseUrl) {
  return {
    getImageUrl: (path) => {
      if (path.startsWith('http')) return path;
      return `${baseUrl}${path}`;
    },

    getGeneratedImageUrl: (prompt, width = 100, height = 100) => {
      const encodedPrompt = encodeURIComponent(prompt);
      return `${baseUrl}/api/images-simple/generate?prompt=${encodedPrompt}&width=${width}&height=${height}`;
    },

    getStaticImageUrl: (imageName) => {
      return `${baseUrl}/api/static-images/${imageName}`;
    },

    getAvatarUrl: (userId, width = 100, height = 100) => {
      return `${baseUrl}/api/images-simple/generate?prompt=professional headshot of person&width=${width}&height=${height}&seed=${userId}`;
    }
  };
}

// Default helpers for Node.js environments
export const { getImageUrl, getGeneratedImageUrl, getStaticImageUrl, getAvatarUrl } = createHelpers(BASE_URL);
