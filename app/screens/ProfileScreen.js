import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { 
  Chip, 
  PersonCard, 
  ClubCard, 
  StatCard, 
  RankingCard,
  ProgressBar,
  TabNavigation 
} from '../components/ui';
import { ProfileHeader, ProfileInfo, styles } from '../components/profile';
import { usersAPI, authAPI } from '../services/api';
import { getStaticImageUrl } from '../config/api.config';

export default function ProfileScreen({ navigation, route }) {
  const [activeTab, setActiveTab] = useState('activities');
  const [userProfile, setUserProfile] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [connections, setConnections] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadProfileData();
  }, [route?.params?.userId]); // Reload when userId changes

  const loadProfileData = async () => {
    try {
      setLoading(true);
      
      // Get user ID from route params or current user
      let targetUserId = route?.params?.userId;
      if (!targetUserId) {
        const currentUser = await authAPI.getCurrentUser();
        if (!currentUser) return;
        targetUserId = currentUser.id;
      }
      
      // Load all profile data for the target user
      const [profileRes, statsRes, connectionsRes, clubsRes] = await Promise.all([
        usersAPI.getProfile(targetUserId),
        usersAPI.getStats(targetUserId),
        usersAPI.getConnections(targetUserId),
        usersAPI.getClubs(targetUserId)
      ]);
      
      setUserProfile(profileRes.data);
      setUserStats(statsRes.data);
      setConnections(connectionsRes.data);
      setClubs(clubsRes.data);
    } catch (error) {
      console.error('Failed to load profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <ProfileHeader navigation={navigation} />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <ProfileInfo userProfile={userProfile} />

        <TabNavigation
          tabs={[
            { key: 'activities', label: 'Активность' },
            { key: 'posts', label: 'Посты' }
          ]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {loading && (
          <View style={{ padding: 40, alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text style={{ marginTop: 10, color: '#6b7280' }}>Загрузка профиля...</Text>
          </View>
        )}

        {!loading && activeTab === 'activities' && (
          <ActivitiesTab 
            userProfile={userProfile}
            userStats={userStats}
            connections={connections}
            clubs={clubs}
          />
        )}

        {activeTab === 'posts' && (
          <PostsTab />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function ActivitiesTab({ userProfile, userStats, connections, clubs }) {
  return (
    <View>
      <View style={styles.sportsFilter}>
        <Chip label="Падел" active={true} onPress={() => {}} />
        <Chip label="Теннис" active={false} onPress={() => {}} />
        <Chip label="Пиклбол" active={false} onPress={() => {}} />
      </View>

      <LevelCard userProfile={userProfile} />
      <LevelProgressSection userStats={userStats} />
      <PlayerPreferencesSection userProfile={userProfile} />
      <RecentMatchesSection userStats={userStats} />
      <StatisticsSection userProfile={userProfile} userStats={userStats} />
      <PeopleSection connections={connections} />
      <ClubsSection clubs={clubs} userProfile={userProfile} />
      <RankingsSection userProfile={userProfile} />
    </View>
  );
}

function PostsTab() {
  return (
    <View style={styles.tabContent}>
      <Text style={styles.comingSoon}>Посты</Text>
      <Text style={styles.comingSoonSub}>Скоро будет доступно</Text>
    </View>
  );
}

function LevelCard({ userProfile }) {
  if (!userProfile) return null;
  
  const level = userProfile.level || 0;
  const reliability = userProfile.stats?.winRate || 0;
  const levelName = userProfile.levelName || 'Начинающий';
  
  return (
    <View style={styles.levelCard}>
      <View style={styles.levelHeader}>
        <View>
          <Text style={styles.levelLabel}>🏆 Текущий уровень</Text>
          <Text style={styles.levelNumber}>{level.toFixed(1)}</Text>
        </View>
        <View style={styles.reliabilityBadge}>
          <Text style={styles.reliabilityText}>{levelName.toUpperCase()}</Text>
        </View>
      </View>
      <View style={styles.progressContainer}>
        <ProgressBar 
          percentage={reliability} 
          showLabel={true}
          label={`Надежность уровня: ${reliability}%`}
        />
      </View>
    </View>
  );
}

function LevelProgressSection() {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Прогресс уровня</Text>
      
      <View style={styles.filterButtons}>
        <Chip label="5 результатов" active={true} onPress={() => {}} />
        <Chip label="10 результатов" active={false} badge={9} onPress={() => {}} />
        <Chip label="Все результаты" active={false} badge={9} onPress={() => {}} />
      </View>

      <MatchResultCard />
      <LevelChart />
    </View>
  );
}

function MatchResultCard() {
  return (
    <View style={styles.matchCard}>
      <View style={styles.matchHeader}>
        <View style={styles.matchTitleContainer}>
          <Ionicons name="trophy" size={20} color="#f59e0b" />
          <Text style={styles.matchTitle}>Открытый матч</Text>
        </View>
        <Text style={styles.matchDate}>06/01/2025</Text>
      </View>
      <Text style={{ textAlign: 'center', color: '#6b7280', padding: 20 }}>
        Детали матча
      </Text>
    </View>
  );
}

function LevelChart() {
  return (
    <View style={styles.chartContainer}>
      <Text style={{ textAlign: 'center', color: '#6b7280', padding: 20 }}>
        График прогресса уровня
      </Text>
    </View>
  );
}

function PlayerPreferencesSection({ userProfile }) {
  if (!userProfile?.preferences) return null;
  
  const preferences = [
    { icon: '👋', label: 'Лучшая рука', value: userProfile.preferences.hand || 'Не указано' },
    { icon: '📍', label: 'Позиция на корте', value: userProfile.preferences.position || 'Не указано' },
    { icon: '🌅', label: 'Предпочитаемое время игры', value: userProfile.preferences.preferredTime || 'Не указано' },
  ];

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Предпочтения игрока</Text>
      {preferences.map((pref, index) => (
        <View key={index} style={styles.preferenceItem}>
          <Text style={styles.preferenceIcon}>{pref.icon}</Text>
          <View>
            <Text style={styles.preferenceLabel}>{pref.label}</Text>
            <Text style={styles.preferenceValue}>{pref.value}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

function RecentMatchesSection() {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Матчи</Text>
      <Text style={{ textAlign: 'center', color: '#6b7280', padding: 20 }}>
        Последние матчи
      </Text>
    </View>
  );
}

function StatisticsSection({ userProfile, userStats }) {
  if (!userProfile?.stats) return null;
  
  const stats = userProfile.stats;
  const effectiveness = userStats?.overview?.winRate || stats.winRate || 0;
  
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Статистика</Text>
      
      <View style={styles.statsGrid}>
        <StatCard number={stats.totalMatches?.toString() || "0"} label="Всего" />
        <StatCard number={stats.wins?.toString() || "0"} label="Выиграно" color="#10b981" />
        <StatCard number="10" label="Последние" />
        <StatCard number={stats.wins && stats.totalMatches ? Math.min(stats.wins, 10).toString() : "0"} label="Выиграно" color="#10b981" />
      </View>
      
      <View style={styles.effectivenessCard}>
        <View style={styles.effectivenessIcon}>
          <Ionicons name="analytics" size={32} color="#3b82f6" />
        </View>
        <Text style={styles.effectivenessNumber}>{effectiveness}%</Text>
        <Text style={styles.effectivenessLabel}>Эффективность</Text>
        <Text style={styles.effectivenessSubLabel}>Последние 10</Text>
        <View style={styles.effectivenessProgress}>
          <ProgressBar 
            percentage={effectiveness} 
            color="#3b82f6"
            backgroundColor="#f3f4f6"
            height={8}
          />
        </View>
      </View>
    </View>
  );
}

function PeopleSection({ connections }) {
  if (!connections || connections.length === 0) return null;
  
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Люди, которые играли больше всего с этим пользователем</Text>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.peopleScroll}>
        {connections.map((person) => (
          <PersonCard
            key={person.id}
            avatar={person.avatar}
            initials={person.name.split(' ').map(n => n[0]).join('')}
            name={person.name}
            level={person.level?.toFixed(1) || '0.0'}
            matches={person.matchesPlayed?.toString() || '0'}
            onPress={() => {}}
          />
        ))}
      </ScrollView>
    </View>
  );
}

function ClubsSection({ clubs, userProfile }) {
  if (!clubs || clubs.length === 0) return null;
  
  const userName = userProfile?.name || 'пользователя';
  
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Клубы, где играет {userName}</Text>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.clubsScroll}>
        {clubs.map((club, index) => (
          <ClubCard
            key={club.id || index}
            image={getStaticImageUrl('club-facility-1')}
            name={club.name}
            location={club.location || 'Москва'}
            onPress={() => {}}
          />
        ))}
      </ScrollView>
    </View>
  );
}

function RankingsSection({ userProfile }) {
  if (!userProfile) return null;
  
  const level = userProfile.level || 0;
  
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Рейтинги</Text>
      
      <View style={styles.rankingsContainer}>
        <RankingCard
          title="Рейтинг падел уровня"
          value={`#${level.toFixed(2)}`}
          unit="LvL"
        />
        <RankingCard
          title="Глобальный рейтинг падел"
          value={`#${(level * 1000 + Math.random() * 500).toFixed(0)}`}
        />
      </View>
    </View>
  );
}