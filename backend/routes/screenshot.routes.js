import express from 'express';
import axios from 'axios';
import { 
  buildScreenshotUrl, 
  validateScreenshotParams 
} from '../utils/screenshotHelper.js';

const router = express.Router();

/**
 * POST /api/screenshot
 * Generate a screenshot URL and optionally proxy the image
 * 
 * Body parameters:
 * - url: Target website URL (required)
 * - fullpage: Capture full height (optional, 0 or 1)
 * - width: Thumbnail width in pixels (optional)
 * - viewport: Viewport dimensions (optional, format: widthxheight)
 * - format: Output format (optional, PNG/JPG/GIF/WEBP)
 * - quality: Image quality for lossy formats (optional, 1-100)
 * - scale: Device pixel ratio for Retina (optional, 1-2)
 * - delay: Delay before capture in seconds (optional, 0-20)
 * - force: Force fresh screenshot (optional, 0 or 1)
 * - user_agent: Custom User-Agent header (optional)
 * - accept_lang: Custom Accept-Language header (optional)
 */
router.post('/screenshot', async (req, res, next) => {
  try {
    const params = req.body;
    
    // Debug logging
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('Content-Type:', req.get('Content-Type'));

    // Validate parameters
    const validation = validateScreenshotParams(params);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Invalid parameters',
          type: 'validation_error',
          details: validation.errors
        }
      });
    }

    // Build the secure Screenshotlayer API URL
    const screenshotUrl = buildScreenshotUrl(params);

    // Return the URL for client-side usage (e.g., in <img> tags)
    res.json({
      success: true,
      data: {
        url: screenshotUrl,
        params: {
          target: params.url,
          format: params.format || 'PNG',
          viewport: params.viewport || '1440x900'
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/screenshot/proxy
 * Proxy the screenshot request through the server
 * Returns the actual image data
 * 
 * This endpoint is useful when you want to:
 * - Process the image on the server before sending to client
 * - Hide the Screenshotlayer API completely from client
 * - Add additional server-side image manipulation
 */
router.post('/screenshot/proxy', async (req, res, next) => {
  try {
    const params = req.body;

    // Validate parameters
    const validation = validateScreenshotParams(params);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Invalid parameters',
          type: 'validation_error',
          details: validation.errors
        }
      });
    }

    // Build the secure Screenshotlayer API URL
    const screenshotUrl = buildScreenshotUrl(params);

    // Fetch the image from Screenshotlayer
    const response = await axios.get(screenshotUrl, {
      responseType: 'arraybuffer',
      timeout: 30000 // 30 second timeout
    });

    // Determine content type based on format
    const format = (params.format || 'PNG').toLowerCase();
    const contentTypeMap = {
      'png': 'image/png',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'gif': 'image/gif',
      'webp': 'image/webp'
    };

    const contentType = contentTypeMap[format] || 'image/png';

    // Send the image back to client
    res.set('Content-Type', contentType);
    res.set('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
    res.send(response.data);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/screenshot/url
 * Generate a screenshot URL via query parameters
 * Useful for simple GET requests
 */
router.get('/screenshot/url', (req, res, next) => {
  try {
    const params = req.query;

    // Validate parameters
    const validation = validateScreenshotParams(params);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Invalid parameters',
          type: 'validation_error',
          details: validation.errors
        }
      });
    }

    // Build the secure Screenshotlayer API URL
    const screenshotUrl = buildScreenshotUrl(params);

    res.json({
      success: true,
      data: {
        url: screenshotUrl
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/health
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

export default router;
