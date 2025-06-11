import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, TouchableOpacityProps, TextStyle, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'icon';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends Omit<TouchableOpacityProps, 'style'> {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  icon?: keyof typeof Ionicons.glyphMap;
  disabled?: boolean;
  size?: ButtonSize;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Button({ 
  title, 
  onPress, 
  variant = 'primary', 
  icon, 
  disabled = false,
  size = 'medium',
  style = {},
  textStyle = {},
  ...props 
}: ButtonProps): React.JSX.Element {
  const getButtonStyle = () => {
    const baseStyle = [styles.button, styles[`${variant}Button`], styles[`${size}Button`]];
    if (disabled) baseStyle.push(styles.disabledButton);
    return [...baseStyle, style];
  };

  const getTextStyle = () => {
    const baseStyle = [styles.buttonText, styles[`${variant}ButtonText`], styles[`${size}ButtonText`]];
    if (disabled) baseStyle.push(styles.disabledButtonText);
    return [...baseStyle, textStyle];
  };

  const getIconColor = () => {
    if (disabled) return '#9ca3af';
    switch (variant) {
      case 'primary': return '#ffffff';
      case 'secondary': return '#4f46e5';
      case 'outline': return '#4f46e5';
      default: return '#6b7280';
    }
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      {...props}
    >
      {icon && (
        <Ionicons 
          name={icon} 
          size={size === 'small' ? 14 : size === 'large' ? 18 : 16} 
          color={getIconColor()} 
          style={styles.icon} 
        />
      )}
      <Text style={getTextStyle()}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  
  // Variants
  primaryButton: {
    backgroundColor: '#4f46e5',
    shadowColor: '#4f46e5',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  secondaryButton: {
    borderWidth: 1.5,
    borderColor: '#4f46e5',
    backgroundColor: 'white',
    shadowOpacity: 0.05,
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: 'white',
    shadowOpacity: 0.05,
  },
  iconButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 24,
    width: 48,
    height: 48,
    shadowOpacity: 0.05,
  },
  
  // Sizes
  smallButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    minHeight: 36,
  },
  mediumButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 48,
  },
  largeButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    minHeight: 56,
  },
  
  // Text styles
  buttonText: {
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  primaryButtonText: {
    color: '#ffffff',
  },
  secondaryButtonText: {
    color: '#4f46e5',
  },
  outlineButtonText: {
    color: '#6b7280',
  },
  iconButtonText: {
    color: '#6b7280',
  },
  
  // Text sizes
  smallButtonText: {
    fontSize: 12,
  },
  mediumButtonText: {
    fontSize: 14,
  },
  largeButtonText: {
    fontSize: 16,
  },
  
  // Disabled states
  disabledButton: {
    backgroundColor: '#f3f4f6',
    borderColor: '#e5e7eb',
    shadowOpacity: 0,
    elevation: 0,
  },
  disabledButtonText: {
    color: '#9ca3af',
  },
  
  icon: {
    marginRight: 6,
  },
});