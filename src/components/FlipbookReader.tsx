import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TOTAL_PAGES } from '@/lib/chapters';
import { storage } from '@/lib/storage';
import { useIsMobile } from '@/hooks/use-mobile';
import coverIllustration from '@/assets/cover-illustration.png';

interface FlipbookReaderProps {
  currentPage: number;
  onPageChange: (page: number) => void;
}

const FlipbookReader = ({ currentPage, onPageChange }: FlipbookReaderProps) => {
  const isMobile = useIsMobile();
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'left' | 'right' | null>(null);

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
      const newPage = currentPage <= 2 ? 1 : currentPage - 2;
      goToPage(newPage, 'right');
    }
  }, [currentPage, isMobile, goToPage]);

  const goToNextPage = useCallback(() => {
    if (isMobile) {
      goToPage(currentPage + 1, 'left');
    } else {
      // Desktop: go forward 2 pages for spread view
      const newPage = currentPage >= TOTAL_PAGES - 1 ? TOTAL_PAGES : currentPage + 2;
      goToPage(newPage, 'left');
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

  // Generate placeholder page content
  const renderPage = (pageNum: number) => {
    const isFirstPage = pageNum === 1;
    const isLastPage = pageNum === TOTAL_PAGES;

    return (
      <div
        className={`relative bg-card rounded-lg shadow-card overflow-hidden transition-transform duration-300
          ${flipDirection === 'left' && !isMobile ? 'animate-page-flip-left' : ''}
          ${flipDirection === 'right' && !isMobile ? 'animate-page-flip-right' : ''}
        `}
        style={{
          aspectRatio: '210 / 297', // A4 ratio
        }}
      >
        {/* Page content placeholder - will be replaced with actual images */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-peach to-card">
          {isFirstPage && (
            <div className="text-center">
              <img 
                src={coverIllustration} 
                alt="封面" 
                className="w-32 h-32 object-cover rounded-2xl mx-auto mb-4 shadow-soft"
              />
              <h2 className="text-2xl font-display font-bold text-gradient mb-2">
                和你一起學 AI
              </h2>
              <p className="text-muted-foreground text-sm">
                國小生生成式AI學習應用手冊
              </p>
            </div>
          )}
          {isLastPage && (
            <div className="text-center">
              <div className="text-6xl mb-4">🌟</div>
              <h2 className="text-xl font-display font-bold mb-2">
                恭喜你讀完了！
              </h2>
              <p className="text-muted-foreground text-sm">
                希望你學到了很多關於 AI 的知識！
              </p>
            </div>
          )}
          {!isFirstPage && !isLastPage && (
            <div className="text-center w-full h-full flex flex-col items-center justify-center">
              <div className="w-full h-full min-h-[200px] bg-muted/30 rounded-lg flex items-center justify-center border-2 border-dashed border-muted-foreground/20">
                <div className="text-center">
                  <div className="text-4xl mb-2 opacity-50">📄</div>
                  <span className="text-muted-foreground text-sm">
                    第 {pageNum} 頁
                  </span>
                  <p className="text-xs text-muted-foreground/60 mt-1">
                    (等待載入圖片)
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Page number */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-foreground/10 rounded-full px-3 py-1">
          <span className="text-xs font-medium text-foreground/70">
            {pageNum}
          </span>
        </div>
      </div>
    );
  };

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === TOTAL_PAGES;
  const isCoverOrBack = isFirstPage || isLastPage;

  // Calculate which pages to show in desktop spread view
  const leftPage = currentPage % 2 === 0 ? currentPage : currentPage;
  const rightPage = currentPage % 2 === 0 ? currentPage + 1 : currentPage + 1;

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
      {/* Book container */}
      <div className={`relative w-full max-w-5xl ${isMobile ? 'max-w-md' : ''}`}>
        {/* Pages */}
        <div className={`flex ${isCoverOrBack && !isMobile ? 'justify-center' : 'justify-center gap-1'}`}>
          {isMobile ? (
            // Mobile: Single page view
            <div className="w-full max-w-sm">
              {renderPage(currentPage)}
            </div>
          ) : isCoverOrBack ? (
            // Desktop: Single page for cover/back
            <div className="w-1/2 max-w-md">
              {renderPage(currentPage)}
            </div>
          ) : (
            // Desktop: Spread view (two pages)
            <>
              <div className="w-1/2 transform origin-right">
                {renderPage(leftPage)}
              </div>
              {rightPage <= TOTAL_PAGES && (
                <div className="w-1/2 transform origin-left">
                  {renderPage(rightPage)}
                </div>
              )}
            </>
          )}
        </div>

        {/* Navigation buttons */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-16 h-12 w-12 rounded-full bg-card shadow-soft hover:shadow-card disabled:opacity-30"
          onClick={goToPrevPage}
          disabled={currentPage === 1}
          aria-label="上一頁"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-16 h-12 w-12 rounded-full bg-card shadow-soft hover:shadow-card disabled:opacity-30"
          onClick={goToNextPage}
          disabled={currentPage === TOTAL_PAGES}
          aria-label="下一頁"
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>

      {/* Page indicator */}
      <div className="mt-6 flex items-center gap-4">
        <span className="text-sm text-muted-foreground">
          {currentPage} / {TOTAL_PAGES}
        </span>
        <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full gradient-primary rounded-full transition-all duration-300"
            style={{ width: `${(currentPage / TOTAL_PAGES) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default FlipbookReader;
