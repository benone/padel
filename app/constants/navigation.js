// Navigation route names and configuration
export const ROUTES = {
  // Stack routes
  MAIN: 'Main',
  BOOKING: 'Booking',
  CLUB_HOME: 'ClubHome',
  PROFILE: 'Profile',
  OPEN_MATCHES: 'OpenMatches',
  MATCH_DETAILS: 'MatchDetails',
  NEW_MATCH: 'NewMatch',
  COMPONENTS_LIBRARY: 'ComponentsLibrary',
  
  // Tab routes
  HOME: 'Home',
  COMMUNITY: 'Community',
  PROFILE_TAB: 'ProfileTab',
};

export const NAVIGATION_CONFIG = {
  cardStyleInterpolator: ({ current, layouts }) => ({
    cardStyle: {
      transform: [
        {
          translateX: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [layouts.screen.width, 0],
          }),
        },
      ],
    },
  }),
};