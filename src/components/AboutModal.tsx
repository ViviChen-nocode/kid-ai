import { ExternalLink, Mail, Heart, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutModal = ({ isOpen, onClose }: AboutModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-display flex items-center gap-2">
            🌐 關於本站
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Author info */}
          <div className="text-center">
            <div className="w-20 h-20 rounded-full mx-auto mb-4 overflow-hidden border-2 border-primary/20">
              <img 
                src="/avatar.png" 
                alt="Vivi Chen 大師姐" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to emoji if image not found
                  e.currentTarget.style.display = 'none';
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    parent.innerHTML = '<span class="text-4xl flex items-center justify-center w-full h-full">🌸</span>';
                  }
                }}
              />
            </div>
            <h3 className="text-xl font-bold mb-1">Vivi Chen 大師姐</h3>
            <p className="text-muted-foreground text-sm">
              本站架設者
            </p>
          </div>

          {/* Description */}
          <div className="bg-muted/50 rounded-xl p-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              這個互動式閱讀器是根據教育部
              <a 
                href="https://pads.moe.edu.tw/pads/upload/%E4%B8%AD%E5%B0%8F%E5%AD%B8%E7%94%9F%E6%88%90%E5%BC%8FAI%E4%B9%8B%E5%AD%B8%E7%BF%92%E6%87%89%E7%94%A8%E6%89%8B%E5%86%8A-%E3%80%8A%E6%88%91%E5%92%8CAI%E4%B8%80%E8%B5%B7%E5%AD%B8%E3%80%8Bfor%E5%9C%8B%E5%B0%8F1141218.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                《國小生生成式AI學習應用手冊》
              </a>
              製作的，
              希望能讓小朋友們有更好的學習體驗！
            </p>
            <p className="text-xs text-muted-foreground mt-3 pt-3 border-t border-border/50">
              ※ 本站為個人自發製作，非教育部官方網站。
            </p>
          </div>

          {/* Links */}
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-12"
              onClick={(e) => {
                e.preventDefault();
                window.open('https://www.facebook.com/vivichen.sister', '_blank', 'noopener,noreferrer');
              }}
            >
              <div className="w-8 h-8 rounded-full bg-[#1877F2] flex items-center justify-center">
                <span className="text-white text-lg font-bold">f</span>
              </div>
              <span>追蹤 Facebook 粉專</span>
              <ExternalLink className="w-4 h-4 ml-auto text-muted-foreground" />
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-12"
              onClick={(e) => {
                e.preventDefault();
                window.open('https://www.instagram.com/thevividai.vi/', '_blank', 'noopener,noreferrer');
              }}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center">
                <Instagram className="w-4 h-4 text-white" />
              </div>
              <span>追蹤 Instagram</span>
              <ExternalLink className="w-4 h-4 ml-auto text-muted-foreground" />
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-12"
              onClick={(e) => {
                e.preventDefault();
                window.open('https://www.threads.net/@thevividai.vi', '_blank', 'noopener,noreferrer');
              }}
            >
              <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
                <span className="text-white text-lg">🧵</span>
              </div>
              <span>追蹤 Threads</span>
              <ExternalLink className="w-4 h-4 ml-auto text-muted-foreground" />
            </Button>

            <a
              href="mailto:thevividai@gmail.com"
              className="block"
            >
              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-12"
              >
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <Mail className="w-4 h-4 text-primary-foreground" />
                </div>
                <span>寫信給大師姐</span>
                <ExternalLink className="w-4 h-4 ml-auto text-muted-foreground" />
              </Button>
            </a>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1">
            獻給每一位小小 AI 探險家 <Heart className="w-3 h-3 text-accent fill-accent" />
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AboutModal;
