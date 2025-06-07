import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { TIME_SLOTS } from '../../constants/booking';
import { styles } from './styles';

export default function TimeSlotGrid({ selectedTime, setSelectedTime }) {
  return (
    <View style={styles.slotsWrap}>
      {TIME_SLOTS.map((time) => {
        const isSelected = selectedTime === time;
        return (
          <TouchableOpacity
            key={time}
            onPress={() => setSelectedTime(time)}
            style={[
              styles.slot,
              isSelected && styles.slotSelected,
            ]}
          >
            <Text style={[styles.slotText, isSelected && styles.slotTextSelected]}>
              {time}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}