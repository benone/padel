// Cloudflare Worker entry point
import { Router } from 'itty-router';
import { createMockData } from './data/mockData.mjs';

// Cache mock data to avoid recreating on each request
let cachedMockData = null;

const router = Router();

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
};

// Helper functions
function sendSuccess(data, message = 'Success', status = 200) {
  return new Response(JSON.stringify({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  }), {
    status,
    headers: corsHeaders
  });
}

function sendError(message = 'Error', status = 400, error = null) {
  return new Response(JSON.stringify({
    success: false,
    message,
    error: error?.message || error,
    timestamp: new Date().toISOString()
  }), {
    status,
    headers: corsHeaders
  });
}

// Mock authentication middleware
async function authenticateToken(request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.substring(7);
  // Mock validation - in production use proper JWT validation
  if (token === 'mock-token-12345') {
    return { id: '12345', email: 'kirill.romanov@example.com' };
  } else if (token.startsWith('mock-token-')) {
    return { id: 'user_456', email: 'user@example.com' };
  }
  
  return null;
}

// Root endpoint
router.get('/', () => {
  return sendSuccess({
    name: 'Padel App Backend API (Cloudflare Workers)',
    version: '1.0.0',
    description: 'Mock backend server for Padel booking and community app',
    endpoints: {
      users: '/api/users',
      clubs: '/api/clubs',
      matches: '/api/matches',
      bookings: '/api/bookings',
      auth: '/api/auth'
    },
    status: 'running'
  }, 'Padel App Backend API is running');
});

// Health check
router.get('/api/health', () => {
  return sendSuccess({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: 'N/A in Workers',
    memory: 'N/A in Workers'
  }, 'Service is healthy');
});

// Authentication endpoints
router.post('/api/auth/login', async (request) => {
  try {
    const body = await request.json();
    const { email, password } = body;
    
    if (!email || !password) {
      return sendError('Email and password are required', 400);
    }
    
    const mockToken = email === 'kirill.romanov@example.com' ? 'mock-token-12345' : 'mock-token-generic';
    
    return sendSuccess({
      token: mockToken,
      user: {
        id: email === 'kirill.romanov@example.com' ? '12345' : 'user_456',
        email,
        name: email === 'kirill.romanov@example.com' ? 'Кирилл Романов' : 'Mock User'
      },
      expiresIn: '7d'
    }, 'Login successful');
  } catch (error) {
    return sendError('Login failed', 500, error);
  }
});

router.post('/api/auth/register', async (request) => {
  try {
    const body = await request.json();
    const { email, password, name, phone } = body;
    
    if (!email || !password || !name) {
      return sendError('Email, password, and name are required', 400);
    }
    
    const newUserId = `user_${Date.now()}`;
    const mockToken = `mock-token-${newUserId}`;
    
    return sendSuccess({
      token: mockToken,
      user: {
        id: newUserId,
        email,
        name,
        phone: phone || null
      },
      expiresIn: '7d'
    }, 'Registration successful', 201);
  } catch (error) {
    return sendError('Registration failed', 500, error);
  }
});

// User endpoints
router.get('/api/users/profile', async (request) => {
  const user = await authenticateToken(request);
  if (!user) {
    return sendError('Unauthorized', 401);
  }
  
  if (!cachedMockData) cachedMockData = createMockData('');
  const userProfile = cachedMockData.users.find(u => u.id === user.id) || cachedMockData.users[0];
  return sendSuccess(userProfile, 'User profile retrieved successfully');
});

router.get('/api/users/:userId', async (request) => {
  const { userId } = request.params;
  if (!cachedMockData) cachedMockData = createMockData('');
  const userProfile = cachedMockData.users.find(u => u.id === userId) || cachedMockData.users[0];
  return sendSuccess(userProfile, 'User profile retrieved successfully');
});

