import React from 'react';
import { ScrollView, TouchableOpacity, Text } from 'react-native';
import { DATES } from '../../constants/booking';
import { styles } from './styles';

export default function DateSelector({ selectedDate, setSelectedDate }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.dateRow}
      scrollEnabled={true}
      nestedScrollEnabled={true}
    >
      {DATES.map(({ day, date, month }) => {
        const isSelected = selectedDate === date;
        return (
          <TouchableOpacity
            key={date}
            onPress={() => setSelectedDate(date)}
            style={[
              styles.dateCard,
              isSelected && styles.dateCardSelected,
            ]}
          >
            <Text style={[styles.dateDay, isSelected && styles.dateSelectedText]}>
              {day}
            </Text>
            <Text style={[styles.dateNumber, isSelected && styles.dateSelectedText]}>
              {date < 10 ? `0${date}` : date}
            </Text>
            <Text style={[styles.dateMonth, isSelected && styles.dateSelectedText]}>
              {month}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}