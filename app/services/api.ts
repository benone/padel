// API Configuration and Service Layer - Using Generated OpenAPI Client with Fallbacks
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '@env';
import { PadelClubApi, OpenAPI } from '../api';
import { LoggingPadelClubApi } from './apiLogger';
import type {
  User,
  Match,
  Club,
  Booking,
  Post,
  Player,
  Sport,
  Court,
  Review,
  Notification,
  Payment
} from '../api';

// Legacy types for backward compatibility
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Re-export generated types
export type {
  User,
  Match,
  Club,
  Booking,
  Post,
  Player,
  Sport,
  Court,
  Review,
  Notification,
  Payment
} from '../api';

// Storage keys
const STORAGE_KEYS = {
  AUTH_TOKEN: '@padel_auth_token',
  USER_DATA: '@padel_user_data',
} as const;

// Mock data for fallbacks
const mockUser: User = {
  id: 1,
  email: 'kirill.romanov@example.com',
  name: 'Kirill Romanov',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};


// Initialize OpenAPI configuration
const initializeAPI = async () => {
  // The generated client has hardcoded BASE as 'http://localhost:3000/api'
  // We need to override it with the correct base URL without /api duplication
  const baseUrl = API_BASE_URL;
  let cleanBaseUrl = baseUrl;

  // Remove trailing /api if present to avoid duplication
  if (cleanBaseUrl.endsWith('/api')) {
    cleanBaseUrl = cleanBaseUrl.slice(0, -4);
  }

  // Ensure no trailing slash
  cleanBaseUrl = cleanBaseUrl.replace(/\/$/, '');

  // Override the generated default BASE URL
  OpenAPI.BASE = cleanBaseUrl;

  console.log('🔧 API Configuration:', {
    original: API_BASE_URL,
    clean: cleanBaseUrl,
    final: OpenAPI.BASE,
    note: 'Generated client adds /api prefix to all endpoints'
  });

  // Configure authentication
  OpenAPI.TOKEN = async () => {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    return token || '';
  };

  // Configure default headers
  OpenAPI.HEADERS = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
};

// Initialize API configuration
initializeAPI();

// Create API client instance with logging
const apiClient = new LoggingPadelClubApi();

// Helper function to handle API responses
const handleResponse = async <T>(
  apiCall: Promise<T>,
  operation: string
): Promise<ApiResponse<T>> => {
  try {
    console.log(`🌐 Attempting API call: ${operation}`);

    // Debug: Log API configuration before making the call
    console.log(`🔧 DEBUG - Current OpenAPI config:`, {
      BASE: OpenAPI.BASE,
      TOKEN: typeof OpenAPI.TOKEN,
      HEADERS: OpenAPI.HEADERS
    });

    const data = await apiCall;
    console.log(`✅ API call successful: ${operation}`);

    // Truncate response data for logging
    const dataStr = JSON.stringify(data, null, 2);
    const truncatedData = dataStr.length > 500 ?
      dataStr.substring(0, 500) + '...[truncated]' :
      dataStr;
    console.log(`📊 Response data (first 500 chars):`, truncatedData);

    return { success: true, data };
  } catch (error) {
    console.warn(`⚠️ API call failed: ${operation}`);

    // Debug: Enhanced error logging
    console.warn(`🔧 DEBUG - Detailed error for ${operation}:`, {
      name: error?.constructor?.name,
      message: error?.message,
      status: error?.status,
      statusText: error?.statusText,
      url: error?.url,
      body: error?.body,
      stack: error?.stack,
      fullError: error,
      errorProperties: Object.getOwnPropertyNames(error),
      // Additional network debugging
      cause: error?.cause,
      errno: error?.errno,
      syscall: error?.syscall,
      address: error?.address,
      port: error?.port
    });

    return {
      success: false,
      error: error instanceof Error ? error.message : 'API call failed'
    };
  }
};

// Authentication API
const authAPI = {
  async login(email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> {
    try {
      console.log(`🔐 Login attempt for: ${email}`);

      // Mock login for development - replace with actual auth endpoint when available
      const mockToken = 'mock-token-12345';

      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, mockToken);
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(mockUser));

      console.log('✅ Mock login successful');
      return {
        success: true,
        data: { user: mockUser, token: mockToken }
      };
    } catch (error) {
      console.error('❌ Login failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Login failed'
      };
    }
  },

  async register(userData: Partial<User>): Promise<ApiResponse<{ user: User; token: string }>> {
    try {
      const response = await apiClient.players.postApiPlayers();
      return { success: true, data: response };
    } catch (error) {
      // Fallback to mock registration
      const mockToken = 'mock-token-12345';
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, mockToken);
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(mockUser));

      return {
        success: true,
        data: { user: mockUser, token: mockToken }
      };
    }
  },

  async logout(): Promise<ApiResponse<void>> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
      console.log('✅ Logout successful');
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Logout failed'
      };
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.warn('Failed to get current user:', error);
      return null;
    }
  },
};

