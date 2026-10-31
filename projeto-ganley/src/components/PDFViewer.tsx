'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface PDFViewerProps {
  pdfUrl: string;
  trainingSlug: string;
  trainingId: string;
  initialPage?: number;
  onPageChange?: (page: number, total: number) => void;
  onLoadComplete?: (totalPages: number) => void;
}

export default function PDFViewer({
  pdfUrl,
  trainingSlug,
  trainingId,
  initialPage = 1,
  onPageChange,
  onLoadComplete,
}: PDFViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderTaskRef = useRef<any>(null);

  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [scale, setScale] = useState<number>(1.2);
  const [fitMode, setFitMode] = useState<'custom' | 'width' | 'auto'>('width');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [renderLoading, setRenderLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Initialize PDF.js
  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);
    setError(null);

    async function loadPdf() {
      try {
        const pdfjs = await import('pdfjs-dist');
        // Set worker source
        pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

        const loadingTask = pdfjs.getDocument({
          url: pdfUrl,
          cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
          cMapPacked: true,
          standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts/`,
        });

        const doc = await loadingTask.promise;

        if (!isCancelled) {
          setPdfDoc(doc);
          setTotalPages(doc.numPages);
          setIsLoading(false);

          const startPage = Math.min(Math.max(1, initialPage), doc.numPages);
          setCurrentPage(startPage);

          if (onLoadComplete) {
            onLoadComplete(doc.numPages);
          }
        }
      } catch (err: any) {
        console.error('Error loading PDF via PDF.js:', err);
        if (!isCancelled) {
          setError('Não foi possível renderizar este documento automaticamente.');
          setIsLoading(false);
        }
      }
    }

    loadPdf();

    return () => {
      isCancelled = true;
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch {
          // ignore
        }
      }
    };
  }, [pdfUrl, initialPage]);

  // Render current page
  const renderPage = useCallback(async (pageNum: number) => {
    if (!pdfDoc || !canvasRef.current || !containerRef.current) return;

    if (renderTaskRef.current) {
      try {
        renderTaskRef.current.cancel();
      } catch {
        // ignore
      }
    }

    try {
      setRenderLoading(true);
      const page = await pdfDoc.getPage(pageNum);
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d', { alpha: false });
      if (!context) return;

      const containerWidth = containerRef.current.clientWidth - 32; // padding
      const unscaledViewport = page.getViewport({ scale: 1 });

      let calculatedScale = scale;
      if (fitMode === 'width') {
        calculatedScale = Math.max(0.6, containerWidth / unscaledViewport.width);
      } else if (fitMode === 'auto') {
        const containerHeight = (containerRef.current.clientHeight || 700) - 40;
        const widthScale = containerWidth / unscaledViewport.width;
        const heightScale = containerHeight / unscaledViewport.height;
        calculatedScale = Math.min(widthScale, heightScale);
      }

      // Handle HiDPI displays (retina) for crisp text render
      const outputScale = window.devicePixelRatio || 1;
      const viewport = page.getViewport({ scale: calculatedScale });

      canvas.width = Math.floor(viewport.width * outputScale);
      canvas.height = Math.floor(viewport.height * outputScale);
      canvas.style.width = `${Math.floor(viewport.width)}px`;
      canvas.style.height = `${Math.floor(viewport.height)}px`;

      const transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;

      const renderContext = {
        canvasContext: context,
        transform: transform,
        viewport: viewport,
      };

      const renderTask = page.render(renderContext);
      renderTaskRef.current = renderTask;
      await renderTask.promise;

      setRenderLoading(false);

      // Save progress to server
      if (onPageChange && totalPages > 0) {
        onPageChange(pageNum, totalPages);
      }
    } catch (err: any) {
      if (err?.name !== 'RenderingCancelledException') {
        console.error('Error rendering page:', err);
      }
      setRenderLoading(false);
    }
  }, [pdfDoc, scale, fitMode, totalPages, onPageChange]);

  // Trigger render when page or scale changes
  useEffect(() => {
    if (pdfDoc && currentPage > 0) {
      renderPage(currentPage);
    }
  }, [pdfDoc, currentPage, scale, fitMode, renderPage]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        goToNextPage();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        goToPrevPage();
      } else if (e.key === '+' || (e.ctrlKey && e.key === '=')) {
        e.preventDefault();
        zoomIn();
      } else if (e.key === '-' || (e.ctrlKey && e.key === '-')) {
        e.preventDefault();
        zoomOut();
      } else if (e.key === '0' && e.ctrlKey) {
        e.preventDefault();
        setFitMode('width');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, totalPages, pdfDoc]);

  // Navigation handlers
  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const zoomIn = () => {
    setFitMode('custom');
    setScale((prev) => Math.min(prev + 0.2, 3.0));
  };

  const zoomOut = () => {
    setFitMode('custom');
    setScale((prev) => Math.max(prev - 0.2, 0.5));
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-col rounded-2xl overflow-hidden border border-white/10 bg-[#0B0912] shadow-2xl transition-all ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'w-full min-h-[600px] sm:min-h-[750px]'
      }`}
    >
      {/* Discrete Top Toolbar */}
      <div className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-2 px-3 sm:px-6 py-2.5 bg-[#0D0B16]/90 backdrop-blur-md border-b border-white/10">
        {/* Left: Page Navigation */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={goToPrevPage}
            disabled={currentPage <= 1 || isLoading}
            className="p-1.5 sm:p-2 rounded-lg text-ganley-gray hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            aria-label="Página anterior"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex items-center gap-1 text-xs sm:text-sm font-medium text-white px-2 py-1 rounded-md bg-white/5 border border-white/5">
            <input
              type="number"
              min={1}
              max={totalPages || 1}
              value={currentPage}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (!isNaN(val) && val >= 1 && val <= totalPages) {
                  setCurrentPage(val);
                }
              }}
              className="w-8 sm:w-10 text-center bg-transparent border-none outline-none font-bold text-white text-xs sm:text-sm"
            />
            <span className="text-ganley-gray-dark">/</span>
            <span className="text-ganley-gray">{totalPages || '—'}</span>
          </div>

          <button
            onClick={goToNextPage}
            disabled={currentPage >= totalPages || isLoading}
            className="p-1.5 sm:p-2 rounded-lg text-ganley-gray hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            aria-label="Próxima página"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Center / Right: Zoom & Layout Controls */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Zoom Out */}
          <button
            onClick={zoomOut}
            disabled={isLoading}
            className="p-1.5 sm:p-2 rounded-lg text-ganley-gray hover:text-white hover:bg-white/10 transition-all"
            title="Reduzir zoom (-)"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>

          {/* Fit to width */}
          <button
            onClick={() => {
              setFitMode('width');
            }}
            className={`px-2 py-1 rounded text-xs font-medium transition-all ${
              fitMode === 'width' ? 'bg-ganley-purple/30 text-ganley-purple-light border border-ganley-purple/40' : 'text-ganley-gray hover:text-white hover:bg-white/5'
            }`}
          >
            Ajustar
          </button>

          {/* Zoom In */}
          <button
            onClick={zoomIn}
            disabled={isLoading}
            className="p-1.5 sm:p-2 rounded-lg text-ganley-gray hover:text-white hover:bg-white/10 transition-all"
            title="Aumentar zoom (+)"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>

          <div className="h-4 w-[1px] bg-white/10 mx-1" />

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 sm:p-2 rounded-lg text-ganley-gray hover:text-white hover:bg-white/10 transition-all"
            title="Tela cheia"
          >
            {isFullscreen ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Main Canvas Document Area */}
      <div className="flex-1 overflow-auto flex items-center justify-center p-2 sm:p-6 bg-[#07060A] min-h-[500px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
            <div className="w-10 h-10 border-2 border-ganley-purple border-t-transparent rounded-full animate-spin" />
            <p className="text-ganley-gray text-sm font-medium">Carregando treinamento...</p>
            <p className="text-ganley-gray-dark text-xs">Preparando documento em alta definição</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center gap-4 py-20 text-center max-w-md px-4">
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-ganley-magenta">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-white font-medium text-sm">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-ghost text-xs px-4 py-2"
            >
              Tentar novamente
            </button>
          </div>
        ) : (
          <div className="relative shadow-2xl rounded-lg overflow-hidden bg-white max-w-full">
            {renderLoading && (
              <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px] flex items-center justify-center z-10 transition-opacity">
                <div className="w-6 h-6 border-2 border-ganley-purple border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            <canvas ref={canvasRef} className="block max-w-full h-auto mx-auto" />
          </div>
        )}
      </div>

      {/* Discrete Bottom Bar with Shortcuts guide */}
      <div className="px-4 py-2 bg-[#090810] border-t border-white/5 flex items-center justify-between text-[11px] text-ganley-gray-dark">
        <span className="hidden sm:inline">Use as setas ← e → do teclado para navegar</span>
        <span className="inline sm:hidden">Deslize ou toque nas setas para navegar</span>
        <span>PROJETO GANLEY</span>
      </div>
    </div>
  );
}
