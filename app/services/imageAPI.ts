// Image Generation API - Using Generated OpenAPI Client
import { API_BASE_URL } from '@env';
import { PadelClubApi, OpenAPI } from '../api';

// Initialize API client
const imageApiClient = new PadelClubApi();

// Ensure OpenAPI configuration is set
if (!OpenAPI.BASE) {
  OpenAPI.BASE = API_BASE_URL;
}

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
  async generate(prompt: string, options: { width?: number; height?: number; style?: string } = {}) {
    const { width = 512, height = 512, style = 'realistic' } = options;

    if (!prompt || typeof prompt !== 'string') {
      throw new Error('Prompt is required and must be a string');
    }

    try {
      // TODO: Re-enable when API routes are properly configured
      // const result = await imageApiClient.images.getApiImagesGenerate();
      // return { success: true, data: result };

      // For now, return mock data to avoid routing errors
      console.log(`🖼️ Mock image generation for: ${prompt}`);
      const mockResult = {
        url: `https://picsum.photos/${width}/${height}?random=${Date.now()}`,
        prompt,
        width,
        height,
        style
      };
      return { success: true, data: mockResult };
    } catch (error) {
      console.error('Image generation failed:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Failed to generate image'
      );
    }
  },

  /**
   * Get cached image by cache key
   * @param {string} cacheKey - Cache key for the image
   * @returns {Promise<Object>} Cached image data
   */
  async getCached(cacheKey: string) {
    try {
      // For now, return a mock response since cache endpoint may not be in generated API
      return { success: true, data: { url: '', cacheKey } };
    } catch (error) {
      console.error('Failed to get cached image:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Failed to retrieve cached image'
      );
    }
  },

  /**
   * List all cached images
   * @returns {Promise<Object>} List of cached images
   */
  async listCached() {
    try {
      // For now, return a mock response since cache endpoint may not be in generated API
      return { success: true, data: [] };
    } catch (error) {
      console.error('Failed to list cached images:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Failed to list cached images'
      );
    }
  },

  /**
   * Clear image cache
   * @returns {Promise<Object>} Success message
   */
  async clearCache() {
    try {
      // For now, return a mock response since cache endpoint may not be in generated API
      return { success: true, data: { message: 'Cache cleared' } };
    } catch (error) {
      console.error('Failed to clear image cache:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Failed to clear image cache'
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
  async generateAvatar(name: string, description = '', options: { width?: number; height?: number; style?: string } = {}) {
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
  async generateVenueImage(clubName: string, description = '', options: { width?: number; height?: number; style?: string } = {}) {
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
