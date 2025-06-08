import { useRef, useEffect } from 'react';
import { Animated } from 'react-native';

const TAB_POSITIONS = {
  home: 10,
  reserve: 120,
  matches: 280,
  active: 440,
};

export const useTabAnimation = (activeTab) => {
  const underlinePosition = useRef(new Animated.Value(TAB_POSITIONS.home)).current;
  
  useEffect(() => {
    Animated.timing(underlinePosition, {
      toValue: TAB_POSITIONS[activeTab],
      duration: 150,
      useNativeDriver: false,
    }).start();
  }, [activeTab]);

  return { underlinePosition };
};