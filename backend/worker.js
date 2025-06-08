// Cloudflare Worker entry point
import { Router } from 'itty-router';
import { mockData } from './data/mockData';

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
  
  const userProfile = mockData.users.find(u => u.id === user.id) || mockData.users[0];
  return sendSuccess(userProfile, 'User profile retrieved successfully');
});

router.get('/api/users/:userId', async (request) => {
  const { userId } = request.params;
  const userProfile = mockData.users.find(u => u.id === userId) || mockData.users[0];
  return sendSuccess(userProfile, 'User profile retrieved successfully');
});

router.get('/api/users/:userId/stats', async (request) => {
  const { userId } = request.params;
  const userStats = mockData.userStats.find(s => s.userId === userId) || mockData.userStats[0];
  return sendSuccess(userStats, 'User stats retrieved successfully');
});

// Clubs endpoints
router.get('/api/clubs', async (request) => {
  const url = new URL(request.url);
  const city = url.searchParams.get('city');
  const search = url.searchParams.get('search');
  const limit = parseInt(url.searchParams.get('limit') || '10');
  const offset = parseInt(url.searchParams.get('offset') || '0');
  
  let filteredClubs = [...mockData.clubs];
  
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
  const club = mockData.clubs.find(c => c.id === clubId);
  
  if (!club) {
    return sendError('Club not found', 404);
  }
  
  return sendSuccess(club, 'Club details retrieved successfully');
});

// Matches endpoints
router.get('/api/matches/open', async (request) => {
  const url = new URL(request.url);
  const city = url.searchParams.get('city');
  const date = url.searchParams.get('date');
  const limit = parseInt(url.searchParams.get('limit') || '10');
  const offset = parseInt(url.searchParams.get('offset') || '0');
  
  let filteredMatches = mockData.matches.filter(match => match.status === 'open');
  
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

// Bookings endpoints
router.get('/api/bookings', async (request) => {
  const user = await authenticateToken(request);
  if (!user) {
    return sendError('Unauthorized', 401);
  }
  
  const userBookings = mockData.bookings.filter(b => b.userId === user.id);
  return sendSuccess({
    bookings: userBookings,
    total: userBookings.length
  }, 'Bookings retrieved successfully');
});

// Static images endpoint
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