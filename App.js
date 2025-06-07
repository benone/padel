import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import { colors } from './constants';
import './global.css';

export default function App() {
  return (
    <NavigationContainer>
      <AppNavigator />
      <StatusBar style="light" backgroundColor={colors.status.bar} />
    </NavigationContainer>
  );
}
