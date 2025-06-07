import React from 'react';
import { View, Text } from 'react-native';
import { typography, spacing } from '../constants';

export default function CommunityScreen() {
  return (
    <View className="flex-1 bg-white items-center justify-center">
      <Text 
        style={{ 
          fontSize: typography.sizes.xxl, 
          fontWeight: typography.weights.bold, 
          color: '#1f2937',
          marginBottom: spacing.sm 
        }}
      >
        Сообщество
      </Text>
      <Text 
        style={{ 
          fontSize: typography.sizes.base, 
          color: '#6b7280' 
        }}
      >
        Связь с игроками
      </Text>
    </View>
  );
}