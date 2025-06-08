# Padel App Backend - Mock Server

A comprehensive mock backend server for the React Native Padel booking and community application. Built with Express.js and featuring realistic mock data and complete API functionality.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- npm or yarn

### Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:3000`

### Production Start
```bash
npm start
```

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication

Most endpoints require authentication. Use the following mock credentials:

**Login Credentials:**
- Email: `kirill.romanov@example.com`
- Password: `any`
- Mock Token: `mock-token-12345`

**Headers:**
```
Authorization: Bearer mock-token-12345
Content-Type: application/json
```

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration  
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - User logout

### Users
- `GET /api/users/:userId/profile` - Get user profile
- `PUT /api/users/:userId/profile` - Update user profile
- `GET /api/users/:userId/matches` - Get user match history
- `GET /api/users/:userId/stats` - Get user statistics
- `GET /api/users/:userId/preferences` - Get user preferences
- `PUT /api/users/:userId/preferences` - Update user preferences
- `GET /api/users/:userId/connections` - Get frequent playing partners
- `GET /api/users/:userId/clubs` - Get user club memberships
- `GET /api/users/:userId/bookings` - Get user bookings

### Clubs
- `GET /api/clubs/search` - Search clubs with filters
- `GET /api/clubs/:clubId` - Get club details
- `GET /api/clubs/:clubId/availability` - Get court availability
- `GET /api/clubs/:clubId/contact` - Get club contact info
- `GET /api/clubs/:clubId/reviews` - Get club reviews
- `POST /api/clubs/:clubId/favorite` - Add club to favorites
- `DELETE /api/clubs/:clubId/favorite` - Remove from favorites

### Matches
- `GET /api/matches/open` - Get available matches
- `GET /api/matches/search` - Search matches with filters
- `GET /api/matches/:matchId` - Get match details
- `POST /api/matches` - Create new match
- `POST /api/matches/:matchId/join` - Join a match
- `POST /api/matches/:matchId/reserve` - Accept player to match
- `GET /api/matches/:matchId/players` - Get match players
- `PUT /api/matches/:matchId/result` - Submit match result
- `DELETE /api/matches/:matchId` - Cancel match

### Bookings
- `POST /api/bookings` - Create court booking
- `GET /api/bookings/:bookingId` - Get booking details
- `PUT /api/bookings/:bookingId/cancel` - Cancel booking
- `PUT /api/bookings/:bookingId` - Modify booking
- `GET /api/bookings` - Get user bookings
- `GET /api/bookings/history` - Get booking history with filters
- `POST /api/bookings/check-availability` - Check time slot availability

### General
- `GET /api/sports` - Get available sports
- `GET /api/time-slots` - Get available time slots
- `GET /api/config` - Get app configuration
- `GET /api/health` - Health check
- `GET /api/popular-venues` - Get popular venues
- `GET /api/trending-matches` - Get trending matches
- `GET /api/search-suggestions` - Get search suggestions

### Payments
- `POST /api/payments/process` - Process payment
- `GET /api/payments/:paymentId/status` - Get payment status

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:notificationId/read` - Mark as read

### Support
- `POST /api/support/tickets` - Create support ticket

## 📝 Example API Calls

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "kirill.romanov@example.com", "password": "any"}'
```

### Get User Profile
```bash
curl -X GET http://localhost:3000/api/users/12345/profile \
  -H "Authorization: Bearer mock-token-12345"
```

### Search Clubs
```bash
curl -X GET "http://localhost:3000/api/clubs/search?lat=55.7558&lng=37.6176&sport=padel"
```

### Create Match
```bash
curl -X POST http://localhost:3000/api/matches \
  -H "Authorization: Bearer mock-token-12345" \
  -H "Content-Type: application/json" \
  -d '{
    "sport": "padel",
    "date": "2024-01-22T19:00:00Z",
    "duration": 90,
    "totalPlayers": 4,
    "level": "advanced",
    "venue": {"type": "club", "clubId": "club_123"},
    "price": 1400,
    "competitive": true
  }'
```

### Create Booking
```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Authorization: Bearer mock-token-12345" \
  -H "Content-Type: application/json" \
  -d '{
    "clubId": "club_123",
    "courtId": "court_2", 
    "date": "2024-01-20",
    "time": "18:00",
    "duration": 90,
    "sport": "padel",
    "totalPrice": 3000
  }'
```

