import { Menu, X, Home, HelpCircle, FileText, User, ChevronRight, Book, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { chapters } from '@/lib/chapters';
import { ScrollArea } from '@/components/ui/scroll-area';
import { storage } from '@/lib/storage';
import { useEffect, useState } from 'react';

interface MobileMenuProps {
  userName: string;
  currentPage: number;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigate: (page: number) => void;
  onOpenQuiz: () => void;
  onOpenWorksheet: () => void;
  onOpenAbout: () => void;
  onReset: () => void;
}

const MobileMenu = ({
  userName,
  currentPage,
  isOpen,
  onOpenChange,
  onNavigate,
  onOpenQuiz,
  onOpenWorksheet,
  onOpenAbout,
  onReset,
}: MobileMenuProps) => {
  const [userRole, setUserRole] = useState<number>(1);

  useEffect(() => {
    const role = storage.getUserRole();
    if (role) {
      setUserRole(role);
    }
  }, []);

  const roleImagePath = `/role0${userRole}.png`;

  const handleNavigate = (page: number) => {
    onNavigate(page);
    onOpenChange(false);
  };

  const handleAction = (action: () => void) => {
    action();
    onOpenChange(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 bg-card shadow-soft rounded-full"
        >
          <Menu className="w-5 h-5" />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-80 p-0 bg-sidebar">
        <SheetHeader className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20 flex items-center justify-center flex-shrink-0">
              <img
                src={roleImagePath}
                alt={`角色 ${userRole}`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-left flex-1">
              <p className="text-sm text-muted-foreground">歡迎回來</p>
              <SheetTitle className="text-lg font-bold">{userName}</SheetTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={() => {
                onOpenChange(false);
                if (confirm('確定要重新開始嗎？這將清除所有進度並返回首頁。')) {
                  onReset();
                }
              }}
              title="重新開始"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-140px)]">
          <div className="p-4">
            {/* Quick Actions */}
            <div className="space-y-0.5">
              <Button
                variant="nav"
                className="w-full justify-start gap-3 h-10"
                onClick={() => {
                  const targetPage = currentPage === 1 ? 1 : storage.getLastPage();
                  handleNavigate(targetPage);
                }}
              >
                <Home className="w-5 h-5 text-primary" />
                <span>{currentPage === 1 ? '開始閱讀' : '繼續閱讀'}</span>
              </Button>

              <Button
                variant="nav"
                className="w-full justify-start gap-3 h-10"
                onClick={() => handleAction(onOpenQuiz)}
              >
                <HelpCircle className="w-5 h-5 text-secondary" />
                <span>小小測驗王</span>
                <span className="ml-auto text-xs bg-secondary/20 text-secondary px-2 py-0.5 rounded-full">
                  10題
                </span>
              </Button>

              <Button
                variant="nav"
                className="w-full justify-start gap-3 h-10"
                onClick={() => handleAction(onOpenWorksheet)}
              >
                <FileText className="w-5 h-5 text-accent" />
                <span>我的 AI 使用承諾</span>
              </Button>
            </div>

            {/* Divider */}
            <div className="py-1.5 mt-1">
              <div className="border-t border-sidebar-border/50" />
            </div>

            {/* Chapter Navigation */}
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-1 mt-1">
              📚 章節目錄
            </h3>

            {chapters.map((chapter) => {
              const isActive = currentPage >= chapter.startPage;

              return (
                <Button
                  key={chapter.id}
                  variant="nav"
                  className={`w-full justify-start gap-2 h-auto py-2 px-3 text-left ${
                    isActive ? 'bg-sidebar-accent' : ''
                  }`}
                  onClick={() => handleNavigate(chapter.startPage)}
                >
                  <span className="text-lg shrink-0">{chapter.icon}</span>
                  <span className="text-sm leading-tight flex-1">
                    {chapter.title}
                  </span>
                  <ChevronRight className="w-4 h-4 shrink-0 text-muted-foreground" />
                </Button>
              );
            })}

            {/* Divider */}
            <div className="py-2">
              <div className="border-t border-sidebar-border/50" />
            </div>

            {/* About Site */}
            <Button
              variant="nav"
              className="w-full justify-start gap-3 h-12"
              onClick={() => handleAction(onOpenAbout)}
            >
              <User className="w-5 h-5 text-mint" />
              <span>關於本站</span>
            </Button>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