router.get('/api/users/:userId/profile', async (request) => {
  const { userId } = request.params;
  if (!cachedMockData) cachedMockData = createMockData('');
  const userProfile = cachedMockData.users.find(u => u.id === userId) || cachedMockData.users[0];
  return sendSuccess(userProfile, 'User profile retrieved successfully');
});

router.get('/api/users/:userId/stats', async (request) => {
  const { userId } = request.params;
  if (!cachedMockData) cachedMockData = createMockData('');
  const userStats = cachedMockData.generateUserStats(userId);
  return sendSuccess(userStats, 'User stats retrieved successfully');
});

router.get('/api/users/:userId/connections', async (request) => {
  const { userId } = request.params;
  
  // Mock connections data
  const connections = [
    {
      id: "user_789",
      name: "Мария Иванова",
      avatar: null,
      level: 6.8,
      matchesPlayed: 8
    },
    {
      id: "user_101",
      name: "Игорь Волков",
      avatar: `https://api.dicebear.com/9.x/avataaars/svg?seed=user_101`,
      level: 7.2,
      matchesPlayed: 12
    }
  ];
  
  return sendSuccess(connections, 'User connections retrieved successfully');
});

router.get('/api/users/:userId/clubs', async (request) => {
  const { userId } = request.params;
  
  // Return subset of clubs as user's clubs
  if (!cachedMockData) cachedMockData = createMockData('');
  const userClubs = cachedMockData.clubs.slice(0, 2);
  
  return sendSuccess(userClubs, 'User clubs retrieved successfully');
});

// Clubs endpoints
router.get('/api/clubs', async (request) => {
  const url = new URL(request.url);
  const city = url.searchParams.get('city');
  const search = url.searchParams.get('search');
  const limit = parseInt(url.searchParams.get('limit') || '10');
  const offset = parseInt(url.searchParams.get('offset') || '0');
  
  if (!cachedMockData) cachedMockData = createMockData('');
  let filteredClubs = [...cachedMockData.clubs];
  
  if (city) {
    filteredClubs = filteredClubs.filter(club => 
      club.city.toLowerCase() === city.toLowerCase()
    );
  }
  
  if (search) {
    const searchLower = search.toLowerCase();
    filteredClubs = filteredClubs.filter(club => 
      club.name.toLowerCase().includes(searchLower) ||
      club.city.toLowerCase().includes(searchLower)
    );
  }
  
  const paginatedClubs = filteredClubs.slice(offset, offset + limit);
  
  return sendSuccess({
    clubs: paginatedClubs,
    total: filteredClubs.length,
    hasMore: offset + limit < filteredClubs.length
  }, 'Clubs retrieved successfully');
});

router.get('/api/clubs/:clubId', async (request) => {
  const { clubId } = request.params;
  if (!cachedMockData) cachedMockData = createMockData('');
  const club = cachedMockData.clubs.find(c => c.id === clubId);
  
  if (!club) {
    return sendError('Club not found', 404);
  }
  
  return sendSuccess(club, 'Club details retrieved successfully');
});

// Club availability endpoint
router.get('/api/clubs/:clubId/availability', async (request) => {
  const { clubId } = request.params;
  const url = new URL(request.url);
  const date = url.searchParams.get('date');
  const sport = url.searchParams.get('sport') || 'padel';
  
  if (!cachedMockData) cachedMockData = createMockData('');
  const club = cachedMockData.clubs.find(c => c.id === clubId);
  if (!club) {
    return sendError('Club not found', 404);
  }
  
  if (!date) {
    return sendError('Date parameter is required', 400);
  }
  
  const timeSlots = cachedMockData.generateCourtAvailability(date, sport);
  
  return sendSuccess({
    date,
    sport,
    club: {
      id: club.id,
      name: club.name
    },
    timeSlots
  }, 'Club availability retrieved successfully');
});

