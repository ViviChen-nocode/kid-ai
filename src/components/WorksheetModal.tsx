import { useState } from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface WorksheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
}

interface PledgeCardData {
  signature: string;
}

const WorksheetModal = ({ isOpen, onClose, userName }: WorksheetModalProps) => {
  const [data, setData] = useState<PledgeCardData>({
    signature: '',
  });
  const [isDownloading, setIsDownloading] = useState(false);

  const handleChange = (field: keyof PledgeCardData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const downloadPledgeCard = async () => {
    setIsDownloading(true);

    // Create canvas for pledge card - matching the provided design
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 1130;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      // Background - soft light beige/cream
      ctx.fillStyle = '#FEF9F3';
      ctx.fillRect(0, 0, 800, 1130);

      // Main title at top - large playful text
      ctx.fillStyle = '#475569';
      ctx.font = 'bold 42px "Comic Neue", "Noto Sans TC", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('📝 我的 AI 使用承諾卡', 400, 70);

      // Yellow banner "簽署AI使用承諾卡" with rounded corners
      const bannerY = 100;
      const bannerHeight = 50;
      const bannerWidth = 640;
      const bannerX = 80;
      const bannerRadius = 12;
      
      // Helper function to draw rounded rectangle
      const drawRoundedRect = (x: number, y: number, width: number, height: number, radius: number) => {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
      };
      
      // Yellow banner background
      ctx.fillStyle = '#FEF08A';
      drawRoundedRect(bannerX, bannerY, bannerWidth, bannerHeight, bannerRadius);
      ctx.fill();
      
      // Banner border
      ctx.strokeStyle = '#EAB308';
      ctx.lineWidth = 2;
      drawRoundedRect(bannerX, bannerY, bannerWidth, bannerHeight, bannerRadius);
      ctx.stroke();
      
      // Banner text
      ctx.fillStyle = '#475569';
      ctx.font = 'bold 20px "Comic Neue", "Noto Sans TC", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('簽署AI使用承諾卡', 400, bannerY + 35);

      // Main content box - light blue dashed border (like the image)
      const contentY = 180;
      const contentHeight = 680;
      const boxWidth = 680;
      const boxX = 60;

      // Light blue background (subtle)
      ctx.fillStyle = '#F0F9FF';
      ctx.fillRect(boxX, contentY, boxWidth, contentHeight);

      // Dashed border - light blue
      ctx.strokeStyle = '#7DD3FC';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([12, 6]);
      ctx.strokeRect(boxX, contentY, boxWidth, contentHeight);
      ctx.setLineDash([]);

      // Inner padding
      const padding = 50;
      let currentY = contentY + padding;

      // Name line
      ctx.fillStyle = '#1E293B';
      ctx.font = '22px "Comic Neue", "Noto Sans TC", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`我是 ${userName}`, boxX + padding, currentY);
      currentY += 50;

      // Promise header
      ctx.font = 'bold 22px "Comic Neue", "Noto Sans TC", sans-serif';
      ctx.fillText('我願意承諾：', boxX + padding, currentY);
      currentY += 50;

      // Promise items (all checked) - larger spacing
      const promises = [
        '我會自己負責',
        '我會清楚分辨',
        '我會主動標記',
        '我會動腦判斷',
        '我會學會提問',
      ];

      ctx.font = '20px "Comic Neue", "Noto Sans TC", sans-serif';
      promises.forEach((promise) => {
        // Checkbox (checked) - larger
        ctx.fillStyle = '#1E293B';
        ctx.font = 'bold 24px "Comic Neue", sans-serif';
        ctx.fillText('☑', boxX + padding, currentY);
        
        // Promise text
        ctx.fillStyle = '#1E293B';
        ctx.font = '20px "Comic Neue", "Noto Sans TC", sans-serif';
        ctx.fillText(promise, boxX + padding + 35, currentY);
        currentY += 45;
      });

      currentY += 40;

      // Signature and date section
      ctx.font = '20px "Comic Neue", "Noto Sans TC", sans-serif';
      
      // Signature line
      ctx.fillText('簽名：', boxX + padding, currentY);
      const signatureX = boxX + padding + 70;
      const signatureWidth = 350;
      
      // Signature underline
      ctx.strokeStyle = '#94A3B8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(signatureX, currentY + 6);
      ctx.lineTo(signatureX + signatureWidth, currentY + 6);
      ctx.stroke();
      
      // Signature text if provided
      if (data.signature) {
        ctx.fillStyle = '#1E293B';
        ctx.fillText(data.signature, signatureX, currentY);
      }
      
      currentY += 50;

      // Date line
      const today = new Date();
      const dateStr = `${today.getFullYear()}/${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}`;
      ctx.fillText(`日期：${dateStr}`, boxX + padding, currentY);

      // Bottom section - similar style box
      const bottomBoxY = contentY + contentHeight + 30;
      const bottomBoxHeight = 120;
      
      // Light blue background
      ctx.fillStyle = '#F0F9FF';
      ctx.fillRect(boxX, bottomBoxY, boxWidth, bottomBoxHeight);
      
      // Dashed border
      ctx.strokeStyle = '#7DD3FC';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([12, 6]);
      ctx.strokeRect(boxX, bottomBoxY, boxWidth, bottomBoxHeight);
      ctx.setLineDash([]);
      
      // Download button text in center
      ctx.fillStyle = '#1E293B';
      ctx.font = 'bold 22px "Comic Neue", "Noto Sans TC", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('📥 下載我的承諾卡', 400, bottomBoxY + 70);

      // Page number at bottom (if needed - matching original design)
      ctx.fillStyle = '#94A3B8';
      ctx.font = '16px "Comic Neue", "Noto Sans TC", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('教育部《國小生生成式AI學習應用手冊》', 400, 1110);
    }

    // Download
    const link = document.createElement('a');
    link.download = `${userName}_AI使用承諾卡.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();

    setIsDownloading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-display flex items-center gap-2">
            📝 我的 AI 使用承諾卡
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-4">
          <p className="text-muted-foreground text-sm">
            填寫簽名後，可以下載成圖片保存喔！
          </p>

          <div className="space-y-4">
            <div className="bg-muted/50 rounded-xl p-4 space-y-3">
              <div className="text-sm text-foreground">
                <p className="font-semibold mb-3">我願意承諾：</p>
                <div className="space-y-2 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span className="text-primary">☑</span>
                    <span>我會自己負責</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-primary">☑</span>
                    <span>我會清楚分辨</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-primary">☑</span>
                    <span>我會主動標記</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-primary">☑</span>
                    <span>我會動腦判斷</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-primary">☑</span>
                    <span>我會學會提問</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="signature" className="text-sm font-semibold">
                簽名（可選填）
              </Label>
              <Input
                id="signature"
                placeholder="請輸入您的簽名"
                value={data.signature}
                onChange={(e) => handleChange('signature', e.target.value)}
                maxLength={50}
              />
              <p className="text-xs text-muted-foreground">
                如果不填寫，下載的承諾卡上簽名欄位將為空白，可列印後手寫簽名
              </p>
            </div>
          </div>

          <div className="pt-2">
            <Button
              variant="playful"
              className="w-full"
              onClick={downloadPledgeCard}
              disabled={isDownloading}
            >
              <Download className="w-4 h-4" />
              {isDownloading ? '生成中...' : '📥 下載我的承諾卡'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WorksheetModal;
