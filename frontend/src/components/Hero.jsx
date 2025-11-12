export default function Hero({ urlInput, setUrlInput, onCapture, theme }) {
  return (
    <section className="mx-auto max-w-7xl px-6 pt-8 sm:pt-12">
      <div className="mx-auto max-w-3xl text-center">
        <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs ring-1 ${
          theme === 'dark'
            ? 'bg-white/[0.03] text-slate-300 ring-white/10'
            : 'bg-white text-slate-700 ring-slate-300'
        }`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-indigo-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M5 12h14M12 5v14"/>
          </svg>
          Ship banners 10x faster
        </div>
        <h1 className={`mt-4 text-4xl sm:text-5xl font-semibold tracking-tight ${
          theme === 'dark' ? 'text-white' : 'text-slate-900'
        }`}>
          Generate social media banners from any URL
        </h1>
        <p className={`mt-4 text-base sm:text-lg ${
          theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
        }`}>
          Enter a website, capture a live screenshot, and customize it on a simple canvas. Adjust background, pick social sizes, then copy or download in seconds.
        </p>
      </div>

      {/* URL Input */}
      <div className="mx-auto mt-8 max-w-3xl">
        <div className="flex flex-col sm:flex-row items-stretch gap-3">
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10M12 2a15.3 15.3 0 0 0-4 10 15.3 15.3 0 0 0 4 10"/>
              </svg>
            </div>
            <input 
              type="url" 
              placeholder="https://example.com" 
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onCapture()}
              className={`w-full rounded-md pl-10 pr-4 py-3 text-sm ring-1 focus:outline-none focus:ring-2 ${
                theme === 'dark'
                  ? 'bg-white/5 text-white placeholder-slate-500 ring-white/10 focus:ring-indigo-500/60'
                  : 'bg-white text-slate-900 placeholder-slate-400 ring-slate-300 focus:ring-indigo-500'
              }`}
            />
          </div>
          <button 
            onClick={onCapture}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-indigo-500/90 px-4 py-3 text-sm font-medium text-white shadow-sm ring-1 ring-indigo-400/60 hover:bg-indigo-400/90 hover:ring-indigo-300 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5 12h14M12 5v14"/>
            </svg>
            Capture
          </button>
        </div>

        <div className={`mt-4 flex flex-wrap items-center gap-2 text-xs ${
          theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
        }`}>
          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 ring-1 ${
            theme === 'dark' ? 'bg-white/[0.03] ring-white/10' : 'bg-white ring-slate-300'
          }`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-sky-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 6h16M4 12h16M4 18h7"/>
            </svg>
            Retina 2x export
          </span>
          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 ring-1 ${
            theme === 'dark' ? 'bg-white/[0.03] ring-white/10' : 'bg-white ring-slate-300'
          }`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-emerald-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="m3 7 9 6 9-6-9-4-9 4v10l9 4 9-4V7"/>
            </svg>
            WebP support
          </span>
          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 ring-1 ${
            theme === 'dark' ? 'bg-white/[0.03] ring-white/10' : 'bg-white ring-slate-300'
          }`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-violet-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5 8h14M5 16h14M5 12h14"/>
            </svg>
            Drag to reposition
          </span>
        </div>
      </div>
    </section>
  );
}
