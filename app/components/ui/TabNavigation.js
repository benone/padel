import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default function TabNavigation({ 
  tabs, 
  activeTab, 
  onTabChange,
  underlineColor = '#1f2937',
  tabTextColor = '#6b7280',
  activeTabTextColor = '#1f2937',
  style = {},
  ...props 
}) {
  const underlinePosition = useRef(new Animated.Value(0)).current;
  
  const getTabPositions = () => {
    const containerWidth = width - 40; // Account for horizontal margins (20px each side)
    const tabWidth = containerWidth / tabs.length;
    const underlineWidth = 60; // Fixed width from styles
    const positions = {};
    
    tabs.forEach((tab, index) => {
      const tabCenter = (tabWidth * index) + (tabWidth / 2);
      positions[tab.key] = tabCenter - (underlineWidth / 2);
    });
    
    return positions;
  };
  
  const tabPositions = getTabPositions();
  
  useEffect(() => {
    Animated.timing(underlinePosition, {
      toValue: tabPositions[activeTab],
      duration: 150,
      useNativeDriver: false,
    }).start();
  }, [activeTab]);

  return (
    <View style={[styles.tabsContainer, style]} {...props}>
      <View style={styles.tabsRow}>
        {tabs.map((tab) => (
          <TouchableOpacity 
            key={tab.key}
            style={styles.tab} 
            onPress={() => onTabChange(tab.key)}
          >
            <Text 
              numberOfLines={1}
              ellipsizeMode="tail"
              style={[
                styles.tabText,
                { color: tabTextColor },
                activeTab === tab.key && { 
                  color: activeTabTextColor, 
                  fontWeight: '600' 
                }
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <Animated.View 
        style={[
          styles.underline, 
          { 
            left: underlinePosition,
            backgroundColor: underlineColor 
          }
        ]} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tabsContainer: {
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    marginHorizontal: 20,
  },
  tabsRow: { 
    flexDirection: 'row',
  },
  tab: { 
    paddingBottom: 12, 
    paddingHorizontal: 8,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: { 
    fontSize: 14,
    textAlign: 'center',
  },
  underline: {
    position: 'absolute',
    bottom: 0,
    height: 2,
    width: 60,
    borderRadius: 1,
  },
});