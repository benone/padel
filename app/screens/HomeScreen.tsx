import React from 'react';
import { View, ScrollView, Text, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HomeHeader, ActionCardPair } from '../components/home';
import { ActionCard } from '../components/ui';
import { useHeaderTap } from '../hooks/useHeaderTap';
import { ROUTES, spacing, colors, images } from '../constants';
import { getGeneratedImageUrl } from '../config/api.config';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { TabParamList } from '../navigation/TabNavigator';

type Props = BottomTabScreenProps<TabParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props): React.JSX.Element {
  const { handleHeaderTap } = useHeaderTap(() => {
    navigation.navigate(ROUTES.COMPONENTS_LIBRARY);
  });

  const handleInviteFriends = () => {
    Alert.alert(
      'Пригласить друзей',
      'Поделитесь PadelStar с друзьями и получите бонусы!',
      [
        {
          text: 'Поделиться',
          onPress: () => {
            // Here you would implement actual sharing functionality
            Alert.alert('Функция скоро будет доступна');
          }
        },
        { text: 'Отмена', style: 'cancel' }
      ]
    );
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View style={{ padding: spacing.md }}>
        <HomeHeader onTap={handleHeaderTap} />
        <ActionCardPair navigation={navigation} />

        {/* Training with Coach Section */}
        <View style={{ marginTop: spacing.md }}>
          <ActionCard
            title="Занятия с тренером"
            subtitle="Улучшите свою технику с профессионалом"
            image={getGeneratedImageUrl('very realistic man playing padel tennis bright green court professional training', 600, 200)}
            icon="school"
            iconColor="#f59e0b"
            onPress={() => Alert.alert('Занятия с тренером', 'Функция скоро будет доступна')}
            style={{ width: '100%' }}
          />
        </View>

        {/* Invite Friends Section */}
        <TouchableOpacity
          onPress={handleInviteFriends}
          style={{
            backgroundColor: 'white',
            borderRadius: 16,
            padding: 16,
            marginTop: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 4,
            borderWidth: 1,
            borderColor: '#f3f4f6'
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <View style={{
                width: 48,
                height: 48,
                backgroundColor: colors.primary[50],
                borderRadius: 24,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12
              }}>
                <Ionicons name="person-add" size={24} color={colors.primary[500]} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{
                  color: '#1f2937',
                  fontWeight: '600',
                  fontSize: 16,
                  marginBottom: 4
                }}>
                  Пригласи друзей в PadelStar
                </Text>
                <Text style={{
                  color: '#6b7280',
                  fontSize: 14
                }}>
                  Играйте вместе и получайте бонусы
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