// Matches endpoints
router.get('/api/matches/open', async (request) => {
  const url = new URL(request.url);
  const city = url.searchParams.get('city');
  const date = url.searchParams.get('date');
  const limit = parseInt(url.searchParams.get('limit') || '10');
  const offset = parseInt(url.searchParams.get('offset') || '0');
  
  if (!cachedMockData) cachedMockData = createMockData('');
  let filteredMatches = cachedMockData.matches.filter(match => match.status === 'open');
  
  if (city) {
    filteredMatches = filteredMatches.filter(match => 
      match.location.city.toLowerCase() === city.toLowerCase()
    );
  }
  
  if (date) {
    filteredMatches = filteredMatches.filter(match => 
      match.date.startsWith(date)
    );
  }
  
  const paginatedMatches = filteredMatches.slice(offset, offset + limit);
  
  return sendSuccess({
    matches: paginatedMatches,
    total: filteredMatches.length,
    hasMore: offset + limit < filteredMatches.length
  }, 'Open matches retrieved successfully');
});

router.post('/api/matches', async (request) => {
  const user = await authenticateToken(request);
  if (!user) {
    return sendError('Unauthorized', 401);
  }
  
  try {
    const body = await request.json();
    const { clubId, courtId, date, time, duration, maxPlayers, skillLevel, description } = body;
    
    if (!clubId || !courtId || !date || !time) {
      return sendError('Club, court, date and time are required', 400);
    }
    
    const newMatch = {
      id: `match_${Date.now()}`,
      clubId,
      courtId,
      date,
      time,
      duration: duration || 90,
      organizerId: user.id,
      players: [{
        id: user.id,
        name: user.name || 'Current User',
        avatar: `https://api.dicebear.com/9.x/avataaars/svg?seed=${user.id}`,
        skillLevel: 3.5
      }],
      maxPlayers: maxPlayers || 4,
      skillLevel: skillLevel || 'intermediate',
      description,
      status: 'open',
      price: 1500,
      createdAt: new Date().toISOString()
    };
    
    return sendSuccess(newMatch, 'Match created successfully', 201);
  } catch (error) {
    return sendError('Failed to create match', 500, error);
  }
});

// Get match details
router.get('/api/matches/:matchId', async (request) => {
  const { matchId } = request.params;
  if (!cachedMockData) cachedMockData = createMockData('');
  
  const match = cachedMockData.matches.find(m => m.id === matchId);
  
  if (!match) {
    return sendError('Match not found', 404);
  }
  
  return sendSuccess(match, 'Match details retrieved successfully');
});

// Bookings endpoints
router.get('/api/bookings', async (request) => {
  const user = await authenticateToken(request);
  if (!user) {
    return sendError('Unauthorized', 401);
  }
  
  if (!cachedMockData) cachedMockData = createMockData('');
  const userBookings = cachedMockData.bookings.filter(b => b.userId === user.id);
  return sendSuccess({
    bookings: userBookings,
    total: userBookings.length
  }, 'Bookings retrieved successfully');
});

