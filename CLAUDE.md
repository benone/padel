# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
This is a React Native Expo application for padel court booking and community features. The app uses React Navigation for routing, NativeWind for Tailwind CSS styling, and a custom component library for UI consistency.

## Common Commands
```bash
# Development
npm start          # Start development server on port 8082
npm run android    # Start with Android simulator
npm run ios        # Start with iOS simulator
npm run web        # Start web version

# Building for distribution
npm run build:android    # Build Android APK for sharing
npm run build:ios        # Build iOS IPA for sharing
npm run build:all        # Build for both platforms
npm run build:dev        # Development builds with Expo Dev Client
```

## Architecture

### Modular Component Structure
The codebase follows a highly modular architecture with centralized exports:

**Component Organization:**
- `components/ui/` - Core reusable UI library with centralized index export
- `components/home/` - HomeScreen-specific components (HomeHeader, ActionCardPair)
- `components/booking/` - BookingScreen components (ParallaxHeader, DateSelector, TimeSlotGrid)
- `components/profile/` - ProfileScreen components (ProfileHeader, ProfileInfo)

**Constants & Utilities:**
- `constants/` - Centralized theme, navigation routes, assets, and booking data
- `hooks/` - Custom hooks (useHeaderTap, useParallax, useTabAnimation)
- `utils/` - Utility functions for dimensions and responsive design

### Navigation Structure
- **AppNavigator**: Root stack navigator with slide-right transitions using centralized ROUTES constants
- **TabNavigator**: Bottom tab navigation with dynamic icon configuration
- **Route Management**: All route names defined in `constants/navigation.js` as ROUTES object

### Component Import Patterns
```javascript
// UI Components
import { Button, Chip, Avatar, Badge } from '../components/ui';

// Screen-specific components
import { HomeHeader, ActionCardPair } from '../components/home';
import { ParallaxHeader, DateSelector } from '../components/booking';
import { ProfileHeader, ProfileInfo } from '../components/profile';

// Constants and utilities
import { colors, spacing, typography, ROUTES } from '../constants';
import { useParallax, useHeaderTap } from '../hooks';
```

### Styling System
- **Theme Constants**: Centralized color palette, spacing scale, and typography in `constants/theme.js`
- **NativeWind Integration**: Tailwind CSS classes for React Native
- **Responsive Design**: Utility functions in `utils/dimensions.js` for screen adaptation
- **Component Styles**: Dedicated style files for complex components (e.g., `components/booking/styles.js`)

### State Management Patterns
- **Custom Hooks**: Extracted complex state logic (parallax animations, tab transitions)
- **Component Composition**: Large screens broken into smaller, focused components
- **Props Interface**: Clean prop passing between parent and child components

### Asset Management
- **Centralized Assets**: All image imports in `constants/assets.js`
- **Organized Structure**: Icons, court images, and app assets properly categorized

### Build Configuration
- **EAS Integration**: Configured for Expo Application Services builds
- **Multi-profile Setup**: Development, preview, and production build profiles
- **Cross-platform**: Optimized for both iOS and Android distribution

### Hidden Features
- **Components Library Access**: Tap the home screen title 5 times to open the hidden ComponentsLibrary screen for UI component reference

## Development Guidelines
- Use existing UI components from `components/ui/` before creating new ones
- Import constants from centralized locations rather than hardcoding values
- Follow the established component composition patterns for new screens
- Maintain Russian localization for user-facing text
- Prefer editing existing files over creating new ones unless absolutely necessary