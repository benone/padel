import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CustomHeader({ title }) {
  return (
    <View style={{ backgroundColor: '#1e3a4a', paddingTop: 48, paddingBottom: 16, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ color: '#ffffff', fontSize: 20, fontWeight: '500' }}>Привет, Кирилл! </Text>
        <Text style={{ fontSize: 20 }}>👋</Text>
      </View>
      
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color="white" />
        </TouchableOpacity>
        
        <TouchableOpacity>
          <View style={{ flexDirection: 'column', gap: 3 }}>
            <View style={{ width: 24, height: 2, backgroundColor: 'white' }}></View>
            <View style={{ width: 24, height: 2, backgroundColor: 'white' }}></View>
            <View style={{ width: 24, height: 2, backgroundColor: 'white' }}></View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}