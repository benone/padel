import { useRef } from 'react';
import { Animated } from 'react-native';

export const useParallax = () => {
  const scrollY = useRef(new Animated.Value(0)).current;
  
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [280, 140],
    extrapolate: 'clamp',
  });
  
  const imageScale = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [1, 1.2],
    extrapolate: 'clamp',
  });
  
  const imageTranslateY = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [0, -50],
    extrapolate: 'clamp',
  });
  
  const buttonsOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.3],
    extrapolate: 'clamp',
  });

  return {
    scrollY,
    headerHeight,
    imageScale,
    imageTranslateY,
    buttonsOpacity,
  };
};