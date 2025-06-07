import React from 'react';
import { TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { images } from '../../constants';
import { styles } from './styles';

export default function ParallaxHeader({ 
  navigation, 
  headerHeight, 
  imageScale, 
  imageTranslateY, 
  buttonsOpacity 
}) {
  return (
    <Animated.View style={[styles.header, { height: headerHeight }]}>
      <Animated.Image
        source={images.courts.courtBg1}
        resizeMode="cover"
        style={[styles.headerImage, {
          transform: [
            { scale: imageScale },
            { translateY: imageTranslateY }
          ]
        }]}
        onError={(e) => console.log('Header image error:', e.nativeEvent.error)}
      />

      <Animated.View style={[styles.headerBtns, { opacity: buttonsOpacity }]}>
        <TouchableOpacity
          style={styles.circleBtn}
          onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.circleBtn}>
          <Ionicons name="share-outline" size={24} color="#1f2937" />
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
}