## 🗂️ Project Structure

```
backend/
├── server.js              # Main server entry point
├── package.json           # Dependencies and scripts
├── data/
│   └── mockData.js        # Mock data and generators
├── routes/
│   ├── users.js           # User management endpoints
│   ├── clubs.js           # Club management endpoints
│   ├── matches.js         # Match coordination endpoints
│   ├── bookings.js        # Booking system endpoints
│   └── general.js         # General utilities endpoints
├── middleware/
│   └── auth.js            # Authentication middleware
└── utils/
    └── responseHelper.js  # Response formatting utilities
```

## 🎯 Features

### Core Functionality
- ✅ Complete user management with profiles and statistics
- ✅ Club search and detailed information
- ✅ Match creation, joining, and management
- ✅ Court booking system with availability
- ✅ Mock payment processing
- ✅ Notification system
- ✅ Search and filtering capabilities

### Mock Data
- ✅ Realistic Russian user data and content
- ✅ Multiple club profiles with amenities
- ✅ Dynamic court availability generation
- ✅ Match history and statistics
- ✅ Booking confirmations and tracking

### Technical Features
- ✅ JWT-style authentication simulation
- ✅ CORS enabled for React Native development
- ✅ Request logging with Morgan
- ✅ Error handling and consistent responses
- ✅ Simulated network delays for realistic testing
- ✅ Comprehensive API documentation

## 🔧 Configuration

### Environment Variables
Create a `.env` file (optional):
```env
PORT=3000
NODE_ENV=development
```

### CORS Configuration
The server is configured to accept requests from:
- `http://localhost:8081` (Expo default)
- `http://localhost:19006` (Expo web)
- `exp://localhost:8081` (Expo client)

## 🧪 Testing

### Health Check
```bash
curl http://localhost:3000/api/health
```

### Postman Collection
Import the provided `postman-collection.json` file for complete API testing.

## 📱 Integration with React Native

### API Base URL Configuration
In your React Native app, configure the API base URL:

```javascript
// For iOS Simulator
const API_BASE_URL = 'http://localhost:3000/api';

// For Android Emulator  
const API_BASE_URL = 'http://10.0.2.2:3000/api';

// For physical device (replace with your computer's IP)
const API_BASE_URL = 'http://192.168.1.100:3000/api';
```

### Example Integration
```javascript
// services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000,
});

// Add auth token interceptor
api.interceptors.request.use((config) => {
  const token = 'mock-token-12345'; // Get from AsyncStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getOpenMatches = () => 
  api.get('/matches/open');

export const getUserProfile = (userId) => 
  api.get(`/users/${userId}/profile`);
```

## 🚧 Development

### Adding New Endpoints
1. Create route handler in appropriate file in `/routes`
2. Add route to `server.js`
3. Update mock data in `/data/mockData.js` if needed
4. Test with curl or Postman

### Mock Data Customization
Edit `/data/mockData.js` to:
- Add more clubs, users, or matches
- Modify response data structure
- Adjust mock behavior (availability, success rates)

## 🔍 Debugging

### Logs
The server uses Morgan for request logging. Check console output for:
- Request details (method, URL, status, response time)
- Error messages and stack traces
- Server startup information

### Common Issues
1. **Port already in use**: Change PORT in package.json or kill existing process
2. **CORS errors**: Ensure your React Native dev server URL is in CORS config
3. **Authentication errors**: Verify Bearer token format and value

## 📋 Mock Authentication Details

### Users
- **ID**: `12345` 
- **Email**: `kirill.romanov@example.com`
- **Token**: `mock-token-12345`
- **Name**: `Кирилл Романов`

- **ID**: `user_456`
- **Any other email**
- **Token**: `mock-token-generic`  
- **Name**: `Mock User`

### Behavior
- Any password is accepted for login
- Tokens don't expire in mock environment
- All authenticated routes accept valid Bearer tokens
- Some routes work without authentication (clubs, open matches)

## 🔧 Scripts

```bash
npm start       # Start production server
npm run dev     # Start development server with nodemon
npm test        # Run tests (placeholder)
```

## 📄 License

MIT License - feel free to use this mock server for development and testing purposes.

---

**Happy coding! 🎾** 

For questions or issues, check the API responses and server logs for detailed error information.