import React, { useState, useRef, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Switch,
  StyleSheet,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Import local assets
const assets = {
  headerImage: require('../assets/court-bg-1.png'),
};

export default function BookingScreen({ navigation }) {
  const [showAvailableOnly, setShowAvailableOnly] = useState(true);
  const [selectedDate, setSelectedDate] = useState(9);
  const [selectedTime, setSelectedTime] = useState('10:00');
  const [activeTab, setActiveTab] = useState('reserve');
  
  const scrollY = useRef(new Animated.Value(0)).current;
  
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [280, 140],
    extrapolate: 'clamp',
  });
  
  const imageScale = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [1, 1.2],
    extrapolate: 'clamp',
  });
  
  const imageTranslateY = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [0, -50],
    extrapolate: 'clamp',
  });
  
  const buttonsOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.3],
    extrapolate: 'clamp',
  });
  
  const underlinePosition = useRef(new Animated.Value(10)).current;
  
  const tabPositions = {
    home: 10,
    reserve: 120,
    matches: 280,
    active: 440
  };
  
  useEffect(() => {
    Animated.timing(underlinePosition, {
      toValue: tabPositions[activeTab],
      duration: 150,
      useNativeDriver: false,
    }).start();
  }, [activeTab]);

  const dates = [
    { day: 'ПТ', date: 6, month: 'Июн' },
    { day: 'СБ', date: 7, month: 'Июн' },
    { day: 'ВС', date: 8, month: 'Июн' },
    { day: 'ПН', date: 9, month: 'Июн' },
    { day: 'ВТ', date: 10, month: 'Июн' },
    { day: 'СР', date: 11, month: 'Июн' },
    { day: 'ЧТ', date: 12, month: 'Июн' },
  ];

  const timeSlots = [
    '08:00', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30', '13:00',
    '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '21:30',
  ];

  return (
    <SafeAreaView style={styles.root}>
      {/* ---------- Header ---------- */}
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <Animated.Image
          source={assets.headerImage}
          resizeMode="cover"
          style={[styles.headerImage, {
            transform: [
              { scale: imageScale },
              { translateY: imageTranslateY }
            ]
          }]}
          onError={(e) => console.log('Header image error:', e.nativeEvent.error)}
        />

        {/* back / share buttons */}
        <Animated.View style={[styles.headerBtns, { opacity: buttonsOpacity }]}>
          <TouchableOpacity
            style={styles.circleBtn}
            onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#1f2937" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.circleBtn}>
            <Ionicons name="share-outline" size={24} color="#1f2937" />
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>

      {/* ---------- Content ---------- */}
      <View style={styles.panel}>
        {/* static (non-scroll) top section */}
        <View style={styles.panelHeader}>
          <View style={styles.rowBetween}>
            <Text style={styles.clubTitle}>PadelStar Ярославль</Text>
            <TouchableOpacity>
              <Ionicons name="heart-outline" size={28} color="#1f2937" />
            </TouchableOpacity>
          </View>

          <Text style={styles.address}>п. Нагорный, ул. Дачная, 25</Text>

          {/* tabs */}
          <View style={styles.tabsContainer}>
            <View style={styles.tabsRow}>
              <TouchableOpacity 
                style={styles.tab} 
                onPress={() => setActiveTab('home')}
              >
                <Text style={activeTab === 'home' ? styles.tabTextActive : styles.tabTextMuted}>Главная</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.tab} 
                onPress={() => setActiveTab('reserve')}
              >
                <Text style={activeTab === 'reserve' ? styles.tabTextActive : styles.tabTextMuted}>Забронировать</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.tab} 
                onPress={() => setActiveTab('matches')}
              >
                <Text style={activeTab === 'matches' ? styles.tabTextActive : styles.tabTextMuted}>Открытые матчи</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.tab} 
                onPress={() => setActiveTab('active')}
              >
                <Text style={activeTab === 'active' ? styles.tabTextActive : styles.tabTextMuted}>Активные</Text>
              </TouchableOpacity>
            </View>
            <Animated.View style={[styles.underline, { left: underlinePosition }]} />
          </View>
        </View>

        {/* all scrollable selectors below */}
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
          overScrollMode="never">
          
          {activeTab === 'home' && (
            <View>
              {/* Club Information */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Информация о клубе</Text>
                
                <View style={styles.sportRow}>
                  <View style={styles.sportIcon}>
                    <Ionicons name="tennisball-outline" size={24} color="#1f2937" />
                  </View>
                  <Text style={styles.sportText}>Падел</Text>
                </View>

                <Text style={styles.courtsText}>3 доступных корта</Text>

                {/* Amenities */}
                <View style={styles.amenitiesRow}>
                  <View style={styles.amenityChip}>
                    <Ionicons name="accessibility-outline" size={18} color="#4b5563" />
                    <Text style={styles.amenityText}>Спец. доступ</Text>
                  </View>
                  <View style={styles.amenityChip}>
                    <Ionicons name="car-outline" size={18} color="#4b5563" />
                    <Text style={styles.amenityText}>Бесплатная парковка</Text>
                  </View>
                  <View style={styles.amenityChip}>
                    <Ionicons name="cafe-outline" size={18} color="#4b5563" />
                    <Text style={styles.amenityText}>Кафе</Text>
                  </View>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionsRow}>
                <TouchableOpacity style={styles.actionBtn}>
                  <View style={styles.actionBtnActive}>
                    <Ionicons name="navigate" size={24} color="white" />
                  </View>
                  <Text style={styles.actionText}>МАРШРУТ</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionBtn}>
                  <View style={styles.actionBtnOutline}>
                    <Ionicons name="link-outline" size={24} color="#1f2937" />
                  </View>
                  <Text style={styles.actionText}>ВЕБ</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionBtn}>
                  <View style={styles.actionBtnOutline}>
                    <Ionicons name="call-outline" size={24} color="#1f2937" />
                  </View>
                  <Text style={styles.actionText}>ПОЗВОНИТЬ</Text>
                </TouchableOpacity>
              </View>

              {/* Map Placeholder */}
              <TouchableOpacity style={styles.mapContainer}>
                <View style={styles.mapPlaceholder}>
                  <Ionicons name="map-outline" size={48} color="#6b7280" />
                  <Text style={styles.mapText}>Посмотреть на карте</Text>
                  <Text style={styles.mapSubText}>п. Нагорный, ул. Дачная, 25</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}

          {activeTab === 'reserve' && (
            <View>
              {/* date selector */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dateRow}
            scrollEnabled={true}
            nestedScrollEnabled={true}>
            {dates.map(({ day, date, month }) => {
              const isSelected = selectedDate === date;
              return (
                <TouchableOpacity
                  key={date}
                  onPress={() => setSelectedDate(date)}
                  style={[
                    styles.dateCard,
                    isSelected && styles.dateCardSelected,
                  ]}>
                  <Text
                    style={[
                      styles.dateDay,
                      isSelected && styles.dateSelectedText,
                    ]}>
                    {day}
                  </Text>
                  <Text
                    style={[
                      styles.dateNumber,
                      isSelected && styles.dateSelectedText,
                    ]}>
                    {date < 10 ? `0${date}` : date}
                  </Text>
                  <Text
                    style={[
                      styles.dateMonth,
                      isSelected && styles.dateSelectedText,
                    ]}>
                    {month}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* availability switch */}
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

          {/* time slots grid */}
          <View style={styles.slotsWrap}>
            {timeSlots.map((t) => {
              const isSel = selectedTime === t;
              return (
                <TouchableOpacity
                  key={t}
                  onPress={() => setSelectedTime(t)}
                  style={[
                    styles.slot,
                    isSel && styles.slotSelected,
                  ]}>
                  <Text
                    style={[
                      styles.slotText,
                      isSel && styles.slotTextSelected,
                    ]}>
                    {t}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

              {/* priority alerts row */}
              <TouchableOpacity style={styles.alertRow}>
                <Ionicons name="notifications-outline" size={20} color="#1f2937" style={{ marginRight: 12 }} />
                <Text style={styles.alertText}>Приоритетные уведомления</Text>
              </TouchableOpacity>
            </View>
          )}

          {activeTab === 'matches' && (
            <View style={styles.tabContent}>
              <Text style={styles.comingSoon}>Открытые матчи</Text>
              <Text style={styles.comingSoonSub}>Скоро будет доступно</Text>
            </View>
          )}

          {activeTab === 'active' && (
            <View style={styles.tabContent}>
              <Text style={styles.comingSoon}>Активные матчи</Text>
              <Text style={styles.comingSoonSub}>Скоро будет доступно</Text>
            </View>
          )}

        </Animated.ScrollView>
      </View>
    </SafeAreaView>
  );
}

/* ---------- Styles ---------- */
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f5f5f5' },

  /* Header */
  header: { width: '100%', height: 280, overflow: 'hidden' },
  headerImage: { width: '100%', height: '100%', position: 'absolute' },
  headerBtns: {
    position: 'absolute',
    top: 6,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  circleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  /* White panel */
  panel: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  panelHeader: { padding: 20, paddingBottom: 0 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  clubTitle: { fontSize: 24, fontWeight: '700', color: '#1f2937' },
  address: { fontSize: 16, color: '#6b7280', marginBottom: 20 },

  /* Tabs */
  tabsContainer: {
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tabsRow: { flexDirection: 'row' },
  tab: { 
    paddingBottom: 12, 
    paddingHorizontal: 12,
    minWidth: 100,
    alignItems: 'center',
  },
  tabTextMuted: { fontSize: 16, color: '#6b7280' },
  tabTextActive: { fontSize: 16, fontWeight: '600', color: '#1f2937' },
  underline: {
    position: 'absolute',
    bottom: 0,
    height: 2,
    width: 80,
    backgroundColor: '#1f2937',
    borderRadius: 1,
  },

  /* Scroll content */
  scrollBody: { flexGrow: 1, paddingBottom: 100 },

  /* Date selector */
  dateRow: { paddingHorizontal: 20, paddingRight: 40, paddingTop: 20 },
  dateCard: {
    alignItems: 'center',
    marginRight: 12,
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: '#f8f9fa',
    minWidth: 65,
  },
  dateCardSelected: { backgroundColor: '#1f2937', borderWidth: 0 },
  dateDay: { fontSize: 12, color: '#6b7280', marginBottom: 2 },
  dateNumber: { fontSize: 18, fontWeight: '600', color: '#1f2937', marginBottom: 2 },
  dateMonth: { fontSize: 12, color: '#6b7280' },
  dateSelectedText: { color: '#ffffff' },

  /* Switch label */
  switchLabel: { fontSize: 16, color: '#4b5563', marginHorizontal: 20, marginTop: 20 },

  /* Time slots */
  slotsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    marginTop: 20,
    paddingBottom: 10,
  },
  slot: {
    width: '18.4%',
    paddingVertical: 16,
    marginRight: '2%',
    marginBottom: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotSelected: { backgroundColor: '#1f2937' },
  slotText: { fontSize: 14, fontWeight: '500', color: '#1f2937' },
  slotTextSelected: { color: '#ffffff' },

  /* Alerts */
  alertRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    marginTop: 10,
    marginBottom: 20,
  },
  alertText: { fontSize: 16, color: '#1f2937' },

  /* Home tab content */
  section: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 20,
  },
  sportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sportIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sportText: {
    fontSize: 18,
    color: '#1f2937',
  },
  courtsText: {
    fontSize: 16,
    color: '#4b5563',
    marginBottom: 20,
  },
  amenitiesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  amenityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 16,
    gap: 6,
  },
  amenityText: {
    fontSize: 12,
    color: '#4b5563',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  actionBtn: {
    alignItems: 'center',
  },
  actionBtnActive: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1f2937',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionBtnOutline: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1f2937',
  },
  mapContainer: {
    height: 160,
    margin: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
  },
  mapText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4b5563',
    marginTop: 12,
  },
  mapSubText: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  tabContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  comingSoon: {
    fontSize: 20,
    fontWeight: '600',
    color: '#4b5563',
    marginBottom: 8,
  },
  comingSoonSub: {
    fontSize: 16,
    color: '#6b7280',
  },
});
