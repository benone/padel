import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Avatar, { AvatarPair } from './Avatar';
import Badge, { StatusDot, VSIndicator } from './Badge';
import { getImageUrl } from '../../config/api.config';

export function ActionCard({ 
  title, 
  subtitle, 
  image, 
  icon, 
  iconColor = '#1e3a4a',
  backgroundColor = '#e3f2fd',
  onPress,
  style = {},
  ...props 
}) {
  return (
    <TouchableOpacity 
      style={[styles.actionCard, style]}
      onPress={onPress}
      activeOpacity={0.95}
      {...props}
    >
      <View style={[styles.actionCardHeader, { backgroundColor }]}>
        {image && (
          <Image source={image} style={styles.actionCardImage} resizeMode="cover" />
        )}
        <View style={[styles.actionCardIcon, { backgroundColor: iconColor }]}>
          <Ionicons name={icon} size={20} color="white" />
        </View>
      </View>
      <View style={styles.actionCardContent}>
        <Text style={styles.actionCardTitle}>{title}</Text>
        <Text style={styles.actionCardSubtitle}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );
}

export function MatchCard({ 
  title, 
  date, 
  players, 
  score, 
  result,
  levelChange,
  style = {},
  ...props 
}) {
  return (
    <View style={[styles.matchCard, style]} {...props}>
      <View style={styles.matchHeader}>
        <View style={styles.matchTitleContainer}>
          <Ionicons name="trophy" size={20} color="#f59e0b" />
          <Text style={styles.matchTitle}>{title}</Text>
        </View>
        <Text style={styles.matchDate}>{date}</Text>
      </View>
      
      <View style={styles.matchPlayersRow}>
        {players.map((player, index) => (
          <View key={index} style={styles.playerInfoSection}>
            <Avatar
              uri={player.avatar ? getImageUrl(player.avatar) : null}
              initials={player.initials}
              size="medium"
              showStatus={player.online}
              online={player.online}
            />
            <View style={styles.playerDetails}>
              <Text style={styles.playerName}>{player.name}</Text>
              <Badge 
                text={player.level} 
                type="level" 
                size="small"
              />
            </View>
          </View>
        ))}
        
        {players.length > 1 && <VSIndicator style={styles.vsSpacing} />}
      </View>
      
      {score && (
        <View style={styles.matchScoreResult}>
          <Text style={styles.scoreNumber}>{score.team1}</Text>
          <Text style={styles.scoreNumber}>{score.team2}</Text>
          <Text style={styles.scoreSeparator}>-</Text>
          {result && <Text style={styles.winnerName}>{result}</Text>}
          {levelChange && <Text style={styles.levelChange}>{levelChange}</Text>}
        </View>
      )}
    </View>
  );
}

export function PersonCard({ 
  avatar, 
  initials,
  name, 
  level, 
  matches,
  onPress,
  style = {},
  ...props 
}) {
  return (
    <TouchableOpacity style={[styles.personCard, style]} onPress={onPress} {...props}>
      <Avatar
        uri={avatar ? getImageUrl(avatar) : null}
        initials={initials}
        size="large"
      />
      <Text style={styles.personName}>{name}</Text>
      <Text style={styles.personLevel}>Уровень {level}</Text>
      <Text style={styles.personMatches}>{matches} общих матчей</Text>
    </TouchableOpacity>
  );
}

export function ClubCard({ 
  image, 
  name, 
  location,
  onPress,
  style = {},
  ...props 
}) {
  return (
    <TouchableOpacity style={[styles.clubCard, style]} onPress={onPress} {...props}>
      <Image source={{ uri: image }} style={styles.clubImage} />
      <Text style={styles.clubName}>{name}</Text>
      <Text style={styles.clubLocation}>{location}</Text>
    </TouchableOpacity>
  );
}

export function StatCard({ 
  number, 
  label, 
  color,
  style = {},
  ...props 
}) {
  return (
    <View style={[styles.statCard, style]} {...props}>
      <Text style={[styles.statCardNumber, color && { color }]}>{number}</Text>
      <Text style={[styles.statCardLabel, color && { color }]}>{label}</Text>
    </View>
  );
}

export function RankingCard({ 
  title, 
  value, 
  unit,
  style = {},
  ...props 
}) {
  return (
    <View style={[styles.rankingCard, style]} {...props}>
      <Text style={styles.rankingTitle}>{title}</Text>
      <Text style={styles.rankingValue}>
        {value}
        {unit && <Text style={styles.rankingUnit}>{unit}</Text>}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  // Action Card
  actionCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    overflow: 'hidden',
  },
  actionCardHeader: {
    position: 'relative',
    height: 120,
    justifyContent: 'flex-end',
    paddingLeft: 16,
    paddingBottom: 16,
  },
  actionCardImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  },
  actionCardIcon: {
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
  actionCardContent: {
    padding: 16,
    paddingTop: 28,
  },
  actionCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 6,
  },
  actionCardSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 18,
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
    marginBottom: 16,
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
  vsSpacing: {
    marginHorizontal: 16,
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
  levelChange: {
    fontSize: 16,
    color: '#10b981',
    fontWeight: '700',
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
    marginRight: 16,
  },
  personName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
    textAlign: 'center',
    marginTop: 12,
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
    marginRight: 16,
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
  
  // Stat Card
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
  
  // Ranking Card
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
});