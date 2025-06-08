// Centralized API configuration for React Native app
import { API_BASE_URL } from '@env';

// Base URL for API calls - falls back to localhost for development
const getBaseUrl = () => {
  if (API_BASE_URL) {
    return API_BASE_URL.replace('/api', '');
  }
  
  // Development fallback - adjust based on your development setup
  // For iOS Simulator
  if (__DEV__) {
    return 'http://localhost:3000';
  }
  
  // Production fallback
  return 'https://padel-app-backend.hi-sender.workers.dev';
};

const getApiUrl = () => {
  if (API_BASE_URL) {
    return API_BASE_URL;
  }
  
  // Development fallback
  if (__DEV__) {
    return 'http://localhost:3000/api';
  }
  
  // Production fallback
  return 'https://padel-app-backend.hi-sender.workers.dev/api';
};

export const BASE_URL = getBaseUrl();
export const API_URL = getApiUrl();

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