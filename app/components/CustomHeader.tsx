import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../constants';

export default function CustomHeader({ title, userName = 'Кирилл', onNotificationPress, onMenuPress }) {
  return (
    <View style={styles.header}>
      <View style={styles.greeting}>
        <Text style={styles.greetingText}>Привет, {userName}! </Text>
        <Text style={styles.emoji}>👋</Text>
      </View>
      
      <View style={styles.actions}>
        <TouchableOpacity onPress={onNotificationPress} style={styles.actionButton}>
          <Ionicons name="notifications-outline" size={24} color="white" />
        </TouchableOpacity>
        
        <TouchableOpacity onPress={onMenuPress} style={styles.actionButton}>
          <View style={styles.menuIcon}>
            <View style={styles.menuLine} />
            <View style={styles.menuLine} />
            <View style={styles.menuLine} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.status.bar,
    paddingTop: 68,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  greeting: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greetingText: {
    color: '#ffffff',
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.medium,
  },
  emoji: {
    fontSize: typography.sizes.lg,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  actionButton: {
    padding: spacing.xs,
  },
  menuIcon: {
    gap: 3,
  },
  menuLine: {
    width: 24,
    height: 2,
    backgroundColor: 'white',
  },
});