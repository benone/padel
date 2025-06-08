// API Configuration and Service Layer
import AsyncStorage from '@react-native-async-storage/async-storage';

// API Configuration
const API_CONFIG = {
  // For iOS Simulator
  baseURL: 'http://localhost:3000/api',
  // For Android Emulator: 'http://10.0.2.2:3000/api'
  // For physical device: 'http://[YOUR_IP]:3000/api'
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Storage keys
const STORAGE_KEYS = {
  AUTH_TOKEN: '@padel_auth_token',
  USER_DATA: '@padel_user_data',
};

// API Client class
class ApiClient {
  constructor() {
    this.baseURL = API_CONFIG.baseURL;
    this.timeout = API_CONFIG.timeout;
    this.defaultHeaders = API_CONFIG.headers;
  }

  // Get auth token from storage
  async getAuthToken() {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
      console.warn('Failed to get auth token:', error);
      return null;
    }
  }

  // Set auth token in storage
  async setAuthToken(token) {
    try {
      if (token) {
        await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      } else {
        await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      }
    } catch (error) {
      console.warn('Failed to set auth token:', error);
    }
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = await this.getAuthToken();
    
    const headers = {
      ...this.defaultHeaders,
      ...(options.headers || {}),
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const config = {
      method: 'GET',
      headers,
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      console.error(`API Error [${config.method} ${url}]:`, error);
      throw error;
    }
  }

  // GET request
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url);
  }

  // POST request
  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: data,
    });
  }

  // PUT request
  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: data,
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }
}

// Create API client instance
const apiClient = new ApiClient();

// Authentication API
const authAPI = {
  async login(email, password) {
    const response = await apiClient.post('/auth/login', { email, password });
    if (response.data?.token) {
      await apiClient.setAuthToken(response.data.token);
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.data.user));
    }
    return response;
  },

  async register(userData) {
    const response = await apiClient.post('/auth/register', userData);
    if (response.data?.token) {
      await apiClient.setAuthToken(response.data.token);
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.data.user));
    }
    return response;
  },

  async logout() {
    await apiClient.post('/auth/logout');
    await apiClient.setAuthToken(null);
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
  },

  async getCurrentUser() {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.warn('Failed to get current user:', error);
      return null;
    }
  },
};

// Users API
const usersAPI = {
  async getProfile(userId) {
    return apiClient.get(`/users/${userId}/profile`);
  },

  async updateProfile(userId, updates) {
    return apiClient.put(`/users/${userId}/profile`, updates);
  },

  async getMatchHistory(userId, params = {}) {
    return apiClient.get(`/users/${userId}/matches`, params);
  },

  async getStats(userId, period = '6months') {
    return apiClient.get(`/users/${userId}/stats`, { period });
  },

  async getPreferences(userId) {
    return apiClient.get(`/users/${userId}/preferences`);
  },

  async updatePreferences(userId, preferences) {
    return apiClient.put(`/users/${userId}/preferences`, preferences);
  },

  async getConnections(userId) {
    return apiClient.get(`/users/${userId}/connections`);
  },

  async getClubs(userId) {
    return apiClient.get(`/users/${userId}/clubs`);
  },

  async getBookings(userId, params = {}) {
    return apiClient.get(`/users/${userId}/bookings`, params);
  },
};

// Clubs API
const clubsAPI = {
  async search(params = {}) {
    return apiClient.get('/clubs/search', params);
  },

  async getDetails(clubId) {
    return apiClient.get(`/clubs/${clubId}`);
  },

  async getAvailability(clubId, params = {}) {
    return apiClient.get(`/clubs/${clubId}/availability`, params);
  },

  async getContact(clubId) {
    return apiClient.get(`/clubs/${clubId}/contact`);
  },

  async getReviews(clubId, params = {}) {
    return apiClient.get(`/clubs/${clubId}/reviews`, params);
  },

  async addToFavorites(clubId) {
    return apiClient.post(`/clubs/${clubId}/favorite`);
  },

  async removeFromFavorites(clubId) {
    return apiClient.delete(`/clubs/${clubId}/favorite`);
  },

  async getNearby(params = {}) {
    return apiClient.get('/clubs', params);
  },
};

