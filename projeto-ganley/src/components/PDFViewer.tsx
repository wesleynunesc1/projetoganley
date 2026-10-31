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
  const [scale, setScale] = useState<number>(1.25);
  const [fitMode, setFitMode] = useState<'width' | 'custom'>('width');
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

  // Render Page to Canvas
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

      // Available container width
      const containerWidth = containerRef.current.clientWidth;
      const horizontalPadding = window.innerWidth < 640 ? 12 : 36;
      const targetWidth = Math.max(280, containerWidth - horizontalPadding);

      const unscaledViewport = page.getViewport({ scale: 1 });

      let currentScale = scale;
      if (fitMode === 'width') {
        currentScale = targetWidth / unscaledViewport.width;
      }

      const outputScale = window.devicePixelRatio || 1;
      const viewport = page.getViewport({ scale: currentScale });

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

  useEffect(() => {
    if (pdfDoc && currentPage > 0) {
      renderPage(currentPage);
    }
  }, [pdfDoc, currentPage, scale, fitMode, renderPage]);

  // Keyboard navigation
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        goToNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        goToPrev();
      } else if (e.key === '+' || (e.ctrlKey && e.key === '=')) {
        e.preventDefault();
        zoomIn();
      } else if (e.key === '-' || (e.ctrlKey && e.key === '-')) {
        e.preventDefault();
        zoomOut();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [currentPage, totalPages, pdfDoc]);

  const goToPrev = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  const goToNext = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  const zoomIn = () => {
    setFitMode('custom');
    setScale((prev) => Math.min(prev + 0.2, 2.8));
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
      className={`relative flex flex-col rounded-3xl overflow-hidden bg-[#0A0812] border border-white/[0.08] shadow-2xl transition-all ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'w-full min-h-[620px] sm:min-h-[820px]'
      }`}
    >
      {/* Editorial Glass Toolbar */}
      <div className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3 bg-[#0C0A14]/90 backdrop-blur-xl border-b border-white/[0.07]">
        {/* Page Nav */}
        <div className="flex items-center gap-2">
          <button
            onClick={goToPrev}
            disabled={currentPage <= 1 || isLoading}
            className="p-2 rounded-xl text-ganley-gray hover:text-white hover:bg-white/[0.06] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            aria-label="Página anterior"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/[0.05] border border-white/[0.08] text-xs sm:text-sm font-sans font-medium text-white">
            <span>Página</span>
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
              className="w-7 sm:w-8 text-center bg-transparent border-none outline-none font-bold text-white text-xs sm:text-sm p-0"
            />
            <span className="text-ganley-gray-dark">/</span>
            <span className="text-ganley-gray">{totalPages || '—'}</span>
          </div>

          <button
            onClick={goToNext}
            disabled={currentPage >= totalPages || isLoading}
            className="p-2 rounded-xl text-ganley-gray hover:text-white hover:bg-white/[0.06] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            aria-label="Próxima página"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* View & Zoom Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={zoomOut}
            disabled={isLoading}
            className="p-2 rounded-xl text-ganley-gray hover:text-white hover:bg-white/[0.06] transition-all"
            title="Diminuir Zoom (-)"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>

          <button
            onClick={() => setFitMode('width')}
            className={`px-3 py-1.5 rounded-xl text-xs font-sans font-medium transition-all ${
              fitMode === 'width'
                ? 'bg-ganley-purple/20 text-ganley-purple-light border border-ganley-purple/30'
                : 'text-ganley-gray hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            Ajustar
          </button>

          <button
            onClick={zoomIn}
            disabled={isLoading}
            className="p-2 rounded-xl text-ganley-gray hover:text-white hover:bg-white/[0.06] transition-all"
            title="Aumentar Zoom (+)"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>

          <div className="h-4 w-[1px] bg-white/[0.1] mx-1" />

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl text-ganley-gray hover:text-white hover:bg-white/[0.06] transition-all"
            title="Modo Tela Cheia"
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

      {/* Main Document Reading Canvas */}
      <div className="flex-1 overflow-auto flex items-center justify-center p-2 sm:p-6 bg-[#06050A] min-h-[520px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
            <div className="w-9 h-9 border-2 border-ganley-purple border-t-transparent rounded-full animate-spin" />
            <p className="text-white text-sm font-sans font-medium mt-2">Carregando treinamento...</p>
            <p className="text-ganley-gray text-xs">Renderizando documento em alta definição</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-center max-w-sm px-4">
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-ganley-magenta mb-2">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-white font-medium text-sm">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-glass text-xs px-4 py-2 mt-2"
            >
              Recarregar documento
            </button>
          </div>
        ) : (
          <div className="relative shadow-2xl rounded-xl overflow-hidden bg-white max-w-full">
            {renderLoading && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center z-10 transition-opacity">
                <div className="w-6 h-6 border-2 border-ganley-purple border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            <canvas ref={canvasRef} className="block max-w-full h-auto mx-auto" />
          </div>
        )}
      </div>

      {/* Discrete Bottom Status Bar */}
      <div className="px-4 py-2 bg-[#0A0812] border-t border-white/[0.05] flex items-center justify-between text-[11px] text-ganley-gray-dark font-sans">
        <span className="hidden sm:inline">Navegação rápida: utilize as setas ← e → do teclado</span>
        <span className="inline sm:hidden">Toque nas setas para folhear as páginas</span>
        <span className="font-semibold text-ganley-gray">PROJETO GANLEY</span>
      </div>
    </div>
  );
}
