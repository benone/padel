import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
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

export default function ProfileScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('activities');

  return (
    <SafeAreaView style={styles.root}>
      <ProfileHeader navigation={navigation} />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <ProfileInfo />

        <TabNavigation
          tabs={[
            { key: 'activities', label: 'Активность' },
            { key: 'posts', label: 'Посты' }
          ]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {activeTab === 'activities' && (
          <ActivitiesTab />
        )}

        {activeTab === 'posts' && (
          <PostsTab />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function ActivitiesTab() {
  return (
    <View>
      <View style={styles.sportsFilter}>
        <Chip label="Падел" active={true} onPress={() => {}} />
        <Chip label="Теннис" active={false} onPress={() => {}} />
        <Chip label="Пиклбол" active={false} onPress={() => {}} />
      </View>

      <LevelCard />
      <LevelProgressSection />
      <PlayerPreferencesSection />
      <RecentMatchesSection />
      <StatisticsSection />
      <PeopleSection />
      <ClubsSection />
      <RankingsSection />
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

function LevelCard() {
  return (
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

function PlayerPreferencesSection() {
  const preferences = [
    { icon: '👋', label: 'Лучшая рука', value: 'Правша' },
    { icon: '📍', label: 'Позиция на корте', value: 'Обе стороны' },
    { icon: '🌅', label: 'Предпочитаемое время игры', value: 'Вечером' },
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

function StatisticsSection() {
  return (
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
  );
}

function PeopleSection() {
  return (
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
  );
}

function ClubsSection() {
  return (
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
  );
}

function RankingsSection() {
  return (
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
  );
}