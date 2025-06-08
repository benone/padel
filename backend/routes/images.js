const express = require('express');
const { Runware } = require('@runware/sdk-js');
const fs = require('fs-extra');
const path = require('path');
const crypto = require('crypto');
const https = require('https');
const http = require('http');

const router = express.Router();

// Initialize Runware client
let runware;

// Ensure cache directories exist
const cacheDir = path.join(__dirname, '../cache/images');
const blobCacheDir = path.join(__dirname, '../cache/blobs');
fs.ensureDirSync(cacheDir);
fs.ensureDirSync(blobCacheDir);

// In-memory cache for generated images
const imageCache = new Map();

/**
 * Download image from URL and save as blob
 * @param {string} imageUrl - URL of the image to download
 * @param {string} cacheKey - Cache key for the image
 * @returns {Promise<string>} Path to the cached blob file
 */
async function downloadAndCacheImage(imageUrl, cacheKey) {
  return new Promise((resolve, reject) => {
    const blobPath = path.join(blobCacheDir, `${cacheKey}.jpg`);
    
    console.log(`📥 Downloading image from: ${imageUrl}`);
    console.log(`💾 Saving to: ${blobPath}`);
    
    // Check if blob already exists and has content
    if (fs.existsSync(blobPath) && fs.statSync(blobPath).size > 0) {
      console.log(`✅ Blob already exists with size: ${fs.statSync(blobPath).size} bytes`);
      resolve(blobPath);
      return;
    }

    const protocol = imageUrl.startsWith('https:') ? https : http;
    const file = fs.createWriteStream(blobPath);
    
    const request = protocol.get(imageUrl, (response) => {
      console.log(`📡 Response status: ${response.statusCode}`);
      console.log(`📏 Content-Length: ${response.headers['content-length']}`);
      
      if (response.statusCode !== 200) {
        const error = new Error(`Failed to download image: ${response.statusCode}`);
        console.error(`❌ Download failed:`, error.message);
        reject(error);
        return;
      }
      
      let downloadedBytes = 0;
      
      response.on('data', (chunk) => {
        downloadedBytes += chunk.length;
      });
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close((err) => {
          if (err) {
            console.error(`❌ File close error:`, err);
            reject(err);
            return;
          }
          
          const finalSize = fs.statSync(blobPath).size;
          console.log(`✅ Download complete! Downloaded: ${downloadedBytes} bytes, File size: ${finalSize} bytes`);
          
          if (finalSize === 0) {
            const error = new Error('Downloaded file is empty');
            console.error(`❌ ${error.message}`);
            fs.unlink(blobPath, () => {});
            reject(error);
            return;
          }
          
          resolve(blobPath);
        });
      });
      
      file.on('error', (err) => {
        console.error(`❌ File write error:`, err);
        fs.unlink(blobPath, () => {}); // Delete the file on error
        reject(err);
      });
    });
    
    request.on('error', (err) => {
      console.error(`❌ Request error:`, err);
      reject(err);
    });
    
    request.setTimeout(30000, () => {
      console.error(`❌ Download timeout for ${imageUrl}`);
      request.destroy();
      reject(new Error('Download timeout'));
    });
  });
}

/**
 * Generate image from text prompt and return as blob
 * GET /api/images/generate?prompt=your_prompt_here
 * 
 * Query parameters:
 * - prompt (required): Text description for image generation
 * - width (optional): Image width, default 512
 * - height (optional): Image height, default 512
 * - style (optional): Style preset, default 'realistic'
 * - format (optional): Return format - 'blob' (default) or 'json'
 */
