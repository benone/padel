import { API_URL } from '../config/api.config';

class ConfigAPI {
  constructor() {
    this.baseUrl = `${API_URL}/config`;
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  async makeRequest(url, options = {}) {
    try {
      console.log(`🔄 ConfigAPI: Making request to ${url}`);
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      console.log(`📡 ConfigAPI: Response status ${response.status} for ${url}`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`✅ ConfigAPI: Response received for ${url}:`, data);
      
      return data;
    } catch (error) {
      console.error(`❌ ConfigAPI: Request failed for ${url}:`, error);
      console.error(`❌ ConfigAPI: Error type:`, error.constructor.name);
      console.error(`❌ ConfigAPI: Error message:`, error.message);
      throw error;
    }
  }

  getCacheKey(endpoint) {
    return `config_${endpoint}`;
  }

  getCachedData(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      console.log(`ConfigAPI: Using cached data for ${key}`);
      return cached.data;
    }
    return null;
  }

  setCachedData(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  // Get application configuration
  async getAppConfig() {
    const cacheKey = this.getCacheKey('app');
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const response = await this.makeRequest(`${this.baseUrl}/app`);
      this.setCachedData(cacheKey, response.data);
      return response.data;
    } catch (error) {
      console.error('❌ ConfigAPI: Failed to get app config:', error);
      console.error('❌ ConfigAPI: Error details:', {
        message: error.message,
        stack: error.stack,
        url: `${this.baseUrl}/app`
      });
      // Return fallback configuration
      return this.getFallbackAppConfig();
    }
  }

  // Get localization strings
  async getLocalization(locale = 'ru') {
    const cacheKey = this.getCacheKey(`localization_${locale}`);
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const response = await this.makeRequest(`${this.baseUrl}/localization/${locale}`);
      this.setCachedData(cacheKey, response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to get localization:', error);
      // Return fallback localization
      return this.getFallbackLocalization();
    }
  }

  // Get pricing configuration
  async getPricingConfig() {
    const cacheKey = this.getCacheKey('pricing');
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const response = await this.makeRequest(`${this.baseUrl}/pricing`);
      this.setCachedData(cacheKey, response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to get pricing config:', error);
      // Return fallback pricing
      return this.getFallbackPricingConfig();
    }
  }

  // Get business rules
  async getBusinessRules() {
    const cacheKey = this.getCacheKey('business-rules');
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const response = await this.makeRequest(`${this.baseUrl}/business-rules`);
      this.setCachedData(cacheKey, response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to get business rules:', error);
      // Return fallback business rules
      return this.getFallbackBusinessRules();
    }
  }

  // Helper methods to get specific configurations
  async getSportsConfig() {
    const appConfig = await this.getAppConfig();
    return appConfig.sports || [];
  }

  async getBookingConfig() {
    const appConfig = await this.getAppConfig();
    return appConfig.booking || {};
  }

  async getFiltersConfig() {
    const appConfig = await this.getAppConfig();
    return appConfig.filters || {};
  }

  async getUIConfig() {
    const appConfig = await this.getAppConfig();
    return appConfig.ui || {};
  }

  async getText(key, fallback = '') {
    try {
      const localization = await this.getLocalization();
      const keys = key.split('.');
      let value = localization;
      
      for (const k of keys) {
        value = value?.[k];
        if (value === undefined) break;
      }
      
      return value || fallback;
    } catch (error) {
      console.warn(`Failed to get text for key "${key}":`, error);
      return fallback;
    }
  }

  async getPrice(sport, duration) {
    try {
      const pricingConfig = await this.getPricingConfig();
      const sportConfig = pricingConfig.sports?.[sport];
      
      if (!sportConfig) return null;
      
      const durationConfig = sportConfig.durations?.find(d => d.minutes === duration);
      return durationConfig ? durationConfig.price : null;
    } catch (error) {
      console.warn(`Failed to get price for ${sport} ${duration}min:`, error);
      return null;
    }
  }

  // Clear cache
  clearCache() {
    this.cache.clear();
  }

  // Fallback configurations for offline/error scenarios
  getFallbackAppConfig() {
    return {
      sports: [
        {
          id: 'padel',
          name: 'Падел',
          icon: 'tennisball-outline',
          active: true,
          defaultDuration: 90,
          playerCounts: [2, 4],
          levelRanges: [
            { id: 'beginner', label: '0.49 - 1.49', min: 0.49, max: 1.49 }
          ]
        }
      ],
      booking: {
        defaultDuration: 90,
        durations: [
          { value: 60, label: '60мин', price: 2000 },
          { value: 90, label: '90мин', price: 3000 },
          { value: 120, label: '120мин', price: 4000 }
        ],
        timeSlots: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'],
        genderOptions: [
          { id: 'mixed', label: 'Все игроки' },
          { id: 'male', label: 'Только мужчины' },
          { id: 'female', label: 'Только женщины' }
        ],
        defaultPrice: 3000
      },
      filters: {
        defaultSport: 'padel',
        defaultClubSelection: '2 клуба',
        defaultDateRange: 'Сб-Вс-Пн, 07'
      }
    };
  }

  getFallbackLocalization() {
    return {
      common: {
        loading: 'Загрузка...',
        error: 'Ошибка',
        success: 'Успешно!',
        cancel: 'Отмена',
        confirm: 'Подтвердить'
      },
      home: {
        greeting: 'Сыграй свой идеальный матч',
        bookCourt: 'Забронировать корт',
        playOpenMatch: 'Играть открытый матч'
      },
      booking: {
        showAvailableOnly: 'Показать только доступные',
        courtBooked: 'Корт забронирован'
      }
    };
  }

  getFallbackPricingConfig() {
    return {
      sports: {
        padel: {
          basePrice: 2000,
          pricePerHour: 2000,
          durations: [
            { minutes: 60, price: 2000, popular: false },
            { minutes: 90, price: 3000, popular: true },
            { minutes: 120, price: 4000, popular: false }
          ]
        }
      },
      currency: '₽'
    };
  }

  getFallbackBusinessRules() {
    return {
      booking: {
        maxAdvanceBookingDays: 30,
        minAdvanceBookingHours: 2
      },
      match: {
        minPlayers: 2,
        maxPlayers: 4,
        defaultPlayerCount: 4
      }
    };
  }
}

export default new ConfigAPI();