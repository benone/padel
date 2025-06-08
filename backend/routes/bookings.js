const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { bookings, clubs } = require('../data/mockData');
const { authenticateToken } = require('../middleware/auth');
const { sendSuccess, sendError, simulateDelay } = require('../utils/responseHelper');

// Create new booking
router.post('/', authenticateToken, async (req, res) => {
  try {
    await simulateDelay();
    
    const {
      clubId,
      courtId,
      date,
      time,
      duration,
      sport,
      players,
      totalPrice,
      paymentMethod
    } = req.body;
    
    // Validate required fields
    if (!clubId || !courtId || !date || !time || !duration || !sport) {
      return sendError(res, 'Missing required booking information', 400);
    }
    
    // Find club
    const club = clubs.find(c => c.id === clubId);
    if (!club) {
      return sendError(res, 'Club not found', 404);
    }
    
    // Generate booking confirmation
    const confirmationCode = `PB${date.replace(/-/g, '')}${String(bookings.length + 1).padStart(3, '0')}`;
    
    const newBooking = {
      id: `booking_${uuidv4()}`,
      confirmationCode,
      status: 'confirmed',
      club: {
        id: club.id,
        name: club.name,
        address: club.address.street + ', ' + club.address.city,
        phone: club.contact.phone
      },
      court: {
        id: courtId,
        name: courtId.replace('court_', 'Корт ')
      },
      user: {
        id: req.user.id,
        name: req.user.name,
        phone: players?.[0]?.phone || '+7 (999) 123-45-67'
      },
      date,
      time,
      duration,
      sport: sport === 'padel' ? 'Падел' : sport,
      totalPrice: totalPrice || 3000,
      paymentStatus: 'paid',
      paymentMethod: paymentMethod || 'card',
      createdAt: new Date().toISOString(),
      instructions: 'Приходите за 15 минут до начала. Вход со стороны парковки.'
    };
    
    // Add to bookings array
    bookings.push(newBooking);
    
    sendSuccess(res, newBooking, 'Booking created successfully', 201);
  } catch (error) {
    sendError(res, 'Failed to create booking', 500, error);
  }
});

// Get booking details
router.get('/:bookingId', authenticateToken, async (req, res) => {
  try {
    await simulateDelay();
    
    const { bookingId } = req.params;
    const booking = bookings.find(b => b.id === bookingId);
    
    if (!booking) {
      return sendError(res, 'Booking not found', 404);
    }
    
    // Check if user owns this booking
    if (booking.user.id !== req.user.id) {
      return sendError(res, 'Access denied', 403);
    }
    
    sendSuccess(res, booking, 'Booking details retrieved successfully');
  } catch (error) {
    sendError(res, 'Failed to retrieve booking details', 500, error);
  }
});

// Cancel booking
router.put('/:bookingId/cancel', authenticateToken, async (req, res) => {
  try {
    await simulateDelay();
    
    const { bookingId } = req.params;
    const { reason } = req.body;
    
    const bookingIndex = bookings.findIndex(b => b.id === bookingId);
    if (bookingIndex === -1) {
      return sendError(res, 'Booking not found', 404);
    }
    
    const booking = bookings[bookingIndex];
    
    // Check if user owns this booking
    if (booking.user.id !== req.user.id) {
      return sendError(res, 'Access denied', 403);
    }
    
    // Check if booking can be cancelled (e.g., not too close to start time)
    const bookingDateTime = new Date(`${booking.date}T${booking.time}:00`);
    const now = new Date();
    const hoursUntilBooking = (bookingDateTime - now) / (1000 * 60 * 60);
    
    if (hoursUntilBooking < 24) {
      return sendError(res, 'Booking cannot be cancelled less than 24 hours before start time', 400);
    }
    
    // Update booking status
    bookings[bookingIndex].status = 'cancelled';
    bookings[bookingIndex].cancellationReason = reason || 'Cancelled by user';
    bookings[bookingIndex].cancelledAt = new Date().toISOString();
    bookings[bookingIndex].refundStatus = 'pending';
    
    sendSuccess(res, {
      bookingId,
      status: 'cancelled',
      refundStatus: 'pending',
      message: 'Booking cancelled successfully. Refund will be processed within 3-5 business days.'
    }, 'Booking cancelled successfully');
  } catch (error) {
    sendError(res, 'Failed to cancel booking', 500, error);
  }
});

