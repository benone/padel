const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const crypto = require('crypto');
const https = require('https');

const router = express.Router();

// Ensure cache directories exist
const cacheDir = path.join(__dirname, '../cache/images');
const blobCacheDir = path.join(__dirname, '../cache/blobs');
fs.ensureDirSync(cacheDir);
fs.ensureDirSync(blobCacheDir);

/**
 * Download image from URL and save as blob
 */
async function downloadAndCacheImage(imageUrl, cacheKey) {
  return new Promise((resolve, reject) => {
    const blobPath = path.join(blobCacheDir, `${cacheKey}.jpg`);
    
    // Check if blob already exists and has content
    if (fs.existsSync(blobPath) && fs.statSync(blobPath).size > 0) {
      resolve(blobPath);
      return;
    }

    const file = fs.createWriteStream(blobPath);
    
    const request = https.get(imageUrl, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download image: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close((err) => {
          if (err) {
            reject(err);
            return;
          }
          
          const finalSize = fs.statSync(blobPath).size;
          if (finalSize === 0) {
            fs.unlink(blobPath, () => {});
            reject(new Error('Downloaded file is empty'));
            return;
          }
          
          resolve(blobPath);
        });
      });
      
      file.on('error', (err) => {
        fs.unlink(blobPath, () => {});
        reject(err);
      });
    });
    
    request.on('error', (err) => {
      reject(err);
    });
    
    request.setTimeout(30000, () => {
      request.destroy();
      reject(new Error('Download timeout'));
    });
  });
}

/**
 * Mock image generation endpoint
 * GET /api/images-mock/generate?prompt=your_prompt_here
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

    // Create cache key
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

    console.log(`🎨 Mock generating image for prompt: "${prompt}"`);

    // Use a fixed sample image URL for testing (avoiding random to help with caching)
    const imageUrl = `http://localhost:3000/api/images-simple/generate?prompt=modern%20padel%20court%20sports%20facility&width=${width}&height=${height}`;

    // Cache the metadata
    const cacheData = {
      prompt,
      imageUrl,
      width: parseInt(width),
      height: parseInt(height),
      style,
      generatedAt: new Date().toISOString(),
      cacheKey,
      mockGenerated: true
    };

    // Save metadata to file cache
    await fs.writeJson(cachedFilePath, cacheData, { spaces: 2 });
    
    // Download and cache the image blob
    console.log(`📥 Downloading mock image blob...`);
    let downloadedBlobPath;
    try {
      downloadedBlobPath = await downloadAndCacheImage(imageUrl, cacheKey);
      console.log(`✅ Mock image downloaded and cached for prompt: "${prompt}"`);
    } catch (downloadError) {
      console.error(`❌ Download failed:`, downloadError);
      return res.json({
        success: true,
        cached: false,
        prompt,
        imageUrl,
        downloadError: downloadError.message,
        fallbackMode: true,
        mockGenerated: true,
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
        mockGenerated: true,
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
    res.setHeader('X-Mock-Generated', 'true');
    res.sendFile(downloadedBlobPath);

  } catch (error) {
    console.error('❌ Mock image generation error:', error);
    
    res.status(500).json({
      error: 'Mock image generation failed',
      message: error.message || 'Unknown error occurred'
    });
  }
});

module.exports = router;