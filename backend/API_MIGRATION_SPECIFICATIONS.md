# Padel App Backend API Migration Specifications

## Executive Summary

This document provides comprehensive specifications for migrating the Padel App backend API from its current Express.js/Cloudflare Workers implementation to another service. The API serves a React Native mobile application for padel court booking and community features.

## System Overview

### Current Architecture
- **Primary Implementation**: Express.js server (development)
- **Edge Deployment**: Cloudflare Workers (production)
- **Database**: Mock data (no persistent storage)
- **Authentication**: JWT-based with mock validation
- **Image Services**: AI generation via Runware API + static assets

### Key Statistics
- **Total Endpoints**: 78 unique API routes
- **Authenticated Endpoints**: 31 (40%)
- **Public Endpoints**: 47 (60%)
- **API Domains**: 11 major service areas

## API Endpoint Categories

### 1. Authentication Service (/api/auth)
**Purpose**: User authentication and session management
**Endpoints**: 4
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh` - Token refresh (auth required)
- `POST /api/auth/logout` - User logout (auth required)

### 2. Booking Service (/api/bookings)
**Purpose**: Court reservation management
**Endpoints**: 7 (all require authentication)
- `POST /api/bookings` - Create booking
- `GET /api/bookings/:bookingId` - Get booking details
- `PUT /api/bookings/:bookingId` - Modify booking
- `PUT /api/bookings/:bookingId/cancel` - Cancel booking
- `GET /api/bookings` - List user bookings
- `GET /api/bookings/history` - Booking history with filters
- `POST /api/bookings/check-availability` - Check slot availability

### 3. Club Service (/api/clubs)
**Purpose**: Venue information and availability
**Endpoints**: 8
- `GET /api/clubs/search` - Search clubs with geo-filters
- `GET /api/clubs/:clubId` - Club details
- `GET /api/clubs/:clubId/availability` - Court availability
- `GET /api/clubs/:clubId/contact` - Contact information
- `GET /api/clubs/:clubId/reviews` - Club reviews
- `GET /api/clubs` - List nearby clubs
- `POST /api/clubs/:clubId/favorite` - Add to favorites
- `DELETE /api/clubs/:clubId/favorite` - Remove from favorites

### 4. Match Service (/api/matches)
**Purpose**: Match organization and player matching
**Endpoints**: 9
- `GET /api/matches/open` - Find open matches
- `GET /api/matches/search` - Advanced match search
- `GET /api/matches/:matchId` - Match details
- `POST /api/matches` - Create match (auth required)
- `POST /api/matches/:matchId/join` - Join request (auth required)
- `POST /api/matches/:matchId/reserve` - Accept player (auth required)
- `GET /api/matches/:matchId/players` - List players
- `PUT /api/matches/:matchId/result` - Update result (auth required)
- `DELETE /api/matches/:matchId` - Cancel match (auth required)

### 5. User Service (/api/users)
**Purpose**: User profiles and statistics
**Endpoints**: 9
- `GET /api/users/:userId/profile` - Get profile
- `PUT /api/users/:userId/profile` - Update profile (auth required)
- `GET /api/users/:userId/matches` - Match history
- `GET /api/users/:userId/stats` - Performance statistics
- `GET /api/users/:userId/preferences` - User preferences
- `PUT /api/users/:userId/preferences` - Update preferences (auth required)
- `GET /api/users/:userId/connections` - Frequent partners
- `GET /api/users/:userId/clubs` - Club memberships
- `GET /api/users/:userId/bookings` - User bookings (auth required)

### 6. Community Service (/api/community)
**Purpose**: Social features and user discovery
**Endpoints**: 5 (all require authentication)
- `GET /api/community/posts` - Get feed posts
- `GET /api/community/suggestions` - Suggested users
- `POST /api/community/posts/:postId/like` - Like/unlike post
- `POST /api/community/users/:userId/follow` - Follow/unfollow user
- `GET /api/community/search` - Search users and posts

### 7. Configuration Service (/api/config)
**Purpose**: App configuration and settings
**Endpoints**: 4
- `GET /api/config/app` - Application config
- `GET /api/config/localization/:locale?` - Translations
- `GET /api/config/pricing` - Pricing rules
- `GET /api/config/business-rules` - Validation rules

### 8. Image Services (/api/images*)
**Purpose**: Dynamic image generation and serving
**Endpoints**: 12
- Advanced AI generation with caching (`/api/images/*`)
- Simple AI generation without caching (`/api/images-simple/*`)
- Mock generation for testing (`/api/images-mock/*`)
- Static image catalog (`/api/static-images/*`)

### 9. General/Utility Services (/api)
**Purpose**: Common utilities and health checks
**Endpoints**: 7
- `GET /api/health` - System health check
- `GET /api/sports` - Available sports list
- `GET /api/time-slots` - Booking time slots
- `GET /api/popular-venues` - Popular clubs
- `GET /api/trending-matches` - Trending matches
- `GET /api/search-suggestions` - Search autocomplete
- `POST /api/clear-cache` - Clear image cache

### 10. Payment Service (/api/payments)
**Purpose**: Payment processing
**Endpoints**: 2 (all require authentication)
- `POST /api/payments/process` - Process payment
- `GET /api/payments/:paymentId/status` - Payment status

### 11. Support Services
**Purpose**: Notifications and customer support
**Endpoints**: 4 (all require authentication)
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/:notificationId/read` - Mark as read
- `POST /api/support/tickets` - Create support ticket

## Data Models

### Core Entities

#### User Model
```typescript
interface User {
  id: string;
  email: string;
  phone: string;
  name: string;
  avatar: string | null;
  level: number;
  levelName: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  age: number;
  stats: UserStats;
  preferences: UserPreferences;
  createdAt: string;
  lastActive: string;
}
```

#### Club Model
```typescript
interface Club {
  id: string;
  name: string;
  description: string;
  address: ClubAddress;
  contact: ClubContact;
  images: string[];
  sports: Sport[];
  amenities: Amenities;
  workingHours: WorkingHours;
  rating: number;
  reviewCount: number;
  distance?: number;
}
```

#### Match Model
```typescript
interface Match {
  id: string;
  sport: string;
  date: string;
  duration: number;
  level: string;
  levelRange: [number, number];
  type: string;
  playersNeeded: number;
  totalPlayers: number;
  price: number;
  pricePerPerson: boolean;
  competitive: boolean;
  genderPreference: string;
  description?: string;
  club: MatchClub;
  organizer: MatchOrganizer;
  players: Player[];
  availableSpots: Spot[];
  courtBooked: boolean;
  courtInfo?: CourtInfo;
  status: string;
  createdAt: string;
  updatedAt: string;
  cancellationPolicy: string;
}
```

#### Booking Model
```typescript
interface Booking {
  id: string;
  confirmationCode: string;
  status: string;
  club: BookingClub;
  court: Court;
  user: BookingUser;
  date: string;
  time: string;
  duration: number;
  sport: string;
  totalPrice: number;
  paymentStatus: string;
  paymentMethod: string;
  createdAt: string;
  instructions?: string;
}
```

## Authentication & Security

### Authentication Flow
1. **Token Type**: Bearer JWT tokens
2. **Mock Tokens**: 
   - Admin: `mock-token-12345` → User ID: `12345`
   - Default: Any other token → User ID: `user_456`
3. **Token Lifetime**: 7 days (configurable)
4. **No Real Validation**: Current implementation accepts any Bearer token

### Security Headers Required
```
Authorization: Bearer <token>
Content-Type: application/json
```

### CORS Configuration
```javascript
allowedOrigins: [
  'http://localhost:8081',
  'http://localhost:19006',
  'exp://*'
]
```

## Response Standards

### Success Response Format
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {},
  "timestamp": "2024-01-20T10:30:00.000Z"
}
```

### Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "error": {
    "code": 400,
    "details": {}
  },
  "timestamp": "2024-01-20T10:30:00.000Z"
}
```

### Standard HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## External Dependencies

### Required Services
1. **Runware API** (for AI image generation)
   - API Token required
   - Used for dynamic avatar and image generation
   - Endpoints: `/api/images` and `/api/images-simple`

### Environment Variables
```bash
# Required
RUNWARE_API_TOKEN=<token>

# Optional
PORT=3000
```

## Migration Considerations

### 1. Database Implementation
Current system uses mock data. Migration requires:
- Database schema design based on data models
- Data persistence layer implementation
- Migration scripts for initial data
- Transaction support for bookings/payments

### 2. Authentication Enhancement
Current mock auth needs replacement with:
- Real JWT validation
- Refresh token mechanism
- Session management
- Password hashing (bcrypt recommended)
- OAuth integration (optional)

### 3. Image Service Options
- **Option 1**: Keep Runware integration
- **Option 2**: Implement own image generation
- **Option 3**: Use static avatars only
- **Option 4**: Integrate with CDN service

### 4. Real-time Features
Consider adding for enhanced UX:
- WebSocket for match updates
- Push notifications for bookings
- Live availability updates
- Chat for match players

### 5. Payment Integration
Current mock payment needs:
- Payment gateway integration (Stripe, PayPal, etc.)
- Webhook handling
- Refund processing
- Invoice generation

### 6. Caching Strategy
Implement caching for:
- Club search results (geo-based)
- User profiles
- Static configuration
- Image assets

### 7. Rate Limiting
Recommended limits:
- Authentication: 5 requests/minute
- Search: 30 requests/minute
- Bookings: 10 requests/minute
- General: 100 requests/minute

### 8. Monitoring & Logging
Essential metrics:
- API response times
- Error rates by endpoint
- Authentication failures
- Booking conversion rates
- Image generation usage

## Performance Requirements

### Response Time Targets
- Authentication: < 200ms
- Search operations: < 500ms
- Booking creation: < 1000ms
- Image generation: < 3000ms
- Static content: < 100ms

### Scalability Needs
- Concurrent users: 10,000+
- Daily bookings: 5,000+
- API calls/day: 1M+
- Image generations/day: 50,000+

## Deployment Architecture Options

### Option 1: Microservices
- Auth Service
- Booking Service
- Club Service
- Match Service
- User Service
- Image Service

### Option 2: Monolithic API
- Single deployment unit
- Shared database
- Internal service layer

### Option 3: Serverless
- API Gateway + Lambda functions
- DynamoDB for data
- S3 for images
- CloudFront CDN

## Testing Requirements

### API Testing Coverage
- Unit tests for business logic
- Integration tests for endpoints
- Load testing for performance
- Security testing for auth
- Mock data consistency tests

### Test Data Requirements
- 10+ test users with various levels
- 5+ test clubs with availability
- 20+ test matches in various states
- 50+ historical bookings
- Image generation test cases

## Documentation Needs

### API Documentation
- OpenAPI/Swagger specification
- Interactive API explorer
- Authentication guide
- Error code reference
- Migration guide

### Developer Resources
- Local setup instructions
- Environment configuration
- Testing procedures
- Deployment guide
- Troubleshooting guide

## Success Criteria

### Functional Requirements
✓ All 78 endpoints implemented
✓ Authentication working
✓ Data persistence
✓ Image services operational
✓ Payment processing ready

### Non-Functional Requirements
✓ 99.9% uptime
✓ Response times within targets
✓ Scalability proven
✓ Security audit passed
✓ Documentation complete

## Migration Timeline Estimate

### Phase 1: Foundation (2-3 weeks)
- Database design and setup
- Authentication system
- Core data models
- Basic CRUD operations

### Phase 2: Core Features (3-4 weeks)
- Booking system
- Club search
- Match management
- User profiles

### Phase 3: Advanced Features (2-3 weeks)
- Payment integration
- Image services
- Community features
- Notifications

### Phase 4: Testing & Launch (2 weeks)
- Load testing
- Security audit
- Bug fixes
- Production deployment

**Total Estimated Timeline: 9-12 weeks**

## Appendix

### Mock User Credentials
- Admin: `kirill.romanov@example.com` (any password)
- Token: `mock-token-12345`

### Test Data Characteristics
- Russian localization throughout
- Moscow-based locations
- Prices in RUB currency
- 24-hour time format
- Metric measurements

### Contact
For questions about this specification or the migration process, please refer to the original repository documentation or contact the development team.