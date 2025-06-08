const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { matches, clubs, users } = require('../data/mockData');
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const { sendSuccess, sendError, simulateDelay } = require('../utils/responseHelper');

// Get open matches
router.get('/open', optionalAuth, async (req, res) => {
  try {
    await simulateDelay();
    
    const { lat, lng, sport = 'padel', date, level, limit = 20, offset = 0 } = req.query;
    
    let filteredMatches = [...matches];
    
    // Filter by sport
    if (sport && sport !== 'all') {
      filteredMatches = filteredMatches.filter(match => 
        match.sport.toLowerCase().includes(sport.toLowerCase()) ||
        (sport.toLowerCase() === 'padel' && match.sport === 'Падел')
      );
    }
    
    // Filter by date
    if (date) {
      const targetDate = new Date(date).toDateString();
      filteredMatches = filteredMatches.filter(match => 
        new Date(match.date).toDateString() === targetDate
      );
    }
    
    // Filter by level
    if (level) {
      const targetLevel = parseFloat(level);
      filteredMatches = filteredMatches.filter(match => 
        targetLevel >= match.levelRange[0] && targetLevel <= match.levelRange[1]
      );
    }
    
    // Add distance calculation if coordinates provided
    if (lat && lng) {
      filteredMatches = filteredMatches.map(match => ({
        ...match,
        club: {
          ...match.club,
          distance: Math.round((Math.random() * 15 + 1) * 10) / 10
        }
      })).sort((a, b) => a.club.distance - b.club.distance);
    }
    
    // Apply pagination
    const total = filteredMatches.length;
    const paginatedMatches = filteredMatches.slice(parseInt(offset), parseInt(offset) + parseInt(limit));
    
    sendSuccess(res, {
      matches: paginatedMatches,
      total,
      hasMore: parseInt(offset) + parseInt(limit) < total,
      filters: {
        sport,
        date,
        level,
        location: lat && lng ? { lat: parseFloat(lat), lng: parseFloat(lng) } : null
      }
    }, 'Open matches retrieved successfully');
  } catch (error) {
    sendError(res, 'Failed to retrieve open matches', 500, error);
  }
});

// Search matches with filters
router.get('/search', optionalAuth, async (req, res) => {
  try {
    await simulateDelay();
    
    const { 
      sport, 
      clubs: clubIds, 
      dates, 
      level, 
      competitive, 
      genderPreference,
      limit = 20, 
      offset = 0 
    } = req.query;
    
    let filteredMatches = [...matches];
    
    // Apply various filters
    if (sport) {
      filteredMatches = filteredMatches.filter(match => 
        match.sport.toLowerCase().includes(sport.toLowerCase())
      );
    }
    
    if (clubIds) {
      const clubIdArray = Array.isArray(clubIds) ? clubIds : [clubIds];
      filteredMatches = filteredMatches.filter(match => 
        clubIdArray.includes(match.club.id)
      );
    }
    
    if (competitive !== undefined) {
      filteredMatches = filteredMatches.filter(match => 
        match.competitive === (competitive === 'true')
      );
    }
    
    if (genderPreference) {
      filteredMatches = filteredMatches.filter(match => 
        match.genderPreference === genderPreference
      );
    }
    
    // Apply pagination
    const total = filteredMatches.length;
    const paginatedMatches = filteredMatches.slice(parseInt(offset), parseInt(offset) + parseInt(limit));
    
    sendSuccess(res, {
      matches: paginatedMatches,
      total,
      hasMore: parseInt(offset) + parseInt(limit) < total
    }, 'Matches search completed successfully');
  } catch (error) {
    sendError(res, 'Failed to search matches', 500, error);
  }
});

// Get match details
router.get('/:matchId', async (req, res) => {
  try {
    await simulateDelay();
    
    const { matchId } = req.params;
    const match = matches.find(m => m.id === matchId);
    
    if (!match) {
      return sendError(res, 'Match not found', 404);
    }
    
    sendSuccess(res, match, 'Match details retrieved successfully');
  } catch (error) {
    sendError(res, 'Failed to retrieve match details', 500, error);
  }
});

// Create new match
router.post('/', authenticateToken, async (req, res) => {
  try {
    await simulateDelay();
    
    const {
      sport,
      date,
      duration,
      totalPlayers,
      level,
      levelRange,
      competitive,
      genderPreference,
      venue,
      price,
      pricePerPerson,
      description,
      autoBookCourt
    } = req.body;
    
    // Validate required fields
    if (!sport || !date || !duration || !totalPlayers || !venue) {
      return sendError(res, 'Missing required fields', 400);
    }
    
    // Find club if venue type is club
    let clubInfo = null;
    if (venue.type === 'club') {
      clubInfo = clubs.find(c => c.id === venue.clubId);
      if (!clubInfo) {
        return sendError(res, 'Club not found', 404);
      }
    }
    
    // Create new match
    const newMatch = {
      id: `match_${uuidv4()}`,
      sport: sport === 'padel' ? 'Падел' : sport,
      date,
      duration,
      level: level === 'advanced' ? 'Продвинутый' : level === 'intermediate' ? 'Средний' : 'Начинающий',
      levelRange: levelRange || [1.0, 10.0],
      type: totalPlayers === 4 ? 'Парный' : 'Одиночный',
      playersNeeded: totalPlayers - 1, // Organizer is already included
      totalPlayers,
      price: price || 0,
      pricePerPerson: pricePerPerson || false,
      competitive: competitive || false,
      genderPreference: genderPreference || 'mixed',
      description: description || '',
      club: clubInfo ? {
        id: clubInfo.id,
        name: clubInfo.name,
        address: clubInfo.address.street + ', ' + clubInfo.address.city
      } : null,
      organizer: {
        id: req.user.id,
        name: req.user.name,
        level: 7.5 // Mock level
      },
      players: [
        {
          id: req.user.id,
          name: req.user.name,
          level: 7.5,
          confirmed: true,
          role: 'organizer'
        }
      ],
      courtBooked: autoBookCourt || false,
      courtInfo: autoBookCourt ? {
        courtId: 'court_1',
        courtName: 'Корт 1'
      } : null,
      status: 'open',
      createdAt: new Date().toISOString()
    };
    
    // Add to matches array (in real app, this would be saved to database)
    matches.push(newMatch);
    
    sendSuccess(res, newMatch, 'Match created successfully', 201);
  } catch (error) {
    sendError(res, 'Failed to create match', 500, error);
  }
});

