import dotenv from 'dotenv';

dotenv.config();

export const config = {
  screenshotlayer: {
    accessKey: process.env.SCREENSHOTLAYER_ACCESS_KEY,
    secretKeyword: process.env.SCREENSHOTLAYER_SECRET_KEYWORD,
    baseUrl: 'https://api.screenshotlayer.com/api/capture'
  },
  server: {
    port: process.env.PORT || 3001,
    nodeEnv: process.env.NODE_ENV || 'development'
  },
  cors: {
    allowedOrigins: process.env.ALLOWED_ORIGINS 
      ? process.env.ALLOWED_ORIGINS.split(',')
      : ['http://localhost:3000', 'http://localhost:5173']
  }
};

// Validate required environment variables
export const validateConfig = () => {
  const required = [
    'SCREENSHOTLAYER_ACCESS_KEY',
    'SCREENSHOTLAYER_SECRET_KEYWORD'
  ];

  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please copy .env.example to .env and fill in your values.'
    );
  }
};
