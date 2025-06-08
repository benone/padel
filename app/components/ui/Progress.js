import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

export default function ProgressBar({ 
  percentage, 
  color = '#84cc16',
  backgroundColor = 'rgba(255,255,255,0.2)',
  height = 6,
  borderRadius,
  showLabel = false,
  label,
  style = {},
  ...props 
}) {
  const calculatedBorderRadius = borderRadius || height / 2;
  
  return (
    <View style={[styles.container, style]} {...props}>
      <View 
        style={[
          styles.progressBar, 
          { 
            height, 
            backgroundColor, 
            borderRadius: calculatedBorderRadius 
          }
        ]}
      >
        <Animated.View 
          style={[
            styles.progressFill, 
            { 
              width: `${percentage}%`, 
              backgroundColor: color,
              borderRadius: calculatedBorderRadius 
            }
          ]} 
        />
      </View>
      {showLabel && label && (
        <Text style={styles.label}>{label}</Text>
      )}
    </View>
  );
}

export function CircularProgress({ 
  percentage, 
  size = 120,
  strokeWidth = 8,
  color = '#3b82f6',
  backgroundColor = '#f3f4f6',
  children,
  style = {},
  ...props 
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  return (
    <View 
      style={[
        styles.circularContainer, 
        { width: size, height: size }, 
        style
      ]} 
      {...props}
    >
      <View style={styles.circularContent}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  progressBar: {
    width: '100%',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
  },
  label: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  circularContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  circularContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
});