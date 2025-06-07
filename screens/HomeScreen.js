import { View, Text, TouchableOpacity, Image, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Import local assets
const assets = {
  courtImage1: require('../assets/court-bg-1.png'),
  courtImage2: require('../assets/court-bg-2.png'),
};

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

export default function HomeScreen({ navigation }) {
  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: '700', color: '#1f2937', marginBottom: 20, marginTop: 10 }}>
          Сыграй свой идеальный матч
        </Text>
        
        <View style={{ flexDirection: 'row', gap: 16 }}>
          <TouchableOpacity 
            onPress={() => navigation.navigate('Booking')}
            activeOpacity={0.95}
            style={{ 
              backgroundColor: 'white',
              borderRadius: 16,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 12,
              elevation: 3,
              overflow: 'hidden',
              width: cardWidth
            }}
          >
            <View style={{ position: 'relative', backgroundColor: '#e3f2fd', height: 120 }}>
              <Image 
                source={assets.courtImage1}
                style={{ width: '100%', height: 120 }}
                resizeMode="cover"
                onError={(e) => console.log('Image 1 error:', e.nativeEvent.error)}
              />
              <View style={{ 
                position: 'absolute',
                bottom: -20,
                left: 16,
                backgroundColor: '#1e3a4a', 
                width: 40, 
                height: 40, 
                borderRadius: 12, 
                alignItems: 'center', 
                justifyContent: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.15,
                shadowRadius: 8,
                elevation: 3
              }}>
                <Ionicons name="search" size={20} color="white" />
              </View>
            </View>
            <View style={{ padding: 16, paddingTop: 28 }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#1f2937', marginBottom: 6 }}>
                Забронировать{'\n'}корт
              </Text>
              <Text style={{ fontSize: 12, color: '#6b7280', lineHeight: 18 }}>
                Если вы уже знаете{'\n'}с кем будете играть
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            activeOpacity={0.95}
            style={{ 
              backgroundColor: 'white',
              borderRadius: 16,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 12,
              elevation: 3,
              overflow: 'hidden',
              width: cardWidth
            }}
          >
            <View style={{ position: 'relative', backgroundColor: '#f3e5f5', height: 120 }}>
              <Image 
                source={assets.courtImage2}
                style={{ width: '100%', height: 120 }}
                resizeMode="cover"
                onError={(e) => console.log('Image 2 error:', e.nativeEvent.error)}
              />
              <View style={{ 
                position: 'absolute',
                bottom: -20,
                left: 16,
                backgroundColor: '#1e3a4a', 
                width: 40, 
                height: 40, 
                borderRadius: 12, 
                alignItems: 'center', 
                justifyContent: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.15,
                shadowRadius: 8,
                elevation: 3
              }}>
                <View style={{ width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: 'white' }}>
                  <View style={{ position: 'absolute', right: -3, top: 6, width: 8, height: 2, backgroundColor: 'white', transform: [{ rotate: '45deg' }] }} />
                </View>
              </View>
            </View>
            <View style={{ padding: 16, paddingTop: 28 }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#1f2937', marginBottom: 6 }}>
                Играть{'\n'}открытый матч
              </Text>
              <Text style={{ fontSize: 12, color: '#6b7280', lineHeight: 18 }}>
                Если вы ищете{'\n'}игроков вашего{'\n'}уровня
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}