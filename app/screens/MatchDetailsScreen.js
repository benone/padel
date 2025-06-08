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
import { getStaticImageUrl } from '../config/api.config';

export default function MatchDetailsScreen({ navigation, route }) {
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
      setMatchData(response.data);
    } catch (error) {
      console.error('Failed to load match details:', error);
      // Fallback to sample data if API fails
      setMatchData({
        date: 'Воскресенье, 8 июня',
        time: '09:00 - 10:30',
        type: 'Соревновательный',
        levelRange: '0.49-1.49',
        gender: 'Все игроки',
        price: '₽450',
        players: [
          { name: 'Анна', level: '0.74', initials: 'А' },
          { name: 'Кирилл', level: '=', initials: 'К', isCurrentUser: true },
          { name: 'Дмитрий', level: '0.85', initials: 'Д' },
          { name: 'Доступно', available: true }
        ],
        club: {
          name: 'Спортивный клуб "Чемпион"',
          location: 'Москва'
        }
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
            uri={player.avatar}
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
            <Badge text={player.level?.toFixed(2) || '0.00'} type="level" size="small" />
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
              onPress={() => navigation.goBack()}
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