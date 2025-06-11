const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const { sports, timeSlots } = require('../data/mockData');
const { sendSuccess, sendError, simulateDelay } = require('../utils/responseHelper');

// Get available sports
router.get('/sports', async (req, res) => {
  try {
    await simulateDelay();
    
    sendSuccess(res, { sports }, 'Sports retrieved successfully');
  } catch (error) {
    sendError(res, 'Failed to retrieve sports', 500, error);
  }
});

// Get time slots
router.get('/time-slots', async (req, res) => {
  try {
    await simulateDelay();
    
    const { date, duration = 90 } = req.query;
    
    // Filter time slots by duration if needed
    let filteredTimeSlots = timeSlots;
    if (duration) {
      filteredTimeSlots = timeSlots.filter(slot => slot.duration === parseInt(duration));
    }
    
    sendSuccess(res, {
      timeSlots: filteredTimeSlots,
      date: date || new Date().toISOString().split('T')[0],
      duration: parseInt(duration)
    }, 'Time slots retrieved successfully');
  } catch (error) {
    sendError(res, 'Failed to retrieve time slots', 500, error);
  }
});

// Get app configuration
router.get('/config', async (req, res) => {
  try {
    await simulateDelay();
    
    const config = {
      supportedSports: ['padel', 'tennis', 'badminton'],
      defaultDuration: 90,
      bookingAdvanceLimit: 30, // days
      cancellationWindow: 24, // hours
      modificationWindow: 4, // hours
      paymentMethods: ['card', 'cash', 'bank_transfer'],
      currencies: ['RUB'],
      languages: ['ru', 'en'],
      features: {
        matchmaking: true,
        socialFeatures: true,
        reviews: true,
        favorites: true,
        notifications: true
      },
      policies: {
        cancellation: 'Отмена возможна за 24 часа до начала игры',
        modification: 'Изменение бронирования возможно за 4 часа до начала',
        noShow: 'При неявке взимается 50% стоимости бронирования'
      }
    };
    
    sendSuccess(res, config, 'App configuration retrieved successfully');
  } catch (error) {
    sendError(res, 'Failed to retrieve app configuration', 500, error);
  }
});

