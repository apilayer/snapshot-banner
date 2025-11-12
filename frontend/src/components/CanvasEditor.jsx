import { useRef, useEffect } from 'react';

export default function CanvasEditor({ state, setState, onExport, theme }) {
  const canvasRef = useRef(null);
  const dragStateRef = useRef({ dragging: false, startX: 0, startY: 0, imgStartX: 0, imgStartY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Set canvas size with device pixel ratio for sharp rendering
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(state.width * dpr);
    canvas.height = Math.round(state.height * dpr);
    
    // Scale to fit container
    const container = canvas.parentElement;
    const maxW = container.clientWidth - 2;
    const scale = Math.min(1, maxW / state.width);
    canvas.style.width = `${state.width * scale}px`;
    canvas.style.height = `${state.height * scale}px`;
    
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Draw
    ctx.clearRect(0, 0, state.width, state.height);
    ctx.fillStyle = state.bg;
    ctx.fillRect(0, 0, state.width, state.height);

    if (state.img && state.img.complete) {
      const imgW = state.img.naturalWidth;
      const imgH = state.img.naturalHeight;
      const s = state.scale;
      const drawW = imgW * s;
      const drawH = imgH * s;
      const x = (state.width - drawW) / 2 + state.offsetX;
      const y = (state.height - drawH) / 2 + state.offsetY;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(state.img, x, y, drawW, drawH);
    }
  }, [state]);

  const getCanvasCoords = (ev) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = ((ev.clientX - rect.left) / rect.width) * state.width;
    const y = ((ev.clientY - rect.top) / rect.height) * state.height;
    return { x, y };
  };

  const handleMouseDown = (e) => {
    if (!state.img) return;
    const p = getCanvasCoords(e);
    dragStateRef.current = {
      dragging: true,
      startX: p.x,
      startY: p.y,
      imgStartX: state.offsetX,
      imgStartY: state.offsetY
    };
  };

  const handleMouseMove = (e) => {
    if (!dragStateRef.current.dragging) return;
    const p = getCanvasCoords(e);
    const dragState = dragStateRef.current;
    setState(prev => ({
      ...prev,
      offsetX: dragState.imgStartX + (p.x - dragState.startX),
      offsetY: dragState.imgStartY + (p.y - dragState.startY)
    }));
  };

  const handleMouseUp = () => {
    dragStateRef.current.dragging = false;
  };

  const handleWheel = (e) => {
    if (!state.img) return;
    e.preventDefault();
    
    const delta = -Math.sign(e.deltaY) * 0.05;
    const prevScale = state.scale;
    const nextScale = Math.max(0.25, Math.min(5, prevScale + delta));
    
    // Zoom around cursor
    const p = getCanvasCoords(e);
    const imgW = state.img.naturalWidth * prevScale;
    const imgH = state.img.naturalHeight * prevScale;
    const imgX = (state.width - imgW) / 2 + state.offsetX;
    const imgY = (state.height - imgH) / 2 + state.offsetY;
    const relX = (p.x - imgX) / imgW;
    const relY = (p.y - imgY) / imgH;
    
    const newImgW = state.img.naturalWidth * nextScale;
    const newImgH = state.img.naturalHeight * nextScale;
    const newImgX = p.x - relX * newImgW;
    const newImgY = p.y - relY * newImgH;
    
    setState(prev => ({
      ...prev,
      scale: nextScale,
      offsetX: newImgX - (state.width - newImgW) / 2,
      offsetY: newImgY - (state.height - newImgH) / 2
    }));
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [state]);

  const handleResetView = () => {
    if (!state.img) return;
    setState(prev => ({ ...prev, scale: 1, offsetX: 0, offsetY: 0 }));
  };

  const handleCopy = async () => {
    try {
      const blob = await onExport();
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob })
      ]);
      showToast('Copied banner to clipboard');
    } catch (e) {
      showToast('Copy failed, downloading instead');
      const blob = await onExport();
      downloadBlob(blob);
    }
  };

  const handleDownload = async () => {
    const blob = await onExport();
    downloadBlob(blob);
  };

  const downloadBlob = (blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const suffix = state.retina ? '@2x' : '';
    a.href = url;
    a.download = `banner-${state.width}x${state.height}${suffix}.${state.format === 'webp' ? 'webp' : 'png'}`;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    a.remove();
  };

  const showToast = (message) => {
    // Toast implementation would go here
    alert(message);
  };

  const exportLabel = `Export: ${state.width * (state.retina ? 2 : 1)} × ${state.height * (state.retina ? 2 : 1)} (${state.format.toUpperCase()})`;

  return (
    <div className="lg:col-span-8">
      <div className={`rounded-xl ring-1 p-4 sm:p-5 ${
        theme === 'dark' ? 'bg-white/[0.02] ring-white/10' : 'bg-white ring-slate-300'
      }`}>
        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-2 text-xs ${
            theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
          }`}>
            <span className={`inline-flex items-center gap-1 rounded-md px-2 py-1 ring-1 ${
              theme === 'dark' ? 'bg-white/5 ring-white/10' : 'bg-slate-100 ring-slate-300'
            }`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="4" width="18" height="14" rx="2"/>
                <path d="M7 8h10M7 12h6"/>
              </svg>
              <span>{state.width} × {state.height}</span>
            </span>
            {state.retina && (
              <span className={`hidden sm:inline-flex items-center gap-1 rounded-md px-2 py-1 ring-1 ${
                theme === 'dark'
                  ? 'bg-indigo-500/10 text-indigo-200 ring-indigo-400/20'
                  : 'bg-indigo-100 text-indigo-700 ring-indigo-300'
              }`}>
                @2x
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleResetView} className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs ring-1 transition ${
              theme === 'dark'
                ? 'bg-white/[0.03] text-slate-200 ring-white/10 hover:bg-white/[0.06] hover:ring-white/20'
                : 'bg-slate-100 text-slate-700 ring-slate-300 hover:bg-slate-200 hover:ring-slate-400'
            }`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 12a9 9 0 1 0 9-9"/>
                <path d="M3 3v6h6"/>
              </svg>
              Reset view
            </button>
          </div>
        </div>

        {/* Preview Surface */}
        <div className={`mt-4 rounded-lg border p-3 ${
          theme === 'dark'
            ? 'border-white/10 bg-[linear-gradient(to_bottom_right,rgba(255,255,255,0.04),rgba(255,255,255,0.02))]'
            : 'border-slate-300 bg-slate-50'
        }`}>
          <div className="relative isolate mx-auto max-w-full overflow-hidden rounded-md bg-[url('data:image/svg+xml,%3Csvg width=%2716%27 height=%2716%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cpath d=%27M0 0h8v8H0zM8 8h8v8H8z%27 fill=%27%230f1629%27/%3E%3C/svg%3E')] ring-1 ring-white/10">
            <canvas 
              ref={canvasRef}
              className="block w-full h-auto cursor-move"
              onMouseDown={handleMouseDown}
              onWheel={handleWheel}
            />

            {/* Help hint */}
            <div className="pointer-events-none absolute bottom-3 left-3">
              <div className="inline-flex items-center gap-1.5 rounded-md bg-black/40 px-2.5 py-1 text-[11px] text-slate-200 ring-1 ring-white/10 backdrop-blur">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M8 21h8M12 17v4M7 8v4a5 5 0 1 0 10 0V8a5 5 0 1 0-10 0Z"/>
                </svg>
                Drag to reposition • Scroll to zoom
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className={`flex items-center gap-2 text-xs ${
            theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
          }`}>
            <div className={`inline-flex items-center gap-1 rounded-md px-2 py-1 ring-1 ${
              theme === 'dark' ? 'bg-white/[0.03] ring-white/10' : 'bg-slate-100 ring-slate-300'
            }`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 4h16v16H4zM9 4v16M4 9h16"/>
              </svg>
              <span>{exportLabel}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleCopy} className={`inline-flex items-center gap-2 rounded-md px-3.5 py-2 text-sm ring-1 transition ${
              theme === 'dark'
                ? 'bg-white/[0.03] text-slate-200 ring-white/10 hover:bg-white/[0.06] hover:ring-white/20'
                : 'bg-slate-100 text-slate-700 ring-slate-300 hover:bg-slate-200 hover:ring-slate-400'
            }`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="9" y="9" width="13" height="13" rx="2"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
              Copy
            </button>
            <button onClick={handleDownload} className="inline-flex items-center gap-2 rounded-md bg-indigo-500/90 px-4 py-2.5 text-sm font-medium text-white ring-1 ring-indigo-400/60 hover:bg-indigo-400/90 hover:ring-indigo-300 transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14"/>
              </svg>
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
