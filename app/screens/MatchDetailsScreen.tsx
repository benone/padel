import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Avatar, Badge, Button } from '../components/ui';
import { matchesAPI, authAPI } from '../services/api';
import { getStaticImageUrl, getImageUrl } from '../config/api.config';
import { useCanGoBack } from '../hooks';

export default function MatchDetailsScreen({ navigation, route }) {
  const { canGoBack, goBack } = useCanGoBack();
  const { matchId } = route.params || {};
  const [matchData, setMatchData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    loadMatchDetails();
    loadCurrentUser();
  }, [matchId]);

  const loadCurrentUser = async () => {
    try {
      const user = await authAPI.getCurrentUser();
      setCurrentUser(user);
    } catch (error) {
      console.warn('Failed to load current user:', error);
    }
  };

  const loadMatchDetails = async () => {
    try {
      setLoading(true);
      const response = await matchesAPI.getDetails(matchId);
      
      console.log('🔧 DEBUG - Match details response:', {
        hasData: !!response.data,
        dataType: typeof response.data,
        hasDataProperty: response.data?.data ? 'yes' : 'no',
        dataKeys: response.data ? Object.keys(response.data) : 'none'
      });

      // Process the JSONAPI response to extract match data and players
      let processedMatchData = {};
      
      if (response.data?.data) {
        // JSONAPI format: { data: {...}, included: [...] }
        const match = response.data.data;
        const attrs = match.attributes || {};
        const included = response.data.included || [];
        
        // Extract player information using same logic as OpenMatchesScreen
        const players = [];
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
        
        // Extract club information
        let clubData = { name: 'Падел клуб', location: 'Москва' };
        if (match.relationships?.club?.data) {
          const clubId = match.relationships.club.data.id;
          const club = included.find(item => 
            item.type === 'clubs' && item.id === clubId
          );
          
          if (club) {
            clubData = {
              name: club.attributes.name,
              location: club.attributes.description || 'Москва'
            };
          }
        }
        
        // Build processed match data
        processedMatchData = {
          id: match.id,
          date: attrs.match_date,
          sport: 'ПАДЕЛ',
          competitive: false, // Default to friendly
          genderPreference: attrs.gender_preference || 'mixed',
          levelRange: [attrs.level_min || '6.0', attrs.level_max || '8.0'],
          price: attrs.price_per_person || '625',
          players: players,
          playersNeeded: attrs.spots_available || 2,
          club: clubData,
          duration: attrs.duration || 90,
          description: attrs.description
        };
        
        console.log('🔧 DEBUG - Processed match data:', {
          matchId: processedMatchData.id,
          playersCount: players.length,
          clubName: clubData.name,
          players: players.map(p => ({ id: p.id, name: p.name, isOrganizer: p.isOrganizer }))
        });
        
      } else {
        // Legacy format fallback
        processedMatchData = response.data;
      }
      
      setMatchData(processedMatchData);
    } catch (error) {
      console.error('Failed to load match details:', error);
      // Minimal fallback data
      setMatchData({
        date: new Date().toISOString(),
        sport: 'ПАДЕЛ',
        genderPreference: 'mixed',
        levelRange: ['6.0', '8.0'],
        price: '625',
        players: [],
        playersNeeded: 4,
        club: { name: 'Падел клуб', location: 'Москва' }
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading || !matchData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
      </SafeAreaView>
    );
  }

  const renderPlayer = (player, index) => {
    const isCurrentUser = currentUser && (player.id === currentUser.id || player.isCurrentUser);
    const isWaiting = player.status === 'waiting' || player.waiting;
    
    return (
      <View key={index} style={styles.playerSlot}>
        <TouchableOpacity 
          style={styles.playerInfo}
          onPress={() => !isCurrentUser && navigation.navigate('Profile', { userId: player.id })}
          disabled={isCurrentUser}
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
            <Badge text={player.level ? player.level.toFixed(2) : '0.00'} type="level" size="small" />
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Background */}
      <ImageBackground
        source={{ uri: getStaticImageUrl('court-background-1') }}
        style={styles.headerBackground}
        imageStyle={styles.headerBackgroundImage}
      >
        <View style={styles.headerOverlay}>
          <View style={styles.headerControls}>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={goBack}
            >
              <Ionicons name="arrow-back" size={24} color="#1f2937" />
            </TouchableOpacity>
            <View style={styles.headerRightButtons}>
              <TouchableOpacity style={styles.headerButton}>
                <Ionicons name="share-outline" size={24} color="#1f2937" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton}>
                <Ionicons name="ellipsis-horizontal" size={24} color="#1f2937" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Match Info Card */}
        <View style={styles.matchInfoCard}>
          <View style={styles.matchInfoHeader}>
            <View style={styles.sportIcon}>
              <Ionicons name="tennisball-outline" size={24} color="#1f2937" />
            </View>
            <View style={styles.matchInfoDetails}>
              <Text style={styles.sportTitle}>{matchData.sport || 'ПАДЕЛ'}</Text>
              <Text style={styles.matchDateTime}>
                {matchData.date ? new Date(matchData.date).toLocaleDateString('ru-RU', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long'
                }) : ''} {matchData.date ? new Date(matchData.date).toLocaleTimeString('ru-RU', {
                  hour: '2-digit',
                  minute: '2-digit'
                }) : ''}
              </Text>
            </View>
          </View>

          <View style={styles.matchInfoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Пол</Text>
              <Text style={styles.infoValue}>{matchData.genderPreference === 'mixed' ? 'Все игроки' : matchData.genderPreference || 'Все игроки'}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Уровень</Text>
              <Text style={styles.infoValue}>
                {matchData.levelRange ? `${matchData.levelRange[0]} - ${matchData.levelRange[1]}` : '0.0 - 10.0'}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Цена</Text>
              <Text style={styles.infoValue}>₽{matchData.price || '0'}</Text>
            </View>
          </View>
        </View>

        {/* Match Status */}
        <View style={styles.statusCard}>
          <View style={styles.statusItem}>
            <Ionicons name="lock-open-outline" size={20} color="#1f2937" />
            <Text style={styles.statusText}>Открытый матч</Text>
          </View>
          <View style={styles.statusIndicator}>
            <Ionicons name="checkmark-circle" size={20} color="#10b981" />
            <Text style={styles.statusSuccessText}>Корт забронирован</Text>
          </View>
        </View>

        {/* Match Type Info */}
        <View style={styles.competitiveCard}>
          <Text style={styles.competitiveTitle}>{matchData.competitive ? 'Соревновательный' : 'Дружеский'}</Text>
          <Text style={styles.competitiveDescription}>
            {matchData.competitive ? 'Результат этого матча будет засчитан в уровень' : 'Результат этого матча не влияет на ваш уровень'}
          </Text>
        </View>

        {/* Players Section */}
        <View style={styles.playersSection}>
          <Text style={styles.sectionTitle}>Игроки</Text>
          <View style={styles.playersGrid}>
            {matchData.players && matchData.players.map(renderPlayer)}
            {matchData.playersNeeded && Array.from({ length: matchData.playersNeeded }, (_, index) => (
              <View key={`available-${index}`} style={styles.playerSlot}>
                <TouchableOpacity 
                  style={styles.availableSlot}
                  onPress={() => {}}
                >
                  <View style={styles.plusIcon}>
                    <Text style={styles.plusText}>+</Text>
                  </View>
                  <Text style={styles.availableText}>Доступно</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* Teams */}
        <View style={styles.teamsSection}>
          <View style={styles.teamColumn}>
            <Text style={styles.teamLabel}>A</Text>
          </View>
          <View style={styles.teamColumn}>
            <Text style={styles.teamLabel}>B</Text>
          </View>
        </View>
      </ScrollView>

      {/* Reserve Button */}
      <View style={styles.reserveContainer}>
        <Button
          title={`Забронировать место - ${matchData.price}`}
          variant="primary"
          onPress={() => {}}
          style={styles.reserveButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  
  // Header
  headerBackground: {
    height: 200,
    position: 'relative',
  },
  headerBackgroundImage: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 60,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  headerRightButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  
  content: {
    flex: 1,
    marginTop: -20,
  },
  
  // Match Info Card
  matchInfoCard: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  matchInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sportIcon: {
    marginRight: 12,
  },
  matchInfoDetails: {
    flex: 1,
  },
  sportTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  matchDateTime: {
    fontSize: 16,
    color: '#6b7280',
  },
  matchInfoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  infoItem: {
    flex: 1,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  
  // Status Card
  statusCard: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusSuccessText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10b981',
  },
  
  // Competitive Card
  competitiveCard: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  competitiveTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
  },
  competitiveDescription: {
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 24,
  },
  
  // Players Section
  playersSection: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 20,
  },
  playersGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  
  // Teams
  teamsSection: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 20,
    marginBottom: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  teamColumn: {
    flex: 1,
    alignItems: 'center',
  },
  teamLabel: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
  },
  
  // Reserve Button
  reserveContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  reserveButton: {
    borderRadius: 30,
    minHeight: 56,
  },
});