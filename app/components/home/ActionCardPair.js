import React from 'react';
import { View } from 'react-native';
import { ActionCard } from '../ui';
import { images, colors, spacing } from '../../constants';
import { getCardWidth } from '../../utils';
import { getGeneratedImageUrl } from '../../config/api.config';

const ACTION_CARDS_CONFIG = [
  {
    title: 'Забронировать корт',
    subtitle: 'Если вы уже знаете с кем будете играть',
    image: getGeneratedImageUrl('professional woman playing padel tennis blue toned athletic pose', 300, 150),
    icon: 'search',
    backgroundColor: colors.primary[50],
    route: 'Booking',
  },
  {
    title: 'Играть открытый матч',
    subtitle: 'Если вы ищете игроков вашего уровня',
    image: images.courts.courtBg2,
    icon: 'people',
    backgroundColor: colors.secondary[50],
    route: 'OpenMatches',
  },
];

export default function ActionCardPair({ navigation }) {
  const cardWidth = getCardWidth();

  return (
    <View style={{ flexDirection: 'row', gap: spacing.md }}>
      {ACTION_CARDS_CONFIG.map((card, index) => (
        <ActionCard
          key={index}
          title={card.title}
          subtitle={card.subtitle}
          image={card.image}
          icon={card.icon}
          backgroundColor={card.backgroundColor}
          onPress={() => navigation.navigate(card.route)}
          style={{ width: cardWidth }}
        />
      ))}
    </View>
  );
}