router.get('/generate', async (req, res) => {
  try {
    const { prompt, width = 512, height = 512, style = 'realistic', format = 'blob' } = req.query;
    
    if (!prompt) {
      return res.status(400).json({
        error: 'Missing required parameter: prompt',
        message: 'Please provide a prompt query parameter'
      });
    }

    // Create cache key based on prompt and parameters
    const cacheKey = crypto
      .createHash('md5')
      .update(`${prompt}_${width}_${height}_${style}`)
      .digest('hex');

    // Check if blob cache exists
    const blobPath = path.join(blobCacheDir, `${cacheKey}.jpg`);
    const cachedFilePath = path.join(cacheDir, `${cacheKey}.json`);
    
    if (await fs.pathExists(blobPath) && await fs.pathExists(cachedFilePath)) {
      console.log(`🎯 Blob cache hit for prompt: "${prompt}"`);
      
      if (format === 'json') {
        const cachedData = await fs.readJson(cachedFilePath);
        return res.json({
          success: true,
          cached: true,
          prompt,
          imageUrl: cachedData.imageUrl,
          cacheKey
        });
      }
      
      // Serve blob
      res.setHeader('Content-Type', 'image/jpeg');
      res.setHeader('Cache-Control', 'public, max-age=31536000');
      res.setHeader('X-Cache-Hit', 'true');
      res.setHeader('X-Cache-Key', cacheKey);
      return res.sendFile(blobPath);
    }

    console.log(`🎨 Generating new image for prompt: "${prompt}"`);

    // Initialize Runware if not already done
    if (!runware) {
      runware = await Runware.initialize({ 
        apiKey: process.env.RUNWARE_API_TOKEN 
      });
    }

    // Generate image
    const images = await runware.requestImages({
      positivePrompt: prompt,
      width: parseInt(width),
      height: parseInt(height),
      model: "runware:100@1",
      numberResults: 1,
      steps: 20,
      CFGScale: 7,
      seed: Math.floor(Math.random() * 1000000),
    });

    if (!images || images.length === 0) {
      return res.status(500).json({
        error: 'Image generation failed',
        message: 'No images were generated'
      });
    }

    const imageUrl = images[0].imageURL;

    // Cache the metadata
    const cacheData = {
      prompt,
      imageUrl,
      width: parseInt(width),
      height: parseInt(height),
      style,
      generatedAt: new Date().toISOString(),
      cacheKey
    };

    // Save metadata to file cache
    await fs.writeJson(cachedFilePath, cacheData, { spaces: 2 });
    
    // Download and cache the image blob
    console.log(`📥 Downloading image blob...`);
    let downloadedBlobPath;
    try {
      downloadedBlobPath = await downloadAndCacheImage(imageUrl, cacheKey);
      console.log(`✅ Image generated, downloaded and cached for prompt: "${prompt}"`);
    } catch (downloadError) {
      console.error(`❌ Download failed:`, downloadError);
      // If download fails, return JSON response with the URL instead
      return res.json({
        success: true,
        cached: false,
        prompt,
        imageUrl,
        downloadError: downloadError.message,
        fallbackMode: true,
        width: parseInt(width),
        height: parseInt(height),
        style,
        cacheKey,
        generatedAt: cacheData.generatedAt
      });
    }

    if (format === 'json') {
      return res.json({
        success: true,
        cached: false,
        prompt,
        imageUrl,
        width: parseInt(width),
        height: parseInt(height),
        style,
        cacheKey,
        generatedAt: cacheData.generatedAt
      });
    }

    // Serve the blob
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    res.setHeader('X-Cache-Hit', 'false');
    res.setHeader('X-Cache-Key', cacheKey);
    res.setHeader('X-Generated-At', cacheData.generatedAt);
    res.sendFile(downloadedBlobPath);

  } catch (error) {
    console.error('❌ Image generation error:', error);
    
    res.status(500).json({
      error: 'Image generation failed',
      message: error.message || 'Unknown error occurred',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

/**
 * Serve cached image blob
 * GET /api/images/blob/:cacheKey
 */
router.get('/blob/:cacheKey', async (req, res) => {
  try {
    const { cacheKey } = req.params;
    
    const blobPath = path.join(blobCacheDir, `${cacheKey}.jpg`);
    const metadataPath = path.join(cacheDir, `${cacheKey}.json`);
    
    if (!(await fs.pathExists(blobPath))) {
      return res.status(404).json({
        error: 'Image not found',
        message: 'No cached image found for this key'
      });
    }
    
    // Add metadata headers if available
    if (await fs.pathExists(metadataPath)) {
      const metadata = await fs.readJson(metadataPath);
      res.setHeader('X-Prompt', metadata.prompt);
      res.setHeader('X-Generated-At', metadata.generatedAt);
      res.setHeader('X-Dimensions', `${metadata.width}x${metadata.height}`);
    }
    
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    res.setHeader('X-Cache-Key', cacheKey);
    res.sendFile(blobPath);
    
  } catch (error) {
    console.error('❌ Blob serving error:', error);
    res.status(500).json({
      error: 'Failed to serve image',
      message: error.message
    });
  }
});

/**
 * Get cached image metadata
 * GET /api/images/cache/:cacheKey
 */
router.get('/cache/:cacheKey', async (req, res) => {
  try {
    const { cacheKey } = req.params;
    
    // Check in-memory cache
    if (imageCache.has(cacheKey)) {
      return res.json({
        success: true,
        cached: true,
        imageUrl: imageCache.get(cacheKey),
        cacheKey
      });
    }

    // Check file cache
    const cachedFilePath = path.join(cacheDir, `${cacheKey}.json`);
    if (await fs.pathExists(cachedFilePath)) {
      const cachedData = await fs.readJson(cachedFilePath);
      imageCache.set(cacheKey, cachedData.imageUrl);
      return res.json({
        success: true,
        cached: true,
        ...cachedData
      });
    }

    res.status(404).json({
      error: 'Cache entry not found',
      message: 'No cached image found for this key'
    });

  } catch (error) {
    console.error('❌ Cache retrieval error:', error);
    res.status(500).json({
      error: 'Cache retrieval failed',
      message: error.message
    });
  }
});

/**
 * List all cached images
 * GET /api/images/cache
 */
router.get('/cache', async (req, res) => {
  try {
    const files = await fs.readdir(cacheDir);
    const jsonFiles = files.filter(file => file.endsWith('.json'));
    
    const cachedImages = [];
    for (const file of jsonFiles) {
      try {
        const data = await fs.readJson(path.join(cacheDir, file));
        cachedImages.push({
          cacheKey: data.cacheKey,
          prompt: data.prompt,
          imageUrl: data.imageUrl,
          generatedAt: data.generatedAt
        });
      } catch (err) {
        console.warn(`⚠️  Skipping corrupted cache file: ${file}`);
      }
    }

    res.json({
      success: true,
      total: cachedImages.length,
      images: cachedImages.sort((a, b) => 
        new Date(b.generatedAt) - new Date(a.generatedAt)
      )
    });

  } catch (error) {
    console.error('❌ Cache listing error:', error);
    res.status(500).json({
      error: 'Cache listing failed',
      message: error.message
    });
  }
});

/**
 * Clear image cache
 * DELETE /api/images/cache
 */
router.delete('/cache', async (req, res) => {
  try {
    // Clear memory cache
    imageCache.clear();
    
    // Clear file caches
    await fs.emptyDir(cacheDir);
    await fs.emptyDir(blobCacheDir);
    
    console.log('🗑️  Image cache and blob cache cleared');
    
    res.json({
      success: true,
      message: 'Image cache cleared successfully'
    });

  } catch (error) {
    console.error('❌ Cache clearing error:', error);
    res.status(500).json({
      error: 'Cache clearing failed',
      message: error.message
    });
  }
});

module.exports = router;