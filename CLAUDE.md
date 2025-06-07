# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
This is a React Native Expo application for padel court booking and community features. The app uses React Navigation for routing, NativeWind for Tailwind CSS styling, and a custom component library for UI consistency.

## Common Commands
```bash
npm start          # Start development server on port 8082
npm run android    # Start with Android simulator
npm run ios        # Start with iOS simulator
npm run web        # Start web version
```

## Architecture

### Navigation Structure
- **AppNavigator**: Root stack navigator with slide-right transitions
- **TabNavigator**: Bottom tab navigation for main screens (Home, Community, Profile)
- **Main Screens**: HomeScreen, BookingScreen, ProfileScreen, CommunityScreen
- **Hidden Screen**: ComponentsLibrary (accessed via 5-tap gesture on home title)

### Component System
The app uses a comprehensive reusable component library located in `components/ui/`:

**Core Components:**
- `Button` - Primary, secondary, icon, outline variants
- `Chip` - Active/inactive states with optional badges  
- `Avatar` - Single avatars and avatar pairs with status indicators
- `Badge` - Level badges, status indicators, win badges
- `Card` - ActionCard, MatchCard, PersonCard, ClubCard, StatCard, RankingCard
- `ProgressBar` - Customizable progress indicators
- `TabNavigation` - Animated tab navigation with sliding underline

**Import Pattern:**
```javascript
import { Button, Chip, Avatar, Badge } from '../components/ui';
```

### Screen Patterns
- **HomeScreen**: Action cards for court booking and match finding
- **BookingScreen**: Animated parallax header, sliding tab navigation, time slot selection
- **ProfileScreen**: Comprehensive user profile with stats, level tracking, social features
- **ComponentsLibrary**: Developer reference showing all UI components

### Styling Guidelines
- Use NativeWind (Tailwind CSS for React Native) for styling
- Custom component library handles most UI patterns
- Prefer reusable components over inline styles
- Russian localization throughout the app

### Development Server
- Default port: 8082 (configured in metro.config.js and package.json)
- Metro bundler with NativeWind integration
- Expo development workflow

### Hidden Features
- **Components Library Access**: Tap the home screen title 5 times to open the hidden ComponentsLibrary screen for UI component reference

### File Organization
```
screens/           # Main application screens
navigation/        # Navigation configuration
components/
  ui/             # Reusable UI component library
  ComponentsLibrary.js  # Hidden developer reference
assets/           # Local images and icons
```

## Development Guidelines
- Do what has been asked; nothing more, nothing less
- NEVER create files unless they're absolutely necessary for achieving your goal
- ALWAYS prefer editing an existing file to creating a new one
- NEVER proactively create documentation files (*.md) or README files unless explicitly requested
- Use existing UI components from `components/ui/` before creating new ones
- Maintain Russian localization for user-facing text