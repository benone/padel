const express = require('express');
const { BASE_URL } = require('../config/api.config.js');
const router = express.Router();
const { clubs, generateCourtAvailability } = require('../data/mockData');
const { sendSuccess, sendError, simulateDelay } = require('../utils/responseHelper');

// Search clubs
router.get('/search', async (req, res) => {
  try {
    await simulateDelay();
    
    const { lat, lng, radius = 10, sport = 'padel', limit = 20, offset = 0 } = req.query;
    
    // Mock filtering logic
    let filteredClubs = clubs.filter(club => {
      // Filter by sport if specified
      if (sport && sport !== 'all') {
        return club.sports.some(s => 
          s.name.toLowerCase().includes(sport.toLowerCase()) ||
          (sport.toLowerCase() === 'padel' && s.name === 'Падел')
        );
      }
      return true;
    });
    
    // If coordinates provided, add distance calculation (mock)
    if (lat && lng) {
      filteredClubs = filteredClubs.map(club => ({
        ...club,
        distance: Math.round((Math.random() * 15 + 1) * 10) / 10 // Mock distance 1-15 km
      })).sort((a, b) => a.distance - b.distance);
    }
    
    // Apply pagination
    const total = filteredClubs.length;
    const paginatedClubs = filteredClubs.slice(parseInt(offset), parseInt(offset) + parseInt(limit));
    
    // Simplified club data for search results
    const simplifiedClubs = paginatedClubs.map(club => ({
      id: club.id,
      name: club.name,
      address: club.address.street + ', ' + club.address.city,
      distance: club.distance,
      rating: club.rating,
      priceRange: `${Math.min(...club.sports.map(s => s.pricePerHour))}-${Math.max(...club.sports.map(s => s.pricePerHour))}`,
      courts: club.sports.find(s => s.name === 'Падел')?.courts || 0,
      amenities: Object.keys(club.amenities).filter(key => club.amenities[key] === true)
    }));
    
    sendSuccess(res, {
      clubs: simplifiedClubs,
      total,
      hasMore: parseInt(offset) + parseInt(limit) < total,
      filters: {
        sport,
        radius: parseInt(radius),
        location: lat && lng ? { lat: parseFloat(lat), lng: parseFloat(lng) } : null
      }
    }, 'Clubs retrieved successfully');
  } catch (error) {
    sendError(res, 'Failed to search clubs', 500, error);
  }
});

// Get club details
router.get('/:clubId', async (req, res) => {
  try {
    await simulateDelay();
    
    const { clubId } = req.params;
    const club = clubs.find(c => c.id === clubId);
    
    if (!club) {
      return sendError(res, 'Club not found', 404);
    }
    
    sendSuccess(res, club, 'Club details retrieved successfully');
  } catch (error) {
    sendError(res, 'Failed to retrieve club details', 500, error);
  }
});

// Get club availability
router.get('/:clubId/availability', async (req, res) => {
  try {
    await simulateDelay();
    
    const { clubId } = req.params;
    const { date, sport = 'padel' } = req.query;
    
    const club = clubs.find(c => c.id === clubId);
    if (!club) {
      return sendError(res, 'Club not found', 404);
    }
    
    if (!date) {
      return sendError(res, 'Date parameter is required', 400);
    }
    
    const timeSlots = generateCourtAvailability(date, sport);
    
    sendSuccess(res, {
      date,
      sport,
      club: {
        id: club.id,
        name: club.name
      },
      timeSlots
    }, 'Club availability retrieved successfully');
  } catch (error) {
    sendError(res, 'Failed to retrieve club availability', 500, error);
  }
});

// Get club contact information
router.get('/:clubId/contact', async (req, res) => {
  try {
    await simulateDelay();
    
    const { clubId } = req.params;
    const club = clubs.find(c => c.id === clubId);
    
    if (!club) {
      return sendError(res, 'Club not found', 404);
    }
    
    sendSuccess(res, {
      contact: club.contact,
      address: club.address,
      workingHours: club.workingHours
    }, 'Club contact information retrieved successfully');
  } catch (error) {
    sendError(res, 'Failed to retrieve club contact information', 500, error);
  }
});

