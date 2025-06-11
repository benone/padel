import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TabNavigator from './TabNavigator';
import BookingScreen from '../screens/BookingScreen';
import ClubHomeScreen from '../screens/ClubHomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import OpenMatchesScreen from '../screens/OpenMatchesScreen';
import MatchDetailsScreen from '../screens/MatchDetailsScreen';
import NewMatchScreen from '../screens/NewMatchScreen';
import ComponentsLibrary from '../components/ComponentsLibrary';
import { ROUTES, NAVIGATION_CONFIG } from '../constants';

export type RootStackParamList = {
  [ROUTES.MAIN]: undefined;
  [ROUTES.BOOKING]: { clubId?: string };
  [ROUTES.CLUB_HOME]: { clubId: string };
  [ROUTES.PROFILE]: { userId?: string };
  [ROUTES.OPEN_MATCHES]: undefined;
  [ROUTES.MATCH_DETAILS]: { matchId: string };
  [ROUTES.NEW_MATCH]: undefined;
  [ROUTES.COMPONENTS_LIBRARY]: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator(): React.JSX.Element {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: NAVIGATION_CONFIG.cardStyleInterpolator,
        cardStyle: { flex: 1 },
      }}
    >
      <Stack.Screen name={ROUTES.MAIN} component={TabNavigator} />
      <Stack.Screen name={ROUTES.BOOKING} component={BookingScreen} />
      <Stack.Screen name={ROUTES.CLUB_HOME} component={ClubHomeScreen} />
      <Stack.Screen name={ROUTES.PROFILE} component={ProfileScreen} />
      <Stack.Screen name={ROUTES.OPEN_MATCHES} component={OpenMatchesScreen} />
      <Stack.Screen name={ROUTES.MATCH_DETAILS} component={MatchDetailsScreen} />
      <Stack.Screen name={ROUTES.NEW_MATCH} component={NewMatchScreen} />
      <Stack.Screen name={ROUTES.COMPONENTS_LIBRARY} component={ComponentsLibrary} />
    </Stack.Navigator>
  );
}