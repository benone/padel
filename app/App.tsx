import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import { colors, LINKING_CONFIG } from './constants';
import { initializeAuth } from './services/api';
import './global.css';

export default function App(): React.JSX.Element {
  useEffect(() => {
    // Initialize authentication on app start
    initializeAuth();
  }, []);

  return (
    <NavigationContainer linking={LINKING_CONFIG}>
      <AppNavigator />
      <StatusBar style="light" backgroundColor={colors.status.bar} />
    </NavigationContainer>
  );
}
