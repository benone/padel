// Import only the API client class to avoid circular dependency
import { API_BASE_URL } from '@env';

const API_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

/**
 * Image Generation API
 * Provides methods to generate and cache images using AI
 */
export const imageAPI = {
  /**
   * Generate an image from text prompt
   * @param {string} prompt - Text description for image generation
   * @param {Object} options - Additional options
   * @param {number} options.width - Image width (default: 512)
   * @param {number} options.height - Image height (default: 512) 
   * @param {string} options.style - Style preset (default: 'realistic')
   * @returns {Promise<Object>} Generated image data
   */
  async generate(prompt, options = {}) {
    const { width = 512, height = 512, style = 'realistic' } = options;
    
    if (!prompt || typeof prompt !== 'string') {
      throw new Error('Prompt is required and must be a string');
    }

    try {
      const params = new URLSearchParams({ prompt, width, height, style });
      const response = await fetch(`${API_CONFIG.baseURL}/images/generate?${params}`, {
        method: 'GET',
        headers: API_CONFIG.headers,
        signal: AbortSignal.timeout(API_CONFIG.timeout),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Image generation failed:', error);
      throw new Error(
        error.message || 'Failed to generate image'
      );
    }
  },

  /**
   * Get cached image by cache key
   * @param {string} cacheKey - Cache key for the image
   * @returns {Promise<Object>} Cached image data
   */
  async getCached(cacheKey) {
    try {
      const response = await fetch(`${API_CONFIG.baseURL}/images/cache/${cacheKey}`, {
        method: 'GET',
        headers: API_CONFIG.headers,
        signal: AbortSignal.timeout(API_CONFIG.timeout),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to get cached image:', error);
      throw new Error(
        error.message || 'Failed to retrieve cached image'
      );
    }
  },

  /**
   * List all cached images
   * @returns {Promise<Object>} List of cached images
   */
  async listCached() {
    try {
      const response = await fetch(`${API_CONFIG.baseURL}/images/cache`, {
        method: 'GET',
        headers: API_CONFIG.headers,
        signal: AbortSignal.timeout(API_CONFIG.timeout),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to list cached images:', error);
      throw new Error(
        error.message || 'Failed to list cached images'
      );
    }
  },

  /**
   * Clear image cache
   * @returns {Promise<Object>} Success message
   */
  async clearCache() {
    try {
      const response = await fetch(`${API_CONFIG.baseURL}/images/cache`, {
        method: 'DELETE',
        headers: API_CONFIG.headers,
        signal: AbortSignal.timeout(API_CONFIG.timeout),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to clear image cache:', error);
      throw new Error(
        error.message || 'Failed to clear image cache'
      );
    }
  },

  /**
   * Generate avatar image for user
   * @param {string} name - User name
   * @param {string} description - Additional description (optional)
   * @param {Object} options - Generation options
   * @returns {Promise<Object>} Generated avatar data
   */
  async generateAvatar(name, description = '', options = {}) {
    const prompt = description 
      ? `Professional headshot portrait of ${name}, ${description}, high quality, clean background`
      : `Professional headshot portrait of ${name}, high quality, clean background`;
    
    return this.generate(prompt, {
      width: 400,
      height: 400,
      style: 'realistic',
      ...options
    });
  },

  /**
   * Generate club/venue image
   * @param {string} clubName - Name of the club
   * @param {string} description - Description of the venue
   * @param {Object} options - Generation options
   * @returns {Promise<Object>} Generated venue image data
   */
  async generateVenueImage(clubName, description = '', options = {}) {
    const prompt = description
      ? `${clubName} sports facility, ${description}, modern architecture, professional photography`
      : `${clubName} padel tennis sports facility, modern courts, professional photography`;
    
    return this.generate(prompt, {
      width: 800,
      height: 400,
      style: 'realistic',
      ...options
    });
  }
};

export default imageAPI;