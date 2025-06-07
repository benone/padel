import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Import local assets
const assets = {
  headerImage: require('../assets/court-bg-1.png'),
};

export default function ClubHomeScreen({ navigation }) {
  const handleDirections = () => {
    const address = 'п. Нагорный, ул. Дачная, 25';
    const url = `https://maps.apple.com/?address=${encodeURIComponent(address)}`;
    Linking.openURL(url);
  };

  const handleWeb = () => {
    Linking.openURL('https://padelstar.ru');
  };

  const handleCall = () => {
    Linking.openURL('tel:+74852123456');
  };

  return (
    <SafeAreaView style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={assets.headerImage}
          resizeMode="cover"
          style={styles.headerImage}
        />

        {/* back / share buttons */}
        <View style={styles.headerBtns}>
          <TouchableOpacity
            style={styles.circleBtn}
            onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#1f2937" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.circleBtn}>
            <Ionicons name="share-outline" size={24} color="#1f2937" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <View style={styles.panel}>
        <View style={styles.panelHeader}>
          <View style={styles.rowBetween}>
            <Text style={styles.clubTitle}>PadelStar Ярославль</Text>
            <TouchableOpacity>
              <Ionicons name="heart-outline" size={28} color="#1f2937" />
            </TouchableOpacity>
          </View>

          <Text style={styles.address}>п. Нагорный, ул. Дачная, 25</Text>

          {/* tabs */}
          <View style={styles.tabsRow}>
            <TouchableOpacity style={[styles.tab, styles.tabActive]}>
              <Text style={styles.tabTextActive}>Главная</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tab}>
              <Text style={styles.tabTextMuted}>Забронировать</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tab}>
              <Text style={styles.tabTextMuted}>Открытые матчи</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tab}>
              <Text style={styles.tabTextMuted}>Активные</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollBody}
          showsVerticalScrollIndicator={false}>
          {/* Club Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Информация о клубе</Text>
            
            <View style={styles.sportRow}>
              <View style={styles.sportIcon}>
                <Ionicons name="tennisball-outline" size={24} color="#1f2937" />
              </View>
              <Text style={styles.sportText}>Падел</Text>
            </View>

            <Text style={styles.courtsText}>3 доступных корта</Text>

            {/* Amenities */}
            <View style={styles.amenitiesRow}>
              <View style={styles.amenityChip}>
                <Ionicons name="accessibility-outline" size={18} color="#4b5563" />
                <Text style={styles.amenityText}>Спец. доступ</Text>
              </View>
              <View style={styles.amenityChip}>
                <Ionicons name="car-outline" size={18} color="#4b5563" />
                <Text style={styles.amenityText}>Бесплатная парковка</Text>
              </View>
              <View style={styles.amenityChip}>
                <Ionicons name="cafe-outline" size={18} color="#4b5563" />
                <Text style={styles.amenityText}>Кафе</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.actionBtn} onPress={handleDirections}>
              <View style={styles.actionBtnActive}>
                <Ionicons name="navigate" size={24} color="white" />
              </View>
              <Text style={styles.actionText}>МАРШРУТ</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionBtn} onPress={handleWeb}>
              <View style={styles.actionBtnOutline}>
                <Ionicons name="link-outline" size={24} color="#1f2937" />
              </View>
              <Text style={styles.actionText}>ВЕБ</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionBtn} onPress={handleCall}>
              <View style={styles.actionBtnOutline}>
                <Ionicons name="call-outline" size={24} color="#1f2937" />
              </View>
              <Text style={styles.actionText}>ПОЗВОНИТЬ</Text>
            </TouchableOpacity>
          </View>

          {/* Map Placeholder */}
          <TouchableOpacity style={styles.mapContainer} onPress={handleDirections}>
            <View style={styles.mapPlaceholder}>
              <Ionicons name="map-outline" size={48} color="#6b7280" />
              <Text style={styles.mapText}>Посмотреть на карте</Text>
              <Text style={styles.mapSubText}>п. Нагорный, ул. Дачная, 25</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f5f5f5' },

  /* Header */
  header: { width: '100%', height: 200, overflow: 'hidden' },
  headerImage: { width: '100%', height: '100%' },
  headerBtns: {
    position: 'absolute',
    top: 48,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  circleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  /* White panel */
  panel: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  panelHeader: { padding: 20, paddingBottom: 0 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  clubTitle: { fontSize: 24, fontWeight: '700', color: '#1f2937' },
  address: { fontSize: 16, color: '#6b7280', marginBottom: 20 },

  /* Tabs */
  tabsRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  tab: { paddingBottom: 12, marginRight: 24 },
  tabActive: { borderBottomWidth: 2, borderBottomColor: '#1f2937' },
  tabTextMuted: { fontSize: 16, color: '#6b7280' },
  tabTextActive: { fontSize: 16, fontWeight: '600', color: '#1f2937' },

  /* Scroll content */
  scrollBody: { flexGrow: 1, paddingBottom: 100 },

  /* Sections */
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 20,
  },

  /* Sport info */
  sportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sportIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sportText: {
    fontSize: 18,
    color: '#1f2937',
  },
  courtsText: {
    fontSize: 16,
    color: '#4b5563',
    marginBottom: 20,
  },

  /* Amenities */
  amenitiesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  amenityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    gap: 6,
  },
  amenityText: {
    fontSize: 14,
    color: '#4b5563',
  },

  /* Action buttons */
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  actionBtn: {
    alignItems: 'center',
  },
  actionBtnActive: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#1f2937',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionBtnOutline: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1f2937',
  },

  /* Map */
  mapContainer: {
    height: 200,
    margin: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
  },
  mapText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4b5563',
    marginTop: 12,
  },
  mapSubText: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
});