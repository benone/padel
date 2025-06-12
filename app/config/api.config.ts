// Centralized API configuration for React Native app
import { API_BASE_URL } from '@env';

// Base URL for API calls - uses environment variable or defaults to worker
const getBaseUrl = () => {
  return API_BASE_URL;
  // In production builds, API_BASE_URL from .env may be undefined
  // Always fallback to Cloudflare Worker for reliability
    // const url = API_BASE_URL || 'http://localhost:3000';
    // // Remove trailing /api if present to avoid duplication
    // return url.endsWith('/api') ? url.slice(0, -4) : url;
};

const getApiUrl = () => {
  // In production builds, API_BASE_URL from .env may be undefined
  // Always fallback to Cloudflare Worker for reliability
  return API_BASE_URL;
};

export const BASE_URL = getBaseUrl();
export const API_URL = getApiUrl();

// Helper function to build image URLs
export const getImageUrl = (path) => {
  if (path.startsWith('http')) return path;
  return `${BASE_URL}${path}`;
};

// Helper function to build API image generation URLs
export const getGeneratedImageUrl = (prompt, width = 128, height = 128) => {
  const encodedPrompt = encodeURIComponent(prompt);
  return `${API_URL}/api/images/generate?prompt=${encodedPrompt}&width=${width}&height=${height}`;
};

// Helper function for static images
export const getStaticImageUrl = (imageName) => {
  return `${API_URL}/static-images/${imageName}`;
};
