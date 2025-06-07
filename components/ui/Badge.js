import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Badge({ 
  text, 
  type = 'default',
  size = 'medium',
  color,
  backgroundColor,
  icon,
  style = {},
  ...props 
}) {
  const getBadgeStyle = () => {
    const baseStyle = [styles.badge, styles[`${type}Badge`], styles[`${size}Badge`]];
    
    if (backgroundColor) {
      baseStyle.push({ backgroundColor });
    }
    
    return [...baseStyle, style];
  };

  const getTextStyle = () => {
    const baseStyle = [styles.badgeText, styles[`${type}BadgeText`], styles[`${size}BadgeText`]];
    
    if (color) {
      baseStyle.push({ color });
    }
    
    return baseStyle;
  };

  const getIconSize = () => {
    switch (size) {
      case 'small': return 10;
      case 'medium': return 12;
      case 'large': return 14;
      default: return 12;
    }
  };

  const getIconColor = () => {
    if (color) return color;
    
    switch (type) {
      case 'level': return '#000000';
      case 'win': return '#ffffff';
      case 'status': return '#ffffff';
      default: return '#6b7280';
    }
  };

  return (
    <View style={getBadgeStyle()} {...props}>
      {icon && (
        <Ionicons 
          name={icon} 
          size={getIconSize()} 
          color={getIconColor()} 
          style={styles.icon} 
        />
      )}
      <Text style={getTextStyle()}>{text}</Text>
    </View>
  );
}

export function StatusDot({ online = false, size = 'medium', style = {} }) {
  const getDotSize = () => {
    switch (size) {
      case 'small': return 12;
      case 'medium': return 16;
      case 'large': return 24;
      default: return 16;
    }
  };

  const dotSize = getDotSize();
  const dotStyle = {
    width: dotSize,
    height: dotSize,
    borderRadius: dotSize / 2,
    backgroundColor: online ? '#10b981' : '#9ca3af',
    borderWidth: 2,
    borderColor: 'white',
  };

  return <View style={[dotStyle, style]} />;
}

export function VSIndicator({ style = {} }) {
  return (
    <View style={[styles.vsIndicator, style]}>
      <Text style={styles.vsText}>VS</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  
  // Types
  defaultBadge: {
    backgroundColor: '#f3f4f6',
  },
  levelBadge: {
    backgroundColor: '#84cc16',
  },
  winBadge: {
    backgroundColor: '#10b981',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  statusBadge: {
    backgroundColor: '#3b82f6',
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  
  // Sizes
  smallBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
  },
  mediumBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  largeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  
  // Text styles
  badgeText: {
    fontWeight: '700',
    textAlign: 'center',
  },
  defaultBadgeText: {
    color: '#6b7280',
  },
  levelBadgeText: {
    color: '#000000',
  },
  winBadgeText: {
    color: '#ffffff',
  },
  statusBadgeText: {
    color: '#ffffff',
  },
  
  // Text sizes
  smallBadgeText: {
    fontSize: 10,
  },
  mediumBadgeText: {
    fontSize: 12,
  },
  largeBadgeText: {
    fontSize: 14,
  },
  
  icon: {
    marginRight: 4,
  },
  
  // VS Indicator
  vsIndicator: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'center',
  },
  vsText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6b7280',
  },
});