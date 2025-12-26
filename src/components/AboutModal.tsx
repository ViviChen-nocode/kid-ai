import { ExternalLink, Mail, Heart } from 'lucide-react';
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
            <div className="w-20 h-20 rounded-full gradient-primary mx-auto mb-4 flex items-center justify-center">
              <span className="text-4xl">🌸</span>
            </div>
            <h3 className="text-xl font-bold mb-1">Vivi Chen</h3>
            <p className="text-muted-foreground text-sm">
              網站架設者
            </p>
          </div>

          {/* Description */}
          <div className="bg-muted/50 rounded-xl p-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              這個互動式閱讀器是根據教育部《國小生生成式AI學習應用手冊》製作的，
              希望能讓小朋友們有更好的學習體驗！
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
                <span className="text-white text-lg">f</span>
              </div>
              <span>Facebook 粉絲專頁</span>
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
                <span>thevividai@gmail.com</span>
                <ExternalLink className="w-4 h-4 ml-auto text-muted-foreground" />
              </Button>
            </a>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1">
            Made with <Heart className="w-3 h-3 text-accent fill-accent" /> for young learners
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AboutModal;
