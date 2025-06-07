import { View, Text, TouchableOpacity, Image, ScrollView, Dimensions } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { ActionCard } from '../components/ui';

// Import local assets
const assets = {
  courtImage1: require('../assets/court-bg-1.png'),
  courtImage2: require('../assets/court-bg-2.png'),
};

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

export default function HomeScreen({ navigation }) {
  const [tapCount, setTapCount] = useState(0);
  
  const handleHeaderTap = () => {
    setTapCount(prev => prev + 1);
    
    // If user taps the header 5 times, open Components Library
    if (tapCount === 4) {
      navigation.navigate('ComponentsLibrary');
      setTapCount(0);
    }
    
    // Reset counter after 3 seconds
    setTimeout(() => setTapCount(0), 3000);
  };
  
  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View style={{ padding: 16 }}>
        <TouchableOpacity onPress={handleHeaderTap} activeOpacity={1}>
          <Text style={{ fontSize: 24, fontWeight: '700', color: '#1f2937', marginBottom: 20, marginTop: 10 }}>
            Сыграй свой идеальный матч
          </Text>
        </TouchableOpacity>
        
        <View style={{ flexDirection: 'row', gap: 16 }}>
          <ActionCard
            title="Забронировать корт"
            subtitle="Если вы уже знаете с кем будете играть"
            image={assets.courtImage1}
            icon="search"
            backgroundColor="#e3f2fd"
            onPress={() => navigation.navigate('Booking')}
            style={{ width: cardWidth }}
          />
          
          <ActionCard
            title="Играть открытый матч"
            subtitle="Если вы ищете игроков вашего уровня"
            image={assets.courtImage2}
            icon="people"
            backgroundColor="#f3e5f5"
            onPress={() => navigation.navigate('OpenMatches')}
            style={{ width: cardWidth }}
          />
        </View>
      </View>
    </ScrollView>
  );
}