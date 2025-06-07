import { createStackNavigator } from '@react-navigation/stack';
import TabNavigator from './TabNavigator';
import BookingScreen from '../screens/BookingScreen';
import ClubHomeScreen from '../screens/ClubHomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import OpenMatchesScreen from '../screens/OpenMatchesScreen';
import MatchDetailsScreen from '../screens/MatchDetailsScreen';
import NewMatchScreen from '../screens/NewMatchScreen';
import ComponentsLibrary from '../components/ComponentsLibrary';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: ({ current, layouts }) => {
          return {
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
          };
        },
      }}
    >
      <Stack.Screen name="Main" component={TabNavigator} />
      <Stack.Screen name="Booking" component={BookingScreen} />
      <Stack.Screen name="ClubHome" component={ClubHomeScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="OpenMatches" component={OpenMatchesScreen} />
      <Stack.Screen name="MatchDetails" component={MatchDetailsScreen} />
      <Stack.Screen name="NewMatch" component={NewMatchScreen} />
      <Stack.Screen name="ComponentsLibrary" component={ComponentsLibrary} />
    </Stack.Navigator>
  );
}