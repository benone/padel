import React from 'react';
import { View, ScrollView } from 'react-native';
import { HomeHeader, ActionCardPair } from '../components/home';
import { useHeaderTap } from '../hooks/useHeaderTap';
import { ROUTES, spacing } from '../constants';

export default function HomeScreen({ navigation }) {
  const { handleHeaderTap } = useHeaderTap(() => {
    navigation.navigate(ROUTES.COMPONENTS_LIBRARY);
  });
  
  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View style={{ padding: spacing.md }}>
        <HomeHeader onTap={handleHeaderTap} />
        <ActionCardPair navigation={navigation} />
      </View>
    </ScrollView>
  );
}