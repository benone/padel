import React, { useState, useRef, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { 
  Button, 
  Chip, 
  Avatar, 
  Badge, 
  MatchCard, 
  PersonCard, 
  ClubCard, 
  StatCard, 
  RankingCard,
  ProgressBar,
  TabNavigation 
} from '../components/ui';

const { width } = Dimensions.get('window');

export default function ProfileScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('activities');
  
  const underlinePosition = useRef(new Animated.Value(20)).current;
  
  const tabPositions = {
    activities: 20,
    posts: width / 2 + 20,
  };
  
  useEffect(() => {
    Animated.timing(underlinePosition, {
      toValue: tabPositions[activeTab],
      duration: 150,
      useNativeDriver: false,
    }).start();
  }, [activeTab]);

  return (
    <SafeAreaView style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Профиль</Text>
        <TouchableOpacity>
          <Ionicons name="share-outline" size={24} color="#1f2937" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarShadow}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1494790108755-2616c5fab5e7?w=300&h=300&fit=crop&crop=face' }}
                style={styles.avatar}
              />
            </View>
            <View style={styles.statusDot} />
          </View>
          <Text style={styles.name}>Александра Гарнева</Text>
          <Text style={styles.location}>📍 Ярославль, Россия</Text>
          
          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>44</Text>
              <Text style={styles.statLabel}>Матчи</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>37</Text>
              <Text style={styles.statLabel}>Подписчики</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>22</Text>
              <Text style={styles.statLabel}>Подписки</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <Button
              title="Подписаться"
              variant="primary"
              icon="person-add"
              style={{ flex: 1 }}
              onPress={() => {}}
            />
            <Button
              title="Сообщение"
              variant="secondary"
              icon="chatbubble-outline"
              style={{ flex: 1 }}
              onPress={() => {}}
            />
            <Button
              title=""
              variant="icon"
              icon="ellipsis-horizontal"
              onPress={() => {}}
            />
          </View>
        </View>

        {/* Tabs */}
        <TabNavigation
          tabs={[
            { key: 'activities', label: 'Активность' },
            { key: 'posts', label: 'Посты' }
          ]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Tab Content */}
        {activeTab === 'activities' && (
          <View>
            {/* Sports Filter */}
            <View style={styles.sportsFilter}>
              <Chip label="Падел" active={true} onPress={() => {}} />
              <Chip label="Теннис" active={false} onPress={() => {}} />
              <Chip label="Пиклбол" active={false} onPress={() => {}} />
            </View>

            {/* Level Card */}
            <View style={styles.levelCard}>
              <View style={styles.levelHeader}>
                <View>
                  <Text style={styles.levelLabel}>🏆 Текущий уровень</Text>
                  <Text style={styles.levelNumber}>0.69</Text>
                </View>
                <View style={styles.reliabilityBadge}>
                  <Text style={styles.reliabilityText}>СРЕДНИЙ</Text>
                </View>
              </View>
              <View style={styles.progressContainer}>
                <ProgressBar 
                  percentage={64.84} 
                  showLabel={true}
                  label="Надежность уровня: 64.84%"
                />
              </View>
            </View>

            {/* Level Progression */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Прогресс уровня</Text>
              
              <View style={styles.filterButtons}>
                <Chip label="5 результатов" active={true} onPress={() => {}} />
                <Chip label="10 результатов" active={false} badge={9} onPress={() => {}} />
                <Chip label="Все результаты" active={false} badge={9} onPress={() => {}} />
              </View>

              {/* Match Result */}
              <View style={styles.matchCard}>
                <View style={styles.matchHeader}>
                  <View style={styles.matchTitleContainer}>
                    <Ionicons name="trophy" size={20} color="#f59e0b" />
                    <Text style={styles.matchTitle}>Открытый матч</Text>
                  </View>
                  <Text style={styles.matchDate}>06/01/2025</Text>
                </View>
                <View style={styles.matchResultDetail}>
                  <View style={styles.matchPlayersDetail}>
                    <View style={styles.teamColumn}>
                      <View style={styles.playerPair}>
                        <Image source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face' }} style={styles.playerAvatar} />
                        <Image source={{ uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face' }} style={styles.playerAvatar} />
                      </View>
                    </View>
                    <View style={styles.scoreSection}>
                      <Text style={styles.score}>0</Text>
                      <Text style={styles.score}>1</Text>
                      <Text style={styles.scoreSeparator}>-</Text>
                    </View>
                    <View style={styles.resultSection}>
                      <Text style={styles.resultWinText}>Победа</Text>
                      <Text style={styles.levelChangeText}>Выше</Text>
                      <Text style={styles.levelChange}>+0.09</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Enhanced Chart */}
              <View style={styles.chartContainer}>
                <View style={styles.chartBackground}>
                  <View style={styles.chartLine}>
                    <View style={styles.chartPoint} />
                    <View style={styles.chartLineConnector} />
                    <View style={styles.chartPoint} />
                    <View style={styles.chartLineConnector} />
                    <View style={styles.chartPoint} />
                    <View style={styles.chartLineConnector} />
                    <View style={styles.chartPointActive}>
                      <View style={styles.chartPointLabel}>
                        <Text style={styles.chartPointValue}>0.7</Text>
                        <Text style={styles.chartPointValueMain}>0.69</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.chartYAxis}>
                    <Text style={styles.chartAxisLabel}>0.58</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Player Preferences */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Предпочтения игрока</Text>
              
              <View style={styles.preferenceItem}>
                <Text style={styles.preferenceIcon}>👋</Text>
                <View>
                  <Text style={styles.preferenceLabel}>Лучшая рука</Text>
                  <Text style={styles.preferenceValue}>Правша</Text>
                </View>
              </View>

              <View style={styles.preferenceItem}>
                <Text style={styles.preferenceIcon}>📍</Text>
                <View>
                  <Text style={styles.preferenceLabel}>Позиция на корте</Text>
                  <Text style={styles.preferenceValue}>Обе стороны</Text>
                </View>
              </View>

              <View style={styles.preferenceItem}>
                <Text style={styles.preferenceIcon}>🌅</Text>
                <View>
                  <Text style={styles.preferenceLabel}>Предпочитаемое время игры</Text>
                  <Text style={styles.preferenceValue}>Вечером</Text>
                </View>
              </View>
            </View>

            {/* Recent Matches */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Матчи</Text>
              
              <View style={styles.recentMatch}>
                <View style={styles.matchPlayersRow}>
                  <View style={styles.playerInfoSection}>
                    <View style={styles.playerAvatarContainer}>
                      <Image source={{ uri: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face' }} style={styles.matchPlayerAvatar} />
                      <View style={styles.onlineIndicator} />
                    </View>
                    <View style={styles.playerDetails}>
                      <Text style={styles.playerName}>Жанна</Text>
                      <View style={styles.levelBadge}>
                        <Text style={styles.levelBadgeText}>0.66</Text>
                      </View>
                    </View>
                  </View>
                  
                  <View style={styles.vsIndicator}>
                    <Text style={styles.vsText}>VS</Text>
                  </View>
                  
                  <View style={styles.playerInfoSection}>
                    <View style={styles.playerAvatarContainer}>
                      <Image source={{ uri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face' }} style={styles.matchPlayerAvatar} />
                      <View style={styles.onlineIndicator} />
                    </View>
                    <View style={styles.playerDetails}>
                      <Text style={styles.playerName}>Алексей</Text>
                      <View style={styles.levelBadge}>
                        <Text style={styles.levelBadgeText}>0.68</Text>
                      </View>
                    </View>
                  </View>
                </View>
                
                <View style={styles.matchTimeContainer}>
                  <Ionicons name="time-outline" size={16} color="#6b7280" />
                  <Text style={styles.matchTime}>Июн 01 | 17:30 - 18:30</Text>
                </View>
                
                <View style={styles.matchScoreResult}>
                  <Text style={styles.scoreNumber}>0</Text>
                  <Text style={styles.scoreNumber}>1</Text>
                  <Text style={styles.scoreSeparator}>-</Text>
                  <Text style={styles.winnerName}>Олег</Text>
                </View>
              </View>
            </View>

            {/* Statistics */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Статистика</Text>
              
              <View style={styles.statsGrid}>
                <StatCard number="37" label="Всего" />
                <StatCard number="12" label="Выиграно" color="#10b981" />
                <StatCard number="10" label="Последние" />
                <StatCard number="4" label="Выиграно" color="#10b981" />
              </View>
              
              <View style={styles.effectivenessCard}>
                <View style={styles.effectivenessIcon}>
                  <Ionicons name="analytics" size={32} color="#3b82f6" />
                </View>
                <Text style={styles.effectivenessNumber}>40%</Text>
                <Text style={styles.effectivenessLabel}>Эффективность</Text>
                <Text style={styles.effectivenessSubLabel}>Последние 10</Text>
                <View style={styles.effectivenessProgress}>
                  <ProgressBar 
                    percentage={40} 
                    color="#3b82f6"
                    backgroundColor="#f3f4f6"
                    height={8}
                  />
                </View>
              </View>
            </View>

            {/* People that played most with this user */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Люди, которые играли больше всего с этим пользователем</Text>
              
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.peopleScroll}>
                <PersonCard
                  initials="AC"
                  name="Александр К."
                  level="0.95"
                  matches="19"
                  onPress={() => {}}
                />
                <PersonCard
                  avatar="https://images.unsplash.com/photo-1494790108755-2616c5fab5e7?w=200&h=200&fit=crop&crop=face"
                  name="Мария Вос"
                  level="1.38"
                  matches="5"
                  onPress={() => {}}
                />
                <PersonCard
                  avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face"
                  name="Сергей"
                  level="0.84"
                  matches="4"
                  onPress={() => {}}
                />
              </ScrollView>
            </View>

            {/* Clubs where Alejandra plays */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Клубы, где играет Александра</Text>
              
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.clubsScroll}>
                <ClubCard
                  image="https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=200&fit=crop"
                  name="Падел Центр СУМА"
                  location="Пушкин"
                  onPress={() => {}}
                />
                <ClubCard
                  image="https://images.unsplash.com/photo-1544966503-7fdb27fca2d8?w=300&h=200&fit=crop"
                  name="Падел Арена"
                  location="Васильевский остров"
                  onPress={() => {}}
                />
                <ClubCard
                  image="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop"
                  name="Fair Play"
                  location="Санкт-Петербург"
                  onPress={() => {}}
                />
              </ScrollView>
            </View>

            {/* Rankings */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Рейтинги</Text>
              
              <View style={styles.rankingsContainer}>
                <RankingCard
                  title="Рейтинг падел уровня"
                  value="#0.69"
                  unit="LvL"
                />
                <RankingCard
                  title="Глобальный рейтинг падел"
                  value="#3,154.74"
                />
              </View>
            </View>
          </View>
        )}

        {activeTab === 'posts' && (
          <View style={styles.tabContent}>
            <Text style={styles.comingSoon}>Посты</Text>
            <Text style={styles.comingSoonSub}>Скоро будет доступно</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#ffffff' },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  
  container: { flex: 1 },
  
  profileSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    backgroundColor: '#f8fafc',
  },
  avatarContainer: {
    marginBottom: 16,
    position: 'relative',
  },
  avatarShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  statusDot: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#10b981',
    borderWidth: 3,
    borderColor: 'white',
  },
  name: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  location: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 24,
    textAlign: 'center',
  },
  
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    paddingHorizontal: 4,
  },
  followButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4f46e5',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 30,
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
    minHeight: 48,
  },
  followButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
    letterSpacing: 0.2,
    textAlign: 'center',
  },
  messageButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#4f46e5',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 30,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
    minHeight: 48,
  },
  messageButtonText: {
    color: '#4f46e5',
    fontWeight: '600',
    fontSize: 14,
    letterSpacing: 0.2,
    textAlign: 'center',
  },
  moreButton: {
    width: 48,
    height: 48,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  
  // Tabs
  tabsContainer: {
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    marginHorizontal: 20,
  },
  tabsRow: { flexDirection: 'row' },
  tab: { 
    paddingBottom: 12, 
    paddingHorizontal: 12,
    flex: 1,
    alignItems: 'center',
  },
  tabTextMuted: { fontSize: 16, color: '#6b7280' },
  tabTextActive: { fontSize: 16, fontWeight: '600', color: '#1f2937' },
  underline: {
    position: 'absolute',
    bottom: 0,
    height: 2,
    width: 80,
    backgroundColor: '#1f2937',
    borderRadius: 1,
  },
  
  // Sports Filter
  sportsFilter: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
  },
  sportChipActive: {
    backgroundColor: '#1f2937',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  sportChipActiveText: {
    color: '#ffffff',
    fontWeight: '500',
  },
  sportChip: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  sportChipText: {
    color: '#6b7280',
    fontWeight: '500',
  },
  
  // Level Card
  levelCard: {
    marginHorizontal: 20,
    borderRadius: 20,
    marginBottom: 24,
    backgroundColor: '#1e3a8a',
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  levelLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
  },
  levelNumber: {
    fontSize: 36,
    fontWeight: '700',
    color: '#84cc16',
  },
  reliabilityBadge: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  reliabilityText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#84cc16',
    borderRadius: 3,
  },
  levelReliability: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
  },
  
  // Sections
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 16,
  },
  
  // Filter Buttons
  filterButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  filterButtonActive: {
    backgroundColor: '#1f2937',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  filterButtonActiveText: {
    color: '#ffffff',
    fontWeight: '500',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
  },
  filterButtonBadge: {
    backgroundColor: '#1f2937',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterButtonBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  filterButtonText: {
    color: '#6b7280',
    fontWeight: '500',
  },
  
  // Match Card
  matchCard: {
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: 'white',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  matchResultDetail: {
    alignItems: 'center',
  },
  matchPlayersDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  teamColumn: {
    flex: 1,
    alignItems: 'center',
  },
  scoreSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    justifyContent: 'center',
  },
  resultSection: {
    flex: 1,
    alignItems: 'center',
  },
  resultWinText: {
    fontSize: 14,
    color: '#10b981',
    fontWeight: '600',
    marginBottom: 2,
  },
  levelChangeText: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '500',
    marginBottom: 2,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  matchTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  matchTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },
  matchDate: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  winBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10b981',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  matchResult: {
    alignItems: 'center',
  },
  players: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  playerPair: {
    flexDirection: 'row',
    marginRight: -10,
  },
  playerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: -8,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  score: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  resultContainer: {
    alignItems: 'center',
  },
  resultWin: {
    fontSize: 14,
    color: '#10b981',
    fontWeight: '600',
  },
  levelChange: {
    fontSize: 16,
    color: '#10b981',
    fontWeight: '700',
  },
  
  // Chart
  chartContainer: {
    marginBottom: 20,
    borderRadius: 16,
    backgroundColor: 'white',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    height: 200,
  },
  chartBackground: {
    flex: 1,
    position: 'relative',
  },
  chartLineConnector: {
    height: 2,
    backgroundColor: '#3b82f6',
    flex: 1,
    marginTop: 50,
  },
  chartYAxis: {
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  chartAxisLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  chartPointLabel: {
    position: 'absolute',
    top: -35,
    alignItems: 'center',
    backgroundColor: '#84cc16',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  chartPointValueMain: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  chartArea: {
    alignItems: 'center',
  },
  chartLine: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 100,
    paddingTop: 40,
  },
  chartPoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3b82f6',
  },
  chartPointActive: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#84cc16',
    position: 'relative',
  },
  chartPointValue: {
    fontSize: 10,
    fontWeight: '500',
    color: '#6b7280',
  },
  chartLabels: {
    flexDirection: 'row',
    gap: 40,
  },
  chartLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  
  // Preferences
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    gap: 12,
  },
  preferenceIcon: {
    fontSize: 24,
  },
  preferenceLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  preferenceValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  
  // Recent Matches
  recentMatch: {
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: 'white',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  matchPlayersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  playerInfoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  playerDetails: {
    marginLeft: 12,
    alignItems: 'flex-start',
  },
  playerAvatarContainer: {
    position: 'relative',
  },
  matchPlayerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: 'white',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#10b981',
    borderWidth: 2,
    borderColor: 'white',
  },
  vsIndicator: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginHorizontal: 16,
    alignSelf: 'center',
  },
  vsText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6b7280',
  },
  matchTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  playerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  levelBadge: {
    backgroundColor: '#84cc16',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelBadgeText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: '700',
  },
  matchTime: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  matchScoreResult: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scoreNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  scoreSeparator: {
    fontSize: 18,
    color: '#6b7280',
  },
  winnerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginLeft: 4,
  },
  
  // Statistics
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
  },
  statCardNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1f2937',
  },
  statCardLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  effectivenessCard: {
    borderRadius: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  effectivenessIcon: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#f0f9ff',
    borderRadius: 20,
  },
  effectivenessNumber: {
    fontSize: 52,
    fontWeight: '700',
    color: '#1f2937',
  },
  effectivenessLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  effectivenessSubLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  effectivenessProgress: {
    width: '100%',
  },
  effectivenessProgressBar: {
    height: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 4,
  },
  effectivenessProgressFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 4,
  },
  
  // People section
  peopleScroll: {
    marginBottom: 10,
  },
  personCard: {
    width: 200,
    marginRight: 16,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    alignItems: 'center',
  },
  personImageContainer: {
    marginBottom: 12,
  },
  personInitials: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1f2937',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialsText: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
  },
  personImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  personName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
    textAlign: 'center',
  },
  personLevel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  personMatches: {
    fontSize: 12,
    color: '#9ca3af',
  },
  
  // Clubs section
  clubsScroll: {
    marginBottom: 10,
  },
  clubCard: {
    width: 200,
    marginRight: 16,
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  clubImage: {
    width: '100%',
    height: 120,
  },
  clubName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    paddingHorizontal: 16,
    paddingTop: 12,
    marginBottom: 4,
  },
  clubLocation: {
    fontSize: 14,
    color: '#6b7280',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  
  // Rankings section
  rankingsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  rankingCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    alignItems: 'center',
  },
  rankingTitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
    textAlign: 'center',
  },
  rankingValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1f2937',
  },
  rankingUnit: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6b7280',
  },
  
  // Empty states
  tabContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  comingSoon: {
    fontSize: 20,
    fontWeight: '600',
    color: '#4b5563',
    marginBottom: 8,
  },
  comingSoonSub: {
    fontSize: 16,
    color: '#6b7280',
  },
});