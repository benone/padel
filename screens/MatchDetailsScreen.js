import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Avatar, Badge, Button } from '../components/ui';

export default function MatchDetailsScreen({ navigation, route }) {
  const { match } = route.params || {};
  const [currentUser] = useState({
    name: 'Кирилл (Вы)',
    level: '=',
    initials: 'К',
    status: 'Ожидание'
  });

  // Sample match data if none provided
  const matchData = match || {
    date: 'Воскресенье, 8 июня',
    time: '09:00 - 10:30',
    type: 'Соревновательный',
    levelRange: '0.49-1.49',
    gender: 'Все игроки',
    price: '₽450',
    players: [
      { name: 'Анна', level: '0.74', initials: 'А' },
      { name: 'Кирилл (Вы)', level: '=', initials: 'К', isCurrentUser: true },
      { name: 'Дмитрий', level: '0.85', initials: 'Д' },
      { name: 'Доступно', available: true }
    ],
    club: {
      name: 'Спортивный клуб "Чемпион"',
      location: 'Москва'
    }
  };

  const renderPlayer = (player, index) => (
    <View key={index} style={styles.playerContainer}>
      {player.available ? (
        <View style={styles.availablePlayerSlot}>
          <View style={styles.changeButton}>
            <Text style={styles.changeButtonText}>+</Text>
          </View>
          <Text style={styles.changeText}>Изменить</Text>
        </View>
      ) : (
        <TouchableOpacity 
          style={styles.playerInfo}
          onPress={() => !player.isCurrentUser && navigation.navigate('Profile')}
          disabled={player.isCurrentUser}
        >
          <Avatar
            initials={player.initials}
            size="large"
            style={player.isCurrentUser && styles.currentUserAvatar}
          />
          <Text style={[
            styles.playerName,
            player.isCurrentUser && styles.currentUserName
          ]}>
            {player.name}
          </Text>
          {player.level !== '=' && (
            <Badge text={player.level} type="level" size="medium" />
          )}
          {player.isCurrentUser && (
            <View style={styles.pendingContainer}>
              <Text style={styles.pendingText}>Ожидание</Text>
              <Ionicons name="hourglass-outline" size={16} color="#6b7280" />
            </View>
          )}
        </TouchableOpacity>
      )}
      {index < 3 && <View style={styles.playerDivider} />}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Background */}
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop' }}
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
              <Text style={styles.sportTitle}>ПАДЕЛ</Text>
              <Text style={styles.matchDateTime}>{matchData.date} {matchData.time}</Text>
            </View>
          </View>

          <View style={styles.matchInfoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Пол</Text>
              <Text style={styles.infoValue}>{matchData.gender}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Уровень</Text>
              <Text style={styles.infoValue}>{matchData.levelRange}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Цена</Text>
              <Text style={styles.infoValue}>{matchData.price}</Text>
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
          <Text style={styles.competitiveTitle}>Соревновательный</Text>
          <Text style={styles.competitiveDescription}>
            Результат этого матча будет засчитан в уровень
          </Text>
        </View>

        {/* Players Section */}
        <View style={styles.playersSection}>
          <Text style={styles.sectionTitle}>Игроки</Text>
          <View style={styles.playersGrid}>
            {matchData.players.map(renderPlayer)}
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
  },
  playerContainer: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  playerInfo: {
    alignItems: 'center',
    gap: 8,
  },
  playerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
  },
  currentUserName: {
    color: '#6b7280',
  },
  currentUserAvatar: {
    opacity: 0.7,
  },
  pendingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  pendingText: {
    fontSize: 12,
    color: '#6b7280',
  },
  availablePlayerSlot: {
    alignItems: 'center',
    gap: 8,
  },
  changeButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#3b82f6',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  changeButtonText: {
    fontSize: 32,
    color: '#3b82f6',
    fontWeight: '300',
  },
  changeText: {
    fontSize: 16,
    color: '#3b82f6',
    fontWeight: '600',
  },
  playerDivider: {
    position: 'absolute',
    right: -20,
    top: '50%',
    width: 1,
    height: 60,
    backgroundColor: '#e5e7eb',
    transform: [{ translateY: -30 }],
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