// Matches API
const matchesAPI = {
  async getOpen(params = {}) {
    return apiClient.get('/matches/open', params);
  },

  async search(params = {}) {
    return apiClient.get('/matches/search', params);
  },

  async getDetails(matchId) {
    return apiClient.get(`/matches/${matchId}`);
  },

  async create(matchData) {
    return apiClient.post('/matches', matchData);
  },

  async join(matchId, message = '') {
    return apiClient.post(`/matches/${matchId}/join`, { message });
  },

  async acceptPlayer(matchId, playerId) {
    return apiClient.post(`/matches/${matchId}/reserve`, { playerId });
  },

  async getPlayers(matchId) {
    return apiClient.get(`/matches/${matchId}/players`);
  },

  async updateResult(matchId, result) {
    return apiClient.put(`/matches/${matchId}/result`, result);
  },

  async cancel(matchId, reason = '') {
    return apiClient.delete(`/matches/${matchId}`, { reason });
  },
};

// Bookings API
const bookingsAPI = {
  async create(bookingData) {
    return apiClient.post('/bookings', bookingData);
  },

  async getDetails(bookingId) {
    return apiClient.get(`/bookings/${bookingId}`);
  },

  async cancel(bookingId, reason = '') {
    return apiClient.put(`/bookings/${bookingId}/cancel`, { reason });
  },

  async modify(bookingId, updates) {
    return apiClient.put(`/bookings/${bookingId}`, updates);
  },

  async getHistory(params = {}) {
    return apiClient.get('/bookings/history', params);
  },

  async checkAvailability(availabilityData) {
    return apiClient.post('/bookings/check-availability', availabilityData);
  },
};

// General API
const generalAPI = {
  async getSports() {
    return apiClient.get('/sports');
  },

  async getTimeSlots(params = {}) {
    return apiClient.get('/time-slots', params);
  },

  async getConfig() {
    return apiClient.get('/config');
  },

  async getHealth() {
    return apiClient.get('/health');
  },

  async getPopularVenues(params = {}) {
    return apiClient.get('/popular-venues', params);
  },

  async getTrendingMatches(params = {}) {
    return apiClient.get('/trending-matches', params);
  },

  async getSearchSuggestions(params = {}) {
    return apiClient.get('/search-suggestions', params);
  },
};

// Payments API
const paymentsAPI = {
  async process(paymentData) {
    return apiClient.post('/payments/process', paymentData);
  },

  async getStatus(paymentId) {
    return apiClient.get(`/payments/${paymentId}/status`);
  },
};

// Notifications API
const notificationsAPI = {
  async getAll(params = {}) {
    return apiClient.get('/notifications', params);
  },

  async markAsRead(notificationId) {
    return apiClient.put(`/notifications/${notificationId}/read`);
  },
};

// Support API
const supportAPI = {
  async createTicket(ticketData) {
    return apiClient.post('/support/tickets', ticketData);
  },
};

// Export all APIs
export { 
  authAPI, 
  usersAPI, 
  clubsAPI, 
  matchesAPI, 
  bookingsAPI, 
  generalAPI, 
  paymentsAPI, 
  notificationsAPI, 
  supportAPI,
  apiClient,
  initializeAuth
};

// Note: imageAPI should be imported directly from './imageAPI' to avoid circular dependency

// Auto-login with mock credentials for development
const initializeAuth = async () => {
  try {
    const token = await apiClient.getAuthToken();
    if (!token) {
      // Auto-login with mock credentials for development
      await authAPI.login('kirill.romanov@example.com', 'test');
      console.log('✅ Auto-login successful');
    }
  } catch (error) {
    console.warn('Auto-login failed:', error);
  }
};