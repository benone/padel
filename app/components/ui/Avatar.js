import React, { useState } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Avatar({ 
  uri, 
  initials, 
  size = 'medium', 
  borderColor = 'white',
  showStatus = false,
  online = false,
  showDefaultIcon = false,
  style = {},
  ...props 
}) {
  const getAvatarSize = () => {
    switch (size) {
      case 'small': return 40;
      case 'medium': return 60;
      case 'large': return 80;
      case 'xlarge': return 120;
      default: return 60;
    }
  };

  const getStatusSize = () => {
    switch (size) {
      case 'small': return 12;
      case 'medium': return 16;
      case 'large': return 20;
      case 'xlarge': return 24;
      default: return 16;
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'small': return 14;
      case 'medium': return 18;
      case 'large': return 24;
      case 'xlarge': return 32;
      default: return 18;
    }
  };

  const avatarSize = getAvatarSize();
  const statusSize = getStatusSize();
  const fontSize = getFontSize();

  const avatarStyle = {
    width: avatarSize,
    height: avatarSize,
    borderRadius: avatarSize / 2,
    borderWidth: 3,
    borderColor: borderColor,
  };

  const statusStyle = {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: statusSize,
    height: statusSize,
    borderRadius: statusSize / 2,
    backgroundColor: online ? '#10b981' : '#9ca3af',
    borderWidth: 2,
    borderColor: 'white',
  };

  const initialsStyle = {
    ...avatarStyle,
    backgroundColor: '#1f2937',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
  };

  const initialsTextStyle = {
    fontSize: fontSize,
    fontWeight: '700',
    color: 'white',
  };

  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(!!uri);

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const shouldShowImage = uri && !imageError;
  const shouldShowIcon = showDefaultIcon && !shouldShowImage && !initials;

  return (
    <View style={[styles.container, style]} {...props}>
      {shouldShowImage ? (
        <Image 
          source={{ uri }} 
          style={avatarStyle}
          onError={handleImageError}
          onLoad={handleImageLoad}
        />
      ) : shouldShowIcon ? (
        <View style={initialsStyle}>
          <Ionicons 
            name="person" 
            size={fontSize} 
            color="#9ca3af" 
          />
        </View>
      ) : (
        <View style={initialsStyle}>
          <Text style={initialsTextStyle}>{initials || '?'}</Text>
        </View>
      )}
      {showStatus && <View style={statusStyle} />}
      {imageLoading && shouldShowImage && (
        <View style={[initialsStyle, { position: 'absolute' }]}>
          <Text style={[initialsTextStyle, { fontSize: fontSize * 0.7 }]}>...</Text>
        </View>
      )}
    </View>
  );
}

export function AvatarPair({ 
  avatar1, 
  avatar2, 
  size = 'medium',
  spacing = -8,
  style = {},
  ...props 
}) {
  return (
    <View style={[styles.pairContainer, style]} {...props}>
      <Avatar {...avatar1} size={size} />
      <Avatar {...avatar2} size={size} style={{ marginLeft: spacing }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  pairContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});