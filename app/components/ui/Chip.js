import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

export default function Chip({ 
  label, 
  active = false, 
  onPress, 
  badge,
  variant = 'default',
  size = 'medium',
  style = {},
  ...props 
}) {
  const getChipStyle = () => {
    const baseStyle = [styles.chip, styles[`${size}Chip`]];
    if (active) {
      baseStyle.push(styles.activeChip);
    } else {
      baseStyle.push(styles.inactiveChip);
    }
    return [...baseStyle, style];
  };

  const getTextStyle = () => {
    const baseStyle = [styles.chipText, styles[`${size}ChipText`]];
    if (active) {
      baseStyle.push(styles.activeChipText);
    } else {
      baseStyle.push(styles.inactiveChipText);
    }
    return baseStyle;
  };

  return (
    <TouchableOpacity
      style={getChipStyle()}
      onPress={onPress}
      activeOpacity={0.8}
      {...props}
    >
      {badge !== undefined && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}
      <Text style={getTextStyle()}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  
  // Sizes
  smallChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  mediumChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  largeChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
  },
  
  // States
  activeChip: {
    backgroundColor: '#1f2937',
  },
  inactiveChip: {
    backgroundColor: '#f3f4f6',
  },
  
  // Text styles
  chipText: {
    fontWeight: '500',
    textAlign: 'center',
  },
  activeChipText: {
    color: '#ffffff',
  },
  inactiveChipText: {
    color: '#6b7280',
  },
  
  // Text sizes
  smallChipText: {
    fontSize: 12,
  },
  mediumChipText: {
    fontSize: 14,
  },
  largeChipText: {
    fontSize: 16,
  },
  
  // Badge
  badge: {
    backgroundColor: '#1f2937',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
});