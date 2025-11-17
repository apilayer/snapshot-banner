import { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import CanvasEditor from './components/CanvasEditor';
import ControlsPanel from './components/ControlsPanel';

function App() {
  const [urlInput, setUrlInput] = useState('https://example.com');
  const [theme, setTheme] = useState(() => {
    // Check localStorage or system preference
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  
  const [state, setState] = useState({
    width: 1280,
    height: 720,
    bg: '#0b0f1a',
    scale: 1,
    offsetX: 0,
    offsetY: 0,
    retina: true,
    format: 'webp',
    quality: 0.95,
    img: null
  });

  // Save theme preference
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const loadImage = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  };

  const handleCapture = async () => {
    const url = urlInput.trim() || 'https://example.com';
    
    try {
      // Call the backend proxy endpoint with POST
      const response = await fetch('http://localhost:3001/api/screenshot/proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: url,
          viewport: '1440x900',
          format: 'PNG'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to capture screenshot');
      }

      // Convert response to blob and create object URL
      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      
      // Load the image
      const img = await loadImage(imageUrl);
      const scale = Math.max(state.width / img.naturalWidth, state.height / img.naturalHeight);
      setState(prev => ({
        ...prev,
        img,
        scale,
        offsetX: 0,
        offsetY: 0
      }));
    } catch (e) {
      alert('Failed to load screenshot. Make sure the backend is running.');
      console.error(e);
    }
  };

  const exportCanvasBlob = () => {
    const factor = state.retina ? 2 : 1;
    const w = Math.round(state.width * factor);
    const h = Math.round(state.height * factor);
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    
    // Background
    ctx.fillStyle = state.bg;
    ctx.fillRect(0, 0, w, h);
    
    // Draw image
    if (state.img && state.img.complete) {
      const imgW = state.img.naturalWidth;
      const imgH = state.img.naturalHeight;
      const s = state.scale * (w / state.width);
      const drawW = imgW * s;
      const drawH = imgH * s;
      const x = (w - drawW) / 2 + state.offsetX * (w / state.width);
      const y = (h - drawH) / 2 + state.offsetY * (h / state.height);
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(state.img, x, y, drawW, drawH);
    }
    
    const type = state.format === 'webp' ? 'image/webp' : 'image/png';
    const quality = state.format === 'webp' ? state.quality : 1.0;
    return new Promise(resolve => canvas.toBlob(resolve, type, quality));
  };

  return (
    <div className={`antialiased font-[Inter] min-h-screen transition-colors duration-300 ${
      theme === 'dark'
        ? 'bg-[#0B0F1A] text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200'
        : 'bg-slate-100 text-slate-900 selection:bg-indigo-200 selection:text-indigo-900'
    }`}>
      {/* Backdrop */}
      <div className="pointer-events-none fixed inset-0" aria-hidden="true">
        {theme === 'dark' ? (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_50%_-20%,rgba(99,102,241,0.08),transparent_50%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_10%_20%,rgba(56,189,248,0.06),transparent_55%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(800px_480px_at_90%_10%,rgba(168,85,247,0.05),transparent_60%)]"></div>
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_50%_-20%,rgba(99,102,241,0.06),transparent_50%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_10%_20%,rgba(56,189,248,0.04),transparent_55%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(800px_480px_at_90%_10%,rgba(168,85,247,0.03),transparent_60%)]"></div>
          </>
        )}
      </div>

      <div className="relative z-10">
        <div className="w-full bg-[#FFF9C4] text-slate-900 text-center text-xs sm:text-sm font-medium py-3 px-4 shadow-sm">
          <a 
            href="https://screenshotlayer.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="underline decoration-slate-500/50 hover:decoration-slate-900 transition-colors"
          >
            This app is built using the Screenshotlayer API.
          </a>
        </div>

        <Header theme={theme} onToggleTheme={toggleTheme} />
        
        <main className="relative z-10">
          <Hero urlInput={urlInput} setUrlInput={setUrlInput} onCapture={handleCapture} theme={theme} />
          
          <section className="mx-auto max-w-7xl px-6 mt-10 sm:mt-12 pb-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <CanvasEditor state={state} setState={setState} onExport={exportCanvasBlob} theme={theme} />
              <ControlsPanel state={state} setState={setState} theme={theme} />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
