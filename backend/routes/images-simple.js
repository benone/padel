const express = require('express');
const https = require('https');
const crypto = require('crypto');
const { Runware } = require('@runware/sdk-js');

const router = express.Router();

// Initialize Runware client
let runware;

/**
 * AI image generation that returns blob directly
 * GET /api/images-simple/generate?prompt=your_prompt_here
 */
router.get('/generate', async (req, res) => {
  try {
    let { prompt, width = 512, height = 512 } = req.query;
    
    if (!prompt) {
      return res.status(400).json({
        error: 'Missing required parameter: prompt',
        message: 'Please provide a prompt query parameter'
      });
    }

    // Validate and adjust dimensions for Runware API requirements
    width = parseInt(width);
    height = parseInt(height);
    
    // Ensure minimum size (128) and round to nearest multiple of 64
    width = Math.max(128, Math.ceil(width / 64) * 64);
    height = Math.max(128, Math.ceil(height / 64) * 64);
    
    // Ensure maximum size (2048)
    width = Math.min(2048, width);
    height = Math.min(2048, height);

    console.log(`🎨 AI generating image for prompt: "${prompt}"`);

    // Initialize Runware if not already done
    if (!runware) {
      runware = await Runware.initialize({ 
        apiKey: process.env.RUNWARE_API_TOKEN 
      });
    }

    // Generate image with Runware AI
    const images = await runware.requestImages({
      positivePrompt: prompt,
      width: width,
      height: height,
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
    console.log(`✅ Image generated: ${imageUrl}`);

    // Download and stream the generated image
    const request = https.get(imageUrl, (response) => {
      if (response.statusCode !== 200) {
        return res.status(500).json({
          error: 'Failed to fetch generated image',
          message: `HTTP ${response.statusCode}`
        });
      }
      
      // Set appropriate headers
      res.setHeader('Content-Type', 'image/jpeg');
      res.setHeader('Cache-Control', 'public, max-age=31536000');
      res.setHeader('X-Generated-For', prompt);
      res.setHeader('X-Dimensions', `${width}x${height}`);
      res.setHeader('X-AI-Generated', 'true');
      
      // Pipe the image directly to response
      response.pipe(res);
    });
    
    request.on('error', (err) => {
      console.error('❌ Download error:', err);
      res.status(500).json({
        error: 'Failed to download generated image',
        message: err.message
      });
    });
    
    request.setTimeout(30000, () => {
      request.destroy();
      res.status(500).json({
        error: 'Download timeout',
        message: 'Image download timed out'
      });
    });

  } catch (error) {
    console.error('❌ AI generation error:', error);
    res.status(500).json({
      error: 'AI image generation failed',
      message: error.message || 'Unknown error occurred'
    });
  }
});

module.exports = router;