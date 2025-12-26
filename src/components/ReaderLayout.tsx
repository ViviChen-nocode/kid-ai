import { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { storage } from '@/lib/storage';
import { Menu, X, ZoomIn, ZoomOut, Maximize2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Sidebar from './Sidebar';
import MobileMenu from './MobileMenu';
import FlipbookReader from './FlipbookReader';
import QuizModal from './QuizModal';
import WorksheetModal from './WorksheetModal';
import AboutModal from './AboutModal';

interface ReaderLayoutProps {
  userName: string;
  onReset: () => void;
}

const ReaderLayout = ({ userName, onReset }: ReaderLayoutProps) => {
  const isMobile = useIsMobile();
  const [currentPage, setCurrentPage] = useState(() => storage.getLastPage());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true); // Default open on desktop
  const [quizOpen, setQuizOpen] = useState(false);
  const [worksheetOpen, setWorksheetOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Reset zoom and position when page changes
  useEffect(() => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }, [currentPage]);

  // Zoom controls
  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleZoomReset = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleNavigate = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <>
          {/* Sidebar Container - Pushes content */}
          <div
            className={`relative h-screen transition-all duration-300 ease-in-out flex-shrink-0 overflow-hidden ${
              sidebarOpen ? 'w-72' : 'w-0'
            }`}
          >
            <div className="absolute top-0 left-0 h-full w-72">
              <Sidebar
                userName={userName}
                currentPage={currentPage}
                onNavigate={(page) => {
                  handleNavigate(page);
                }}
                onOpenQuiz={() => {
                  setQuizOpen(true);
                }}
                onOpenWorksheet={() => {
                  setWorksheetOpen(true);
                }}
                onOpenAbout={() => {
                  setAboutOpen(true);
                }}
                onReset={onReset}
              />
            </div>
          </div>

          {/* Sidebar Toggle Button - Tab style */}
          <button
            className={`fixed top-0 z-50 gradient-primary border-r border-primary/30 shadow-lg transition-all duration-300 ease-in-out rounded-r-lg hover:opacity-90 group ${
              sidebarOpen ? 'left-72' : 'left-0'
            }`}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? '收合選單' : '展開選單'}
            style={{
              width: '24px',
              height: '88px', // Match header block height (p-6 padding top/bottom = 24px each, content ~40px)
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {sidebarOpen ? (
              <ChevronLeft className="w-4 h-4 text-white transition-transform" />
            ) : (
              <ChevronRight className="w-4 h-4 text-white transition-transform" />
            )}
          </button>
        </>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Mobile Header */}
        {isMobile && (
          <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 relative">
            <MobileMenu
              userName={userName}
              currentPage={currentPage}
              isOpen={mobileMenuOpen}
              onOpenChange={setMobileMenuOpen}
              onNavigate={handleNavigate}
              onOpenQuiz={() => setQuizOpen(true)}
              onOpenWorksheet={() => setWorksheetOpen(true)}
              onOpenAbout={() => setAboutOpen(true)}
              onReset={onReset}
            />
            <h1 className="font-display font-bold text-lg text-gradient absolute left-1/2 -translate-x-1/2">
              和你一起學 AI
            </h1>
            <div className="w-10"></div>
          </header>
        )}

        {/* Desktop Header - Minimal */}
        {!isMobile && (
          <header className="h-10 bg-transparent flex items-center justify-between px-4">
            <div className="flex-1"></div>
            <h1 className="font-display font-bold text-xl text-gradient flex-1 text-center">
              和你一起學 AI
            </h1>
            <div className="flex-1 flex justify-end items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full bg-card/80 backdrop-blur-sm shadow-soft hover:shadow-card"
                onClick={handleZoomOut}
                disabled={zoom <= 0.5}
                aria-label="縮小"
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-3 rounded-full bg-card/80 backdrop-blur-sm shadow-soft hover:shadow-card text-xs"
                onClick={handleZoomReset}
                aria-label="重置縮放"
              >
                <Maximize2 className="w-3 h-3 mr-1.5" />
                <span className="text-xs">{Math.round(zoom * 100)}%</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full bg-card/80 backdrop-blur-sm shadow-soft hover:shadow-card"
                onClick={handleZoomIn}
                disabled={zoom >= 3}
                aria-label="放大"
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
            </div>
          </header>
        )}

        {/* Flipbook */}
        <FlipbookReader
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          zoom={zoom}
          setZoom={setZoom}
          position={position}
          setPosition={setPosition}
        />
      </main>

      {/* Modals */}
      <QuizModal
        isOpen={quizOpen}
        onClose={() => setQuizOpen(false)}
        userName={userName}
      />

      <WorksheetModal
        isOpen={worksheetOpen}
        onClose={() => setWorksheetOpen(false)}
        userName={userName}
      />

      <AboutModal
        isOpen={aboutOpen}
        onClose={() => setAboutOpen(false)}
      />
    </div>
  );
};

export default ReaderLayout;
