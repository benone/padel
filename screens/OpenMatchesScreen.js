import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Chip, Avatar, Badge, Button } from '../components/ui';
import VenueSelectionModal from './VenueSelectionModal';

export default function OpenMatchesScreen({ navigation }) {
  const [selectedSport, setSelectedSport] = useState('Падел');
  const [selectedClubs, setSelectedClubs] = useState('2 клуба');
  const [selectedDate, setSelectedDate] = useState('Сб-Вс-Пн, 07');
  const [showVenueModal, setShowVenueModal] = useState(false);

  const matches = [
    {
      id: 1,
      date: 'Воскресенье, 8 июня',
      time: '09:00',
      type: 'Соревновательный',
      levelRange: '0.49 - 1.49',
      players: [
        { name: 'Анна', level: '0.74', initials: 'А', avatar: null },
        { name: 'Доступно', level: null, initials: null, avatar: null, available: true },
        { name: 'Дмитрий', level: '0.85', initials: 'Д', avatar: null },
        { name: 'Доступно', level: null, initials: null, avatar: null, available: true },
      ],
      club: {
        name: 'Спортивный клуб "Чемпион"',
        distance: '3км',
        location: 'Москва',
        icon: '🏟️'
      },
      price: '₽450',
      duration: '90мин'
    },
    {
      id: 2,
      date: 'Понедельник, 9 июня',
      time: '09:30',
      type: 'Соревновательный',
      levelRange: '0.44 - 1.44',
      players: [
        { 
          name: 'Елена', 
          level: '0.69', 
          initials: 'Е', 
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616c5fab5e7?w=200&h=200&fit=crop&crop=face'
        },
        { name: 'Доступно', level: null, initials: null, avatar: null, available: true },
        { name: 'Доступно', level: null, initials: null, avatar: null, available: true },
        { name: 'Доступно', level: null, initials: null, avatar: null, available: true },
      ],
      club: {
        name: 'Центр тенниса "Олимп"',
        distance: '5км',
        location: 'Санкт-Петербург',
        icon: '🏟️'
      },
      price: '₽350',
      duration: '90мин'
    },
    {
      id: 3,
      date: 'Понедельник, 9 июня',
      time: '10:30',
      type: 'Соревновательный',
      levelRange: '0.79 - 1.79',
      players: [
        { name: 'Михаил', level: '1.12', initials: 'М', avatar: null },
        { name: 'Доступно', level: null, initials: null, avatar: null, available: true },
        { name: 'София', level: '0.95', initials: 'С', avatar: null },
        { name: 'Доступно', level: null, initials: null, avatar: null, available: true },
      ],
      club: {
        name: 'Теннисный клуб "Энергия"',
        distance: '7км',
        location: 'Казань',
        icon: '🏟️'
      },
      price: '₽520',
      duration: '90мин'
    }
  ];

  const renderMatch = (match) => (
    <TouchableOpacity 
      key={match.id}
      style={styles.matchCard}
      onPress={() => navigation.navigate('MatchDetails', { match })}
    >
      <View style={styles.matchHeader}>
        <Text style={styles.matchDate}>{match.date} | {match.time}</Text>
      </View>
      
      <View style={styles.matchInfo}>
        <View style={styles.matchTypeContainer}>
          <Ionicons name="trophy-outline" size={16} color="#6b7280" />
          <Text style={styles.matchType}>{match.type}</Text>
        </View>
        <View style={styles.levelContainer}>
          <Ionicons name="bar-chart-outline" size={16} color="#6b7280" />
          <Text style={styles.levelRange}>{match.levelRange}</Text>
        </View>
      </View>

      <View style={styles.playersContainer}>
        {match.players.map((player, index) => (
          <View key={index} style={styles.playerSlot}>
            {player.available ? (
              <View style={styles.availableSlot}>
                <View style={styles.plusIcon}>
                  <Text style={styles.plusText}>+</Text>
                </View>
                <Text style={styles.availableText}>Доступно</Text>
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.playerInfo}
                onPress={() => navigation.navigate('Profile')}
              >
                <Avatar
                  uri={player.avatar}
                  initials={player.initials}
                  size="medium"
                />
                <Text style={styles.playerName}>{player.name}</Text>
                <Badge text={player.level} type="level" size="small" />
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>

      <View style={styles.clubInfo}>
        <View style={styles.clubDetails}>
          <Text style={styles.clubIcon}>{match.club.icon}</Text>
          <View>
            <Text style={styles.clubName}>{match.club.name}</Text>
            <Text style={styles.clubLocation}>{match.club.distance} • {match.club.location}</Text>
          </View>
        </View>
        <View style={styles.matchMeta}>
          <Text style={styles.matchPrice}>{match.price}</Text>
          <Text style={styles.matchDuration}>{match.duration}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Доступные</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <View style={styles.filterIcon}>
          <Ionicons name="options-outline" size={20} color="#6b7280" />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
          <Chip 
            label={selectedSport} 
            active={true} 
            onPress={() => {}} 
            style={styles.filterChip}
          />
          <Chip 
            label={selectedClubs} 
            active={true} 
            onPress={() => {}} 
            style={styles.filterChip}
          />
          <Chip 
            label={selectedDate} 
            active={true} 
            onPress={() => {}} 
            style={styles.filterChip}
          />
        </ScrollView>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Для вашего уровня</Text>
          <Text style={styles.sectionSubtitle}>Эти матчи идеально подходят для вашего поиска и уровня</Text>
        </View>

        {/* Matches List */}
        <View style={styles.matchesList}>
          {matches.map(renderMatch)}
        </View>

        {/* Start a Match Button */}
        <View style={styles.startMatchContainer}>
          <Button
            title="Начать матч"
            variant="primary"
            icon="add"
            onPress={() => setShowVenueModal(true)}
            style={styles.startMatchButton}
          />
        </View>
      </ScrollView>
      
      <VenueSelectionModal
        visible={showVenueModal}
        onClose={() => setShowVenueModal(false)}
        onNext={(selectedOption) => {
          setShowVenueModal(false);
          navigation.navigate('NewMatch', { venueType: selectedOption });
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  
  // Filters
  filtersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  filterIcon: {
    marginRight: 12,
  },
  filtersScroll: {
    flex: 1,
  },
  filterChip: {
    marginRight: 8,
  },
  
  content: {
    flex: 1,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  
  // Matches
  matchesList: {
    paddingHorizontal: 16,
    gap: 16,
  },
  matchCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  matchHeader: {
    marginBottom: 12,
  },
  matchDate: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
  },
  matchInfo: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 16,
  },
  matchTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  matchType: {
    fontSize: 14,
    color: '#6b7280',
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  levelRange: {
    fontSize: 14,
    color: '#6b7280',
  },
  
  // Players
  playersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 8,
  },
  playerSlot: {
    flex: 1,
    alignItems: 'center',
  },
  playerInfo: {
    alignItems: 'center',
    gap: 6,
  },
  playerName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
  },
  availableSlot: {
    alignItems: 'center',
    gap: 6,
  },
  plusIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#3b82f6',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusText: {
    fontSize: 24,
    color: '#3b82f6',
    fontWeight: '300',
  },
  availableText: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '500',
  },
  
  // Club
  clubInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  clubDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  clubIcon: {
    fontSize: 24,
  },
  clubName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  clubLocation: {
    fontSize: 14,
    color: '#6b7280',
  },
  matchMeta: {
    alignItems: 'flex-end',
  },
  matchPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3b82f6',
    marginBottom: 2,
  },
  matchDuration: {
    fontSize: 14,
    color: '#3b82f6',
  },
  
  // Start Match
  startMatchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  startMatchButton: {
    borderRadius: 30,
  },
});