import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import CommunityScreen from '../screens/CommunityScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CustomHeader from '../components/CustomHeader';

const Tab = createBottomTabNavigator();

function TabIcon({ focused, name }) {
  const iconMap = {
    'Home': focused ? 'home' : 'home-outline',
    'Community': focused ? 'people' : 'people-outline', 
    'Profile': focused ? 'person' : 'person-outline'
  };
  
  return (
    <Ionicons 
      name={iconMap[name]}
      size={32}
      color={focused ? '#2563eb' : '#9ca3af'}
    />
  );
}

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => (
          <TabIcon focused={focused} name={route.name} />
        ),
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarLabelStyle: {
          marginTop: 8,
        },
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          paddingBottom: 10,
          paddingTop: 10,
          height: 80,
        },
        header: ({ route }) => <CustomHeader title={route.name} />,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Главная' }} />
      <Tab.Screen name="Community" component={CommunityScreen} options={{ title: 'Сообщество' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Профиль' }} />
    </Tab.Navigator>
  );
}