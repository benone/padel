import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import CommunityScreen from '../screens/CommunityScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CustomHeader from '../components/CustomHeader';
import { colors, spacing } from '../constants';

const Tab = createBottomTabNavigator();

const TAB_CONFIG = {
  Home: {
    title: 'Главная',
    iconFocused: 'home',
    iconOutline: 'home-outline',
  },
  Community: {
    title: 'Сообщество',
    iconFocused: 'people',
    iconOutline: 'people-outline',
  },
  Profile: {
    title: 'Профиль',
    iconFocused: 'person',
    iconOutline: 'person-outline',
  },
};

function TabIcon({ focused, name }) {
  const config = TAB_CONFIG[name];
  const iconName = focused ? config.iconFocused : config.iconOutline;
  const iconColor = focused ? colors.primary[600] : colors.gray[400];
  
  return <Ionicons name={iconName} size={32} color={iconColor} />;
}

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => (
          <TabIcon focused={focused} name={route.name} />
        ),
        tabBarActiveTintColor: colors.primary[600],
        tabBarInactiveTintColor: colors.gray[400],
        tabBarLabelStyle: {
          marginTop: spacing.sm,
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
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: TAB_CONFIG.Home.title }} />
      <Tab.Screen name="Community" component={CommunityScreen} options={{ title: TAB_CONFIG.Community.title }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: TAB_CONFIG.Profile.title }} />
    </Tab.Navigator>
  );
}