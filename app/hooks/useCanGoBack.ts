import { useNavigation } from '@react-navigation/native';
import { Platform } from 'react-native';

/**
 * Hook for smart back navigation
 * Always shows back button but navigates to home if no history
 */
export function useCanGoBack() {
  const navigation = useNavigation();
  
  const goBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      // Navigate to home tab if no history (e.g., direct URL access)
      navigation.navigate('Main', { screen: 'Home' });
    }
  };
  
  return {
    canGoBack: true, // Always show the back button
    goBack
  };
}