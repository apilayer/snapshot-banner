export default function ControlsPanel({ state, setState, theme }) {
  const presets = [
    { width: 1280, height: 720, label: 'Thumbnail' },
    { width: 1500, height: 500, label: 'Header' },
    { width: 1080, height: 1080, label: 'Square' },
    { width: 1080, height: 1350, label: 'Portrait' },
    { width: 1200, height: 627, label: 'Link' },
    { width: 820, height: 360, label: 'Cover' }
  ];

  const handlePreset = (width, height) => {
    setState(prev => ({ ...prev, width, height, offsetX: 0, offsetY: 0 }));
    // Fit image if exists
    if (state.img) {
      const scale = Math.max(width / state.img.naturalWidth, height / state.img.naturalHeight);
      setState(prev => ({ ...prev, scale }));
    }
  };

  const handleSizeChange = (dimension, value) => {
    const numValue = Math.max(120, Math.min(8000, parseInt(value || '1', 10)));
    setState(prev => ({ ...prev, [dimension]: numValue }));
  };

  const handleBgChange = (value) => {
    setState(prev => ({ ...prev, bg: value }));
  };

  const handleRetinaToggle = () => {
    setState(prev => ({ ...prev, retina: !prev.retina }));
  };

  const handleScaleChange = (value) => {
    setState(prev => ({ ...prev, scale: parseInt(value, 10) / 100 }));
  };

  const handleCenter = () => {
    setState(prev => ({ ...prev, offsetX: 0, offsetY: 0 }));
  };

  const handleFit = () => {
    if (!state.img) return;
    const scale = Math.max(state.width / state.img.naturalWidth, state.height / state.img.naturalHeight);
    setState(prev => ({ ...prev, scale, offsetX: 0, offsetY: 0 }));
  };

  const handleFormatChange = (format) => {
    setState(prev => ({ ...prev, format }));
  };

  const handleQualityChange = (value) => {
    setState(prev => ({ ...prev, quality: parseInt(value, 10) / 100 }));
  };

  return (
    <div className="lg:col-span-4">
      <div className="space-y-5">
        {/* Canvas Settings */}
        <div className={`rounded-xl ring-1 p-4 sm:p-5 ${
          theme === 'dark' ? 'bg-white/[0.02] ring-white/10' : 'bg-white ring-slate-300'
        }`}>
          <div className="flex items-center justify-between">
            <h3 className={`text-sm font-semibold tracking-tight ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>Canvas</h3>
            <span className={`text-[11px] ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}>Preset sizes</span>
          </div>

          {/* Presets */}
          <div className="mt-3 grid grid-cols-2 gap-2">
            {presets.map((preset) => (
              <button
                key={`${preset.width}x${preset.height}`}
                onClick={() => handlePreset(preset.width, preset.height)}
                className={`group col-span-1 inline-flex items-center justify-between rounded-md px-3 py-2 text-xs ring-1 transition ${
                  theme === 'dark'
                    ? 'bg-white/[0.03] text-slate-200 ring-white/10 hover:bg-white/[0.06] hover:ring-white/20'
                    : 'bg-slate-100 text-slate-700 ring-slate-300 hover:bg-slate-200 hover:ring-slate-400'
                }`}
              >
                {preset.width}×{preset.height}
                <span className={`text-[10px] transition ${
                  theme === 'dark' 
                    ? 'text-slate-400 group-hover:text-slate-300' 
                    : 'text-slate-500 group-hover:text-slate-700'
                }`}>
                  {preset.label}
                </span>
              </button>
            ))}
          </div>

          {/* Custom size */}
          <div className="mt-3 grid grid-cols-2 gap-2">
            <label className={`text-xs ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Width
              <input
                type="number"
                min="120"
                step="1"
                value={state.width}
                onChange={(e) => handleSizeChange('width', e.target.value)}
                className={`mt-1 w-full rounded-md px-2.5 py-2 text-sm ring-1 focus:outline-none focus:ring-2 ${
                  theme === 'dark'
                    ? 'bg-white/5 text-white ring-white/10 focus:ring-indigo-500/60'
                    : 'bg-white text-slate-900 ring-slate-300 focus:ring-indigo-500'
                }`}
              />
            </label>
            <label className={`text-xs ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Height
              <input
                type="number"
                min="120"
                step="1"
                value={state.height}
                onChange={(e) => handleSizeChange('height', e.target.value)}
                className={`mt-1 w-full rounded-md px-2.5 py-2 text-sm ring-1 focus:outline-none focus:ring-2 ${
                  theme === 'dark'
                    ? 'bg-white/5 text-white ring-white/10 focus:ring-indigo-500/60'
                    : 'bg-white text-slate-900 ring-slate-300 focus:ring-indigo-500'
                }`}
              />
            </label>
          </div>

          {/* Background */}
          <div className="mt-3 grid grid-cols-3 gap-2">
            <label className={`col-span-2 text-xs ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Background
              <input
                type="text"
                value={state.bg}
                onChange={(e) => handleBgChange(e.target.value)}
                className={`mt-1 w-full rounded-md px-2.5 py-2 text-sm ring-1 focus:outline-none focus:ring-2 ${
                  theme === 'dark'
                    ? 'bg-white/5 text-white ring-white/10 focus:ring-indigo-500/60'
                    : 'bg-white text-slate-900 ring-slate-300 focus:ring-indigo-500'
                }`}
              />
            </label>
            <label className={`text-xs ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Color
              <input
                type="color"
                value={state.bg}
                onChange={(e) => handleBgChange(e.target.value)}
                className={`mt-1 h-[38px] w-full rounded-md p-1 ring-1 ${
                  theme === 'dark' ? 'bg-white/5 ring-white/10' : 'bg-white ring-slate-300'
                }`}
              />
            </label>
          </div>

          {/* Retina toggle */}
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="4" width="18" height="14" rx="2"/>
                <path d="M7 8h10"/>
              </svg>
              <div className={`text-sm ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}>Retina export</div>
            </div>
            <button
              onClick={handleRetinaToggle}
              aria-pressed={state.retina}
              className={`group inline-flex h-7 w-12 items-center rounded-full transition hover:ring-indigo-300/50 ${
                state.retina ? 'bg-indigo-500/30 ring-1 ring-indigo-400/30' : 'bg-white/10 ring-1 ring-white/10'
              }`}
            >
              <span className={`inline-block h-5 w-5 rounded-full bg-white shadow ring-1 ring-black/10 transition ${
                state.retina ? 'ml-6' : 'ml-1'
              }`}></span>
            </button>
          </div>
        </div>

        {/* Image Controls */}
        <div className={`rounded-xl ring-1 p-4 sm:p-5 ${
          theme === 'dark' ? 'bg-white/[0.02] ring-white/10' : 'bg-white ring-slate-300'
        }`}>
          <h3 className={`text-sm font-semibold tracking-tight ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>Image</h3>
          <div className="mt-3 space-y-3">
            <div>
              <div className={`flex items-center justify-between text-xs ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
              }`}>
                <span>Scale</span>
                <span>{Math.round(state.scale * 100)}%</span>
              </div>
              <input
                type="range"
                min="25"
                max="250"
                value={Math.round(state.scale * 100)}
                onChange={(e) => handleScaleChange(e.target.value)}
                className="mt-2 w-full accent-indigo-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleCenter}
                className={`inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs ring-1 transition ${
                  theme === 'dark'
                    ? 'bg-white/[0.03] text-slate-200 ring-white/10 hover:bg-white/[0.06] hover:ring-white/20'
                    : 'bg-slate-100 text-slate-700 ring-slate-300 hover:bg-slate-200 hover:ring-slate-400'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 12h18M12 3v18"/>
                </svg>
                Center
              </button>
              <button
                onClick={handleFit}
                className={`inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs ring-1 transition ${
                  theme === 'dark'
                    ? 'bg-white/[0.03] text-slate-200 ring-white/10 hover:bg-white/[0.06] hover:ring-white/20'
                    : 'bg-slate-100 text-slate-700 ring-slate-300 hover:bg-slate-200 hover:ring-slate-400'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 8V6a3 3 0 0 1 3-3h2M21 8V6a3 3 0 0 0-3-3h-2M3 16v2a3 3 0 0 0 3 3h2M21 16v2a3 3 0 0 1-3 3h-2"/>
                </svg>
                Fit
              </button>
            </div>
          </div>
        </div>

        {/* Output */}
        <div className={`rounded-xl ring-1 p-4 sm:p-5 ${
          theme === 'dark' ? 'bg-white/[0.02] ring-white/10' : 'bg-white ring-slate-300'
        }`}>
          <div className="flex items-center justify-between">
            <h3 className={`text-sm font-semibold tracking-tight ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>Output</h3>
            <span className={`text-[11px] ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}>Optimized</span>
          </div>

          {/* Format */}
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              onClick={() => handleFormatChange('png')}
              aria-selected={state.format === 'png'}
              className={`inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-xs ring-1 transition ${
                state.format === 'png'
                  ? theme === 'dark'
                    ? 'ring-indigo-400/50 bg-indigo-500/20 text-indigo-200'
                    : 'ring-indigo-400 bg-indigo-100 text-indigo-700'
                  : theme === 'dark'
                    ? 'bg-white/[0.03] text-slate-200 ring-white/10 hover:bg-white/[0.06] hover:ring-white/20'
                    : 'bg-slate-100 text-slate-700 ring-slate-300 hover:bg-slate-200 hover:ring-slate-400'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 7h16v10H4z"/>
                <path d="M8 7V5h8v2"/>
              </svg>
              PNG
            </button>
            <button
              onClick={() => handleFormatChange('webp')}
              aria-selected={state.format === 'webp'}
              className={`inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-xs ring-1 transition ${
                state.format === 'webp'
                  ? theme === 'dark'
                    ? 'ring-emerald-400/50 bg-emerald-500/20 text-emerald-200'
                    : 'ring-emerald-400 bg-emerald-100 text-emerald-700'
                  : theme === 'dark'
                    ? 'bg-white/[0.03] text-slate-200 ring-white/10 hover:bg-white/[0.06] hover:ring-white/20'
                    : 'bg-slate-100 text-slate-700 ring-slate-300 hover:bg-slate-200 hover:ring-slate-400'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-3.5 w-3.5 ${
                state.format === 'webp' && theme === 'light' ? 'text-emerald-600' : 'text-emerald-300'
              }`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 7l9 6 9-6-9-4-9 4v10l9 4 9-4V7"/>
              </svg>
              WebP
            </button>
          </div>

          {/* Quality (for WebP) */}
          {state.format === 'webp' && (
            <div className="mt-3">
              <div className={`flex items-center justify-between text-xs ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
              }`}>
                <span>Quality</span>
                <span>{Math.round(state.quality * 100)}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="100"
                value={Math.round(state.quality * 100)}
                onChange={(e) => handleQualityChange(e.target.value)}
                className="mt-2 w-full accent-emerald-500"
              />
            </div>
          )}

          {/* Notes */}
          <div className={`mt-3 text-[11px] ${
            theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
          }`}>
            Exports honor Retina 2x when enabled for crisp results on high-density displays.
          </div>
        </div>

        {/* Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className={`rounded-lg ring-1 p-3 ${
            theme === 'dark' ? 'bg-white/[0.02] ring-white/10' : 'bg-white ring-slate-300'
          }`}>
            <div className="flex items-center gap-2 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-sky-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10M12 2a15.3 15.3 0 0 0-4 10 15.3 15.3 0 0 0 4 10"/>
              </svg>
              Retina (2x) resolution
            </div>
            <p className={`mt-1.5 text-xs ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}>Sharper edges and typography when sharing across high-DPI screens.</p>
          </div>
          <div className={`rounded-lg ring-1 p-3 ${
            theme === 'dark' ? 'bg-white/[0.02] ring-white/10' : 'bg-white ring-slate-300'
          }`}>
            <div className="flex items-center gap-2 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20 7v10a2 2 0 0 1-2 2H6l-4-4V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z"/>
                <path d="M8 11h8"/>
              </svg>
              WebP format support
            </div>
            <p className={`mt-1.5 text-xs ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}>Smaller files, faster delivery, and excellent visual fidelity.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
