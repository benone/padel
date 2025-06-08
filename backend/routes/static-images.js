const express = require('express');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Static image data - these would typically be stored in a database or CDN
const imageDatabase = {
  // Court/facility images
  'court-background-1': {
    filename: 'court-bg-1.png',
    category: 'courts',
    description: 'Padel court aerial view'
  },
  'court-background-2': {
    filename: 'court-bg-2.png', 
    category: 'courts',
    description: 'Indoor padel facility'
  },
  
  // Profile images
  'profile-female-1': {
    filename: 'profile-female-1.jpg',
    category: 'profiles',
    description: 'Female player profile'
  },
  'profile-male-1': {
    filename: 'profile-male-1.jpg',
    category: 'profiles', 
    description: 'Male player profile'
  },
  'profile-male-2': {
    filename: 'profile-male-2.jpg',
    category: 'profiles',
    description: 'Male player profile'
  },
  
  // Club images
  'club-facility-1': {
    filename: 'club-facility-1.jpg',
    category: 'clubs',
    description: 'Modern sports club facility'
  },
  'club-facility-2': {
    filename: 'club-facility-2.jpg',
    category: 'clubs',
    description: 'Premium padel club'
  },
  
  // Default images
  'default-avatar': {
    filename: 'default-avatar.png',
    category: 'defaults',
    description: 'Default user avatar'
  }
};

/**
 * Get image by ID
 * GET /api/static-images/:imageId
 */
router.get('/:imageId', (req, res) => {
  try {
    const { imageId } = req.params;
    const imageInfo = imageDatabase[imageId];
    
    if (!imageInfo) {
      return res.status(404).json({
        error: 'Image not found',
        message: `Image with ID '${imageId}' does not exist`
      });
    }
    
    // In a real app, you would serve the actual image file
    // For now, we'll return a placeholder or redirect to a local asset
    const imagePath = path.join(__dirname, '../../assets', imageInfo.filename);
    
    // Check if file exists, if not return a JSON response with metadata
    if (fs.existsSync(imagePath)) {
      // Serve the actual image file
      res.sendFile(imagePath);
    } else {
      // Return image metadata with a placeholder URL
      res.json({
        id: imageId,
        url: `http://localhost:3000/api/static-images/${imageId}`,
        filename: imageInfo.filename,
        category: imageInfo.category,
        description: imageInfo.description,
        placeholder: true
      });
    }
    
  } catch (error) {
    console.error('Error serving image:', error);
    res.status(500).json({
      error: 'Failed to serve image',
      message: error.message
    });
  }
});

/**
 * List all available images
 * GET /api/static-images
 */
router.get('/', (req, res) => {
  try {
    const { category } = req.query;
    
    let images = Object.entries(imageDatabase).map(([id, info]) => ({
      id,
      url: `http://localhost:3000/api/static-images/${id}`,
      ...info
    }));
    
    // Filter by category if specified
    if (category) {
      images = images.filter(img => img.category === category);
    }
    
    res.json({
      success: true,
      data: {
        images,
        total: images.length
      }
    });
    
  } catch (error) {
    console.error('Error listing images:', error);
    res.status(500).json({
      error: 'Failed to list images',
      message: error.message
    });
  }
});

/**
 * Get random image by category
 * GET /api/static-images/random/:category
 */
router.get('/random/:category', (req, res) => {
  try {
    const { category } = req.params;
    
    const categoryImages = Object.entries(imageDatabase)
      .filter(([_, info]) => info.category === category)
      .map(([id, info]) => ({
        id,
        url: `http://localhost:3000/api/static-images/${id}`,
        ...info
      }));
    
    if (categoryImages.length === 0) {
      return res.status(404).json({
        error: 'No images found',
        message: `No images found for category '${category}'`
      });
    }
    
    // Return random image from category
    const randomImage = categoryImages[Math.floor(Math.random() * categoryImages.length)];
    
    res.json({
      success: true,
      data: randomImage
    });
    
  } catch (error) {
    console.error('Error getting random image:', error);
    res.status(500).json({
      error: 'Failed to get random image',
      message: error.message
    });
  }
});

module.exports = router;