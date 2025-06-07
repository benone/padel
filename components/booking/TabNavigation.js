import React from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { TAB_CONFIG, TABS } from '../../constants/booking';
import { styles } from './styles';

export default function TabNavigation({ activeTab, setActiveTab, underlinePosition }) {
  return (
    <View style={styles.tabsContainer}>
      <View style={styles.tabsRow}>
        {Object.entries(TAB_CONFIG).map(([key, config]) => (
          <TouchableOpacity 
            key={key}
            style={styles.tab} 
            onPress={() => setActiveTab(key)}
          >
            <Text style={activeTab === key ? styles.tabTextActive : styles.tabTextMuted}>
              {config.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <Animated.View style={[styles.underline, { left: underlinePosition }]} />
    </View>
  );
}