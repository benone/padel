import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  Image,
  FlatList,
  SafeAreaView,
  Pressable,
  StyleSheet
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../constants';
import { Avatar, Button, Chip, PersonCard } from '../components/ui';
import { communityAPI } from '../services/api';


export default function CommunityScreen() {
  const [activeTab, setActiveTab] = useState('Лента');
  const [activeFilter, setActiveFilter] = useState('Все');
  const [searchText, setSearchText] = useState('');
  
  // API data states
  const [posts, setPosts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Load data on mount
  useEffect(() => {
    loadCommunityData();
  }, []);

  const loadCommunityData = async () => {
    try {
      setLoading(true);
      console.log('🏠 CommunityScreen: Loading community data');
      
      const [postsResponse, suggestionsResponse] = await Promise.all([
        communityAPI.getPosts({ limit: 10 }),
        communityAPI.getSuggestions({ limit: 4 })
      ]);

      console.log('✅ CommunityScreen: Posts loaded:', postsResponse.data.posts?.length || 0);
      console.log('✅ CommunityScreen: Suggestions loaded:', suggestionsResponse.data.length);
      
      setPosts(postsResponse.data.posts || []);
      setSuggestions(suggestionsResponse.data || []);
    } catch (error) {
      console.error('❌ CommunityScreen: Failed to load community data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadCommunityData();
    setRefreshing(false);
  };

  const handleLikePost = async (postId) => {
    try {
      const response = await communityAPI.likePost(postId);
      console.log('❤️ CommunityScreen: Post liked:', response.data);
      
      // Update local state
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId 
            ? { ...post, likes: response.data.newLikeCount, liked: response.data.liked }
            : post
        )
      );
    } catch (error) {
      console.error('❌ CommunityScreen: Failed to like post:', error);
    }
  };

  const handleFollowUser = async (userId) => {
    try {
      const response = await communityAPI.followUser(userId);
      console.log('👥 CommunityScreen: User followed:', response.data);
      
      // Update local state
      setSuggestions(prevSuggestions => 
        prevSuggestions.filter(suggestion => suggestion.id !== userId)
      );
    } catch (error) {
      console.error('❌ CommunityScreen: Failed to follow user:', error);
    }
  };

  const renderPostCard = ({ item }) => (
    <View style={styles.postCard}>
      {/* Post Header */}
      <View style={styles.postHeader}>
        <Avatar 
          uri={item.user.avatar}
          initials={item.user.name.split(' ').map(n => n[0]).join('')}
          size="small"
        />
        <View style={styles.postUserInfo}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.postUserName}>
              {item.user.name}
            </Text>
            {item.user.verified && (
              <Ionicons 
                name="checkmark-circle" 
                size={16} 
                color={colors.primary[500]} 
                style={{ marginLeft: 4 }}
              />
            )}
          </View>
          <Text style={styles.postTimestamp}>{item.timestamp}</Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal" size={20} color={colors.text.secondary} />
        </TouchableOpacity>
      </View>

      {/* Post Content */}
      <View style={styles.postContent}>
        <Text style={styles.postText}>{item.content}</Text>
      </View>

      {/* Post Image */}
      {item.image && (
        <Image 
          source={{ uri: item.image }}
          style={styles.postImage}
          resizeMode="cover"
        />
      )}

      {/* Post Actions */}
      <View style={styles.postActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleLikePost(item.id)}
        >
          <Ionicons 
            name={item.liked ? "heart" : "heart-outline"} 
            size={24} 
            color={item.liked ? "#ef4444" : colors.text.secondary} 
          />
          <Text style={styles.actionText}>{item.likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="chatbubble-outline" size={22} color={colors.text.secondary} />
          <Text style={styles.actionText}>{item.comments}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSuggestionCard = ({ item }) => (
    <View style={styles.suggestionCard}>
      <Avatar 
        uri={item.avatar}
        initials={item.name.split(' ').map(n => n[0]).join('')}
        size="large"
      />
      <View style={styles.suggestionCardContent}>
        <View style={styles.suggestionNameContainer}>
          <Text style={styles.suggestionName}>
            {item.name}
          </Text>
          {item.verified && (
            <Ionicons 
              name="checkmark-circle" 
              size={14} 
              color={colors.primary[500]} 
              style={{ marginLeft: 2 }}
            />
          )}
        </View>
      </View>
      <Button
        title="Подписаться"
        size="sm"
        variant="primary"
        style={{ width: '100%' }}
        onPress={() => handleFollowUser(item.id)}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchInput}>
          <Ionicons name="search" size={20} color={colors.text.secondary} />
          <TextInput
            placeholder="Поиск игроков"
            value={searchText}
            onChangeText={setSearchText}
            style={styles.searchTextInput}
            placeholderTextColor={colors.text.secondary}
          />
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {['Лента', 'Группы'].map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={{ marginRight: 32 }}
            >
              <Text 
                style={[
                  styles.tabText,
                  { fontSize: typography.sizes.lg, paddingBottom: 8 },
                  activeTab === tab ? styles.tabTextActive : { color: '#9ca3af' }
                ]}
              >
                {tab}
              </Text>
              {activeTab === tab && (
                <View style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: 2,
                  backgroundColor: 'white'
                }} />
              )}
            </TouchableOpacity>
          ))}
        </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Filter Chips */}
        <View style={styles.filterContainer}>
          {['Все', 'Ваши посты'].map((filter) => (
            <TouchableOpacity
              key={filter}
              onPress={() => setActiveFilter(filter)}
              style={[
                styles.filterChip,
                activeFilter === filter ? styles.filterChipActive : styles.filterChipInactive
              ]}
            >
              <Text 
                style={[
                  styles.filterText,
                  activeFilter === filter ? styles.filterTextActive : styles.filterTextInactive
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Suggested for you */}
        <View style={styles.suggestionSection}>
          <View style={styles.suggestionHeader}>
            <Text style={styles.suggestionTitle}>Рекомендуем для вас</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Посмотреть все</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={[
              { 
                id: 'add-friends', 
                name: 'Добавить друзей из телефонной книги',
                isAddFriends: true 
              },
              ...suggestions
            ]}
            renderItem={({ item }) => {
              if (item.isAddFriends) {
                return (
                  <View style={styles.addFriendsCard}>
                    <View style={styles.addFriendsIcon}>
                      <Ionicons name="add" size={24} color={colors.text.secondary} />
                    </View>
                    <Text style={styles.addFriendsText}>
                      Добавить друзей из телефонной книги
                    </Text>
                  </View>
                );
              }
              return renderSuggestionCard({ item });
            }}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
            keyExtractor={(item) => item.id}
          />
        </View>


        {/* Posts Feed */}
        {posts.map((post) => (
          <View key={post.id}>
            {renderPostCard({ item: post })}
          </View>
        ))}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity 
        className="absolute bottom-6 right-6 w-14 h-14 bg-blue-600 rounded-full items-center justify-center shadow-lg"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  searchSection: {
    backgroundColor: 'white',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  searchInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    marginRight: 12,
  },
  searchTextInput: {
    flex: 1,
    marginLeft: spacing.sm,
    fontSize: typography.sizes.base,
  },
  notificationButton: {
    padding: spacing.sm,
  },
  greeting: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: 'white',
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.sizes.sm,
    color: '#94a3b8',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: 'white',
  },
  tabButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
    borderRadius: spacing.sm,
  },
  tabButtonActive: {
    backgroundColor: '#1e293b',
  },
  tabButtonInactive: {
    backgroundColor: '#e5e7eb',
  },
  tabText: {
    fontWeight: typography.weights.medium,
  },
  tabTextActive: {
    color: 'white',
  },
  tabTextInactive: {
    color: '#6b7280',
  },
  postCard: {
    backgroundColor: 'white',
    marginBottom: spacing.md,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
  },
  postUserInfo: {
    flex: 1,
    marginLeft: 12,
  },
  postUserName: {
    fontWeight: typography.weights.semibold,
    color: colors.gray[900],
    fontSize: typography.sizes.base,
  },
  postTimestamp: {
    color: '#6b7280',
    fontSize: typography.sizes.sm,
  },
  postContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: 12,
  },
  postText: {
    color: colors.gray[900],
    fontSize: typography.sizes.base,
    lineHeight: 20,
  },
  postImage: {
    width: '100%',
    height: 320,
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.lg,
  },
  actionText: {
    marginLeft: spacing.sm,
    color: '#6b7280',
    fontWeight: typography.weights.medium,
  },
  scrollView: {
    flex: 1,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
  },
  filterChip: {
    marginRight: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
  },
  filterChipActive: {
    backgroundColor: '#1e293b',
  },
  filterChipInactive: {
    backgroundColor: '#e5e7eb',
  },
  filterText: {
    fontWeight: typography.weights.medium,
  },
  filterTextActive: {
    color: 'white',
  },
  filterTextInactive: {
    color: '#6b7280',
  },
  suggestionSection: {
    marginBottom: spacing.md,
  },
  suggestionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginBottom: 12,
  },
  suggestionTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.gray[900],
  },
  seeAllText: {
    color: colors.primary[600],
    fontWeight: typography.weights.medium,
  },
  suggestionCard: {
    width: 144,
    marginRight: spacing.md,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
  },
  suggestionCardContent: {
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 12,
  },
  suggestionNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  suggestionName: {
    fontWeight: typography.weights.semibold,
    color: colors.gray[900],
    fontSize: typography.sizes.sm,
    textAlign: 'center',
  },
  addFriendsCard: {
    width: 128,
    marginRight: spacing.md,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    height: 160,
  },
  addFriendsIcon: {
    width: 64,
    height: 64,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#d1d5db',
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  addFriendsText: {
    textAlign: 'center',
    fontSize: typography.sizes.sm,
    color: '#6b7280',
    fontWeight: typography.weights.medium,
  },
});