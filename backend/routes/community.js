const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { success, error } = require('../utils/responseHelper');
const { createMockData } = require('../data/mockData');

const router = express.Router();

// Mock community data
const createCommunityData = (baseUrl) => {
  const posts = [
    {
      id: 'pavel_welcome',
      user: {
        id: 'pavel_kravtsov',
        name: 'Павел Кравцов',
        avatar: `${baseUrl}/api/images-simple/generate?prompt=дружелюбный%20инструктор%20по%20паделу%20павел%20кравцов%20приветствие&width=100&height=100`,
        verified: false
      },
      content: 'Готовы ли вы общаться с друзьями, делиться опытом и знакомиться с людьми со схожими спортивными интересами? Давайте начнем! 🎾',
      subtitle: 'Приветственное сообщение',
      likes: 0,
      comments: 0,
      timestamp: 'Приветственное сообщение',
      type: 'welcome'
    },
    {
      id: '1',
      user: {
        id: 'user_789',
        name: 'Алексей Галанов',
        avatar: `${baseUrl}/api/images-simple/generate?prompt=профессиональный%20игрок%20в%20падел%20мужчина%20алексей%20галанов%20портрет&width=100&height=100`,
        verified: true
      },
      content: 'Постепенно восстанавливаюсь наилучшим образом 🎾⚡️ #АлексейГаланов',
      image: `${baseUrl}/api/images-simple/generate?prompt=корт%20для%20падела%20пара%20играет%20вместе%20счастливые%20закат&width=400&height=300`,
      likes: 1012,
      comments: 23,
      timestamp: '13 апр, 2023',
      type: 'post'
    },
    {
      id: '2',
      user: {
        id: 'user_456',
        name: 'Марина Сидорова',
        avatar: `${baseUrl}/api/images-simple/generate?prompt=профессиональная%20игрок%20в%20падел%20женщина%20марина%20портрет&width=100&height=100`,
        verified: false
      },
      content: 'Отличная тренировка сегодня! Кто готов к матчу завтра утром? 💪',
      likes: 45,
      comments: 8,
      timestamp: '2 часа назад',
      type: 'post'
    },
    {
      id: '3',
      user: {
        id: 'user_321',
        name: 'Андрей Смирнов',
        avatar: `${baseUrl}/api/images-simple/generate?prompt=professional%20padel%20player%20male%20russian%20headshot&width=100&height=100`,
        verified: false
      },
      content: 'Новый корт в "Падел Центре" просто огонь! Рекомендую всем попробовать 🔥',
      image: `${baseUrl}/api/images-simple/generate?prompt=современный%20корт%20для%20падела%20интерьер%20освещение&width=400&height=300`,
      likes: 78,
      comments: 15,
      timestamp: '5 часов назад',
      type: 'post'
    }
  ];

  const suggestions = [
    {
      id: 'user_456',
      name: 'Алексей Галанов',
      avatar: `${baseUrl}/api/images-simple/generate?prompt=профессиональный%20игрок%20в%20падел%20мужчина%20алексей%20галанов%20портрет&width=100&height=100`,
      verified: true,
      mutualFriends: 3,
      level: 8.2
    },
    {
      id: 'user_321',
      name: 'Андрей Смирнов',
      avatar: `${baseUrl}/api/images-simple/generate?prompt=professional%20padel%20player%20male%20russian%20headshot&width=100&height=100`,
      verified: false,
      mutualFriends: 1,
      level: 6.8
    },
    {
      id: 'user_654',
      name: 'Екатерина Волкова',
      avatar: `${baseUrl}/api/images-simple/generate?prompt=профессиональная%20игрок%20в%20падел%20женщина%20екатерина%20портрет&width=100&height=100`,
      verified: false,
      mutualFriends: 2,
      level: 7.1
    },
    {
      id: 'user_987',
      name: 'Дмитрий Козлов',
      avatar: `${baseUrl}/api/images-simple/generate?prompt=спортивный%20мужчина%20падел%20игрок%20дмитрий%20портрет&width=100&height=100`,
      verified: false,
      mutualFriends: 0,
      level: 6.5
    }
  ];

  return { posts, suggestions };
};

// GET /api/community/posts - Get community posts feed
router.get('/posts', authenticateToken, (req, res) => {
  try {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const { posts } = createCommunityData(baseUrl);
    
    // Filter by type if specified
    const type = req.query.type;
    const filteredPosts = type ? posts.filter(post => post.type === type) : posts;
    
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex);
    
    console.log(`📱 Community: Retrieved ${paginatedPosts.length} posts (page ${page})`);
    
    res.json(success(paginatedPosts, {
      currentPage: page,
      totalPages: Math.ceil(filteredPosts.length / limit),
      totalPosts: filteredPosts.length,
      hasMore: endIndex < filteredPosts.length
    }));
  } catch (err) {
    console.error('❌ Community: Error getting posts:', err);
    res.status(500).json(error('Failed to retrieve posts', 500));
  }
});

// GET /api/community/suggestions - Get suggested users to follow
router.get('/suggestions', authenticateToken, (req, res) => {
  try {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const mockData = createMockData(baseUrl);
    const { suggestions } = mockData;
    
    // Limit number of suggestions
    const limit = parseInt(req.query.limit) || 4;
    const limitedSuggestions = suggestions.slice(0, limit);
    
    console.log(`👥 Community: Retrieved ${limitedSuggestions.length} user suggestions`);
    
    res.json(success(limitedSuggestions));
  } catch (err) {
    console.error('❌ Community: Error getting suggestions:', err);
    res.status(500).json(error('Failed to retrieve suggestions', 500));
  }
});

// POST /api/community/posts/:postId/like - Like/unlike a post
router.post('/posts/:postId/like', authenticateToken, (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;
    
    // In a real app, this would update the database
    console.log(`❤️ Community: User ${userId} liked post ${postId}`);
    
    res.json(success({ 
      liked: true, 
      newLikeCount: Math.floor(Math.random() * 100) + 1 
    }));
  } catch (err) {
    console.error('❌ Community: Error liking post:', err);
    res.status(500).json(error('Failed to like post', 500));
  }
});

// POST /api/community/users/:userId/follow - Follow/unfollow a user
router.post('/users/:userId/follow', authenticateToken, (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;
    
    if (userId === currentUserId) {
      return res.status(400).json(error('Cannot follow yourself', 400));
    }
    
    // In a real app, this would update the database
    console.log(`👥 Community: User ${currentUserId} followed user ${userId}`);
    
    res.json(success({ 
      following: true,
      message: 'Successfully followed user'
    }));
  } catch (err) {
    console.error('❌ Community: Error following user:', err);
    res.status(500).json(error('Failed to follow user', 500));
  }
});

// GET /api/community/search - Search users and posts
router.get('/search', authenticateToken, (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json(error('Search query is required', 400));
    }
    
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const { posts, suggestions } = createCommunityData(baseUrl);
    
    // Simple text search
    const searchLower = query.toLowerCase();
    
    const matchingPosts = posts.filter(post => 
      post.content.toLowerCase().includes(searchLower) ||
      post.user.name.toLowerCase().includes(searchLower)
    );
    
    const matchingUsers = suggestions.filter(user =>
      user.name.toLowerCase().includes(searchLower)
    );
    
    console.log(`🔍 Community: Search for "${query}" found ${matchingPosts.length} posts, ${matchingUsers.length} users`);
    
    res.json(success({
      posts: matchingPosts,
      users: matchingUsers,
      query: query
    }));
  } catch (err) {
    console.error('❌ Community: Error searching:', err);
    res.status(500).json(error('Search failed', 500));
  }
});

module.exports = router;