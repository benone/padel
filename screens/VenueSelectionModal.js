import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../components/ui';

export default function VenueSelectionModal({ visible, onClose, onNext }) {
  const [selectedOption, setSelectedOption] = useState('club');

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.helpButton}>
            <Ionicons name="help-circle-outline" size={24} color="#6b7280" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Где вы играете?</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#1f2937" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {/* Sports Club Option */}
          <TouchableOpacity
            style={[
              styles.optionCard,
              selectedOption === 'club' && styles.optionCardSelected
            ]}
            onPress={() => setSelectedOption('club')}
          >
            <View style={styles.optionHeader}>
              <View style={styles.optionIcon}>
                <Ionicons name="business-outline" size={24} color="#1f2937" />
              </View>
              <Text style={styles.optionTitle}>В спортивном клубе</Text>
            </View>
            <Text style={styles.optionDescription}>
              Выберите клуб из нашего списка и опубликуйте ваш матч, чтобы любой игрок мог присоединиться.
            </Text>
          </TouchableOpacity>

          {/* Custom Venue Option */}
          <TouchableOpacity
            style={[
              styles.optionCard,
              selectedOption === 'custom' && styles.optionCardSelected
            ]}
            onPress={() => setSelectedOption('custom')}
          >
            <View style={styles.optionHeader}>
              <View style={styles.optionIcon}>
                <Ionicons name="location-outline" size={24} color="#1f2937" />
              </View>
              <Text style={styles.optionTitle}>Я уже знаю где буду играть</Text>
            </View>
            <Text style={styles.optionDescription}>
              Организуйте матч на площадке, которая не входит в наш список партнеров.
            </Text>
          </TouchableOpacity>
        </View>

        {/* Next Button */}
        <View style={styles.footer}>
          <Button
            title="Далее"
            variant="primary"
            onPress={() => onNext(selectedOption)}
            style={styles.nextButton}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  helpButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  closeButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
    gap: 16,
  },
  optionCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionCardSelected: {
    backgroundColor: '#eff6ff',
    borderColor: '#3b82f6',
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
  },
  optionDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingBottom: 40,
  },
  nextButton: {
    borderRadius: 30,
    minHeight: 56,
  },
});