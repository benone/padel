// Web URL linking configuration for React Navigation
import { ROUTES } from './navigation';

export const LINKING_CONFIG = {
  prefixes: ['http://localhost:8082', 'https://yourapp.com'],
  config: {
    screens: {
      [ROUTES.MAIN]: {
        screens: {
          Home: '',
          Community: 'community',
          Profile: 'profile',
        },
      },
      [ROUTES.BOOKING]: 'booking/:clubId?',
      [ROUTES.CLUB_HOME]: 'club/:clubId',
      [ROUTES.PROFILE]: 'user/:userId',
      [ROUTES.OPEN_MATCHES]: 'matches',
      [ROUTES.MATCH_DETAILS]: 'match/:matchId',
      [ROUTES.NEW_MATCH]: 'create-match/:venueType?',
      [ROUTES.COMPONENTS_LIBRARY]: 'components',
    },
  },
};