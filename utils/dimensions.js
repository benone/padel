import { Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const getScreenDimensions = () => ({
  width: screenWidth,
  height: screenHeight,
});

export const getCardWidth = (padding = 48, columns = 2) => {
  return (screenWidth - padding) / columns;
};

export const getResponsiveSize = (size, factor = 1) => {
  const baseWidth = 375; // iPhone X width as base
  return (screenWidth / baseWidth) * size * factor;
};