// Community endpoints
router.get('/api/community/posts', async (request) => {
  const user = await authenticateToken(request);
  if (!user) {
    return sendError('Unauthorized', 401);
  }
  
  if (!cachedMockData) cachedMockData = createMockData('');
  
  const url = new URL(request.url);
  const type = url.searchParams.get('type');
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '10');
  
  // Create community posts data
  const posts = [
    {
      id: 'pavel_welcome',
      user: {
        id: 'pavel_kravtsov',
        name: 'Павел Кравцов',
        avatar: '/api/images-simple/generate?prompt=дружелюбный%20инструктор%20по%20паделу%20павел%20кравцов%20приветствие&width=100&height=100',
        verified: false
      },
      content: 'Готовы ли вы общаться с друзьями, делиться опытом и знакомиться с людьми со схожими спортивными интересами? Давайте начнем! 🎾',
      subtitle: 'Приветственное сообщение',
      likes: 0,
      comments: 0,
      timestamp: 'Приветственное сообщение',
      type: 'welcome'
    },
    {
      id: '1',
      user: {
        id: 'user_789',
        name: 'Алексей Галанов',
        avatar: '/api/images-simple/generate?prompt=профессиональный%20игрок%20в%20падел%20мужчина%20алексей%20галанов%20портрет&width=100&height=100',
        verified: true
      },
      content: 'Постепенно восстанавливаюсь наилучшим образом 🎾⚡️ #АлексейГаланов',
      image: '/api/images-simple/generate?prompt=корт%20для%20падела%20пара%20играет%20вместе%20счастливые%20закат&width=400&height=300',
      likes: 1012,
      comments: 23,
      timestamp: '13 апр, 2023',
      type: 'post'
    },
    {
      id: '2',
      user: {
        id: 'user_456',
        name: 'Марина Сидорова',
        avatar: '/api/images-simple/generate?prompt=профессиональная%20игрок%20в%20падел%20женщина%20марина%20портрет&width=100&height=100',
        verified: false
      },
      content: 'Отличная тренировка сегодня! Кто готов к матчу завтра утром? 💪',
      likes: 45,
      comments: 8,
      timestamp: '2 часа назад',
      type: 'post'
    },
    {
      id: '3',
      user: {
        id: 'user_321',
        name: 'Андрей Смирнов',
        avatar: '/api/images-simple/generate?prompt=professional%20padel%20player%20male%20russian%20headshot&width=100&height=100',
        verified: false
      },
      content: 'Новый корт в "Падел Центре" просто огонь! Рекомендую всем попробовать 🔥',
      image: '/api/images-simple/generate?prompt=современный%20корт%20для%20падела%20интерьер%20освещение&width=400&height=300',
      likes: 78,
      comments: 15,
      timestamp: '5 часов назад',
      type: 'post'
    }
  ];
  
  // Filter by type if specified
  const filteredPosts = type ? posts.filter(post => post.type === type) : posts;
  
  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);
  
  return sendSuccess({
    posts: paginatedPosts,
    currentPage: page,
    totalPages: Math.ceil(filteredPosts.length / limit),
    totalPosts: filteredPosts.length,
    hasMore: endIndex < filteredPosts.length
  }, 'Community posts retrieved successfully');
});

