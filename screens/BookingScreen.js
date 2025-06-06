import { View, Text, TouchableOpacity, ScrollView, Image, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

export default function BookingScreen({ navigation }) {
  const [showAvailableOnly, setShowAvailableOnly] = useState(true);
  const [selectedDate, setSelectedDate] = useState(9);
  const [selectedTime, setSelectedTime] = useState('10:00');

  const dates = [
    { day: 'ВС', date: 7, month: 'Июн' },
    { day: 'ПН', date: 8, month: 'Июн' },
    { day: 'ВТ', date: 9, month: 'Июн' },
    { day: 'СР', date: 10, month: 'Июн' },
    { day: 'ЧТ', date: 11, month: 'Июн' },
    { day: 'ПТ', date: 12, month: 'Июн' },
    { day: 'СБ', date: 13, month: 'Июн' },
  ];

  const timeSlots = [
    '08:00', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30', '13:00',
    '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '21:30'
  ];

  return (
    <View className="flex-1 bg-white border-t border-red-500">
      {/* Header with image */}
      <View style={{ position: 'relative', height: 200, backgroundColor: '#f3f4f6' }}>
        <Image
          source={{ uri: 'https://static.tildacdn.com/tild3734-3865-4165-a531-633635373766/BG.png' }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            height: '100%'
          }}
          resizeMode="cover"
        />
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          paddingTop: 48,
          paddingHorizontal: 16,
          paddingBottom: 16,
          flexDirection: 'row',
          justifyContent: 'space-between'
        }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: 'rgba(255,255,255,0.9)',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Ionicons name="arrow-back" size={24} color="#1f2937" />
          </TouchableOpacity>

          <TouchableOpacity style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: 'rgba(255,255,255,0.9)',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Ionicons name="share-outline" size={24} color="#1f2937" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <View style={{
        flex: 1,
        backgroundColor: 'red',
        marginTop: -10,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
      }}>
        <View style={{ padding: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <Text style={{ fontSize: 24, fontWeight: '700', color: '#1f2937' }}>
              Padel Club Moscow
            </Text>
            <TouchableOpacity>
              <Ionicons name="heart-outline" size={28} color="#1f2937" />
            </TouchableOpacity>
          </View>

          <Text style={{ fontSize: 16, color: '#6b7280', marginBottom: 20 }}>
            ул. Ленина 15, Москва
          </Text>

          {/* Tabs */}
          <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#e5e7eb' }}>
            <TouchableOpacity style={{ paddingBottom: 12, marginRight: 24 }}>
              <Text style={{ fontSize: 16, color: '#6b7280' }}>Главная</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ paddingBottom: 12, marginRight: 24, borderBottomWidth: 2, borderBottomColor: '#1f2937' }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#1f2937' }}>Забронировать</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ paddingBottom: 12, marginRight: 24 }}>
              <Text style={{ fontSize: 16, color: '#6b7280' }}>Открытые матчи</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ paddingBottom: 12 }}>
              <Text style={{ fontSize: 16, color: '#6b7280' }}>Активные</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={{ flex: 1 }}>
          {/* Date selector */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ paddingHorizontal: 20, marginTop: 20 }}
          >
            {dates.map((date, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedDate(date.date)}
                style={{
                  alignItems: 'center',
                  marginRight: 16,
                  padding: 10,
                  borderRadius: 12,
                  backgroundColor: selectedDate === date.date ? '#1e3a4a' : 'white',
                  borderWidth: selectedDate === date.date ? 0 : 1,
                  borderColor: '#e5e7eb',
                  minWidth: 60
                }}
              >
                <Text style={{
                  fontSize: 12,
                  color: selectedDate === date.date ? 'white' : '#6b7280',
                  marginBottom: 4
                }}>
                  {date.day}
                </Text>
                <Text style={{
                  fontSize: 18,
                  fontWeight: '600',
                  color: selectedDate === date.date ? 'white' : '#1f2937',
                  marginBottom: 4
                }}>
                  {date.date < 10 ? `0${date.date}` : date.date}
                </Text>
                <Text style={{
                  fontSize: 12,
                  color: selectedDate === date.date ? 'white' : '#6b7280'
                }}>
                  {date.month}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Show available only toggle */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            marginTop: 20
          }}>
            <Text style={{ fontSize: 16, color: '#1f2937' }}>
              Показать только доступные
            </Text>
            <Switch
              value={showAvailableOnly}
              onValueChange={setShowAvailableOnly}
              trackColor={{ false: '#e5e7eb', true: '#2563eb' }}
              thumbColor="white"
            />
          </View>

          {/* Time slots */}
          <View style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            paddingHorizontal: 20,
            marginTop: 20,
            paddingBottom: 100
          }}>
            {timeSlots.map((time, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedTime(time)}
                style={{
                  width: '18%',
                  aspectRatio: 1.5,
                  marginRight: '2%',
                  marginBottom: 10,
                  backgroundColor: selectedTime === time ? '#1e3a4a' : 'white',
                  borderWidth: 1,
                  borderColor: selectedTime === time ? '#1e3a4a' : '#e5e7eb',
                  borderRadius: 8,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Text style={{
                  fontSize: 14,
                  fontWeight: '500',
                  color: selectedTime === time ? 'white' : '#1f2937'
                }}>
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Priority alerts */}
          <TouchableOpacity style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingVertical: 16,
            borderTopWidth: 1,
            borderTopColor: '#e5e7eb'
          }}>
            <Text style={{ fontSize: 20, marginRight: 12 }}>🔔</Text>
            <Text style={{ fontSize: 16, color: '#1f2937' }}>
              Приоритетные уведомления
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}
