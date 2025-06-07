import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Switch,
  Animated,
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

export default function BookingScreen({ navigation }) {
  const [showAvailableOnly, setShowAvailableOnly] = useState(true);
  const [selectedDate, setSelectedDate] = useState(9);
  const [selectedTime, setSelectedTime] = useState('10:00');
  const [activeTab, setActiveTab] = useState(TABS.RESERVE);
  
  const {
    scrollY,
    headerHeight,
    imageScale,
    imageTranslateY,
    buttonsOpacity,
  } = useParallax();
  
  const { underlinePosition } = useTabAnimation(activeTab);

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
        <ClubHeader />
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
            <ClubInformationTab />
          )}

          {activeTab === TABS.RESERVE && (
            <ReservationTab
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              selectedTime={selectedTime}
              setSelectedTime={setSelectedTime}
              showAvailableOnly={showAvailableOnly}
              setShowAvailableOnly={setShowAvailableOnly}
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

function ClubInformationTab() {
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

        <Text style={styles.courtsText}>3 доступных корта</Text>

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

      <TouchableOpacity style={styles.mapContainer}>
        <View style={styles.mapPlaceholder}>
          <Ionicons name="map-outline" size={48} color="#6b7280" />
          <Text style={styles.mapText}>Посмотреть на карте</Text>
          <Text style={styles.mapSubText}>п. Нагорный, ул. Дачная, 25</Text>
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
  setShowAvailableOnly 
}) {
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

      <TimeSlotGrid selectedTime={selectedTime} setSelectedTime={setSelectedTime} />

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

