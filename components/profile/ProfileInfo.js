import React from 'react';
import { View, Text } from 'react-native';
import { Button, Avatar } from '../ui';
import { styles } from './styles';

export default function ProfileInfo({ userProfile }) {
  if (!userProfile) {
    return (
      <View style={styles.profileSection}>
        <Text style={{ textAlign: 'center', color: '#6b7280', padding: 20 }}>
          Загрузка профиля...
        </Text>
      </View>
    );
  }

  const totalMatches = userProfile.stats?.totalMatches || 0;
  const followers = userProfile.stats?.favoritePartners || 0;
  const location = userProfile.location?.address || 'Не указано';

  return (
    <View style={styles.profileSection}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatarShadow}>
          <Avatar
            uri={userProfile.avatar}
            initials={userProfile.name ? userProfile.name.split(' ').map(n => n[0]).join('').substring(0, 2) : ''}
            size="xlarge"
            borderColor="white"
            showDefaultIcon={true}
            style={styles.avatar}
          />
        </View>
        <View style={styles.statusDot} />
      </View>
      
      <Text style={styles.name}>{userProfile.name}</Text>
      <Text style={styles.location}>📍 {location}</Text>
      
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{totalMatches}</Text>
          <Text style={styles.statLabel}>Матчи</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{followers}</Text>
          <Text style={styles.statLabel}>Подписчики</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{Math.floor(followers * 0.6)}</Text>
          <Text style={styles.statLabel}>Подписки</Text>
        </View>
      </View>

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
  );
}