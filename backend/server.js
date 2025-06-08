const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

// Import routes
const usersRoutes = require('./routes/users');
const clubsRoutes = require('./routes/clubs');
const matchesRoutes = require('./routes/matches');
const bookingsRoutes = require('./routes/bookings');
const generalRoutes = require('./routes/general');
const imagesRoutes = require('./routes/images');
const imagesMockRoutes = require('./routes/images-mock');
const imagesSimpleRoutes = require('./routes/images-simple');
const staticImagesRoutes = require('./routes/static-images');
const configRoutes = require('./routes/config');

// Import middleware
const { authenticateToken } = require('./middleware/auth');
const { sendSuccess, sendError } = require('./utils/responseHelper');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: ['http://localhost:8081', 'http://localhost:19006', 'exp://localhost:8081'],
  credentials: true
}));

app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  sendError(res, 'Internal server error', 500, err);
});

// Root endpoint
app.get('/', (req, res) => {
  sendSuccess(res, {
    name: 'Padel App Backend API',
    version: '1.0.0',
    description: 'Mock backend server for Padel booking and community app',
    endpoints: {
      users: '/api/users',
      clubs: '/api/clubs', 
      matches: '/api/matches',
      bookings: '/api/bookings',
      images: '/api/images',
      general: '/api'
    },
    docs: 'https://github.com/your-repo/padel-app-backend',
    status: 'running'
  }, 'Padel App Backend API is running');
});

// Authentication endpoints
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return sendError(res, 'Email and password are required', 400);
    }
    
    // Mock authentication - in real app, verify credentials
    const mockToken = email === 'kirill.romanov@example.com' ? 'mock-token-12345' : 'mock-token-generic';
    
    sendSuccess(res, {
      token: mockToken,
      user: {
        id: email === 'kirill.romanov@example.com' ? '12345' : 'user_456',
        email,
        name: email === 'kirill.romanov@example.com' ? 'Кирилл Романов' : 'Mock User'
      },
      expiresIn: '7d'
    }, 'Login successful');
  } catch (error) {
    sendError(res, 'Login failed', 500, error);
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;
    
    if (!email || !password || !name) {
      return sendError(res, 'Email, password, and name are required', 400);
    }
    
    // Mock registration
    const newUserId = `user_${Date.now()}`;
    const mockToken = `mock-token-${newUserId}`;
    
    sendSuccess(res, {
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
    sendError(res, 'Registration failed', 500, error);
  }
});

app.post('/api/auth/refresh', authenticateToken, async (req, res) => {
  try {
    // Mock token refresh
    const newToken = `mock-token-${Date.now()}`;
    
    sendSuccess(res, {
      token: newToken,
      expiresIn: '7d'
    }, 'Token refreshed successfully');
  } catch (error) {
    sendError(res, 'Token refresh failed', 500, error);
  }
});

app.post('/api/auth/logout', authenticateToken, async (req, res) => {
  try {
    // Mock logout - in real app, invalidate token
    sendSuccess(res, {
      message: 'Logged out successfully'
    }, 'Logout successful');
  } catch (error) {
    sendError(res, 'Logout failed', 500, error);
  }
});

// Payment endpoints
app.post('/api/payments/process', authenticateToken, async (req, res) => {
  try {
    const { amount, currency = 'RUB', paymentMethod, bookingId } = req.body;
    
    if (!amount || !paymentMethod) {
      return sendError(res, 'Amount and payment method are required', 400);
    }
    
    // Mock payment processing
    const paymentId = `payment_${Date.now()}`;
    const success = Math.random() > 0.1; // 90% success rate
    
    if (success) {
      sendSuccess(res, {
        paymentId,
        status: 'completed',
        amount,
        currency,
        paymentMethod,
        bookingId,
        transactionId: `txn_${Date.now()}`,
        processedAt: new Date().toISOString()
      }, 'Payment processed successfully', 201);
    } else {
      sendError(res, 'Payment failed', 402, new Error('Insufficient funds'));
    }
  } catch (error) {
    sendError(res, 'Payment processing failed', 500, error);
  }
});

