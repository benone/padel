import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles';

export default function ClubHeader() {
  return (
    <View style={styles.panelHeader}>
      <View style={styles.rowBetween}>
        <Text style={styles.clubTitle}>PadelStar Ярославль</Text>
        <TouchableOpacity>
          <Ionicons name="heart-outline" size={28} color="#1f2937" />
        </TouchableOpacity>
      </View>
      <Text style={styles.address}>п. Нагорный, ул. Дачная, 25</Text>
    </View>
  );
}