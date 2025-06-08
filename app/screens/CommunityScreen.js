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
  Pressable
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../constants';
import { Avatar, Button, Chip, PersonCard } from '../components/ui';
import { getGeneratedImageUrl } from '../config/api.config';

// Mock data for community posts
const mockPosts = [
  {
    id: '1',
    user: {
      id: 'user_789',
      name: 'Ale Galán',
      avatar: getGeneratedImageUrl('professional padel player male ale galan headshot'),
      verified: true
    },
    content: 'Recuperando poco a poco de la mejor manera 🎾⚡️ #AlbaGalán',
    image: getGeneratedImageUrl('padel court couple playing together happy sunset', 400, 300),
    likes: 1012,
    comments: 23,
    timestamp: 'Apr 13, 2023'
  }
];

// Mock suggested users
const mockSuggestions = [
  {
    id: 'user_456',
    name: 'Ale Galán',
    avatar: getGeneratedImageUrl('professional padel player male ale galan headshot'),
    verified: true
  },
  {
    id: 'user_321',
    name: 'Андрей Смирнов',
    avatar: getGeneratedImageUrl('professional padel player male russian headshot'),
    verified: false
  }
];

export default function CommunityScreen() {
  const [activeTab, setActiveTab] = useState('Feed');
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchText, setSearchText] = useState('');

  const renderPostCard = ({ item }) => (
    <View className="bg-white mb-4">
      {/* Post Header */}
      <View className="flex-row items-center px-4 py-3">
        <Avatar 
          source={{ uri: item.user.avatar }}
          size={40}
        />
        <View className="flex-1 ml-3">
          <View className="flex-row items-center">
            <Text className="font-semibold text-gray-900 text-base">
              {item.user.name}
            </Text>
            {item.user.verified && (
              <Ionicons 
                name="checkmark-circle" 
                size={16} 
                color={colors.primary.blue} 
                style={{ marginLeft: 4 }}
              />
            )}
          </View>
          <Text className="text-gray-500 text-sm">{item.timestamp}</Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal" size={20} color={colors.text.secondary} />
        </TouchableOpacity>
      </View>

      {/* Post Content */}
      <View className="px-4 pb-3">
        <Text className="text-gray-900 text-base leading-5">{item.content}</Text>
      </View>

      {/* Post Image */}
      {item.image && (
        <Image 
          source={{ uri: item.image }}
          className="w-full h-80"
          resizeMode="cover"
        />
      )}

      {/* Post Actions */}
      <View className="flex-row items-center px-4 py-3">
        <TouchableOpacity className="flex-row items-center mr-6">
          <Ionicons name="heart-outline" size={24} color={colors.text.secondary} />
          <Text className="ml-2 text-gray-600 font-medium">{item.likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-row items-center">
          <Ionicons name="chatbubble-outline" size={22} color={colors.text.secondary} />
          <Text className="ml-2 text-gray-600 font-medium">{item.comments}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSuggestionCard = ({ item }) => (
    <View className="w-36 mr-4 bg-white rounded-xl p-4 items-center">
      <Avatar 
        source={{ uri: item.avatar }}
        size={60}
        className="mb-3"
      />
      <View className="items-center mb-3">
        <View className="flex-row items-center">
          <Text className="font-semibold text-gray-900 text-sm text-center">
            {item.name}
          </Text>
          {item.verified && (
            <Ionicons 
              name="checkmark-circle" 
              size={14} 
              color={colors.primary.blue} 
              style={{ marginLeft: 2 }}
            />
          )}
        </View>
      </View>
      <Button
        title="Follow"
        size="sm"
        variant="primary"
        className="w-full"
      />
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-slate-800 px-4 pt-2 pb-4">
        {/* Search and notifications */}
        <View className="flex-row items-center mb-4">
          <View className="flex-1 flex-row items-center bg-white rounded-full px-4 py-3 mr-3">
            <Ionicons name="search" size={20} color={colors.text.secondary} />
            <TextInput
              placeholder="Search players"
              value={searchText}
              onChangeText={setSearchText}
              className="flex-1 ml-3 text-base"
              placeholderTextColor={colors.text.secondary}
            />
          </View>
          <TouchableOpacity className="p-2">
            <Ionicons name="notifications-outline" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity className="p-2 ml-2">
            <Ionicons name="menu" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Tab Navigation */}
        <View className="flex-row">
          {['Feed', 'Groups'].map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              className="mr-8"
            >
              <Text 
                className={`text-lg font-medium pb-2 ${
                  activeTab === tab ? 'text-white' : 'text-gray-400'
                }`}
              >
                {tab}
              </Text>
              {activeTab === tab && (
                <View className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Filter Chips */}
        <View className="flex-row px-4 py-3">
          {['All', 'Your posts'].map((filter) => (
            <TouchableOpacity
              key={filter}
              onPress={() => setActiveFilter(filter)}
              className={`mr-3 px-4 py-2 rounded-full ${
                activeFilter === filter 
                  ? 'bg-slate-800' 
                  : 'bg-gray-200'
              }`}
            >
              <Text 
                className={`font-medium ${
                  activeFilter === filter 
                    ? 'text-white' 
                    : 'text-gray-600'
                }`}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Suggested for you */}
        <View className="mb-4">
          <View className="flex-row justify-between items-center px-4 mb-3">
            <Text className="text-xl font-bold text-gray-900">Suggested for you</Text>
            <TouchableOpacity>
              <Text className="text-blue-600 font-medium">See all</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={[
              { 
                id: 'add-friends', 
                name: 'Add friends from your phonebook',
                isAddFriends: true 
              },
              ...mockSuggestions
            ]}
            renderItem={({ item }) => {
              if (item.isAddFriends) {
                return (
                  <View className="w-32 mr-4 bg-white rounded-xl p-4 items-center justify-center h-40">
                    <View className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-full items-center justify-center mb-3">
                      <Ionicons name="add" size={24} color={colors.text.secondary} />
                    </View>
                    <Text className="text-center text-sm text-gray-600 font-medium">
                      Add friends from your phonebook
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

        {/* Welcome Message */}
        <View className="bg-white mx-4 rounded-xl p-4 mb-4">
          <View className="flex-row items-start">
            <Avatar 
              source={{ 
                uri: getGeneratedImageUrl('friendly padel instructor pedro claveria welcome') 
              }}
              size={40}
            />
            <View className="flex-1 ml-3">
              <Text className="font-semibold text-gray-900 mb-1">Pedro Claveria</Text>
              <Text className="text-gray-500 text-sm mb-2">Welcome message</Text>
              <Text className="text-gray-800 leading-5">
                Are you ready to connect with friends, share experiences and meet people with similar sport interests? Let's get started! 🎾
              </Text>
            </View>
          </View>
        </View>

        {/* Posts Feed */}
        {mockPosts.map((post) => (
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
    </SafeAreaView>
  );
}