app.get('/api/payments/:paymentId/status', authenticateToken, async (req, res) => {
  try {
    const { paymentId } = req.params;
    
    // Mock payment status
    sendSuccess(res, {
      paymentId,
      status: 'completed',
      amount: 3000,
      currency: 'RUB',
      processedAt: new Date().toISOString()
    }, 'Payment status retrieved successfully');
  } catch (error) {
    sendError(res, 'Failed to retrieve payment status', 500, error);
  }
});

// Notification endpoints
app.get('/api/notifications', authenticateToken, async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;
    
    // Mock notifications
    const notifications = [
      {
        id: 'notif_1',
        type: 'match_invitation',
        title: 'Приглашение в матч',
        message: 'Алексей Петров приглашает вас в матч на завтра в 19:00',
        read: false,
        createdAt: '2024-01-19T15:30:00Z',
        data: { matchId: 'match_456' }
      },
      {
        id: 'notif_2',
        type: 'booking_confirmed',
        title: 'Бронирование подтверждено',
        message: 'Ваше бронирование на 20.01 в 18:00 подтверждено',
        read: true,
        createdAt: '2024-01-19T12:00:00Z',
        data: { bookingId: 'booking_123' }
      }
    ];
    
    const paginatedNotifications = notifications.slice(parseInt(offset), parseInt(offset) + parseInt(limit));
    
    sendSuccess(res, {
      notifications: paginatedNotifications,
      total: notifications.length,
      unreadCount: notifications.filter(n => !n.read).length,
      hasMore: parseInt(offset) + parseInt(limit) < notifications.length
    }, 'Notifications retrieved successfully');
  } catch (error) {
    sendError(res, 'Failed to retrieve notifications', 500, error);
  }
});

app.put('/api/notifications/:notificationId/read', authenticateToken, async (req, res) => {
  try {
    const { notificationId } = req.params;
    
    // Mock marking notification as read
    sendSuccess(res, {
      notificationId,
      read: true,
      readAt: new Date().toISOString()
    }, 'Notification marked as read');
  } catch (error) {
    sendError(res, 'Failed to mark notification as read', 500, error);
  }
});

// Support endpoints
app.post('/api/support/tickets', authenticateToken, async (req, res) => {
  try {
    const { subject, message, category = 'general' } = req.body;
    
    if (!subject || !message) {
      return sendError(res, 'Subject and message are required', 400);
    }
    
    const ticketId = `ticket_${Date.now()}`;
    
    sendSuccess(res, {
      ticketId,
      subject,
      message,
      category,
      status: 'open',
      createdAt: new Date().toISOString(),
      estimatedResponse: '24 hours'
    }, 'Support ticket created successfully', 201);
  } catch (error) {
    sendError(res, 'Failed to create support ticket', 500, error);
  }
});

// API Routes
app.use('/api/users', usersRoutes);
app.use('/api/clubs', clubsRoutes);
app.use('/api/matches', matchesRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/config', configRoutes);
app.use('/api/images', imagesRoutes);
app.use('/api/images-mock', imagesMockRoutes);
app.use('/api/images-simple', imagesSimpleRoutes);
app.use('/api/static-images', staticImagesRoutes);
app.use('/api', generalRoutes);

// 404 handler
app.use('*', (req, res) => {
  sendError(res, `Route ${req.originalUrl} not found`, 404);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Padel App Backend Server is running on port ${PORT}`);
  console.log(`📖 API Documentation: http://localhost:${PORT}/`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
  console.log('');
  console.log('Available endpoints:');
  console.log(`  Users:     http://localhost:${PORT}/api/users`);
  console.log(`  Clubs:     http://localhost:${PORT}/api/clubs`);
  console.log(`  Matches:   http://localhost:${PORT}/api/matches`);
  console.log(`  Bookings:  http://localhost:${PORT}/api/bookings`);
  console.log(`  Images:    http://localhost:${PORT}/api/images`);
  console.log(`  Auth:      http://localhost:${PORT}/api/auth`);
  console.log('');
  console.log('Mock Authentication:');
  console.log('  Email: kirill.romanov@example.com');
  console.log('  Password: any');
  console.log('  Token: mock-token-12345');
});

module.exports = app;