// Get club reviews
router.get('/:clubId/reviews', async (req, res) => {
  try {
    await simulateDelay();
    
    const { clubId } = req.params;
    const { limit = 10, offset = 0 } = req.query;
    
    const club = clubs.find(c => c.id === clubId);
    if (!club) {
      return sendError(res, 'Club not found', 404);
    }
    
    // Mock reviews data
    const mockReviews = [
      {
        id: 'review_1',
        user: {
          id: 'user_456',
          name: 'Алексей П.',
          avatar: '${BASE_URL}/api/images-simple/generate?prompt=professional%20padel%20player%20male%20reviewer%20headshot%20portrait&width=50&height=50'
        },
        rating: 5,
        comment: 'Отличный клуб! Корты в прекрасном состоянии, персонал дружелюбный.',
        date: '2024-01-15T14:30:00Z',
        helpful: 12
      },
      {
        id: 'review_2',
        user: {
          id: 'user_789',
          name: 'Мария И.',
          avatar: '${BASE_URL}/api/images-simple/generate?prompt=professional%20female%20padel%20player%20reviewer%20headshot%20portrait&width=50&height=50'
        },
        rating: 4,
        comment: 'Хорошие корты, но парковка иногда переполнена в выходные.',
        date: '2024-01-10T19:15:00Z',
        helpful: 8
      }
    ];
    
    const paginatedReviews = mockReviews.slice(parseInt(offset), parseInt(offset) + parseInt(limit));
    
    sendSuccess(res, {
      reviews: paginatedReviews,
      total: mockReviews.length,
      rating: club.rating,
      reviewCount: club.reviewCount,
      hasMore: parseInt(offset) + parseInt(limit) < mockReviews.length
    }, 'Club reviews retrieved successfully');
  } catch (error) {
    sendError(res, 'Failed to retrieve club reviews', 500, error);
  }
});

// Get nearby clubs
router.get('/', async (req, res) => {
  try {
    await simulateDelay();
    
    const { lat, lng, limit = 10 } = req.query;
    
    let result = [...clubs];
    
    // If coordinates provided, calculate distances and sort
    if (lat && lng) {
      result = result.map(club => ({
        ...club,
        distance: Math.round((Math.random() * 20 + 1) * 10) / 10
      })).sort((a, b) => a.distance - b.distance);
    }
    
    // Limit results
    result = result.slice(0, parseInt(limit));
    
    sendSuccess(res, result, 'Clubs retrieved successfully');
  } catch (error) {
    sendError(res, 'Failed to retrieve clubs', 500, error);
  }
});

// Add club to favorites
router.post('/:clubId/favorite', async (req, res) => {
  try {
    await simulateDelay();
    
    const { clubId } = req.params;
    const club = clubs.find(c => c.id === clubId);
    
    if (!club) {
      return sendError(res, 'Club not found', 404);
    }
    
    // Mock adding to favorites
    sendSuccess(res, {
      clubId,
      favorited: true,
      message: 'Club added to favorites'
    }, 'Club favorited successfully');
  } catch (error) {
    sendError(res, 'Failed to favorite club', 500, error);
  }
});

// Remove club from favorites
router.delete('/:clubId/favorite', async (req, res) => {
  try {
    await simulateDelay();
    
    const { clubId } = req.params;
    const club = clubs.find(c => c.id === clubId);
    
    if (!club) {
      return sendError(res, 'Club not found', 404);
    }
    
    // Mock removing from favorites
    sendSuccess(res, {
      clubId,
      favorited: false,
      message: 'Club removed from favorites'
    }, 'Club unfavorited successfully');
  } catch (error) {
    sendError(res, 'Failed to unfavorite club', 500, error);
  }
});

module.exports = router;