// Health check endpoint
router.get('/health', async (req, res) => {
  try {
    const health = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: 'development',
      services: {
        database: 'connected',
        cache: 'connected',
        storage: 'connected'
      }
    };
    
    res.status(200).json(health);
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

// Get popular venues/clubs
router.get('/popular-venues', async (req, res) => {
  try {
    await simulateDelay();
    
    const { lat, lng, limit = 5 } = req.query;
    
    // Mock popular venues based on rating and activity
    const popularVenues = [
      {
        id: 'club_123',
        name: 'Сеть падел клубов «Padel Star»',
        rating: 4.8,
        bookingsThisWeek: 127,
        distance: lat && lng ? 2.3 : null,
        sports: ['Падел', 'Теннис'],
        priceRange: '2500-3000'
      },
      {
        id: 'club_456',
        name: 'Спорт Арена',
        rating: 4.5,
        bookingsThisWeek: 89,
        distance: lat && lng ? 4.7 : null,
        sports: ['Падел'],
        priceRange: '2200-2800'
      }
    ];
    
    const limitedVenues = popularVenues.slice(0, parseInt(limit));
    
    sendSuccess(res, { venues: limitedVenues }, 'Popular venues retrieved successfully');
  } catch (error) {
    sendError(res, 'Failed to retrieve popular venues', 500, error);
  }
});

// Get trending matches
router.get('/trending-matches', async (req, res) => {
  try {
    await simulateDelay();
    
    const { sport, limit = 10 } = req.query;
    
    // Mock trending matches
    const trendingMatches = [
      {
        id: 'match_trending_1',
        sport: 'Падел',
        date: '2024-01-22T19:00:00Z',
        level: 'Продвинутый',
        playersNeeded: 1,
        totalPlayers: 4,
        competitive: true,
        club: {
          name: 'Теннисный клуб Олимп',
          distance: 2.3
        },
        views: 47,
        interested: 12
      },
      {
        id: 'match_trending_2',
        sport: 'Падел',
        date: '2024-01-21T18:30:00Z',
        level: 'Средний',
        playersNeeded: 2,
        totalPlayers: 4,
        competitive: false,
        club: {
          name: 'Спорт Арена',
          distance: 4.7
        },
        views: 32,
        interested: 8
      }
    ];
    
    let filteredMatches = trendingMatches;
    if (sport) {
      filteredMatches = trendingMatches.filter(match => 
        match.sport.toLowerCase().includes(sport.toLowerCase())
      );
    }
    
    const limitedMatches = filteredMatches.slice(0, parseInt(limit));
    
    sendSuccess(res, { matches: limitedMatches }, 'Trending matches retrieved successfully');
  } catch (error) {
    sendError(res, 'Failed to retrieve trending matches', 500, error);
  }
});

// Search suggestions
router.get('/search-suggestions', async (req, res) => {
  try {
    await simulateDelay();
    
    const { query, type = 'all' } = req.query;
    
    if (!query || query.length < 2) {
      return sendSuccess(res, { suggestions: [] }, 'Minimum 2 characters required');
    }
    
    const suggestions = [];
    
    if (type === 'all' || type === 'clubs') {
      suggestions.push(
        { type: 'club', id: 'club_123', name: 'Сеть падел клубов «Padel Star»', address: 'ул. Дачная, 25, п. Нагорный' },
        { type: 'club', id: 'club_456', name: 'Спорт Арена', address: 'пр. Победы, 42' }
      );
    }
    
    if (type === 'all' || type === 'sports') {
      suggestions.push(
        { type: 'sport', id: 'padel', name: 'Падел' },
        { type: 'sport', id: 'tennis', name: 'Теннис' }
      );
    }
    
    if (type === 'all' || type === 'locations') {
      suggestions.push(
        { type: 'location', name: 'Центральный район' },
        { type: 'location', name: 'Северный район' }
      );
    }
    
    // Filter suggestions based on query
    const filteredSuggestions = suggestions.filter(item =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );
    
    sendSuccess(res, { 
      suggestions: filteredSuggestions.slice(0, 10),
      query 
    }, 'Search suggestions retrieved successfully');
  } catch (error) {
    sendError(res, 'Failed to retrieve search suggestions', 500, error);
  }
});

// Clear image cache directory
router.post('/clear-cache', async (req, res) => {
  try {
    const cacheDir = path.join(__dirname, '..', 'cache');
    const blobsDir = path.join(cacheDir, 'blobs');
    const imagesDir = path.join(cacheDir, 'images');
    
    let deletedFiles = 0;
    let errors = [];
    
    // Clear blobs cache
    if (fs.existsSync(blobsDir)) {
      const blobFiles = fs.readdirSync(blobsDir);
      for (const file of blobFiles) {
        if (file !== '.gitkeep') {
          try {
            fs.unlinkSync(path.join(blobsDir, file));
            deletedFiles++;
          } catch (err) {
            errors.push(`Failed to delete blob file ${file}: ${err.message}`);
          }
        }
      }
    }
    
    // Clear images cache
    if (fs.existsSync(imagesDir)) {
      const imageFiles = fs.readdirSync(imagesDir);
      for (const file of imageFiles) {
        if (file !== '.gitkeep') {
          try {
            fs.unlinkSync(path.join(imagesDir, file));
            deletedFiles++;
          } catch (err) {
            errors.push(`Failed to delete image file ${file}: ${err.message}`);
          }
        }
      }
    }
    
    console.log(`🗑️ Cache cleared: ${deletedFiles} files deleted`);
    
    if (errors.length > 0) {
      sendSuccess(res, { 
        deletedFiles, 
        errors,
        message: `Cache partially cleared: ${deletedFiles} files deleted with ${errors.length} errors` 
      }, 'Cache partially cleared');
    } else {
      sendSuccess(res, { 
        deletedFiles,
        message: `Cache cleared successfully: ${deletedFiles} files deleted`
      }, 'Cache cleared successfully');
    }
  } catch (error) {
    console.error('Cache clearing error:', error);
    sendError(res, 'Failed to clear cache', 500, error);
  }
});

module.exports = router;