// Join a match
router.post('/:matchId/join', authenticateToken, async (req, res) => {
  try {
    await simulateDelay();
    
    const { matchId } = req.params;
    const { message } = req.body;
    
    const match = matches.find(m => m.id === matchId);
    if (!match) {
      return sendError(res, 'Match not found', 404);
    }
    
    // Check if match is full
    if (match.players.length >= match.totalPlayers) {
      return sendError(res, 'Match is already full', 400);
    }
    
    // Check if user is already in the match
    if (match.players.some(p => p.id === req.user.id)) {
      return sendError(res, 'You are already in this match', 400);
    }
    
    // Mock join request
    const requestId = `req_${uuidv4()}`;
    
    sendSuccess(res, {
      success: true,
      message: 'Заявка на участие отправлена',
      status: 'pending',
      matchId,
      playerId: req.user.id,
      requestId
    }, 'Join request sent successfully');
  } catch (error) {
    sendError(res, 'Failed to join match', 500, error);
  }
});

// Reserve spot in match (accept join request)
router.post('/:matchId/reserve', authenticateToken, async (req, res) => {
  try {
    await simulateDelay();
    
    const { matchId } = req.params;
    const { playerId } = req.body;
    
    const matchIndex = matches.findIndex(m => m.id === matchId);
    if (matchIndex === -1) {
      return sendError(res, 'Match not found', 404);
    }
    
    const match = matches[matchIndex];
    
    // Check if user is the organizer
    if (match.organizer.id !== req.user.id) {
      return sendError(res, 'Only organizer can accept players', 403);
    }
    
    // Check if match is full
    if (match.players.length >= match.totalPlayers) {
      return sendError(res, 'Match is already full', 400);
    }
    
    // Add player to match
    const newPlayer = {
      id: playerId,
      name: 'New Player', // In real app, fetch from user data
      level: 7.0,
      confirmed: true,
      role: 'player'
    };
    
    matches[matchIndex].players.push(newPlayer);
    matches[matchIndex].playersNeeded = match.totalPlayers - matches[matchIndex].players.length;
    
    if (matches[matchIndex].playersNeeded === 0) {
      matches[matchIndex].status = 'full';
    }
    
    sendSuccess(res, {
      matchId,
      playerId,
      status: 'confirmed',
      playersNeeded: matches[matchIndex].playersNeeded
    }, 'Player added to match successfully');
  } catch (error) {
    sendError(res, 'Failed to reserve spot in match', 500, error);
  }
});

// Get match players
router.get('/:matchId/players', async (req, res) => {
  try {
    await simulateDelay();
    
    const { matchId } = req.params;
    const match = matches.find(m => m.id === matchId);
    
    if (!match) {
      return sendError(res, 'Match not found', 404);
    }
    
    sendSuccess(res, {
      players: match.players,
      totalPlayers: match.totalPlayers,
      playersNeeded: match.playersNeeded,
      availableSpots: match.availableSpots || []
    }, 'Match players retrieved successfully');
  } catch (error) {
    sendError(res, 'Failed to retrieve match players', 500, error);
  }
});

// Update match result
router.put('/:matchId/result', authenticateToken, async (req, res) => {
  try {
    await simulateDelay();
    
    const { matchId } = req.params;
    const { score, winner, players } = req.body;
    
    const matchIndex = matches.findIndex(m => m.id === matchId);
    if (matchIndex === -1) {
      return sendError(res, 'Match not found', 404);
    }
    
    // Update match with results
    matches[matchIndex].status = 'completed';
    matches[matchIndex].result = {
      score,
      winner,
      players,
      completedAt: new Date().toISOString()
    };
    
    sendSuccess(res, {
      matchId,
      status: 'completed',
      result: matches[matchIndex].result
    }, 'Match result updated successfully');
  } catch (error) {
    sendError(res, 'Failed to update match result', 500, error);
  }
});

// Cancel match
router.delete('/:matchId', authenticateToken, async (req, res) => {
  try {
    await simulateDelay();
    
    const { matchId } = req.params;
    const { reason } = req.body;
    
    const matchIndex = matches.findIndex(m => m.id === matchId);
    if (matchIndex === -1) {
      return sendError(res, 'Match not found', 404);
    }
    
    const match = matches[matchIndex];
    
    // Check if user is the organizer
    if (match.organizer.id !== req.user.id) {
      return sendError(res, 'Only organizer can cancel the match', 403);
    }
    
    // Update match status
    matches[matchIndex].status = 'cancelled';
    matches[matchIndex].cancellationReason = reason || 'Cancelled by organizer';
    matches[matchIndex].cancelledAt = new Date().toISOString();
    
    sendSuccess(res, {
      matchId,
      status: 'cancelled',
      reason: matches[matchIndex].cancellationReason
    }, 'Match cancelled successfully');
  } catch (error) {
    sendError(res, 'Failed to cancel match', 500, error);
  }
});

module.exports = router;