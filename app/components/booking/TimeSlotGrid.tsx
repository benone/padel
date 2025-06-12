import React from 'react';
import { View, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { TIME_SLOTS } from '../../constants/booking';
import { styles } from './styles';

export default function TimeSlotGrid({ 
  selectedTime, 
  setSelectedTime, 
  availability = [], 
  showAvailableOnly = false,
  onTimeSlotPress,
  loading = false
}) {
  if (loading) {
    return (
      <View style={[styles.slotsWrap, { justifyContent: 'center', alignItems: 'center', minHeight: 200 }]}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={{ marginTop: 10, color: '#6b7280' }}>Загрузка расписания...</Text>
      </View>
    );
  }

  // Use availability data if available, otherwise fall back to static TIME_SLOTS
  const timeSlots = availability.length > 0 ? availability : TIME_SLOTS.map(time => ({ time, courts: [] }));

  console.log('🎰 TimeSlotGrid data:', { 
    timeSlotsCount: timeSlots.length, 
    showAvailableOnly,
    sampleSlot: timeSlots[0] 
  });

  return (
    <View style={styles.slotsWrap}>
      {timeSlots.map((timeSlot) => {
        const time = typeof timeSlot === 'string' ? timeSlot : timeSlot.time;
        const courts = timeSlot.courts || [];
        const availableCourts = courts.filter(court => court.available);
        const hasAvailability = availableCourts.length > 0;
        const isSelected = selectedTime === time;
        
        // Skip if showing only available and no courts available
        if (showAvailableOnly && !hasAvailability && courts.length > 0) {
          console.log(`⏭️ Skipping ${time}: no available courts (${availableCourts.length}/${courts.length})`);
          return null;
        }

        const isDisabled = courts.length > 0 && !hasAvailability;

        return (
          <TouchableOpacity
            key={time}
            onPress={() => {
              if (isDisabled) return;
              if (onTimeSlotPress && hasAvailability) {
                // Use first available court for booking
                onTimeSlotPress(time, availableCourts[0]?.id);
              } else {
                setSelectedTime(time);
              }
            }}
            style={[
              styles.slot,
              isSelected && styles.slotSelected,
              isDisabled && styles.slotDisabled,
            ]}
            disabled={isDisabled}
          >
            <Text style={[
              styles.slotText, 
              isSelected && styles.slotTextSelected,
              isDisabled && styles.slotTextDisabled
            ]}>
              {time}
            </Text>
            {courts.length > 0 && (
              <Text style={[
                styles.slotSubText,
                isSelected && styles.slotSubTextSelected,
                isDisabled && styles.slotSubTextDisabled
              ]}>
                {availableCourts.length}/{courts.length} корт{courts.length > 1 ? 'а' : ''}
              </Text>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}