// Modify booking
router.put('/:bookingId', authenticateToken, async (req, res) => {
  try {
    await simulateDelay();
    
    const { bookingId } = req.params;
    const { date, time, duration } = req.body;
    
    const bookingIndex = bookings.findIndex(b => b.id === bookingId);
    if (bookingIndex === -1) {
      return sendError(res, 'Booking not found', 404);
    }
    
    const booking = bookings[bookingIndex];
    
    // Check if user owns this booking
    if (booking.user.id !== req.user.id) {
      return sendError(res, 'Access denied', 403);
    }
    
    // Check if booking can be modified
    const bookingDateTime = new Date(`${booking.date}T${booking.time}:00`);
    const now = new Date();
    const hoursUntilBooking = (bookingDateTime - now) / (1000 * 60 * 60);
    
    if (hoursUntilBooking < 4) {
      return sendError(res, 'Booking cannot be modified less than 4 hours before start time', 400);
    }
    
    // Update booking
    if (date) bookings[bookingIndex].date = date;
    if (time) bookings[bookingIndex].time = time;
    if (duration) bookings[bookingIndex].duration = duration;
    
    bookings[bookingIndex].modifiedAt = new Date().toISOString();
    
    sendSuccess(res, bookings[bookingIndex], 'Booking modified successfully');
  } catch (error) {
    sendError(res, 'Failed to modify booking', 500, error);
  }
});

// Get all bookings for a user (handled in users.js, but keeping this for completeness)
router.get('/', authenticateToken, async (req, res) => {
  try {
    await simulateDelay();
    
    const { status = 'all', limit = 10, offset = 0 } = req.query;
    
    let userBookings = bookings.filter(b => b.user.id === req.user.id);
    
    // Filter by status
    if (status !== 'all') {
      userBookings = userBookings.filter(b => b.status === status);
    }
    
    // Sort by date (newest first)
    userBookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Apply pagination
    const total = userBookings.length;
    const paginatedBookings = userBookings.slice(parseInt(offset), parseInt(offset) + parseInt(limit));
    
    sendSuccess(res, {
      bookings: paginatedBookings,
      total,
      hasMore: parseInt(offset) + parseInt(limit) < total
    }, 'User bookings retrieved successfully');
  } catch (error) {
    sendError(res, 'Failed to retrieve bookings', 500, error);
  }
});

// Get booking history with filters
router.get('/history', authenticateToken, async (req, res) => {
  try {
    await simulateDelay();
    
    const { 
      sport, 
      clubId, 
      startDate, 
      endDate, 
      status,
      limit = 20, 
      offset = 0 
    } = req.query;
    
    let userBookings = bookings.filter(b => b.user.id === req.user.id);
    
    // Apply filters
    if (sport) {
      userBookings = userBookings.filter(b => 
        b.sport.toLowerCase().includes(sport.toLowerCase())
      );
    }
    
    if (clubId) {
      userBookings = userBookings.filter(b => b.club.id === clubId);
    }
    
    if (startDate) {
      userBookings = userBookings.filter(b => b.date >= startDate);
    }
    
    if (endDate) {
      userBookings = userBookings.filter(b => b.date <= endDate);
    }
    
    if (status) {
      userBookings = userBookings.filter(b => b.status === status);
    }
    
    // Sort by date (newest first)
    userBookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Apply pagination
    const total = userBookings.length;
    const paginatedBookings = userBookings.slice(parseInt(offset), parseInt(offset) + parseInt(limit));
    
    sendSuccess(res, {
      bookings: paginatedBookings,
      total,
      hasMore: parseInt(offset) + parseInt(limit) < total,
      filters: {
        sport,
        clubId,
        startDate,
        endDate,
        status
      }
    }, 'Booking history retrieved successfully');
  } catch (error) {
    sendError(res, 'Failed to retrieve booking history', 500, error);
  }
});

// Check booking availability
router.post('/check-availability', async (req, res) => {
  try {
    await simulateDelay();
    
    const { clubId, courtId, date, time, duration } = req.body;
    
    // Validate required fields
    if (!clubId || !date || !time || !duration) {
      return sendError(res, 'Missing required fields for availability check', 400);
    }
    
    // Mock availability check
    const isAvailable = Math.random() > 0.3; // 70% chance of being available
    
    if (isAvailable) {
      sendSuccess(res, {
        available: true,
        clubId,
        courtId,
        date,
        time,
        duration,
        price: courtId ? 3000 : null
      }, 'Time slot is available');
    } else {
      sendSuccess(res, {
        available: false,
        clubId,
        courtId,
        date,
        time,
        duration,
        alternativeTimes: [
          { time: '19:30', available: true, price: 3500 },
          { time: '21:00', available: true, price: 3000 }
        ]
      }, 'Time slot is not available');
    }
  } catch (error) {
    sendError(res, 'Failed to check availability', 500, error);
  }
});

module.exports = router;