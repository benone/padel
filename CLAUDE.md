# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a full-stack React Native Expo application for padel court booking and community features. The project consists of:
- **Frontend**: React Native app (`/app`) with NativeWind (Tailwind CSS) styling
- **Backend**: Express.js mock server (`/backend`) with comprehensive REST API

## Common Commands

### Frontend (React Native App)
```bash
cd app
npm start                    # Start Expo dev server on port 8082
npm run android             # Launch Android simulator
npm run ios                 # Launch iOS simulator
npm run web                 # Launch web version
npm run build:android       # Build Android APK for sharing via EAS
npm run build:ios           # Build iOS IPA for sharing via EAS
npm run build:all           # Build for both platforms
```

### Backend (Mock API Server)
```bash
cd backend
npm run dev                 # Start with nodemon (auto-reload)
npm start                   # Start production mode
npm run deploy              # Deploy to Cloudflare Workers
npm run dev:worker          # Test Cloudflare Worker locally
```

### Full Development Setup
```bash
# Terminal 1: Start backend
cd backend && npm run dev

# Terminal 2: Start frontend  
cd app && npm start
```

## High-Level Architecture

### Frontend Architecture (`/app`)

**Modular Component Structure**:
- `components/ui/` - Core reusable UI library with centralized index exports
- `components/home/` - HomeScreen-specific components (HomeHeader, ActionCardPair)
- `components/booking/` - BookingScreen components (ParallaxHeader, DateSelector, TimeSlotGrid)
- `components/profile/` - ProfileScreen components (ProfileHeader, ProfileInfo)

**Navigation System**:
- **AppNavigator**: Root stack navigator with slide-right transitions
- **TabNavigator**: Bottom tab navigation with dynamic icon configuration
- **Route Management**: All route names centralized in `constants/navigation.js`

**Import Patterns**:
```javascript
// UI Components
import { Button, Chip, Avatar, Badge } from '../components/ui';

// Screen-specific components
import { HomeHeader, ActionCardPair } from '../components/home';
import { ParallaxHeader, DateSelector } from '../components/booking';

// Constants and utilities
import { colors, spacing, typography, ROUTES } from '../constants';
import { useParallax, useHeaderTap } from '../hooks';
```

**Styling System**:
- **Tailwind CSS**: Always use NativeWind classes, never inline styles
- **Theme Constants**: Centralized in `constants/theme.js`
- **Responsive Design**: Utility functions in `utils/dimensions.js`

### Backend Architecture (`/backend`)

**Dual Deployment Strategy**:
- **Express.js Server** (`server.js`): Full-featured development server
- **Cloudflare Workers** (`worker.js`): Edge-deployed version with limitations

**Route Organization**:
```
/api/auth/*        # Authentication (login, register, logout)
/api/users/*       # User profiles, stats, connections, bookings
/api/matches/*     # Match management, open matches, join/create
/api/clubs/*       # Club search, details, availability
/api/bookings/*    # Court booking system
/api/images-simple/* # AI image generation with caching
/api/static-images/* # Static asset serving
```

**Key Backend Patterns**:
- **Mock Authentication**: Admin user `kirill.romanov@example.com` with any password
- **Stateless Design**: Server doesn't persist changes between restarts
- **Consistent Responses**: All endpoints return standardized format via `utils/responseHelper.js`
- **CORS Configuration**: Configured for React Native dev servers (ports 8081, 19006)

### Frontend-Backend Integration

**API Service Layer**:
- `services/api.js` - Main API client with authentication handling
- `services/imageAPI.js` - Separate image generation service
- **Auto-login**: Development mode automatically logs in as mock user
- **Token Management**: AsyncStorage-based JWT persistence

**Data Consistency**:
- **Avatar URLs**: Always use `width=100&height=100` for user avatars
- **User IDs**: Consistent mapping between matches and profiles
- **Authentication**: Use `mock-token-12345` for admin user access

## Development Workflow

### Component Development
1. Check existing UI components in `components/ui/` before creating new ones
2. Import constants from centralized locations rather than hardcoding
3. Follow established component composition patterns
4. Maintain Russian localization for user-facing text

### API Development
1. Mock data is centralized in `backend/data/mockData.js`
2. All responses use `utils/responseHelper.js` for consistency
3. Authentication flows through `middleware/auth.js`
4. Test endpoints with provided curl examples in backend README

### Build and Deployment
1. **Frontend**: Use EAS build system for distribution
2. **Backend**: Deploy to Cloudflare Workers for production
3. **Testing**: Backend provides comprehensive mock data for realistic testing

## Hidden Features

**Components Library**: Tap the home screen title 5 times to open the hidden ComponentsLibrary screen for UI component reference.

## Environment Configuration

**Backend Environment Variables**:
```
RUNWARE_API_TOKEN=your_api_token_here  # For AI image generation
PORT=3000                              # Server port (default)
```

## Development Guidelines

- **CSS Styling**: Always use Tailwind CSS classes (NativeWind integration)
- **File Structure**: Prefer editing existing files over creating new ones unless absolutely necessary
- **Dependencies**: Check existing package.json before adding new libraries
- **Backend Dependency**: Start backend server before running React Native app for full functionality
- **Mock Data**: Use consistent user IDs and authentication tokens across frontend and backend

## Additional Development Notes

### Cloudflare Workers Deployment
The backend supports dual deployment with specific configurations:
- **Express Server** (`server.js`): Full-featured development server
- **Cloudflare Workers** (`worker.js`): Edge deployment with limitations (no file system, limited image generation)
- **Deployment Commands**: `npm run deploy`, `npm run dev:worker` for local testing

### Build Configuration Details
- **EAS Build Profiles**: `development`, `preview`, `production` configured in `eas.json`
- **Resource Classes**: Medium instances for iOS builds
- **Android Builds**: APK format for preview, production uses default
- **Simulator Support**: Enabled for iOS preview builds

### Port Configuration
- **Frontend**: Port 8082 (Expo dev server)
- **Backend Express**: Port 3000 (configurable via PORT env var)
- **Cloudflare Worker Dev**: Port 8787
- **CORS**: Configured for ports 8081, 19006, and exp:// protocols

### Current Development State
The project typically maintains working changes during development. Files like `CommunityScreen.js`, `api.js`, `server.js`, `worker.js`, and `backend/routes/community.js` may have uncommitted changes that represent active development work.