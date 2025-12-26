import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TOTAL_PAGES } from '@/lib/chapters';
import { storage } from '@/lib/storage';
import { useIsMobile } from '@/hooks/use-mobile';

// Get image path for a page number
const getPageImagePath = (pageNum: number) => {
  return `/pages/edu-${pageNum.toString().padStart(2, '0')}.png`;
};

// Separate component for rendering a page (hooks must be at top level)
interface PageProps {
  pageNum: number;
  shouldFlip: boolean;
  flipDirection: 'left' | 'right' | null;
  isMobile: boolean;
  onClick?: () => void;
  isVisible?: boolean; // Whether this page is currently visible
}

const Page = ({ pageNum, shouldFlip, flipDirection, isMobile, onClick, isVisible = false }: PageProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className={`relative bg-card rounded-lg shadow-card overflow-hidden transition-transform duration-300 ${onClick ? 'cursor-pointer' : ''}
        ${shouldFlip && flipDirection === 'left' && !isMobile ? 'animate-page-flip-left' : ''}
        ${shouldFlip && flipDirection === 'right' && !isMobile ? 'animate-page-flip-right' : ''}
      `}
      style={{
        aspectRatio: '210 / 297', // A4 ratio
      }}
      onClick={onClick}
    >
      {/* Page image */}
      <img
        src={getPageImagePath(pageNum)}
        alt={`第 ${pageNum} 頁`}
        className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-300 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageError(true)}
        loading={isVisible ? "eager" : "lazy"}
      />

      {/* Loading placeholder */}
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-peach to-card">
          <div className="animate-pulse text-center">
            <div className="text-4xl mb-2">📖</div>
            <span className="text-muted-foreground text-sm">
              載入中...
            </span>
          </div>
        </div>
      )}

      {/* Error placeholder */}
      {imageError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-peach to-card">
          <div className="text-center">
            <div className="text-4xl mb-2 opacity-50">📄</div>
            <span className="text-muted-foreground text-sm">
              第 {pageNum} 頁
            </span>
            <p className="text-xs text-muted-foreground/60 mt-1">
              (圖片尚未上傳)
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

interface FlipbookReaderProps {
  currentPage: number;
  onPageChange: (page: number) => void;
  zoom: number;
  setZoom: (zoom: number | ((prev: number) => number)) => void;
  position: { x: number; y: number };
  setPosition: (position: { x: number; y: number } | ((prev: { x: number; y: number }) => { x: number; y: number })) => void;
}

const FlipbookReader = ({ currentPage, onPageChange, zoom, setZoom, position, setPosition }: FlipbookReaderProps) => {
  const isMobile = useIsMobile();
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'left' | 'right' | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hasDragged, setHasDragged] = useState(false);

  // Save last page to localStorage
  useEffect(() => {
    storage.setLastPage(currentPage);
  }, [currentPage]);

  const goToPage = useCallback((page: number, direction: 'left' | 'right') => {
    if (page < 1 || page > TOTAL_PAGES || isFlipping) return;
    
    setFlipDirection(direction);
    setIsFlipping(true);
    
    setTimeout(() => {
      onPageChange(page);
      setIsFlipping(false);
      setFlipDirection(null);
    }, 300);
  }, [isFlipping, onPageChange]);

  const goToPrevPage = useCallback(() => {
    if (isMobile) {
      goToPage(currentPage - 1, 'right');
    } else {
      // Desktop: go back 2 pages for spread view
      // When going back, right page flips left (away)
      const newPage = currentPage <= 2 ? 1 : currentPage - 2;
      goToPage(newPage, 'left');
    }
  }, [currentPage, isMobile, goToPage]);

  const goToNextPage = useCallback(() => {
    if (isMobile) {
      goToPage(currentPage + 1, 'left');
    } else {
      // Desktop: go forward 2 pages for spread view
      // When going forward, left page flips right (away)
      const newPage = currentPage >= TOTAL_PAGES - 1 ? TOTAL_PAGES : currentPage + 2;
      goToPage(newPage, 'right');
    }
  }, [currentPage, isMobile, goToPage]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPrevPage();
      if (e.key === 'ArrowRight') goToNextPage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToPrevPage, goToNextPage]);

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === TOTAL_PAGES;
  const isCoverOrBack = isFirstPage || isLastPage;

  // Calculate which pages to show in desktop spread view
  // For a book spread: left page should be even, right page should be odd
  // So: pages 2-3, 4-5, 6-7, etc.
  // If currentPage is even, we show currentPage and currentPage+1
  // If currentPage is odd (except 1), we show currentPage-1 and currentPage
  const leftPage = currentPage % 2 === 0 ? currentPage : currentPage - 1;
  const rightPage = currentPage % 2 === 0 ? currentPage + 1 : currentPage;


  // Pan/Drag handlers for zoomed pages
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      setHasDragged(false);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  }, [zoom, position]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging && zoom > 1) {
      setHasDragged(true);
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  }, [isDragging, zoom, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setHasDragged(false);
  }, []);

  // Touch handlers for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (zoom > 1 && e.touches.length === 1) {
      setIsDragging(true);
      setHasDragged(false);
      setDragStart({ 
        x: e.touches[0].clientX - position.x, 
        y: e.touches[0].clientY - position.y 
      });
    }
  }, [zoom, position]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (isDragging && zoom > 1 && e.touches.length === 1) {
      e.preventDefault();
      setHasDragged(true);
      setPosition({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y,
      });
    }
  }, [isDragging, zoom, dragStart]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    setHasDragged(false);
  }, []);

  // Add/remove event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleTouchEnd);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  // Reset position when zoom changes to <= 1
  useEffect(() => {
    if (zoom <= 1) {
      setPosition({ x: 0, y: 0 });
    }
  }, [zoom, setPosition]);

  // Preload adjacent pages for smoother navigation
  useEffect(() => {
    const preloadPages = () => {
      const pagesToPreload: number[] = [];
      
      if (isMobile) {
        // Mobile: preload next and previous page
        if (currentPage > 1) pagesToPreload.push(currentPage - 1);
        if (currentPage < TOTAL_PAGES) pagesToPreload.push(currentPage + 1);
      } else {
        // Desktop: preload pages around the current spread view
        const leftPage = currentPage % 2 === 0 ? currentPage : currentPage - 1;
        const rightPage = currentPage % 2 === 0 ? currentPage + 1 : currentPage;
        
        // Preload 2 pages before and after the spread
        if (leftPage > 2) {
          pagesToPreload.push(leftPage - 2);
          pagesToPreload.push(leftPage - 1);
        }
        if (rightPage < TOTAL_PAGES - 1) {
          pagesToPreload.push(rightPage + 1);
          pagesToPreload.push(rightPage + 2);
        }
      }

      // Preload images
      pagesToPreload.forEach((pageNum) => {
        if (pageNum >= 1 && pageNum <= TOTAL_PAGES) {
          const img = new Image();
          img.src = getPageImagePath(pageNum);
        }
      });
    };

    // Delay preloading slightly to prioritize current page
    const timeoutId = setTimeout(preloadPages, 300);
    return () => clearTimeout(timeoutId);
  }, [currentPage, isMobile]);

  return (
    <div className="flex-1 flex flex-col items-center px-4 md:px-2 pt-0 md:pt-0 pb-4 md:pb-2 relative">
      {/* Navigation buttons - outside zoom container, always visible */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-0 top-1/2 -translate-y-1/2 h-14 w-14 rounded-full bg-card/90 backdrop-blur-sm shadow-lg hover:shadow-xl hover:bg-card border-2 border-border disabled:opacity-30 z-30 transition-all"
        onClick={(e) => {
          e.stopPropagation();
          goToPrevPage();
        }}
        disabled={currentPage === 1}
        aria-label="上一頁"
      >
        <ChevronLeft className="w-8 h-8" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-0 top-1/2 -translate-y-1/2 h-14 w-14 rounded-full bg-card/90 backdrop-blur-sm shadow-lg hover:shadow-xl hover:bg-card border-2 border-border disabled:opacity-30 z-30 transition-all"
        onClick={(e) => {
          e.stopPropagation();
          goToNextPage();
        }}
        disabled={currentPage === TOTAL_PAGES}
        aria-label="下一頁"
      >
        <ChevronRight className="w-8 h-8" />
      </Button>

      {/* Book container with pan/drag support */}
      <div className="flex-1 w-full overflow-hidden flex items-center justify-center">
        <div className={`relative w-full max-w-[950px] ${isMobile ? 'max-w-md' : ''} flex items-center justify-center`}>
          {/* Pages container with zoom and pan */}
          <div 
            className={`flex ${isCoverOrBack && !isMobile ? 'justify-center' : 'justify-center gap-1'} w-full transition-transform duration-300 origin-center ${zoom > 1 ? 'cursor-move' : ''}`}
            style={{ 
              transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
            }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          >
          {isMobile ? (
            // Mobile: Single page view
            <div className="w-full max-w-sm">
              <Page 
                pageNum={currentPage} 
                shouldFlip={!!flipDirection}
                flipDirection={flipDirection} 
                isMobile={isMobile}
                isVisible={true}
              />
            </div>
          ) : isCoverOrBack ? (
            // Desktop: Single page for cover/back
            <div className="w-1/2">
              <Page 
                pageNum={currentPage} 
                shouldFlip={!!flipDirection}
                flipDirection={flipDirection} 
                isMobile={isMobile}
                onClick={zoom <= 1 ? (currentPage === 1 ? goToNextPage : goToPrevPage) : undefined}
                isVisible={true}
              />
            </div>
          ) : (
            // Desktop: Spread view (two pages)
            <>
              <div className="w-1/2 transform origin-right">
                <Page 
                  pageNum={leftPage} 
                  shouldFlip={flipDirection === 'left'} // Left page flips when going back
                  flipDirection={flipDirection === 'left' ? 'right' : null} // But flip direction is reversed
                  isMobile={isMobile} 
                  onClick={zoom <= 1 ? goToPrevPage : undefined}
                  isVisible={true}
                />
              </div>
              {rightPage <= TOTAL_PAGES && (
                <div className="w-1/2 transform origin-left">
                  <Page 
                    pageNum={rightPage} 
                    shouldFlip={flipDirection === 'right'} // Right page flips when going forward
                    flipDirection={flipDirection === 'right' ? 'left' : null} // But flip direction is reversed
                    isMobile={isMobile} 
                    onClick={zoom <= 1 ? goToNextPage : undefined}
                    isVisible={true}
                  />
                </div>
              )}
            </>
          )}
        </div>
        </div>
      </div>

    </div>
  );
};

export default FlipbookReader;
