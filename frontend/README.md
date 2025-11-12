# Snapshot Banner Frontend

A React app for generating social media banners from any website URL using live screenshots.

## Features

- 📸 **Live Screenshot Capture** - Enter any URL and capture its live screenshot via backend proxy
- 🎨 **Canvas Editor** - Drag to reposition and scroll to zoom the screenshot with smooth interactions
- 📐 **Preset Sizes** - Quick buttons for popular social media dimensions (Thumbnail, Header, Square, Portrait, Link, Cover)
- 🎭 **Custom Backgrounds** - Choose any color for your banner background with color picker
- 🔄 **Retina 2x Export** - Support for high-resolution displays with toggle switch
- 🖼️ **Format Support** - Export as PNG or WebP with adjustable quality control
- 💾 **Copy & Download** - Copy to clipboard or download instantly with proper naming
- 🌓 **Light/Dark Theme** - Animated theme toggle with sun/moon icons and persistent preferences
- 🎯 **Responsive Design** - Fully responsive layout that works on all screen sizes
- ✨ **Modern UI** - Tailwind CSS with gradient backdrops and smooth transitions

## Prerequisites

- Node.js 22.x (managed via nvm)
- Backend server running on `http://localhost:3001`

## Installation

```bash
# Switch to Node 22
nvm use 22

# Install dependencies
pnpm install
```

## Development

```bash
# Start the dev server
pnpm dev
```

The app will be available at `http://localhost:5173`

## Usage

1. Enter a website URL in the input field
2. Click "Capture" to grab a screenshot via the backend proxy
3. Use the canvas editor to:
   - **Drag** the image to reposition it
   - **Scroll** to zoom in/out
   - Use the **Scale slider** for precise control
4. Adjust canvas settings:
   - Choose from preset social media sizes
   - Set custom width/height
   - Change background color
   - Toggle Retina 2x export
5. Configure output:
   - Select PNG or WebP format
   - Adjust quality (WebP only)
6. Copy to clipboard or download your banner

## Project Structure

```
src/
├── components/
│   ├── Header.jsx          # App header with branding
│   ├── Hero.jsx            # Hero section with URL input
│   ├── CanvasEditor.jsx    # Main canvas with drag/zoom
│   └── ControlsPanel.jsx   # Settings and controls sidebar
├── App.jsx                 # Main app component
├── index.css               # Global styles
└── main.jsx                # App entry point
```

## API Integration

The app connects to the backend proxy endpoint:

```
GET http://localhost:3001/api/screenshot/proxy?url={encoded_url}
```

Make sure your backend server is running before using the capture feature.

## Build

```bash
# Create production build
pnpm build

# Preview production build
pnpm preview
```

## Technologies

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Canvas API** - Image manipulation and export
- **Screenshotlayer API** - Via backend proxy

## License

MIT

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
