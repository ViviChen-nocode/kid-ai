import { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { storage } from '@/lib/storage';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Sidebar from './Sidebar';
import MobileMenu from './MobileMenu';
import FlipbookReader from './FlipbookReader';
import QuizModal from './QuizModal';
import WorksheetModal from './WorksheetModal';
import AboutModal from './AboutModal';

interface ReaderLayoutProps {
  userName: string;
}

const ReaderLayout = ({ userName }: ReaderLayoutProps) => {
  const isMobile = useIsMobile();
  const [currentPage, setCurrentPage] = useState(() => storage.getLastPage());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Default collapsed
  const [quizOpen, setQuizOpen] = useState(false);
  const [worksheetOpen, setWorksheetOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  const handleNavigate = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <>
          {/* Sidebar Toggle Button - Always visible */}
          <Button
            variant="ghost"
            size="icon"
            className={`fixed top-4 left-4 z-50 bg-card shadow-soft rounded-full transition-all duration-300 ${
              sidebarOpen ? 'left-[296px]' : 'left-4'
            }`}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? '收合選單' : '展開選單'}
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>

          {/* Sidebar with slide animation */}
          <div
            className={`fixed top-0 left-0 h-full z-40 transition-transform duration-300 ease-in-out ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <Sidebar
              userName={userName}
              currentPage={currentPage}
              onNavigate={(page) => {
                handleNavigate(page);
                setSidebarOpen(false);
              }}
              onOpenQuiz={() => {
                setQuizOpen(true);
                setSidebarOpen(false);
              }}
              onOpenWorksheet={() => {
                setWorksheetOpen(true);
                setSidebarOpen(false);
              }}
              onOpenAbout={() => {
                setAboutOpen(true);
                setSidebarOpen(false);
              }}
            />
          </div>

          {/* Overlay when sidebar is open */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-foreground/20 z-30 transition-opacity"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </>
      )}

      {/* Mobile Menu */}
      {isMobile && (
        <MobileMenu
          userName={userName}
          currentPage={currentPage}
          isOpen={mobileMenuOpen}
          onOpenChange={setMobileMenuOpen}
          onNavigate={handleNavigate}
          onOpenQuiz={() => setQuizOpen(true)}
          onOpenWorksheet={() => setWorksheetOpen(true)}
          onOpenAbout={() => setAboutOpen(true)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen w-full">
        {/* Mobile Header */}
        {isMobile && (
          <header className="h-16 bg-card border-b border-border flex items-center justify-center px-16">
            <h1 className="font-display font-bold text-lg text-gradient">
              和你一起學 AI
            </h1>
          </header>
        )}

        {/* Desktop Header - Minimal */}
        {!isMobile && (
          <header className="h-16 bg-transparent flex items-center justify-center">
            <h1 className="font-display font-bold text-xl text-gradient">
              和你一起學 AI
            </h1>
          </header>
        )}

        {/* Flipbook */}
        <FlipbookReader
          currentPage={currentPage}
          onPageChange={setCurrentPage}
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