router.get('/api/community/suggestions', async (request) => {
  const user = await authenticateToken(request);
  if (!user) {
    return sendError('Unauthorized', 401);
  }
  
  const url = new URL(request.url);
  const limit = parseInt(url.searchParams.get('limit') || '4');
  
  const suggestions = [
    {
      id: "user_501",
      name: "Елена Васильева",
      avatar: '/api/images-simple/generate?prompt=профессиональная%20игрок%20в%20падел%20женщина%20елена%20портрет&width=100&height=100',
      verified: false,
      level: 8.1,
      mutualFriends: 5,
      location: "Москва",
      age: 29,
      matchesPlayed: 67,
      winRate: 73,
      preferredTime: "Вечер",
      playingStyle: "Атакующий"
    },
    {
      id: "user_502", 
      name: "Михаил Коваленко",
      avatar: '/api/images-simple/generate?prompt=спортивный%20мужчина%20падел%20игрок%20михаил%20портрет&width=100&height=100',
      verified: true,
      level: 7.9,
      mutualFriends: 3,
      location: "Москва",
      age: 34,
      matchesPlayed: 89,
      winRate: 71,
      preferredTime: "Утром",
      playingStyle: "Универсальный"
    },
    {
      id: "user_503",
      name: "Анастасия Лебедева", 
      avatar: '/api/images-simple/generate?prompt=молодая%20спортивная%20женщина%20падел%20анастасия%20портрет&width=100&height=100',
      verified: false,
      level: 6.7,
      mutualFriends: 2,
      location: "Москва",
      age: 26,
      matchesPlayed: 34,
      winRate: 68,
      preferredTime: "Днем",
      playingStyle: "Защитный"
    },
    {
      id: "user_504",
      name: "Сергей Морозов",
      avatar: '/api/images-simple/generate?prompt=опытный%20игрок%20в%20падел%20мужчина%20сергей%20портрет&width=100&height=100',
      verified: false,
      level: 8.3,
      mutualFriends: 4,
      location: "Москва", 
      age: 31,
      matchesPlayed: 112,
      winRate: 76,
      preferredTime: "Вечер",
      playingStyle: "Агрессивный"
    },
    {
      id: "user_505",
      name: "Ольга Федорова",
      avatar: '/api/images-simple/generate?prompt=профессиональная%20падел%20игрок%20ольга%20женщина%20портрет&width=100&height=100',
      verified: true,
      level: 7.6,
      mutualFriends: 6,
      location: "Москва",
      age: 28,
      matchesPlayed: 78,
      winRate: 69,
      preferredTime: "Утром",
      playingStyle: "Тактический"
    },
    {
      id: "user_506", 
      name: "Владимир Петров",
      avatar: '/api/images-simple/generate?prompt=зрелый%20игрок%20в%20падел%20владимир%20мужчина%20портрет&width=100&height=100',
      verified: false,
      level: 6.9,
      mutualFriends: 1,
      location: "Москва",
      age: 42,
      matchesPlayed: 56,
      winRate: 64,
      preferredTime: "Днем",
      playingStyle: "Стабильный"
    },
    {
      id: "user_507",
      name: "Татьяна Белова",
      avatar: '/api/images-simple/generate?prompt=активная%20женщина%20падел%20игрок%20татьяна%20портрет&width=100&height=100',
      verified: false,
      level: 7.2,
      mutualFriends: 3,
      location: "Москва",
      age: 35,
      matchesPlayed: 41,
      winRate: 72,
      preferredTime: "Вечер",
      playingStyle: "Контр-атакующий"
    },
    {
      id: "user_508",
      name: "Александр Новиков",
      avatar: '/api/images-simple/generate?prompt=молодой%20падел%20игрок%20александр%20мужчина%20портрет&width=100&height=100',
      verified: false,
      level: 6.5,
      mutualFriends: 2,
      location: "Москва",
      age: 24,
      matchesPlayed: 28,
      winRate: 61,
      preferredTime: "Утром",
      playingStyle: "Развивающийся"
    },
    {
      id: "user_509",
      name: "Ирина Козлова",
      avatar: '/api/images-simple/generate?prompt=элегантная%20женщина%20падел%20ирина%20игрок%20портрет&width=100&height=100',
      verified: true,
      level: 8.0,
      mutualFriends: 7,
      location: "Москва",
      age: 30,
      matchesPlayed: 95,
      winRate: 74,
      preferredTime: "Днем",
      playingStyle: "Точный"
    },
    {
      id: "user_510",
      name: "Роман Сидоров", 
      avatar: '/api/images-simple/generate?prompt=сильный%20падел%20игрок%20роман%20мужчина%20портрет&width=100&height=100',
      verified: false,
      level: 7.4,
      mutualFriends: 4,
      location: "Москва",
      age: 27,
      matchesPlayed: 63,
      winRate: 67,
      preferredTime: "Вечер",
      playingStyle: "Мощный"
    }
  ];
  
  const limitedSuggestions = suggestions.slice(0, limit);
  return sendSuccess(limitedSuggestions, 'User suggestions retrieved successfully');
});

router.post('/api/community/posts/:postId/like', async (request) => {
  const user = await authenticateToken(request);
  if (!user) {
    return sendError('Unauthorized', 401);
  }
  
  const { postId } = request.params;
  
  return sendSuccess({
    liked: true,
    newLikeCount: Math.floor(Math.random() * 100) + 1
  }, 'Post liked successfully');
});

router.post('/api/community/users/:userId/follow', async (request) => {
  const user = await authenticateToken(request);
  if (!user) {
    return sendError('Unauthorized', 401);
  }
  
  const { userId } = request.params;
  
  if (userId === user.id) {
    return sendError('Cannot follow yourself', 400);
  }
  
  return sendSuccess({
    following: true,
    message: 'Successfully followed user'
  }, 'User followed successfully');
});

