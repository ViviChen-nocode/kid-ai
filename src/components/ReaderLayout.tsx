import { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { storage } from '@/lib/storage';
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
        <Sidebar
          userName={userName}
          currentPage={currentPage}
          onNavigate={handleNavigate}
          onOpenQuiz={() => setQuizOpen(true)}
          onOpenWorksheet={() => setWorksheetOpen(true)}
          onOpenAbout={() => setAboutOpen(true)}
        />
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
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Mobile Header */}
        {isMobile && (
          <header className="h-16 bg-card border-b border-border flex items-center justify-center px-16">
            <h1 className="font-display font-bold text-lg text-gradient">
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