// Users/Players API
const usersAPI = {
  async getProfile(userId: string): Promise<ApiResponse<User>> {
    try {
      return handleResponse(
        apiClient.players.getApiPlayersId({ id: parseInt(userId) }),
        `getProfile(${userId})`
      );
    } catch (error) {
      console.warn(`❌ Profile endpoint not available for user ${userId}, using mock data`);
      return {
        success: true,
        data: {
          data: {
            id: userId,
            attributes: {
              name: 'Kirill Romanov',
              email: 'kirill.romanov@example.com',
              level: '7.5',
              level_name: 'Продвинутый',
              avatar_url: null,
              phone: '+7 495 123-45-67',
              preferences: {
                hand: 'Правая',
                position: 'Нападение',
                preferredTime: 'Вечер'
              },
              stats: {
                totalMatches: 24,
                wins: 18,
                winRate: 75
              },
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          }
        }
      };
    }
  },

  async updateProfile(userId: string, updates: Partial<User>): Promise<ApiResponse<User>> {
    try {
      return handleResponse(
        apiClient.players.putApiPlayers(),
        `updateProfile(${userId})`
      );
    } catch (error) {
      console.log(`📝 Update profile ${userId} (mock)`);
      return { success: true, data: mockUser };
    }
  },

  async getMatchHistory(userId: string, params = {}): Promise<ApiResponse<Match[]>> {
    try {
      return handleResponse(
        apiClient.matches.getApiMatches(),
        `getMatchHistory(${userId})`
      );
    } catch (error) {
      console.log(`📊 Get match history ${userId} (mock)`);
      return { success: true, data: [] };
    }
  },

  async getStats(userId: string, period = '6months'): Promise<ApiResponse<any>> {
    try {
      return handleResponse(
        apiClient.players.getApiPlayers1(),
        `getStats(${userId}, ${period})`
      );
    } catch (error) {
      console.log(`📈 Get stats ${userId} (mock)`);
      return {
        success: true,
        data: {
          overview: {
            winRate: 75,
            totalMatches: 24,
            wins: 18
          }
        }
      };
    }
  },

  async getPreferences(userId: string): Promise<ApiResponse<any>> {
    try {
      return handleResponse(
        apiClient.players.getApiPlayers1(),
        `getPreferences(${userId})`
      );
    } catch (error) {
      console.log(`⚙️ Get preferences ${userId} (mock)`);
      return { success: true, data: {} };
    }
  },

  async updatePreferences(userId: string, preferences: any): Promise<ApiResponse<any>> {
    try {
      return handleResponse(
        apiClient.players.putApiPlayers(),
        `updatePreferences(${userId})`
      );
    } catch (error) {
      console.log(`⚙️ Update preferences ${userId} (mock)`);
      return { success: true, data: preferences };
    }
  },

  async getConnections(userId: string): Promise<ApiResponse<User[]>> {
    try {
      return handleResponse(
        apiClient.players.getApiPlayers(),
        `getConnections(${userId})`
      );
    } catch (error) {
      console.log(`👥 Get connections ${userId} (mock)`);
      return {
        success: true,
        data: {
          data: [
            {
              id: '5',
              attributes: {
                name: 'Анна Иванова',
                email: 'anna@example.com',
                level: '6.0',
                avatar_url: null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }
            },
            {
              id: '6',
              attributes: {
                name: 'Петр Сидоров',
                email: 'petr@example.com',
                level: '7.0',
                avatar_url: null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }
            }
          ]
        }
      };
    }
  },

  async getClubs(userId: string): Promise<ApiResponse<Club[]>> {
    try {
      return handleResponse(
        apiClient.clubs.getApiClubs(),
        `getClubs(${userId})`
      );
    } catch (error) {
      console.log(`🏢 Get clubs ${userId} (mock)`);
      return {
        success: true,
        data: {
          data: [
            {
              id: '1',
              attributes: {
                name: 'Padel Club Moscow',
                location: 'Москва, ул. Спортивная 10',
                description: 'Современный падел клуб в центре Москвы',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }
            },
            {
              id: '2',
              attributes: {
                name: 'Elite Tennis & Padel',
                location: 'Москва, ул. Ленинский проспект 50',
                description: 'Премиальный спортивный клуб',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }
            }
          ]
        }
      };
    }
  },

  async getBookings(userId: string, params = {}): Promise<ApiResponse<Booking[]>> {
    try {
      return handleResponse(
        apiClient.bookings.getApiBookings(),
        `getBookings(${userId})`
      );
    } catch (error) {
      console.log(`📅 Get bookings ${userId} (mock)`);
      return { success: true, data: [] };
    }
  },
};

// Clubs API
const clubsAPI = {
  async search(params = {}): Promise<ApiResponse<Club[]>> {
    return handleResponse(
      apiClient.clubs.getApiClubs(),
      'searchClubs'
    );
  },

  async getDetails(clubId: string): Promise<ApiResponse<Club>> {
    // For now, use the default club endpoint since the generated API client
    // doesn't properly handle path parameters for individual club IDs
    if (clubId === 'club_123' || clubId === 'default') {
      return handleResponse(
        fetch(`${OpenAPI.BASE}/api/clubs/default`, {
          headers: {
            'Authorization': `Bearer ${await OpenAPI.TOKEN()}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }).then(res => res.json()).then(data => data.data),
        `getClubDetails(${clubId})`
      );
    }

    return handleResponse(
      apiClient.clubs.getApiClubs1(),
      `getClubDetails(${clubId})`
    );
  },

  async getAvailability(clubId: string, params = {}): Promise<ApiResponse<any>> {
    // Use actual club ID for availability endpoint
    const actualClubId = clubId === 'club_123' || clubId === 'default' ? '2' : clubId;

    // Build query string from params
    const queryParams = new URLSearchParams();
    if (params.date) queryParams.append('date', params.date);
    if (params.duration) queryParams.append('duration', params.duration.toString());
    const queryString = queryParams.toString();
    const url = `${OpenAPI.BASE}/api/clubs/${actualClubId}/availability${queryString ? `?${queryString}` : ''}`;

    console.log(`🌐 Making availability request to: ${url}`);

    return handleResponse(
      fetch(url, {
        headers: {
          'Authorization': `Bearer ${await OpenAPI.TOKEN()}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }).then(res => {
        console.log(`📥 Availability response status: ${res.status}`);
        return res.json();
      }).then(data => {
        console.log(`📊 Raw availability response:`, JSON.stringify(data, null, 2));
        return data.data;
      }),
      `getClubAvailability(${clubId})`
    );
  },

  async getContact(clubId: string): Promise<ApiResponse<any>> {
    return handleResponse(
      apiClient.clubs.getApiClubs1(),
      `getClubContact(${clubId})`
    );
  },

  async getReviews(clubId: string, params = {}): Promise<ApiResponse<Review[]>> {
    return handleResponse(
      apiClient.reviews.getApiReviews(),
      `getClubReviews(${clubId})`
    );
  },

  async addToFavorites(clubId: string): Promise<ApiResponse<void>> {
    return handleResponse(
      apiClient.clubs.postApiClubs(),
      `addToFavorites(${clubId})`
    );
  },

  async removeFromFavorites(clubId: string): Promise<ApiResponse<void>> {
    return handleResponse(
      apiClient.clubs.deleteApiClubs(),
      `removeFromFavorites(${clubId})`
    );
  },

  async getNearby(params = {}): Promise<ApiResponse<Club[]>> {
    return handleResponse(
      apiClient.clubs.getApiClubsNearby(),
      'getNearbyClubs'
    );
  },
};

// Matches API
const matchesAPI = {
  async getOpen(params = {}): Promise<ApiResponse<Match[]>> {
    return handleResponse(
      apiClient.matches.getApiMatches(),
      'getOpenMatches'
    );
  },

  async search(params = {}): Promise<ApiResponse<Match[]>> {
    return handleResponse(
      apiClient.matches.getApiMatches(),
      'searchMatches'
    );
  },

  async getDetails(matchId: string): Promise<ApiResponse<Match>> {
    // Use manual fetch with include parameters since generated client doesn't support them
    return handleResponse(
      fetch(`${OpenAPI.BASE}/api/matches/${matchId}?include=participants,organizer,club,sport,court`, {
        headers: {
          'Authorization': `Bearer ${await OpenAPI.TOKEN()}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }).then(res => res.json()),
      `getMatchDetails(${matchId})`
    );
  },

  async create(matchData: Partial<Match>): Promise<ApiResponse<Match>> {
    return handleResponse(
      apiClient.matches.postApiMatches(),
      'createMatch'
    );
  },

  async join(matchId: string, message = ''): Promise<ApiResponse<void>> {
    return handleResponse(
      fetch(`${OpenAPI.BASE}/api/matches/${matchId}/join`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${await OpenAPI.TOKEN()}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ message })
      }).then(res => res.json()).then(data => data.data || data),
      `joinMatch(${matchId})`
    );
  },

  async leave(matchId: string): Promise<ApiResponse<void>> {
    return handleResponse(
      fetch(`${OpenAPI.BASE}/api/matches/${matchId}/leave`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${await OpenAPI.TOKEN()}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }).then(res => res.json()).then(data => data.data || data),
      `leaveMatch(${matchId})`
    );
  },

  async acceptPlayer(matchId: string, playerId: string): Promise<ApiResponse<void>> {
    return handleResponse(
      apiClient.matchParticipants.postApiMatchParticipants(),
      `acceptPlayer(${matchId}, ${playerId})`
    );
  },

  async getPlayers(matchId: string): Promise<ApiResponse<User[]>> {
    return handleResponse(
      apiClient.matchParticipants.getApiMatchParticipants(),
      `getMatchPlayers(${matchId})`
    );
  },

  async updateResult(matchId: string, result: any): Promise<ApiResponse<Match>> {
    return handleResponse(
      apiClient.matches.postApiMatchesRecordResult(),
      `updateMatchResult(${matchId})`
    );
  },

  async cancel(matchId: string, reason = ''): Promise<ApiResponse<void>> {
    return handleResponse(
      apiClient.matches.deleteApiMatches(),
      `cancelMatch(${matchId})`
    );
  },
};

// Bookings API
const bookingsAPI = {
  async create(bookingData: Partial<Booking>): Promise<ApiResponse<Booking>> {
    return handleResponse(
      apiClient.bookings.postApiBookings(),
      'createBooking'
    );
  },

  async getDetails(bookingId: string): Promise<ApiResponse<Booking>> {
    return handleResponse(
      apiClient.bookings.getApiBookings1(),
      `getBookingDetails(${bookingId})`
    );
  },

  async cancel(bookingId: string, reason = ''): Promise<ApiResponse<void>> {
    return handleResponse(
      apiClient.bookings.deleteApiBookings(),
      `cancelBooking(${bookingId})`
    );
  },

  async modify(bookingId: string, updates: Partial<Booking>): Promise<ApiResponse<Booking>> {
    return handleResponse(
      apiClient.bookings.putApiBookings(),
      `modifyBooking(${bookingId})`
    );
  },

  async getHistory(params = {}): Promise<ApiResponse<Booking[]>> {
    return handleResponse(
      apiClient.bookings.getApiBookings(),
      'getBookingHistory'
    );
  },

  async checkAvailability(availabilityData: any): Promise<ApiResponse<any>> {
    return handleResponse(
      apiClient.bookings.getApiBookings(),
      'checkAvailability'
    );
  },
};

// General API
const generalAPI = {
  async getSports(): Promise<ApiResponse<Sport[]>> {
    return handleResponse(
      apiClient.sports.getApiSports(),
      'getSports'
    );
  },

  async getTimeSlots(params = {}): Promise<ApiResponse<any[]>> {
    return handleResponse(
      apiClient.courts.getApiCourts(),
      'getTimeSlots'
    );
  },

  async getConfig(): Promise<ApiResponse<any>> {
    return { success: true, data: { version: '1.0.0' } };
  },

  async getHealth(): Promise<ApiResponse<any>> {
    return { success: true, data: { status: 'healthy' } };
  },

  async getPopularVenues(params = {}): Promise<ApiResponse<Club[]>> {
    return handleResponse(
      apiClient.clubs.getApiClubs(),
      'getPopularVenues'
    );
  },

  async getTrendingMatches(params = {}): Promise<ApiResponse<Match[]>> {
    return handleResponse(
      apiClient.matches.getApiMatches(),
      'getTrendingMatches'
    );
  },

  async getSearchSuggestions(params = {}): Promise<ApiResponse<any[]>> {
    return { success: true, data: [] };
  },
};

// Payments API
const paymentsAPI = {
  async process(paymentData: any): Promise<ApiResponse<Payment>> {
    return handleResponse(
      apiClient.payments.postApiPayments(),
      'processPayment'
    );
  },

  async getStatus(paymentId: string): Promise<ApiResponse<Payment>> {
    return handleResponse(
      apiClient.payments.getApiPayments1(),
      `getPaymentStatus(${paymentId})`
    );
  },
};

// Notifications API
const notificationsAPI = {
  async getAll(params = {}): Promise<ApiResponse<Notification[]>> {
    return handleResponse(
      apiClient.notifications.getApiNotifications(),
      'getAllNotifications'
    );
  },

  async markAsRead(notificationId: string): Promise<ApiResponse<void>> {
    return handleResponse(
      apiClient.notifications.putApiNotifications(),
      `markNotificationAsRead(${notificationId})`
    );
  },
};

// Support API
const supportAPI = {
  async createTicket(ticketData: any): Promise<ApiResponse<any>> {
    const mockTicket = {
      id: Date.now().toString(),
      status: 'open',
      ...ticketData
    };
    console.log('📧 Support ticket created (mock):', mockTicket);
    return { success: true, data: mockTicket };
  },
};

// Community API
const communityAPI = {
  async getPosts(params = {}): Promise<ApiResponse<Post[]>> {
    try {
      const response = await handleResponse(
        apiClient.posts.getApiPosts(),
        'getCommunityPosts'
      );
      return response;
    } catch (error) {
      console.warn('❌ Posts endpoint not available, using mock data');
      return {
        success: true,
        data: {
          data: [
            {
              id: '1',
              attributes: {
                content: 'Ищу партнера для игры в падел на выходных! Уровень 5.0-6.0',
                created_at: new Date().toISOString(),
                image_url: null,
                likes_count: 12,
                comments_count: 3,
                liked: false
              },
              relationships: {
                user: {
                  data: {
                    id: '1',
                    attributes: {
                      name: 'Анна Смирнова',
                      avatar_url: null,
                      verified: true
                    }
                  }
                }
              }
            },
            {
              id: '2',
              attributes: {
                content: 'Отличная тренировка сегодня! Спасибо всем за игру 🎾',
                created_at: new Date(Date.now() - 86400000).toISOString(),
                image_url: null,
                likes_count: 8,
                comments_count: 1,
                liked: true
              },
              relationships: {
                user: {
                  data: {
                    id: '2',
                    attributes: {
                      name: 'Максим Петров',
                      avatar_url: null,
                      verified: false
                    }
                  }
                }
              }
            }
          ]
        }
      };
    }
  },

  async getSuggestions(params = {}): Promise<ApiResponse<User[]>> {
    try {
      const response = await handleResponse(
        apiClient.players.getApiPlayers(),
        'getCommunitySuggestions'
      );
      return response;
    } catch (error) {
      console.warn('❌ Players endpoint not available, using mock data');
      return {
        success: true,
        data: {
          data: [
            {
              id: '3',
              attributes: {
                name: 'Елена Козлова',
                email: 'elena@example.com',
                level: '6.5',
                avatar_url: null,
                verified: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }
            },
            {
              id: '4',
              attributes: {
                name: 'Дмитрий Волков',
                email: 'dmitry@example.com',
                level: '5.0',
                avatar_url: null,
                verified: false,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }
            }
          ]
        }
      };
    }
  },

  async likePost(postId: string): Promise<ApiResponse<void>> {
    try {
      return handleResponse(
        apiClient.posts.postApiPostsLike(),
        `likePost(${postId})`
      );
    } catch (error) {
      console.log(`❤️ Like post ${postId} (mock response)`);
      return { success: true, data: { liked: true, newLikeCount: Math.floor(Math.random() * 20) + 1 } };
    }
  },

  async followUser(userId: string): Promise<ApiResponse<void>> {
    console.log(`👥 Following user ${userId} (mock)`);
    return { success: true };
  },

  async search(query: string): Promise<ApiResponse<any[]>> {
    console.log(`🔍 Searching for: ${query} (mock)`);
    return { success: true, data: [] };
  },
};

// Auto-login with mock credentials for development
const initializeAuth = async () => {
  try {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (!token) {
      // Auto-login with mock credentials for development
      await authAPI.login('kirill.romanov@example.com', 'test');
      console.log('✅ Auto-login successful');
    } else {
      console.log('✅ Found existing auth token');
    }
  } catch (error) {
    console.warn('Auto-login failed:', error);
  }
};

// Initialize auth on module load
initializeAuth();

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
  communityAPI,
  apiClient,
  initializeAuth,
};

// Export the generated API client for direct access
export { apiClient as padelClubApi };
