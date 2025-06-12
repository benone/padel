import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Chip, Avatar, Badge, Button } from '../components/ui';
import VenueSelectionModal from './VenueSelectionModal';
import { matchesAPI, clubsAPI, authAPI } from '../services/api';
import { getImageUrl } from '../config/api.config';
import { useCanGoBack } from '../hooks';

export default function OpenMatchesScreen({ navigation }) {
  const { canGoBack, goBack } = useCanGoBack();
  const [selectedSport, setSelectedSport] = useState('Падел');
  const [selectedClubs, setSelectedClubs] = useState('2 клуба');
  const [selectedDate, setSelectedDate] = useState('Сб-Вс-Пн, 07');
  const [showVenueModal, setShowVenueModal] = useState(false);

  // API data states
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    loadCurrentUser();
    loadMatches();
  }, [selectedSport]);

  const loadCurrentUser = async () => {
    try {
      const user = await authAPI.getCurrentUser();
      setCurrentUser(user);
    } catch (error) {
      console.warn('Failed to load current user:', error);
    }
  };

  const loadMatches = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await matchesAPI.getOpen({
        sport: selectedSport.toLowerCase(),
        limit: 20
      });

      console.log('🔧 DEBUG - API Response structure:', {
        hasData: !!response.data,
        dataType: Array.isArray(response.data) ? 'array' : typeof response.data,
        dataLength: Array.isArray(response.data) ? response.data.length : 'N/A',
        hasDataProperty: response.data?.data ? 'yes' : 'no',
        dataKeys: response.data ? Object.keys(response.data) : 'none'
      });

      // Handle both possible response structures
      let matchesData = [];
      let fullResponse = response.data;
      
      if (response.data?.data && Array.isArray(response.data.data)) {
        // JSONAPI format: { data: [...] }
        matchesData = response.data.data;
      } else if (Array.isArray(response.data)) {
        // Direct array format: [...]
        matchesData = response.data;
        fullResponse = { data: response.data }; // Normalize structure
      } else if (response.data?.matches && Array.isArray(response.data.matches)) {
        // Legacy format: { matches: [...] }
        matchesData = response.data.matches;
        fullResponse = { data: response.data.matches }; // Normalize structure
      }

      // Attach the full response context to each match for relationships/included data
      const matchesWithContext = matchesData.map(match => ({
        ...match,
        _fullResponse: fullResponse
      }));

      console.log('🔧 DEBUG - Processed matches:', {
        matchesCount: matchesWithContext.length,
        firstMatch: matchesWithContext[0] || 'none'
      });

      setMatches(matchesWithContext);
    } catch (error) {
      console.error('Failed to load matches:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить матчи');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleJoinMatch = async (matchId) => {
    try {
      Alert.alert(
        'Присоединиться к матчу',
        'Отправить заявку на участие в этом матче?',
        [
          { text: 'Отмена', style: 'cancel' },
          {
            text: 'Присоединиться',
            onPress: async () => {
              try {
                const response = await matchesAPI.join(matchId, 'Хочу присоединиться к вашему матчу!');
                Alert.alert('Успешно!', response.data.message);
                loadMatches(); // Refresh matches
              } catch (error) {
                Alert.alert('Ошибка', 'Не удалось присоединиться к матчу');
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error('Failed to join match:', error);
    }
  };

  const renderMatch = (match) => {
    // Handle both JSONAPI format and legacy format
    const attrs = match.attributes || match;
    const matchId = match.id || attrs.id;
    
    const matchDate = new Date(attrs.match_date || attrs.date);
    const formattedDate = matchDate.toLocaleDateString('ru-RU', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
    const formattedTime = matchDate.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    });

    // For now, use placeholder data for missing fields in JSONAPI response
    const levelRange = attrs.levelRange 
      ? `${attrs.levelRange[0]} - ${attrs.levelRange[1]}` 
      : `${attrs.level_min || '6.0'} - ${attrs.level_max || '8.0'}`;
    const competitiveText = attrs.competitive ? 'Соревновательный' : 'Дружеский';

    // Extract player information from relationships and included data
    const players = [];
    const fullResponse = match._fullResponse || {};
    const included = fullResponse.included || [];
    const addedPlayerIds = new Set(); // Track added players to prevent duplicates
    
    // Add organizer if available
    if (match.relationships?.organizer?.data) {
      const organizerId = match.relationships.organizer.data.id;
      const organizerData = included.find(item => 
        item.type === 'players' && item.id === organizerId
      );
      
      if (organizerData && !addedPlayerIds.has(organizerId)) {
        players.push({
          id: organizerData.id,
          name: organizerData.attributes.name,
          level: parseFloat(organizerData.attributes.level),
          avatar: organizerData.attributes.avatar_url,
          isOrganizer: true
        });
        addedPlayerIds.add(organizerId);
      }
    }
    
    // Add participants if any (skip if already added as organizer)
    if (match.relationships?.participants?.data) {
      match.relationships.participants.data.forEach(participant => {
        const participantData = included.find(item => 
          item.type === 'players' && item.id === participant.id
        );
        
        if (participantData && !addedPlayerIds.has(participant.id)) {
          players.push({
            id: participantData.id,
            name: participantData.attributes.name,
            level: parseFloat(participantData.attributes.level),
            avatar: participantData.attributes.avatar_url,
            isOrganizer: false
          });
          addedPlayerIds.add(participant.id);
        }
      });
    }
    
    // For display purposes, show at least one player (organizer) if no participants yet
    if (players.length === 0) {
      // If no organizer data, create a placeholder
      players.push({
        id: 'organizer-placeholder',
        name: 'Организатор',
        level: 7.0,
        avatar: null,
        isOrganizer: true
      });
    }
    
    console.log('🔧 DEBUG - Match players:', {
      matchId: matchId,
      playersCount: players.length,
      players: players.map(p => ({ id: p.id, name: p.name, isOrganizer: p.isOrganizer }))
    });

    const playersNeeded = attrs.players_needed || attrs.spots_available || 2;

    return (
      <TouchableOpacity
        key={matchId}
        style={styles.matchCard}
        onPress={() => navigation.navigate('MatchDetails', { matchId: matchId })}
      >
        <View style={styles.matchHeader}>
          <Text style={styles.matchDate}>{formattedDate} | {formattedTime}</Text>
        </View>

        <View style={styles.matchInfo}>
          <View style={styles.matchTypeContainer}>
            <Ionicons name="trophy-outline" size={16} color="#6b7280" />
            <Text style={styles.matchType}>{competitiveText}</Text>
          </View>
          <View style={styles.levelContainer}>
            <Ionicons name="bar-chart-outline" size={16} color="#6b7280" />
            <Text style={styles.levelRange}>{levelRange}</Text>
          </View>
        </View>

        <View style={styles.playersContainer}>
          {players.map((player, index) => {
            const isCurrentUser = currentUser && (player.id === currentUser.id || player.isCurrentUser);
            const isWaiting = player.status === 'waiting' || player.waiting;

            return (
              <View key={index} style={styles.playerSlot}>
                <TouchableOpacity
                  style={styles.playerInfo}
                  onPress={() => navigation.navigate('Profile', { userId: player.id })}
                >
                  <Avatar
                    uri={player.avatar ? getImageUrl(player.avatar) : null}
                    initials={player.name ? player.name.charAt(0) : '?'}
                    size="large"
                  />
                  <View style={styles.playerNameContainer}>
                    <Text style={styles.playerName}>{player.name}</Text>
                    {isCurrentUser && <Text style={styles.playerYouLabel}>(Вы)</Text>}
                  </View>
                  {isWaiting ? (
                    <View style={styles.waitingContainer}>
                      <Text style={styles.waitingText}>Ожидание</Text>
                      <Text style={styles.waitingIcon}>⏳</Text>
                    </View>
                  ) : (
                    <Badge text={player.level?.toFixed(1) || '6.5'} type="level" size="small" />
                  )}
                </TouchableOpacity>
              </View>
            );
          })}

          {/* Show available spots */}
          {Array.from({ length: playersNeeded }, (_, index) => {
            const isLastSlot = index === playersNeeded - 1 && playersNeeded === 1;

            return (
              <View key={`available-${index}`} style={styles.playerSlot}>
                <TouchableOpacity
                  style={styles.availableSlot}
                  onPress={() => handleJoinMatch(matchId)}
                >
                  <View style={styles.plusIcon}>
                    <Text style={styles.plusText}>+</Text>
                  </View>
                  <Text style={[styles.availableText, isLastSlot && styles.editText]}>
                    {isLastSlot ? 'Изменить' : 'Доступно'}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        <View style={styles.clubInfo}>
          <View style={styles.clubDetails}>
            <Text style={styles.clubIcon}>🏟️</Text>
            <View>
              {(() => {
                // Extract club information from included data
                let clubName = 'Падел клуб';
                let clubLocation = '2км • ул. Примерная, 123';
                
                if (match.relationships?.club?.data) {
                  const clubId = match.relationships.club.data.id;
                  const clubData = included.find(item => 
                    item.type === 'clubs' && item.id === clubId
                  );
                  
                  if (clubData) {
                    clubName = clubData.attributes.name;
                    clubLocation = clubData.attributes.description || 'Москва';
                  }
                }
                
                return (
                  <>
                    <Text style={styles.clubName}>{clubName}</Text>
                    <Text style={styles.clubLocation}>{clubLocation}</Text>
                  </>
                );
              })()}
            </View>
          </View>
          <View style={styles.matchMeta}>
            <Text style={styles.matchPrice}>₽{attrs.price_per_person || '625'}</Text>
            <Text style={styles.matchDuration}>{attrs.duration || 90}мин</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack}>
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

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadMatches(true)}
            colors={['#3b82f6']}
            tintColor="#3b82f6"
          />
        }
      >
        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Для вашего уровня</Text>
          <Text style={styles.sectionSubtitle}>Эти матчи идеально подходят для вашего поиска и уровня</Text>
        </View>

        {/* Matches List */}
        <View style={styles.matchesList}>
          {loading && (
            <View style={{ padding: 40, alignItems: 'center' }}>
              <ActivityIndicator size="large" color="#3b82f6" />
              <Text style={{ marginTop: 10, color: '#6b7280' }}>Загрузка матчей...</Text>
            </View>
          )}

          {!loading && matches.length === 0 && (
            <View style={{ padding: 40, alignItems: 'center' }}>
              <Text style={{ fontSize: 18, color: '#6b7280', marginBottom: 8 }}>Нет доступных матчей</Text>
              <Text style={{ color: '#9ca3af', textAlign: 'center' }}>
                Попробуйте изменить фильтры или создать новый матч
              </Text>
            </View>
          )}

          {!loading && matches.map(renderMatch)}
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
    gap: 16,
  },
  playerSlot: {
    flex: 1,
    alignItems: 'center',
  },
  playerInfo: {
    alignItems: 'center',
    gap: 4,
  },
  playerNameContainer: {
    alignItems: 'center',
  },
  playerName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
  },
  playerYouLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  waitingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  waitingText: {
    fontSize: 12,
    color: '#6b7280',
  },
  waitingIcon: {
    fontSize: 12,
  },
  availableSlot: {
    alignItems: 'center',
    gap: 6,
  },
  plusIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#3b82f6',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusText: {
    fontSize: 32,
    color: '#3b82f6',
    fontWeight: '300',
  },
  availableText: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '500',
  },
  editText: {
    color: '#3b82f6',
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