router.get('/api/community/search', async (request) => {
  const user = await authenticateToken(request);
  if (!user) {
    return sendError('Unauthorized', 401);
  }
  
  const url = new URL(request.url);
  const query = url.searchParams.get('q');
  
  if (!query) {
    return sendError('Search query is required', 400);
  }
  
  // Simple mock search results
  const searchLower = query.toLowerCase();
  
  const matchingPosts = [
    {
      id: '1',
      user: { name: 'Алексей Галанов' },
      content: 'Постепенно восстанавливаюсь наилучшим образом 🎾⚡️'
    }
  ].filter(post => 
    post.content.toLowerCase().includes(searchLower) ||
    post.user.name.toLowerCase().includes(searchLower)
  );
  
  const matchingUsers = [
    { id: 'user_456', name: 'Алексей Галанов' },
    { id: 'user_321', name: 'Андрей Смирнов' }
  ].filter(user => user.name.toLowerCase().includes(searchLower));
  
  return sendSuccess({
    posts: matchingPosts,
    users: matchingUsers,
    query: query
  }, 'Search completed successfully');
});

// Static images endpoint
router.get('/api/static-images/:imageName', async (request) => {
  const { imageName } = request.params;
  
  // In Cloudflare Workers, we'll return URLs to images hosted elsewhere
  // For demo purposes, returning placeholder images
  const imageUrl = `https://placehold.co/800x600/4f46e5/ffffff?text=${imageName}`;
  
  return new Response(null, {
    status: 302,
    headers: {
      'Location': imageUrl,
      ...corsHeaders
    }
  });
});

// Static images endpoint with category (for backward compatibility)
router.get('/api/static-images/:category/:imageName', async (request) => {
  const { category, imageName } = request.params;
  
  // In Cloudflare Workers, we'll return URLs to images hosted elsewhere
  // For demo purposes, returning placeholder images
  const imageUrl = `https://placehold.co/800x600/4f46e5/ffffff?text=${category}+${imageName}`;
  
  return new Response(null, {
    status: 302,
    headers: {
      'Location': imageUrl,
      ...corsHeaders
    }
  });
});

// In-memory cache for generated images (simple cache for Workers)
const imageCache = new Map();

