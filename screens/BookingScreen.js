import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Switch,
  StyleSheet,
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
      <View style={styles.header}>
        <Image
          source={assets.headerImage}
          resizeMode="cover"
          style={styles.headerImage}
          onError={(e) => console.log('Header image error:', e.nativeEvent.error)}
        />

        {/* back / share buttons */}
        <View style={styles.headerBtns}>
          <TouchableOpacity
            style={styles.circleBtn}
            onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#1f2937" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.circleBtn}>
            <Ionicons name="share-outline" size={24} color="#1f2937" />
          </TouchableOpacity>
        </View>
      </View>

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
          <View style={styles.tabsRow}>
            <TouchableOpacity style={styles.tab}>
              <Text style={styles.tabTextMuted}>Главная</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tab, styles.tabActive]}>
              <Text style={styles.tabTextActive}>Забронировать</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tab}>
              <Text style={styles.tabTextMuted}>Открытые матчи</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tab}>
              <Text style={styles.tabTextMuted}>Активные</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* all scrollable selectors below */}
        <ScrollView
          contentContainerStyle={styles.scrollBody}
          showsVerticalScrollIndicator={false}>
          {/* date selector */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dateRow}>
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
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

/* ---------- Styles ---------- */
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f5f5f5' },

  /* Header */
  header: { width: '100%', height: 280 },
  headerImage: { width: '100%', height: '100%' },
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
  tabsRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  tab: { paddingBottom: 12, marginRight: 24 },
  tabActive: { borderBottomWidth: 2, borderBottomColor: '#1f2937' },
  tabTextMuted: { fontSize: 16, color: '#6b7280' },
  tabTextActive: { fontSize: 16, fontWeight: '600', color: '#1f2937' },

  /* Scroll content */
  scrollBody: { flexGrow: 1, paddingBottom: 24 },

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
  },
  alertText: { fontSize: 16, color: '#1f2937' },
});
