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
import { TabNavigation } from './ui';

const { width } = Dimensions.get('window');

export default function ComponentsLibrary({ navigation }) {
  const [activeTab, setActiveTab] = useState('buttons');
  const [demoSwitch, setDemoSwitch] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Библиотека компонентов</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Component Tabs */}
      <TabNavigation
        tabs={[
          { key: 'buttons', label: 'Кнопки' },
          { key: 'cards', label: 'Карты' },
          { key: 'badges', label: 'Значки' },
          { key: 'charts', label: 'Графики' }
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Buttons Section */}
        {activeTab === 'buttons' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Основные кнопки</Text>
            
            {/* Primary Buttons */}
            <View style={styles.componentGroup}>
              <Text style={styles.componentLabel}>Основная кнопка</Text>
              <TouchableOpacity style={styles.primaryButton}>
                <Ionicons name="person-add" size={16} color="white" style={{marginRight: 6}} />
                <Text style={styles.primaryButtonText}>Подписаться</Text>
              </TouchableOpacity>
            </View>

            {/* Secondary Buttons */}
            <View style={styles.componentGroup}>
              <Text style={styles.componentLabel}>Вторичная кнопка</Text>
              <TouchableOpacity style={styles.secondaryButton}>
                <Ionicons name="chatbubble-outline" size={16} color="#4f46e5" style={{marginRight: 6}} />
                <Text style={styles.secondaryButtonText}>Сообщение</Text>
              </TouchableOpacity>
            </View>

            {/* Icon Button */}
            <View style={styles.componentGroup}>
              <Text style={styles.componentLabel}>Кнопка с иконкой</Text>
              <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="ellipsis-horizontal" size={18} color="#6b7280" />
              </TouchableOpacity>
            </View>

            {/* Sport Chips */}
            <View style={styles.componentGroup}>
              <Text style={styles.componentLabel}>Спортивные чипы</Text>
              <View style={styles.chipRow}>
                <TouchableOpacity style={styles.sportChipActive}>
                  <Text style={styles.sportChipActiveText}>Падел</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.sportChip}>
                  <Text style={styles.sportChipText}>Теннис</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.sportChip}>
                  <Text style={styles.sportChipText}>Пиклбол</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Filter Buttons */}
            <View style={styles.componentGroup}>
              <Text style={styles.componentLabel}>Фильтры</Text>
              <View style={styles.chipRow}>
                <TouchableOpacity style={styles.filterButtonActive}>
                  <Text style={styles.filterButtonActiveText}>5 результатов</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterButton}>
                  <View style={styles.filterButtonBadge}>
                    <Text style={styles.filterButtonBadgeText}>9</Text>
                  </View>
                  <Text style={styles.filterButtonText}>10 результатов</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Cards Section */}
        {activeTab === 'cards' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Карты</Text>
            
            {/* Home Cards */}
            <View style={styles.componentGroup}>
              <Text style={styles.componentLabel}>Карты главной страницы</Text>
              <TouchableOpacity style={styles.homeCard}>
                <View style={styles.homeCardImageContainer}>
                  <View style={styles.homeCardIcon}>
                    <Ionicons name="search" size={20} color="white" />
                  </View>
                </View>
                <View style={styles.homeCardContent}>
                  <Text style={styles.homeCardTitle}>Забронировать корт</Text>
                  <Text style={styles.homeCardSubtitle}>Если вы уже знаете с кем будете играть</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Level Card */}
            <View style={styles.componentGroup}>
              <Text style={styles.componentLabel}>Карта уровня</Text>
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
                  <View style={styles.progressBar}>
                    <Animated.View style={[styles.progressFill, { width: '64%' }]} />
                  </View>
                  <Text style={styles.levelReliability}>Надежность уровня: 64.84%</Text>
                </View>
              </View>
            </View>

            {/* Match Card */}
            <View style={styles.componentGroup}>
              <Text style={styles.componentLabel}>Карта матча</Text>
              <View style={styles.matchCard}>
                <View style={styles.matchHeader}>
                  <View style={styles.matchTitleContainer}>
                    <Ionicons name="trophy" size={20} color="#f59e0b" />
                    <Text style={styles.matchTitle}>Открытый матч</Text>
                  </View>
                  <Text style={styles.matchDate}>06/01/2025</Text>
                </View>
                <View style={styles.matchPlayersRow}>
                  <View style={styles.playerInfoSection}>
                    <View style={styles.playerAvatarContainer}>
                      <Image source={{ uri: 'http://localhost:3000/api/static-images/profile-female-1' }} style={styles.matchPlayerAvatar} />
                      <View style={styles.onlineIndicator} />
                    </View>
                    <View style={styles.playerDetails}>
                      <Text style={styles.playerName}>Хоана</Text>
                      <View style={styles.levelBadge}>
                        <Text style={styles.levelBadgeText}>0.66</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            {/* Person Card */}
            <View style={styles.componentGroup}>
              <Text style={styles.componentLabel}>Карта игрока</Text>
              <View style={styles.personCard}>
                <View style={styles.personInitials}>
                  <Text style={styles.initialsText}>AC</Text>
                </View>
                <Text style={styles.personName}>Alejandro Camp...</Text>
                <Text style={styles.personLevel}>Уровень 0.95</Text>
                <Text style={styles.personMatches}>19 общих матчей</Text>
              </View>
            </View>

            {/* Club Card */}
            <View style={styles.componentGroup}>
              <Text style={styles.componentLabel}>Карта клуба</Text>
              <View style={styles.clubCard}>
                <Image 
                  source={{ uri: 'http://localhost:3000/api/static-images/club-facility-2' }}
                  style={styles.clubImage}
                />
                <Text style={styles.clubName}>SUMA Pádel</Text>
                <Text style={styles.clubLocation}>Patacona</Text>
              </View>
            </View>
          </View>
        )}

        {/* Badges Section */}
        {activeTab === 'badges' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Значки и индикаторы</Text>
            
            {/* Level Badges */}
            <View style={styles.componentGroup}>
              <Text style={styles.componentLabel}>Значки уровня</Text>
              <View style={styles.badgeRow}>
                <View style={styles.levelBadge}>
                  <Text style={styles.levelBadgeText}>0.66</Text>
                </View>
                <View style={styles.levelBadge}>
                  <Text style={styles.levelBadgeText}>0.95</Text>
                </View>
                <View style={styles.levelBadge}>
                  <Text style={styles.levelBadgeText}>1.38</Text>
                </View>
              </View>
            </View>

            {/* Status Indicators */}
            <View style={styles.componentGroup}>
              <Text style={styles.componentLabel}>Индикаторы статуса</Text>
              <View style={styles.badgeRow}>
                <View style={styles.onlineIndicator} />
                <View style={styles.statusDot} />
                <View style={styles.reliabilityBadge}>
                  <Text style={styles.reliabilityText}>СРЕДНИЙ</Text>
                </View>
              </View>
            </View>

            {/* Win Badge */}
            <View style={styles.componentGroup}>
              <Text style={styles.componentLabel}>Значок победы</Text>
              <View style={styles.winBadge}>
                <Ionicons name="checkmark" size={16} color="white" />
                <Text style={styles.resultWin}>Победа</Text>
              </View>
            </View>

            {/* VS Indicator */}
            <View style={styles.componentGroup}>
              <Text style={styles.componentLabel}>Индикатор против</Text>
              <View style={styles.vsIndicator}>
                <Text style={styles.vsText}>VS</Text>
              </View>
            </View>
          </View>
        )}

        {/* Charts Section */}
        {activeTab === 'charts' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Графики и прогресс</Text>
            
            {/* Progress Bar */}
            <View style={styles.componentGroup}>
              <Text style={styles.componentLabel}>Полоса прогресса</Text>
              <View style={styles.progressBar}>
                <Animated.View style={[styles.progressFill, { width: '64%' }]} />
              </View>
            </View>

            {/* Chart Points */}
            <View style={styles.componentGroup}>
              <Text style={styles.componentLabel}>Точки графика</Text>
              <View style={styles.chartLine}>
                <View style={styles.chartPoint} />
                <View style={styles.chartLineConnector} />
                <View style={styles.chartPoint} />
                <View style={styles.chartLineConnector} />
                <View style={styles.chartPointActive}>
                  <View style={styles.chartPointLabel}>
                    <Text style={styles.chartPointValue}>0.69</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Effectiveness Card */}
            <View style={styles.componentGroup}>
              <Text style={styles.componentLabel}>Карта эффективности</Text>
              <View style={styles.effectivenessCard}>
                <View style={styles.effectivenessIcon}>
                  <Ionicons name="analytics" size={32} color="#3b82f6" />
                </View>
                <Text style={styles.effectivenessNumber}>40%</Text>
                <Text style={styles.effectivenessLabel}>Эффективность</Text>
                <Text style={styles.effectivenessSubLabel}>Последние 10</Text>
                <View style={styles.effectivenessProgress}>
                  <View style={styles.effectivenessProgressBar}>
                    <Animated.View style={[styles.effectivenessProgressFill, { width: '40%' }]} />
                  </View>
                </View>
              </View>
            </View>

            {/* Stats Grid */}
            <View style={styles.componentGroup}>
              <Text style={styles.componentLabel}>Сетка статистики</Text>
              <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                  <Text style={styles.statCardNumber}>37</Text>
                  <Text style={styles.statCardLabel}>Всего</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={[styles.statCardNumber, { color: '#10b981' }]}>12</Text>
                  <Text style={[styles.statCardLabel, { color: '#10b981' }]}>Выиграно</Text>
                </View>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 24,
  },
  componentGroup: {
    marginBottom: 32,
  },
  componentLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4b5563',
    marginBottom: 12,
  },
  
  // Buttons
  primaryButton: {
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
  primaryButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
    letterSpacing: 0.2,
    textAlign: 'center',
  },
  secondaryButton: {
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
  secondaryButtonText: {
    color: '#4f46e5',
    fontWeight: '600',
    fontSize: 14,
    letterSpacing: 0.2,
    textAlign: 'center',
  },
  iconButton: {
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
  
  // Chips
  chipRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
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
  
  // Filter Buttons
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
  
  // Cards
  homeCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    overflow: 'hidden',
  },
  homeCardImageContainer: {
    position: 'relative',
    backgroundColor: '#e3f2fd',
    height: 120,
    justifyContent: 'flex-end',
    paddingLeft: 16,
    paddingBottom: 16,
  },
  homeCardIcon: {
    backgroundColor: '#1e3a4a',
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  homeCardContent: {
    padding: 16,
    paddingTop: 28,
  },
  homeCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 6,
  },
  homeCardSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 18,
  },
  
  // Level Card
  levelCard: {
    borderRadius: 20,
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
  
  // Match Card
  matchCard: {
    borderRadius: 16,
    backgroundColor: 'white',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
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
  playerDetails: {
    marginLeft: 12,
    alignItems: 'flex-start',
  },
  playerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  
  // Person Card
  personCard: {
    width: 200,
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
  personInitials: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1f2937',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  initialsText: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
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
  
  // Club Card
  clubCard: {
    width: 200,
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
  
  // Badges
  badgeRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    flexWrap: 'wrap',
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
  statusDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#10b981',
    borderWidth: 3,
    borderColor: 'white',
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
  resultWin: {
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
  },
  vsIndicator: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'center',
  },
  vsText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6b7280',
  },
  
  // Charts
  chartLine: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    paddingVertical: 20,
  },
  chartPoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3b82f6',
  },
  chartLineConnector: {
    height: 2,
    backgroundColor: '#3b82f6',
    flex: 1,
  },
  chartPointActive: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#84cc16',
    position: 'relative',
  },
  chartPointLabel: {
    position: 'absolute',
    top: -25,
    alignItems: 'center',
    backgroundColor: '#84cc16',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    left: -15,
  },
  chartPointValue: {
    fontSize: 10,
    fontWeight: '700',
    color: '#000',
  },
  
  // Effectiveness Card
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
  
  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
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
});