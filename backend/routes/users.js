const express = require('express');
const { BASE_URL } = require('../config/api.config.js');
const router = express.Router();
const { users, generateMatchHistory, generateUserStats } = require('../data/mockData');
const { authenticateToken } = require('../middleware/auth');
const { sendSuccess, sendError, simulateDelay } = require('../utils/responseHelper');

// Get user profile
router.get('/:userId/profile', async (req, res) => {
  try {
    await simulateDelay();
    
    const { userId } = req.params;
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      return sendError(res, 'User not found', 404);
    }
    
    sendSuccess(res, user, 'User profile retrieved successfully');
  } catch (error) {
    sendError(res, 'Failed to retrieve user profile', 500, error);
  }
});

// Update user profile
router.put('/:userId/profile', authenticateToken, async (req, res) => {
  try {
    await simulateDelay();
    
    const { userId } = req.params;
    const updates = req.body;
    
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return sendError(res, 'User not found', 404);
    }
    
    // Simulate profile update
    const updatedUser = { 
      ...users[userIndex], 
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    users[userIndex] = updatedUser;
    
    sendSuccess(res, updatedUser, 'Profile updated successfully');
  } catch (error) {
    sendError(res, 'Failed to update profile', 500, error);
  }
});

// Get user match history
router.get('/:userId/matches', async (req, res) => {
  try {
    await simulateDelay();
    
    const { userId } = req.params;
    const { limit = 10, offset = 0 } = req.query;
    
    const user = users.find(u => u.id === userId);
    if (!user) {
      return sendError(res, 'User not found', 404);
    }
    
    const matches = generateMatchHistory(userId, parseInt(limit));
    const paginatedMatches = matches.slice(parseInt(offset), parseInt(offset) + parseInt(limit));
    
    sendSuccess(res, {
      matches: paginatedMatches,
      total: matches.length,
      hasMore: parseInt(offset) + parseInt(limit) < matches.length
    }, 'Match history retrieved successfully');
  } catch (error) {
    sendError(res, 'Failed to retrieve match history', 500, error);
  }
});

// Get user statistics
router.get('/:userId/stats', async (req, res) => {
  try {
    await simulateDelay();
    
    const { userId } = req.params;
    const { period = '6months' } = req.query;
    
    const user = users.find(u => u.id === userId);
    if (!user) {
      return sendError(res, 'User not found', 404);
    }
    
    const stats = generateUserStats(userId, period);
    
    sendSuccess(res, stats, 'User statistics retrieved successfully');
  } catch (error) {
    sendError(res, 'Failed to retrieve user statistics', 500, error);
  }
});

// Get user preferences
router.get('/:userId/preferences', async (req, res) => {
  try {
    await simulateDelay();
    
    const { userId } = req.params;
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      return sendError(res, 'User not found', 404);
    }
    
    sendSuccess(res, user.preferences, 'User preferences retrieved successfully');
  } catch (error) {
    sendError(res, 'Failed to retrieve user preferences', 500, error);
  }
});

// Update user preferences
router.put('/:userId/preferences', authenticateToken, async (req, res) => {
  try {
    await simulateDelay();
    
    const { userId } = req.params;
    const preferences = req.body;
    
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return sendError(res, 'User not found', 404);
    }
    
    users[userIndex].preferences = { ...users[userIndex].preferences, ...preferences };
    
    sendSuccess(res, users[userIndex].preferences, 'Preferences updated successfully');
  } catch (error) {
    sendError(res, 'Failed to update preferences', 500, error);
  }
});

// Get user connections (frequent partners)
router.get('/:userId/connections', async (req, res) => {
  try {
    await simulateDelay();
    
    const { userId } = req.params;
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      return sendError(res, 'User not found', 404);
    }
    
    // Return mock frequent partners
    const connections = [
      {
        id: "user_456",
        name: "Алексей Петров",
        avatar: "${BASE_URL}/api/images-simple/generate?prompt=professional%20padel%20player%20male%20connection%20headshot%20portrait&width=50&height=50",
        level: 7.2,
        matchesPlayed: 12,
        winRate: 75,
        lastPlayed: "2024-01-10T18:00:00Z"
      },
      {
        id: "user_789",
        name: "Мария Иванова",
        avatar: "${BASE_URL}/api/images-simple/generate?prompt=professional%20female%20padel%20player%20connection%20headshot%20portrait&width=50&height=50",
        level: 6.8,
        matchesPlayed: 8,
        winRate: 62,
        lastPlayed: "2024-01-05T19:30:00Z"
      }
    ];
    
    sendSuccess(res, connections, 'User connections retrieved successfully');
  } catch (error) {
    sendError(res, 'Failed to retrieve user connections', 500, error);
  }
});

// Get user club memberships
router.get('/:userId/clubs', async (req, res) => {
  try {
    await simulateDelay();
    
    const { userId } = req.params;
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      return sendError(res, 'User not found', 404);
    }
    
    // Return mock club memberships
    const clubs = [
      {
        id: "club_123",
        name: "Сеть падел клубов «Padel Star»",
        membershipType: "Premium",
        joinDate: "2023-06-15",
        status: "active"
      }
    ];
    
    sendSuccess(res, clubs, 'User clubs retrieved successfully');
  } catch (error) {
    sendError(res, 'Failed to retrieve user clubs', 500, error);
  }
});

// Get user bookings
router.get('/:userId/bookings', authenticateToken, async (req, res) => {
  try {
    await simulateDelay();
    
    const { userId } = req.params;
    const { status = 'all' } = req.query;
    
    const user = users.find(u => u.id === userId);
    if (!user) {
      return sendError(res, 'User not found', 404);
    }
    
    // Mock bookings data
    let bookings = [
      {
        id: "booking_123",
        confirmationCode: "PB240120001",
        status: "confirmed",
        club: {
          id: "club_123",
          name: "Сеть падел клубов «Padel Star»",
          address: "ул. Дачная, 25, п. Нагорный"
        },
        court: {
          id: "court_2",
          name: "Корт 2"
        },
        date: "2024-01-20",
        time: "18:00",
        duration: 90,
        sport: "Падел",
        totalPrice: 3000,
        createdAt: "2024-01-19T15:30:00Z"
      },
      {
        id: "booking_124",
        confirmationCode: "PB240125002",
        status: "upcoming",
        club: {
          id: "club_123",
          name: "Сеть падел клубов «Padel Star»",
          address: "ул. Дачная, 25, п. Нагорный"
        },
        court: {
          id: "court_1",
          name: "Корт 1"
        },
        date: "2024-01-25",
        time: "19:30",
        duration: 90,
        sport: "Падел",
        totalPrice: 3500,
        createdAt: "2024-01-20T10:15:00Z"
      }
    ];
    
    if (status !== 'all') {
      bookings = bookings.filter(booking => booking.status === status);
    }
    
    sendSuccess(res, {
      bookings,
      total: bookings.length
    }, 'User bookings retrieved successfully');
  } catch (error) {
    sendError(res, 'Failed to retrieve user bookings', 500, error);
  }
});

module.exports = router;