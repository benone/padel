import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import imageAPI from '../../services/imageAPI';

export default function ImageGenerator({ 
  prompt, 
  width = 400, 
  height = 400, 
  style = 'realistic',
  onImageGenerated,
  children,
  ...props 
}) {
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [error, setError] = useState(null);

  const generateImage = async () => {
    if (!prompt) {
      Alert.alert('Ошибка', 'Не указан prompt для генерации изображения');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log(`🎨 Generating image with prompt: "${prompt}"`);
      
      const result = await imageAPI.generate(prompt, { width, height, style });
      
      setGeneratedImage(result);
      
      if (onImageGenerated) {
        onImageGenerated(result);
      }
      
      console.log(`✅ Image generated successfully. Cached: ${result.cached}`);
      
    } catch (err) {
      console.error('❌ Image generation failed:', err);
      setError(err.message);
      Alert.alert('Ошибка генерации', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container} {...props}>
      {children ? (
        <TouchableOpacity onPress={generateImage} disabled={loading}>
          {children}
        </TouchableOpacity>
      ) : (
        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={generateImage}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Ionicons name="create-outline" size={20} color="#ffffff" />
          )}
          <Text style={styles.buttonText}>
            {loading ? 'Генерируем...' : 'Сгенерировать изображение'}
          </Text>
        </TouchableOpacity>
      )}
      
      {generatedImage && (
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: generatedImage.imageUrl }} 
            style={[styles.image, { width, height }]}
            resizeMode="cover"
          />
          <View style={styles.imageInfo}>
            <Text style={styles.imageInfoText}>
              {generatedImage.cached ? '💾 Из кэша' : '🎨 Новое изображение'}
            </Text>
            <Text style={styles.imageInfoText}>
              {width}×{height}px
            </Text>
          </View>
        </View>
      )}
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
}

// Hook for generating avatars
export function useAvatarGenerator() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateAvatar = async (name, description = '') => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await imageAPI.generateAvatar(name, description);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const generateVenueImage = async (clubName, description = '') => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await imageAPI.generateVenueImage(clubName, description);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    generateAvatar,
    generateVenueImage,
    loading,
    error
  };
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  buttonDisabled: {
    backgroundColor: '#9ca3af',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  imageContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  image: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  imageInfo: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  imageInfoText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  errorContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#fef2f2',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
    textAlign: 'center',
  },
});