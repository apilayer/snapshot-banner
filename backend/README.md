# Snapshotbanner Backend API

Secure Node.js Express middleware for the Screenshotlayer API. This API acts as a secure proxy to keep your Screenshotlayer API keys safe from client-side exposure.

## Features

- 🔒 **Secure API Key Management** - Keeps your Screenshotlayer API key and secret keyword secure on the server
- 🔐 **Automatic URL Encryption** - Generates secure MD5 hashes for each request
- ✅ **Request Validation** - Validates all parameters before proxying to Screenshotlayer
- 🖼️ **Multiple Response Options** - Return URL or proxy the actual image data
- 🎯 **Full Screenshotlayer Support** - Supports all features including Retina/2x resolution and WebP format
- 🌐 **CORS Enabled** - Configured for cross-origin requests
- 📝 **Comprehensive Error Handling** - Detailed error messages and validation feedback

## Prerequisites

- Node.js 22+ (as per your project rules)
- pnpm package manager
- Screenshotlayer API account with access key and secret keyword

## Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies using pnpm:
```bash
pnpm install
```

3. Create your `.env` file:
```bash
cp .env.example .env
```

4. Edit `.env` and add your Screenshotlayer credentials:
```env
SCREENSHOTLAYER_ACCESS_KEY=your_actual_access_key
SCREENSHOTLAYER_SECRET_KEYWORD=your_actual_secret_keyword
PORT=3001
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

## Running the Server

### Development mode (with hot reload):
```bash
pnpm dev
```

### Production mode:
```bash
pnpm start
```

The server will start on `http://localhost:3001` (or your configured PORT).

## API Endpoints

### 1. Health Check
Check if the API is running.

**Endpoint:** `GET /api/health`

**Response:**
```json
{
  "success": true,
  "status": "ok",
  "timestamp": "2025-11-06T09:29:14Z"
}
```

### 2. Generate Screenshot URL
Generate a secure Screenshotlayer URL with your API key and secret.

**Endpoint:** `POST /api/screenshot`

**Request Body:**
```json
{
  "url": "https://www.apple.com",
  "fullpage": 1,
  "viewport": "1440x900",
  "format": "webp",
  "scale": 2
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://api.screenshotlayer.com/api/capture?access_key=xxx&secret_key=xxx&url=...",
    "params": {
      "target": "https://www.apple.com",
      "format": "WEBP",
      "viewport": "1440x900"
    }
  }
}
```

### 3. Proxy Screenshot (Returns Image)
Fetch the screenshot through the server and return the image data directly.

**Endpoint:** `POST /api/screenshot/proxy`

**Request Body:**
```json
{
  "url": "https://www.apple.com",
  "fullpage": 1,
  "format": "png",
  "width": 350
}
```

**Response:** Binary image data with appropriate `Content-Type` header

### 4. Generate Screenshot URL (GET)
Generate a screenshot URL using query parameters.

**Endpoint:** `GET /api/screenshot/url?url=https://www.apple.com&fullpage=1`

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://api.screenshotlayer.com/api/capture?..."
  }
}
```

## Supported Parameters

All Screenshotlayer API parameters are supported:

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `url` | string | **Required.** Target website URL | `https://apple.com` |
| `fullpage` | boolean/int | Capture full page height | `1` or `true` |
| `width` | number | Thumbnail width in pixels | `350` |
| `viewport` | string | Viewport dimensions | `1440x900` |
| `format` | string | Output format | `PNG`, `JPG`, `GIF`, `WEBP` |
| `quality` | number | Image quality (1-100) | `80` |
| `scale` | number | Device pixel ratio (1-2) | `2` for Retina |
| `delay` | number | Delay before capture (0-20s) | `3` |
| `force` | boolean/int | Force fresh screenshot | `1` or `true` |
| `css_url` | string | Inject custom CSS | URL to CSS file |
| `user_agent` | string | Custom User-Agent | Device UA string |
| `accept_lang` | string | Accept-Language header | `en-US`, `es` |
| `placeholder` | string/int | Placeholder image | `1` or image URL |
| `ttl` | number | Cache time in seconds | `259200` |

## Usage Examples

### Frontend Integration (React/Vue/Vanilla JS)

#### Using the URL endpoint:
```javascript
// Fetch screenshot URL from your API
const response = await fetch('http://localhost:3001/api/screenshot', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    url: 'https://www.apple.com',
    fullpage: 1,
    format: 'webp',
    scale: 2,
    viewport: '1440x900'
  })
});

const data = await response.json();

// Use the URL in an image tag
document.getElementById('screenshot').src = data.data.url;
```

#### Using the proxy endpoint:
```javascript
// Fetch image data directly
const response = await fetch('http://localhost:3001/api/screenshot/proxy', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    url: 'https://www.apple.com',
    format: 'png',
    width: 350
  })
});

const blob = await response.blob();
const imageUrl = URL.createObjectURL(blob);
document.getElementById('screenshot').src = imageUrl;
```

### React Example:
```jsx
import { useState } from 'react';

function ScreenshotGenerator() {
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const generateScreenshot = async (targetUrl) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/screenshot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: targetUrl,
          fullpage: 1,
          format: 'webp',
          scale: 2
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setScreenshotUrl(data.data.url);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={() => generateScreenshot('https://www.apple.com')}>
        Generate Screenshot
      </button>
      {loading && <p>Loading...</p>}
      {screenshotUrl && <img src={screenshotUrl} alt="Screenshot" />}
    </div>
  );
}
```

## Error Handling

The API returns standardized error responses:

```json
{
  "success": false,
  "error": {
    "message": "Invalid parameters",
    "type": "validation_error",
    "details": ["url is required"]
  }
}
```

Common error types:
- `validation_error` - Invalid request parameters
- `api_error` - Error from Screenshotlayer API
- `404_not_found` - Route not found
- `internal_error` - Server error

## Security Features

1. **API Key Protection**: Your Screenshotlayer API key never leaves the server
2. **URL Encryption**: Automatic MD5 secret key generation for each request
3. **CORS Protection**: Configurable allowed origins
4. **Input Validation**: All parameters validated before API calls
5. **Environment Variables**: Sensitive data stored in `.env` file

## Project Structure

```
backend/
├── config/
│   └── config.js              # Configuration and env validation
├── middleware/
│   └── errorHandler.js        # Error handling middleware
├── routes/
│   └── screenshot.routes.js   # API routes
├── utils/
│   └── screenshotHelper.js    # URL generation and validation
├── .env.example               # Environment template
├── .gitignore                 # Git ignore rules
├── package.json               # Dependencies
├── README.md                  # This file
└── server.js                  # Main server file
```

## Development

The API is configured to work with your Node.js 22 environment using pnpm.

### Testing endpoints:

Using curl:
```bash
# Health check
curl http://localhost:3001/api/health

# Generate screenshot URL
curl -X POST http://localhost:3001/api/screenshot \
  -H "Content-Type: application/json" \
  -d '{"url":"https://www.apple.com","fullpage":1,"format":"webp"}'
```

Using Postman or Thunder Client:
1. Import the endpoints
2. Set method to POST
3. Add JSON body with parameters
4. Send request

## Production Deployment

1. Set `NODE_ENV=production` in your `.env`
2. Update `ALLOWED_ORIGINS` with your production domain(s)
3. Use a process manager like PM2:
```bash
pnpm install -g pm2
pm2 start server.js --name snapshotbanner-api
```

## License

MIT
