import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Switch,
  Animated,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { 
  ParallaxHeader, 
  ClubHeader, 
  TabNavigation, 
  DateSelector, 
  TimeSlotGrid,
  styles 
} from '../components/booking';
import { useParallax } from '../hooks/useParallax';
import { useTabAnimation } from '../hooks/useTabAnimation';
import { TABS } from '../constants/booking';
import { clubsAPI, bookingsAPI } from '../services/api';

export default function BookingScreen({ navigation, route }) {
  const [showAvailableOnly, setShowAvailableOnly] = useState(true);
  const [selectedDate, setSelectedDate] = useState(9);
  const [selectedTime, setSelectedTime] = useState('10:00');
  const [activeTab, setActiveTab] = useState(TABS.RESERVE);
  
  // API data states
  const [clubData, setClubData] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(false);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [bookingConfig, setBookingConfig] = useState(null);
  
  // Get club ID from route params or use default
  const clubId = route?.params?.clubId || 'club_123';
  
  const {
    scrollY,
    headerHeight,
    imageScale,
    imageTranslateY,
    buttonsOpacity,
  } = useParallax();
  
  const { underlinePosition } = useTabAnimation(activeTab);

  // Load club data on mount
  useEffect(() => {
    loadClubData();
    // Set hardcoded booking config
    setBookingConfig({
      defaultDuration: 90,
      durations: [
        { value: 60, label: '60мин', price: 2000 },
        { value: 90, label: '90мин', price: 3000 },
        { value: 120, label: '120мин', price: 4000 }
      ],
      timeSlots: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'],
      genderOptions: [
        { id: 'mixed', label: 'Все игроки' },
        { id: 'male', label: 'Только мужчины' },
        { id: 'female', label: 'Только женщины' }
      ],
      defaultPrice: 3000
    });
  }, [clubId]);

  // Load availability when date changes
  useEffect(() => {
    console.log('🔍 Availability useEffect triggered:', { 
      clubData: !!clubData, 
      selectedDate, 
      availabilityLength: availability.length 
    });
    if (clubData && selectedDate) {
      loadAvailability();
    }
  }, [clubData, selectedDate]);

  const loadClubData = async () => {
    try {
      setLoading(true);
      console.log(`🏢 BookingScreen: Loading club data for ID: ${clubId}`);
      const response = await clubsAPI.getDetails(clubId);
      console.log(`✅ BookingScreen: Club data loaded successfully:`, response.data);
      setClubData(response.data);
    } catch (error) {
      console.error('❌ BookingScreen: Failed to load club data:', error);
      console.error('❌ BookingScreen: Error details:', {
        message: error.message,
        stack: error.stack,
        clubId: clubId
      });
      Alert.alert('Ошибка', 'Не удалось загрузить информацию о клубе');
    } finally {
      setLoading(false);
    }
  };

  const loadAvailability = async () => {
    try {
      setAvailabilityLoading(true);
      console.log('🔄 Loading availability data...');
      const date = new Date();
      date.setDate(date.getDate() + selectedDate - new Date().getDate());
      const dateStr = date.toISOString().split('T')[0];
      
      // Add timeout to prevent infinite loading
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Availability request timeout')), 10000)
      );
      
      const response = await Promise.race([
        clubsAPI.getAvailability(clubId, {
          date: dateStr,
          sport: 'padel'
        }),
        timeoutPromise
      ]);
      
      console.log('✅ Availability data loaded:', response);
      console.log('📊 Response structure:', JSON.stringify(response, null, 2));
      
      // Check if response has the expected structure
      if (!response || !response.data) {
        console.warn('⚠️ Invalid response structure:', response);
        setAvailability([]);
        return;
      }
      
      // Transform the flat array of time slots into grouped format
      const timeSlots = response.data.timeSlots || [];
      const groupedSlots = timeSlots.reduce((acc, slot) => {
        const existingTime = acc.find(item => item.time === slot.time);
        const court = {
          id: slot.court_id,
          available: slot.available,
          price: slot.price
        };
        
        if (existingTime) {
          existingTime.courts.push(court);
        } else {
          acc.push({
            time: slot.time,
            courts: [court]
          });
        }
        return acc;
      }, []);
      
      console.log('📊 Transformed availability data:', JSON.stringify(groupedSlots, null, 2));
      setAvailability(groupedSlots);
      console.log('✅ Availability state updated successfully');
    } catch (error) {
      console.error('❌ Failed to load availability:', error);
      console.error('❌ Error details:', {
        message: error.message,
        stack: error.stack
      });
      // Set empty availability on error to prevent infinite loading
      setAvailability([]);
    } finally {
      setAvailabilityLoading(false);
    }
  };

  const handleBooking = async (timeSlot, courtId) => {
    try {
      const date = new Date();
      date.setDate(date.getDate() + selectedDate - new Date().getDate());
      const dateStr = date.toISOString().split('T')[0];

      const bookingData = {
        clubId,
        courtId,
        date: dateStr,
        time: timeSlot,
        duration: bookingConfig?.defaultDuration || 90,
        sport: 'padel',
        totalPrice: bookingConfig?.defaultPrice || 3000
      };

      setLoading(true);
      const response = await bookingsAPI.create(bookingData);
      
      Alert.alert(
        'Успешно!', 
        `Бронирование подтверждено. Код: ${response.data.confirmationCode}`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Booking failed:', error);
      Alert.alert('Ошибка', 'Не удалось создать бронирование');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <ParallaxHeader
        navigation={navigation}
        headerHeight={headerHeight}
        imageScale={imageScale}
        imageTranslateY={imageTranslateY}
        buttonsOpacity={buttonsOpacity}
      />

      <View style={styles.panel}>
        <ClubHeader clubData={clubData} />
        <TabNavigation
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          underlinePosition={underlinePosition}
        />

        <Animated.ScrollView
          contentContainerStyle={styles.scrollBody}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
          bounces={true}
          alwaysBounceVertical={false}
          overScrollMode="never"
        >
          {activeTab === TABS.HOME && (
            <ClubInformationTab clubData={clubData} />
          )}

          {activeTab === TABS.RESERVE && (
            <ReservationTab
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              selectedTime={selectedTime}
              setSelectedTime={setSelectedTime}
              showAvailableOnly={showAvailableOnly}
              setShowAvailableOnly={setShowAvailableOnly}
              availability={availability}
              onBooking={handleBooking}
              availabilityLoading={availabilityLoading}
            />
          )}

          {activeTab === TABS.MATCHES && (
            <ComingSoonTab title="Открытые матчи" />
          )}

          {activeTab === TABS.ACTIVE && (
            <ComingSoonTab title="Активные матчи" />
          )}
        </Animated.ScrollView>
      </View>
    </SafeAreaView>
  );
}

function ClubInformationTab({ clubData }) {
  if (!clubData) {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Загрузка...</Text>
      </View>
    );
  }

  const padelSport = clubData.sports?.find(s => s.name === 'Падел');
  
  return (
    <View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Информация о клубе</Text>
        
        <View style={styles.sportRow}>
          <View style={styles.sportIcon}>
            <Ionicons name="tennisball-outline" size={24} color="#1f2937" />
          </View>
          <Text style={styles.sportText}>Падел</Text>
        </View>

        <Text style={styles.courtsText}>
          {padelSport?.courts || 0} доступн{padelSport?.courts === 1 ? 'ый корт' : 'ых корта'}
        </Text>

        <View style={styles.amenitiesRow}>
          {clubData.amenities?.wheelchairAccessible && (
            <View style={styles.amenityChip}>
              <Ionicons name="accessibility-outline" size={18} color="#4b5563" />
              <Text style={styles.amenityText}>Спец. доступ</Text>
            </View>
          )}
          {clubData.amenities?.parking && (
            <View style={styles.amenityChip}>
              <Ionicons name="car-outline" size={18} color="#4b5563" />
              <Text style={styles.amenityText}>Бесплатная парковка</Text>
            </View>
          )}
          {clubData.amenities?.cafe && (
            <View style={styles.amenityChip}>
              <Ionicons name="cafe-outline" size={18} color="#4b5563" />
              <Text style={styles.amenityText}>Кафе</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionBtn}>
          <View style={styles.actionBtnActive}>
            <Ionicons name="navigate" size={24} color="white" />
          </View>
          <Text style={styles.actionText}>МАРШРУТ</Text>
        </TouchableOpacity>

        {clubData.contact?.website && (
          <TouchableOpacity style={styles.actionBtn}>
            <View style={styles.actionBtnOutline}>
              <Ionicons name="link-outline" size={24} color="#1f2937" />
            </View>
            <Text style={styles.actionText}>ВЕБ</Text>
          </TouchableOpacity>
        )}

        {clubData.contact?.phone && (
          <TouchableOpacity style={styles.actionBtn}>
            <View style={styles.actionBtnOutline}>
              <Ionicons name="call-outline" size={24} color="#1f2937" />
            </View>
            <Text style={styles.actionText}>ПОЗВОНИТЬ</Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity style={styles.mapContainer}>
        <View style={styles.mapPlaceholder}>
          <Ionicons name="map-outline" size={48} color="#6b7280" />
          <Text style={styles.mapText}>Посмотреть на карте</Text>
          <Text style={styles.mapSubText}>
            {clubData.address?.street}, {clubData.address?.city}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

function ReservationTab({ 
  selectedDate, 
  setSelectedDate, 
  selectedTime, 
  setSelectedTime, 
  showAvailableOnly, 
  setShowAvailableOnly,
  availability,
  onBooking,
  availabilityLoading
}) {
  const handleTimeSlotPress = (timeSlot, courtId) => {
    setSelectedTime(timeSlot);
    Alert.alert(
      'Подтвердить бронирование',
      `Забронировать корт на ${timeSlot}?`,
      [
        { text: 'Отмена', style: 'cancel' },
        { text: 'Забронировать', onPress: () => onBooking(timeSlot, courtId) }
      ]
    );
  };

  return (
    <View>
      <DateSelector selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
      
      <View style={[styles.rowBetween, { paddingHorizontal: 20, marginTop: 20, alignItems: 'center' }]}>
        <Text style={{ fontSize: 16, color: '#4b5563' }}>Показать только доступные</Text>
        <Switch
          value={showAvailableOnly}
          onValueChange={setShowAvailableOnly}
          trackColor={{ false: '#e5e7eb', true: '#3b82f6' }}
          thumbColor="#ffffff"
          ios_backgroundColor="#e5e7eb"
          style={{ transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }] }}
        />
      </View>

      {(() => {
        console.log('🎯 TimeSlotGrid render state:', { 
          availabilityLoading, 
          availabilityCount: availability.length,
          selectedTime,
          showAvailableOnly 
        });
        return null;
      })()}
      
      <TimeSlotGrid 
        selectedTime={selectedTime} 
        setSelectedTime={setSelectedTime}
        availability={availability}
        showAvailableOnly={showAvailableOnly}
        onTimeSlotPress={handleTimeSlotPress}
        loading={availabilityLoading}
      />

      <TouchableOpacity style={styles.alertRow}>
        <Ionicons name="notifications-outline" size={20} color="#1f2937" style={{ marginRight: 12 }} />
        <Text style={styles.alertText}>Приоритетные уведомления</Text>
      </TouchableOpacity>
    </View>
  );
}

function ComingSoonTab({ title }) {
  return (
    <View style={styles.tabContent}>
      <Text style={styles.comingSoon}>{title}</Text>
      <Text style={styles.comingSoonSub}>Скоро будет доступно</Text>
    </View>
  );
}