// AI Image generation endpoint with caching
router.get('/api/images-simple/generate', async (request) => {
  try {
    const url = new URL(request.url);
    const prompt = url.searchParams.get('prompt');
    let width = parseInt(url.searchParams.get('width') || '512');
    let height = parseInt(url.searchParams.get('height') || '512');
    
    if (!prompt) {
      return sendError('Missing required parameter: prompt', 400);
    }

    // Validate and adjust dimensions for Runware API requirements
    width = Math.max(128, Math.ceil(width / 64) * 64);
    height = Math.max(128, Math.ceil(height / 64) * 64);
    width = Math.min(2048, width);
    height = Math.min(2048, height);

    // Create cache key based on prompt and parameters
    const encoder = new TextEncoder();
    const data = encoder.encode(`${prompt}_${width}_${height}`);
    const hashBuffer = await crypto.subtle.digest('MD5', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const cacheKey = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    // Check cache first
    if (imageCache.has(cacheKey)) {
      const cached = imageCache.get(cacheKey);
      console.log(`🎯 Cache hit for prompt: "${prompt}"`);
      
      return new Response(null, {
        status: 302,
        headers: {
          'Location': cached.imageUrl,
          'Cache-Control': 'public, max-age=31536000',
          'X-Cache-Hit': 'true',
          'X-Generated-For': prompt,
          'X-Dimensions': `${width}x${height}`,
          'X-AI-Generated': 'true',
          ...corsHeaders
        }
      });
    }

    console.log(`🎨 AI generating image for prompt: "${prompt}"`);

    // For now, let's add detailed logging and fallback to placeholder
    console.log(`🔍 Attempting to generate image with Runware API...`);
    
    let imageUrl = null;
    try {
      // Use Runware WebSocket API (same as SDK)
      const runwarePayload = {
        taskType: "imageInference",
        taskUUID: crypto.randomUUID(),
        positivePrompt: prompt,
        width: width,
        height: height,
        model: "runware:100@1",
        numberResults: 1,
        steps: 20,
        CFGScale: 7,
        seed: Math.floor(Math.random() * 1000000)
      };

      console.log(`📤 Sending payload to Runware:`, JSON.stringify(runwarePayload));

      // For Workers, use direct HTTP API call to Runware
      const runwareResponse = await fetch('https://api.runware.ai/v1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${request.env?.RUNWARE_API_TOKEN || 'GoLffJyXPnoNv6u9eHOdwlKSALzQywfP'}`
        },
        body: JSON.stringify([runwarePayload])
      });

      console.log(`📡 Runware response status: ${runwareResponse.status}`);

      if (!runwareResponse.ok) {
        const errorText = await runwareResponse.text();
        console.error('Runware API error:', runwareResponse.status, errorText);
        throw new Error(`Runware API failed with status ${runwareResponse.status}: ${errorText}`);
      }

      const runwareData = await runwareResponse.json();
      console.log(`📥 Runware response data:`, JSON.stringify(runwareData));
      
      // Handle different possible response structures
      
      if (runwareData && runwareData.data && Array.isArray(runwareData.data) && runwareData.data.length > 0) {
        // Runware API returns data in a 'data' array
        const firstResult = runwareData.data[0];
        imageUrl = firstResult.imageURL || firstResult.outputURL || firstResult.image_url;
      } else if (runwareData && Array.isArray(runwareData) && runwareData.length > 0) {
        // Array response
        const firstResult = runwareData[0];
        imageUrl = firstResult.imageURL || firstResult.outputURL || firstResult.image_url;
      } else if (runwareData && runwareData.imageURL) {
        // Direct object response
        imageUrl = runwareData.imageURL;
      } else if (runwareData && runwareData.images && runwareData.images.length > 0) {
        // Nested images array
        imageUrl = runwareData.images[0].imageURL || runwareData.images[0].url;
      }
      
      if (!imageUrl) {
        console.error('❌ No imageURL found in response:', JSON.stringify(runwareData));
        throw new Error('No imageURL found in Runware response');
      }

      console.log(`✅ Image URL extracted: ${imageUrl}`);

    } catch (runwareError) {
      console.error('❌ Runware generation failed:', runwareError.message);
      throw runwareError;
    }
    console.log(`✅ Image generated: ${imageUrl}`);

    // Cache the result (simple in-memory cache, limited to prevent memory issues)
    if (imageCache.size < 100) {  // Limit cache size
      imageCache.set(cacheKey, {
        imageUrl,
        prompt,
        width,
        height,
        generatedAt: new Date().toISOString()
      });
    }

    // Return redirect to the generated image
    return new Response(null, {
      status: 302,
      headers: {
        'Location': imageUrl,
        'Cache-Control': 'public, max-age=31536000',
        'X-Cache-Hit': 'false',
        'X-Generated-For': prompt,
        'X-Dimensions': `${width}x${height}`,
        'X-AI-Generated': 'true',
        'X-Cache-Key': cacheKey,
        ...corsHeaders
      }
    });

  } catch (error) {
    console.error('❌ AI generation error:', error);
    return sendError('AI image generation failed', 500, error);
  }
});

// Handle OPTIONS for CORS
router.options('*', () => {
  return new Response(null, {
    status: 200,
    headers: corsHeaders
  });
});

// 404 handler
router.all('*', () => {
  return sendError('Route not found', 404);
});

// Export for Cloudflare Workers
export default {
  fetch: router.fetch
};