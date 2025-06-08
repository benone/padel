import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button, Chip, Avatar } from '../components/ui';

export default function NewMatchScreen({ navigation, route }) {
  const { venueType } = route.params || {};
  const [selectedSport, setSelectedSport] = useState('Падел');
  const [selectedPlayers, setSelectedPlayers] = useState(4);
  const [selectedDate, setSelectedDate] = useState('Сегодня');
  const [selectedTime, setSelectedTime] = useState('09:00');
  const [selectedDuration, setSelectedDuration] = useState('90мин');
  const [isCompetitive, setIsCompetitive] = useState(true);
  const [selectedGender, setSelectedGender] = useState('Все игроки');
  const [selectedLevel, setSelectedLevel] = useState('0.49 - 1.49');

  // Hardcoded configuration
  const sports = ['Падел'];
  const playerOptions = [2, 4];
  const timeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];
  const durations = ['60мин', '90мин', '120мин'];
  const genderOptions = ['Все игроки', 'Только мужчины', 'Только женщины'];
  const levelOptions = ['0.49 - 1.49', '1.50 - 2.49', '2.50 - 3.49'];

  const renderPlayerSlots = () => {
    const slots = [];
    for (let i = 1; i <= selectedPlayers; i++) {
      slots.push(
        <View key={i} style={styles.playerSlot}>
          {i === 1 ? (
            <View style={styles.currentPlayer}>
              <Avatar initials="К" size="medium" />
              <Text style={styles.currentPlayerText}>Вы</Text>
            </View>
          ) : (
            <View style={styles.availablePlayer}>
              <View style={styles.plusIcon}>
                <Text style={styles.plusText}>+</Text>
              </View>
              <Text style={styles.availableText}>Доступно</Text>
            </View>
          )}
        </View>
      );
    }
    return slots;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Новый матч</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Sport Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Спорт</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sportsScroll}>
            {sports.map((sport, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.sportOption,
                  (sport.name === selectedSport || sport.active) && styles.sportOptionActive
                ]}
                onPress={() => setSelectedSport(sport.name)}
              >
                <Ionicons 
                  name={sport.icon} 
                  size={24} 
                  color={(sport.name === selectedSport || sport.active) ? '#3b82f6' : '#6b7280'} 
                />
                <Text style={[
                  styles.sportText,
                  (sport.name === selectedSport || sport.active) && styles.sportTextActive
                ]}>
                  {sport.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Players */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Игроки</Text>
          <View style={styles.playersContainer}>
            <View style={styles.playerOptions}>
              {playerOptions.map((count) => (
                <TouchableOpacity
                  key={count}
                  style={[
                    styles.playerOption,
                    selectedPlayers === count && styles.playerOptionActive
                  ]}
                  onPress={() => setSelectedPlayers(count)}
                >
                  <Text style={[
                    styles.playerOptionText,
                    selectedPlayers === count && styles.playerOptionTextActive
                  ]}>
                    {count}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.playersGrid}>
              {renderPlayerSlots()}
            </View>
          </View>
        </View>

        {/* Date & Time */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Дата и время</Text>
          <View style={styles.dateTimeContainer}>
            <TouchableOpacity style={styles.dateSelector}>
              <Ionicons name="calendar-outline" size={20} color="#6b7280" />
              <Text style={styles.dateSelectorText}>{selectedDate}</Text>
              <Ionicons name="chevron-down" size={16} color="#6b7280" />
            </TouchableOpacity>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.timeScroll}>
              {timeSlots.map((time) => (
                <TouchableOpacity
                  key={time}
                  style={[
                    styles.timeSlot,
                    selectedTime === time && styles.timeSlotActive
                  ]}
                  onPress={() => setSelectedTime(time)}
                >
                  <Text style={[
                    styles.timeSlotText,
                    selectedTime === time && styles.timeSlotTextActive
                  ]}>
                    {time}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.durationScroll}>
              {durations.map((duration) => (
                <TouchableOpacity
                  key={duration}
                  style={[
                    styles.durationChip,
                    selectedDuration === duration && styles.durationChipActive
                  ]}
                  onPress={() => setSelectedDuration(duration)}
                >
                  <Text style={[
                    styles.durationChipText,
                    selectedDuration === duration && styles.durationChipTextActive
                  ]}>
                    {duration}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* Location */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Место</Text>
          <TouchableOpacity style={styles.locationSelector}>
            <View style={styles.locationIcon}>
              <Ionicons name="location-outline" size={20} color="#1f2937" />
            </View>
            <View style={styles.locationDetails}>
              <Text style={styles.locationName}>
                {venueType === 'club' ? 'Выберите клуб' : 'Введите адрес'}
              </Text>
              <Text style={styles.locationSubtext}>
                {venueType === 'club' 
                  ? 'Из нашего списка партнеров' 
                  : 'Или отметьте на карте'
                }
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#6b7280" />
          </TouchableOpacity>
        </View>

        {/* Match Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Детали матча</Text>
          
          {/* Competitive Toggle */}
          <View style={styles.detailRow}>
            <View style={styles.detailLabel}>
              <Ionicons name="trophy-outline" size={20} color="#1f2937" />
              <View>
                <Text style={styles.detailTitle}>Соревновательный</Text>
                <Text style={styles.detailSubtext}>Результат засчитается в уровень</Text>
              </View>
            </View>
            <Switch
              value={isCompetitive}
              onValueChange={setIsCompetitive}
              trackColor={{ false: '#e5e7eb', true: '#3b82f6' }}
              thumbColor={isCompetitive ? '#ffffff' : '#ffffff'}
            />
          </View>

          {/* Gender */}
          <View style={styles.detailRow}>
            <View style={styles.detailLabel}>
              <Ionicons name="people-outline" size={20} color="#1f2937" />
              <Text style={styles.detailTitle}>Пол</Text>
            </View>
            <TouchableOpacity style={styles.detailSelector}>
              <Text style={styles.detailValue}>{selectedGender}</Text>
              <Ionicons name="chevron-down" size={16} color="#6b7280" />
            </TouchableOpacity>
          </View>

          {/* Level */}
          <View style={styles.detailRow}>
            <View style={styles.detailLabel}>
              <Ionicons name="bar-chart-outline" size={20} color="#1f2937" />
              <Text style={styles.detailTitle}>Уровень</Text>
            </View>
            <TouchableOpacity style={styles.detailSelector}>
              <Text style={styles.detailValue}>{selectedLevel}</Text>
              <Ionicons name="chevron-down" size={16} color="#6b7280" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Create Match Button */}
      <View style={styles.footer}>
        <Button
          title="Создать матч"
          variant="primary"
          onPress={() => {
            // Handle match creation
            navigation.goBack();
          }}
          style={styles.createButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: 'white',
    marginTop: 8,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  
  // Sports
  sportsScroll: {
    paddingHorizontal: 16,
  },
  sportOption: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    minWidth: 100,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  sportOptionActive: {
    backgroundColor: '#eff6ff',
    borderColor: '#3b82f6',
  },
  sportText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
    marginTop: 8,
  },
  sportTextActive: {
    color: '#3b82f6',
    fontWeight: '600',
  },
  
  // Players
  playersContainer: {
    paddingHorizontal: 16,
  },
  playerOptions: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 12,
  },
  playerOption: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  playerOptionActive: {
    backgroundColor: '#eff6ff',
    borderColor: '#3b82f6',
  },
  playerOptionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6b7280',
  },
  playerOptionTextActive: {
    color: '#3b82f6',
  },
  playersGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  playerSlot: {
    flex: 1,
    alignItems: 'center',
  },
  currentPlayer: {
    alignItems: 'center',
    gap: 8,
  },
  currentPlayerText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
  },
  availablePlayer: {
    alignItems: 'center',
    gap: 8,
  },
  plusIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#3b82f6',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusText: {
    fontSize: 24,
    color: '#3b82f6',
    fontWeight: '300',
  },
  availableText: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '500',
  },
  
  // Date & Time
  dateTimeContainer: {
    paddingHorizontal: 16,
    gap: 16,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  dateSelectorText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
  },
  timeScroll: {
    flexDirection: 'row',
  },
  timeSlot: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginRight: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  timeSlotActive: {
    backgroundColor: '#eff6ff',
    borderColor: '#3b82f6',
  },
  timeSlotText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6b7280',
  },
  timeSlotTextActive: {
    color: '#3b82f6',
    fontWeight: '600',
  },
  durationScroll: {
    flexDirection: 'row',
  },
  durationChip: {
    backgroundColor: '#f8fafc',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  durationChipActive: {
    backgroundColor: '#eff6ff',
    borderColor: '#3b82f6',
  },
  durationChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  durationChipTextActive: {
    color: '#3b82f6',
    fontWeight: '600',
  },
  
  // Location
  locationSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#f8fafc',
    marginHorizontal: 16,
    borderRadius: 12,
    gap: 12,
  },
  locationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationDetails: {
    flex: 1,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  locationSubtext: {
    fontSize: 14,
    color: '#6b7280',
  },
  
  // Match Details
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  detailLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  detailSubtext: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  detailSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6b7280',
  },
  
  // Footer
  footer: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  createButton: {
    borderRadius: 30,
    minHeight: 56,
  },
});