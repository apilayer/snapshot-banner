import crypto from 'crypto';
import { config } from '../config/config.js';

/**
 * Generate MD5 hash for URL encryption
 * @param {string} url - Target website URL
 * @param {string} secretKeyword - Secret keyword from config
 * @returns {string} MD5 hash
 */
export const generateSecretKey = (url, secretKeyword) => {
  const combined = url + secretKeyword;
  return crypto.createHash('md5').update(combined).digest('hex');
};

/**
 * Build Screenshotlayer API URL with all parameters
 * @param {object} params - Screenshot parameters
 * @returns {string} Complete API URL
 */
export const buildScreenshotUrl = (params) => {
  const { url, ...options } = params;
  
  if (!url) {
    throw new Error('URL parameter is required');
  }

  // IMPORTANT: Do NOT pre-encode the URL here.
  // URLSearchParams will properly encode it; pre-encoding would double-encode and break the API.

  // Generate secret key
  const secretKey = generateSecretKey(
    url, 
    config.screenshotlayer.secretKeyword
  );

  // Build query parameters
  const queryParams = new URLSearchParams({
    access_key: config.screenshotlayer.accessKey,
    secret_key: secretKey,
    url // let URLSearchParams handle encoding
  });

  // Add optional parameters
  const optionalParams = [
    'fullpage', 'width', 'viewport', 'format', 'quality',
    'css_url', 'delay', 'ttl', 'force', 'placeholder',
    'user_agent', 'accept_lang', 'scale'
  ];

  optionalParams.forEach(param => {
    if (options[param] !== undefined && options[param] !== null && options[param] !== '') {
      let value = options[param];
      // Normalize booleans for APIs expecting 0/1
      if ((param === 'fullpage' || param === 'force' || param === 'placeholder') && typeof value === 'boolean') {
        value = value ? '1' : '0';
      }
      queryParams.append(param, value);
    }
  });

  return `${config.screenshotlayer.baseUrl}?${queryParams.toString()}`;
};

/**
 * Validate screenshot parameters
 * @param {object} params - Parameters to validate
 * @returns {object} Validation result
 */
export const validateScreenshotParams = (params) => {
  const errors = [];

  // Validate required URL
  if (!params.url) {
    errors.push('url is required');
  } else {
    // Basic URL validation
    try {
      new URL(params.url);
    } catch (e) {
      errors.push('url must be a valid URL (include http:// or https://)');
    }
  }

  // Validate optional parameters
  if (params.width && (isNaN(params.width) || params.width < 1)) {
    errors.push('width must be a positive number');
  }

  if (params.viewport && !/^\d+x\d+$/.test(params.viewport)) {
    errors.push('viewport must be in format: widthxheight (e.g., 1440x900)');
  }

  if (params.format && !['PNG', 'JPG', 'JPEG', 'GIF', 'WEBP'].includes(params.format.toUpperCase())) {
    errors.push('format must be one of: PNG, JPG, JPEG, GIF, WEBP');
  }

  if (params.quality && (isNaN(params.quality) || params.quality < 1 || params.quality > 100)) {
    errors.push('quality must be between 1 and 100');
  }

  if (params.delay && (isNaN(params.delay) || params.delay < 0 || params.delay > 20)) {
    errors.push('delay must be between 0 and 20 seconds');
  }

  if (params.scale && (isNaN(params.scale) || params.scale < 1 || params.scale > 2)) {
    errors.push('scale must be between 1 and 2');
  }

  if (params.fullpage && !['0', '1', 0, 1, true, false].includes(params.fullpage)) {
    errors.push('fullpage must be 0, 1, true, or false');
  }

  if (params.force && !['0', '1', 0, 1, true, false].includes(params.force)) {
    errors.push('force must be 0, 1, true, or false');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
