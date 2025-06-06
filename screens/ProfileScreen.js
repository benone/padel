import { View, Text } from 'react-native';

export default function ProfileScreen() {
  return (
    <View className="flex-1 bg-white items-center justify-center">
      <Text className="text-2xl font-bold text-gray-800">Профиль</Text>
      <Text className="text-gray-600 mt-2">Ваш профиль игрока</Text>
    </View>
  );
}