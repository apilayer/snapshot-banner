# Snapshot Banner - Social Media Banner Generator

A full-stack web application for generating social media banners from any website URL using live screenshots. This app is built on top of [Screenshotlayer API](https://screenshotlayer.com/) by [APILayer](https://apilayer.com/). It captures live website screenshots with [Retina (2x) support]() and optimized WebP output, ensuring crisp visuals and fast loading.

## Get Started

### 1. Clone the repository

Clone this snapshot-banner repository in your local machine

```bash
git clone https://github.com/apilayer/snapshot-banner.git
```

### 2. Install dependencies

Install all dependencies separately for backend and frontend using the commands below.

**Backend**

```bash
cd snapshot-banner
cd backend
npm install
```

**Frontend**

```bash
cd snapshot-banner
cd frontend
npm install
```

### 3. Add your API key

1. Create `.env` file in the `backend` folder
2. Copy the contents of `.env.example` into your new `.env` file.
3. Sign up for the [Screenshotlayer API](https://screenshotlayer.com/signup?plan=5&billing=yearly) to get your API key and Secret keyword
4. Add your API key and Secret keywork to the `.env` file

### 4. Start the server

**Backend**

```bash
cd backend
npm start
```

**Frontend**

```bash
cd frontend
npm run dev
```

## Features Implemented

### 1. Screenshot Capture

-   Enter any website URL
-   Fetch screenshot via backend proxy (`/api/screenshot/proxy`)
-   Automatic image loading with error handling

### 2. Canvas Editor

-   **Drag to reposition** - Click and drag the screenshot
-   **Scroll to zoom** - Mouse wheel zoom with cursor tracking
-   **High-DPI rendering** - Crisp display on Retina screens
-   **Reset view** button to return to default state

### 3. Canvas Settings

-   **Preset sizes** for popular social media formats:
    -   1280×720 (Thumbnail)
    -   1500×500 (Header)
    -   1080×1080 (Square/Instagram)
    -   1080×1350 (Portrait/Instagram)
    -   1200×627 (Link preview)
    -   820×360 (Cover)
-   **Custom dimensions** with manual width/height input
-   **Background color** picker with hex input
-   **Retina 2x toggle** for high-resolution exports

### 4. Image Controls

-   **Scale slider** (25% - 250%)
-   **Center button** - Reset image position
-   **Fit button** - Auto-scale to fill canvas

### 5. Output Options

-   **Format selection**: PNG or WebP
-   **Quality slider** for WebP (50% - 100%)
-   **Copy to clipboard** functionality
-   **Download** with proper naming convention

### 6. Design

-   Dark theme with gradient backdrop
-   Responsive layout (mobile-friendly)
-   Smooth transitions and hover effects
-   Professional UI matching the landing.html design

## Tech Stack

### Backend

-   **Node.js** with Express
-   **Screenshotlayer API** for capturing screenshots
-   **CORS** enabled for frontend communication

### Frontend

-   **React 19** with Hooks
-   **Vite** for fast development and building
-   **Tailwind CSS** for styling
-   **Canvas API** for image manipulation
-   **pnpm** for package management

## API Endpoint

```
GET http://localhost:3001/api/screenshot/proxy?url={encoded_url}
```

**Parameters:**

-   `url` (required) - The website URL to capture

**Response:**

-   Returns the screenshot image with CORS headers

## Usage Flow

1. User enters a website URL
2. Frontend sends request to backend proxy
3. Backend fetches screenshot from Screenshotlayer API
4. Image loads into the canvas editor
5. User adjusts position, size, background, and format
6. User exports as PNG/WebP via copy or download

## Key Components

### App.jsx

-   Main state management
-   Screenshot fetching logic
-   Export functionality
-   Layout composition

### CanvasEditor.jsx

-   Canvas rendering with device pixel ratio
-   Drag and zoom interactions
-   Export buttons (copy/download)

### ControlsPanel.jsx

-   Canvas size presets and custom dimensions
-   Background color picker
-   Retina toggle
-   Scale slider
-   Format and quality controls

### Hero.jsx

-   URL input field
-   Capture button
-   Feature badges

### Header.jsx

-   Branding and navigation

## Notes

-   Backend must be running for screenshot capture to work
-   CORS is configured to allow localhost development
-   Images are loaded with `crossOrigin: 'anonymous'` for canvas export
-   Retina export doubles the resolution for crisp results

## Future Enhancements

-   Loading states and progress indicators
-   Toast notifications instead of alerts
-   Image filters and effects
-   Text overlay capabilities
-   Multiple image layers
-   Undo/redo functionality
-   Save/load projects
-   Share generated banners
