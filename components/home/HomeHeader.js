import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { typography, spacing } from '../../constants';

export default function HomeHeader({ onTap }) {
  return (
    <TouchableOpacity onPress={onTap} activeOpacity={1}>
      <Text 
        style={{ 
          fontSize: typography.sizes.xxl, 
          fontWeight: typography.weights.bold, 
          color: '#1f2937', 
          marginBottom: spacing.lg, 
          marginTop: spacing.sm 
        }}
      >
        Сыграй свой идеальный матч
      </Text>
    </TouchableOpacity>
  );
}