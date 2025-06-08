// Centralized API configuration
import { API_BASE_URL } from '@env';

// Base URL for API calls
export const BASE_URL = API_BASE_URL?.replace('/api', '') || 'https://padel-app-backend.hi-sender.workers.dev';
export const API_URL = API_BASE_URL || 'https://padel-app-backend.hi-sender.workers.dev/api';

// Helper function to build image URLs
export const getImageUrl = (path) => {
  if (path.startsWith('http')) return path;
  return `${BASE_URL}${path}`;
};

// Helper function to build API image generation URLs
export const getGeneratedImageUrl = (prompt, width = 100, height = 100) => {
  const encodedPrompt = encodeURIComponent(prompt);
  return `${API_URL}/images-simple/generate?prompt=${encodedPrompt}&width=${width}&height=${height}`;
};

// Helper function for static images
export const getStaticImageUrl = (imageName) => {
  return `${API_URL}/static-images/${imageName}`;
};