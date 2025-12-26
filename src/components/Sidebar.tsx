import { Book, HelpCircle, FileText, User, ChevronRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { chapters } from '@/lib/chapters';
import { ScrollArea } from '@/components/ui/scroll-area';
import { storage } from '@/lib/storage';

interface SidebarProps {
  userName: string;
  currentPage: number;
  onNavigate: (page: number) => void;
  onOpenQuiz: () => void;
  onOpenWorksheet: () => void;
  onOpenAbout: () => void;
}

const Sidebar = ({
  userName,
  currentPage,
  onNavigate,
  onOpenQuiz,
  onOpenWorksheet,
  onOpenAbout,
}: SidebarProps) => {
  return (
    <aside className="w-72 h-full bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">
              {userName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">歡迎回來</p>
            <p className="font-bold text-foreground">{userName}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        {/* Quick Actions */}
        <div className="space-y-1 mb-6">
          <Button
            variant="nav"
            className="w-full justify-start gap-3 h-11"
            onClick={() => {
              const targetPage = currentPage === 1 ? 1 : storage.getLastPage();
              onNavigate(targetPage);
            }}
          >
            <Home className="w-5 h-5 text-primary" />
            <span>{currentPage === 1 ? '開始閱讀' : '繼續閱讀'}</span>
          </Button>

          <Button
            variant="nav"
            className="w-full justify-start gap-3 h-11"
            onClick={onOpenQuiz}
          >
            <HelpCircle className="w-5 h-5 text-secondary" />
            <span>小測驗</span>
            <span className="ml-auto text-xs bg-secondary/20 text-secondary px-2 py-0.5 rounded-full">
              10題
            </span>
          </Button>

          <Button
            variant="nav"
            className="w-full justify-start gap-3 h-11"
            onClick={onOpenWorksheet}
          >
            <FileText className="w-5 h-5 text-accent" />
            <span>學習單</span>
          </Button>
        </div>

        {/* Chapter Navigation */}
        <div className="mb-2">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
            📚 章節目錄
          </h3>
        </div>

        <div className="space-y-1 mb-6">
          {chapters.map((chapter) => {
            const isActive = currentPage >= chapter.startPage;
            
            return (
              <Button
                key={chapter.id}
                variant="nav"
                className={`w-full justify-start gap-2 h-auto py-3 px-3 text-left ${
                  isActive ? 'bg-sidebar-accent' : ''
                }`}
                onClick={() => onNavigate(chapter.startPage)}
              >
                <span className="text-lg shrink-0">{chapter.icon}</span>
                <span className="text-sm leading-tight line-clamp-2">
                  {chapter.title}
                </span>
                <ChevronRight className="w-4 h-4 ml-auto shrink-0 text-muted-foreground" />
              </Button>
            );
          })}
        </div>

        {/* About Site */}
        <div className="px-3">
          <Button
            variant="nav"
            className="w-full justify-start gap-3 h-11"
            onClick={onOpenAbout}
          >
            <User className="w-5 h-5 text-mint" />
            <span>關於本站</span>
          </Button>
        </div>
      </ScrollArea>
    </aside>
  );
};

export default Sidebar;
