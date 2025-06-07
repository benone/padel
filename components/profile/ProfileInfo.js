import React from 'react';
import { View, Text, Image } from 'react-native';
import { Button } from '../ui';
import { styles } from './styles';

export default function ProfileInfo() {
  return (
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