import { useState, useEffect } from 'react';
import { Download, AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { canvasToImageUrl, downloadImage, isLineBrowser } from '@/lib/utils';

interface WorksheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
}

interface PledgeCardData {
  signature: string;
}

interface PledgeItems {
  responsible: boolean;      // 我會自己負責
  distinguish: boolean;       // 我會清楚分辨
  mark: boolean;             // 我會主動標記
  think: boolean;            // 我會動腦判斷
  ask: boolean;              // 我會學會提問
}

const PLEDGE_ITEMS = [
  { 
    key: 'responsible' as keyof PledgeItems, 
    title: '我會自己負責',
    description: '我願意為自己使用AI的方式與結果負責。'
  },
  { 
    key: 'distinguish' as keyof PledgeItems, 
    title: '我會清楚分辨',
    description: '分清楚哪些是我自己寫的，哪些是AI協助的。'
  },
  { 
    key: 'mark' as keyof PledgeItems, 
    title: '我會主動標記',
    description: '凡是AI有幫忙的地方，我會清楚標註。'
  },
  { 
    key: 'think' as keyof PledgeItems, 
    title: '我會動腦判斷',
    description: '使用AI後，我會自己判斷、理解內容，而不是照抄。'
  },
  { 
    key: 'ask' as keyof PledgeItems, 
    title: '我會學會提問',
    description: '遇到疑問，我會勇敢向老師、家長、同學或可信資料請教。'
  },
];

const WorksheetModal = ({ isOpen, onClose, userName }: WorksheetModalProps) => {
  const [data, setData] = useState<PledgeCardData>({
    signature: '',
  });
  const [pledgeItems, setPledgeItems] = useState<PledgeItems>({
    responsible: false,
    distinguish: false,
    mark: false,
    think: false,
    ask: false,
  });
  const [isDownloading, setIsDownloading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewFilename, setPreviewFilename] = useState<string>('');
  const [isCompleted, setIsCompleted] = useState(false);

  const handleChange = (field: keyof PledgeCardData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePledgeChange = (key: keyof PledgeItems, checked: boolean) => {
    setPledgeItems((prev) => ({ ...prev, [key]: checked }));
    // 如果用戶勾選項目，且所有項目都已勾選，則隱藏錯誤訊息
    const newState = { ...pledgeItems, [key]: checked };
    const allChecked = PLEDGE_ITEMS.every(item => newState[item.key]);
    if (allChecked && showError) {
      setShowError(false);
    }
  };

  const downloadPledgeCard = async () => {
    // 檢查是否有未勾選的項目
    const uncheckedItems = PLEDGE_ITEMS.filter(item => !pledgeItems[item.key]);
    
    if (uncheckedItems.length > 0) {
      const uncheckedLabels = uncheckedItems.map(item => item.title).join('、');
      setErrorMessage(`還差一點點！${userName} 還沒承諾：${uncheckedLabels}`);
      setShowError(true);
      // 3秒後自動隱藏錯誤訊息
      setTimeout(() => {
        setShowError(false);
      }, 5000);
      return;
    }

    setShowError(false);
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
      currentY += 60;

      // Promise header
      ctx.font = 'bold 22px "Comic Neue", "Noto Sans TC", sans-serif';
      ctx.fillText('我願意承諾：', boxX + padding, currentY);
      currentY += 50;

      // Promise items - only show checked items
      ctx.font = '20px "Comic Neue", "Noto Sans TC", sans-serif';
      PLEDGE_ITEMS.forEach((item) => {
        if (pledgeItems[item.key]) {
          // Checkbox (checked) - larger
          ctx.fillStyle = '#1E293B';
          ctx.font = 'bold 24px "Comic Neue", sans-serif';
          ctx.fillText('☑', boxX + padding, currentY);
          
          // Promise text with title and description
          const textX = boxX + padding + 35;
          const maxWidth = boxWidth - padding * 2 - 35 - 20; // Available width
          
          // Title (bold)
          ctx.fillStyle = '#1E293B';
          ctx.font = 'bold 20px "Comic Neue", "Noto Sans TC", sans-serif';
          const titleText = `${item.title}：`;
          ctx.fillText(titleText, textX, currentY);
          
          // Description text (lighter color, normal weight)
          ctx.fillStyle = '#475569';
          ctx.font = '18px "Comic Neue", "Noto Sans TC", sans-serif';
          
          // Helper function to wrap text
          const wrapText = (text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
            const chars = text.split('');
            let line = '';
            let currentY = y;
            
            for (let i = 0; i < chars.length; i++) {
              const testLine = line + chars[i];
              const metrics = ctx.measureText(testLine);
              
              if (metrics.width > maxWidth && line.length > 0) {
                ctx.fillText(line, x, currentY);
                line = chars[i];
                currentY += lineHeight;
              } else {
                line = testLine;
              }
            }
            
            if (line.length > 0) {
              ctx.fillText(line, x, currentY);
            }
            
            return currentY;
          };
          
          // Increase spacing: title to description (30px), line height (32px), item spacing (35px)
          const finalY = wrapText(item.description, textX, currentY + 30, maxWidth, 32);
          currentY = finalY + 35; // Add more spacing after each item
        }
      });

      currentY += 50;

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
      
      currentY += 60;

      // Date line
      const today = new Date();
      const dateStr = `${today.getFullYear()}/${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}`;
      ctx.fillText(`日期：${dateStr}`, boxX + padding, currentY);

      // Footer text at bottom
      ctx.fillStyle = '#94A3B8';
      ctx.font = '16px "Comic Neue", "Noto Sans TC", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('根據教育部《國小生生成式AI學習應用手冊》製作', 400, 1110);
    }

    // 生成圖片並顯示預覽
    const filename = `${userName}_AI使用承諾卡.png`;
    const imageUrl = canvasToImageUrl(canvas);
    setPreviewImage(imageUrl);
    setPreviewFilename(filename);
    setIsCompleted(true); // 標記為已完成，隱藏表單

    setIsDownloading(false);
  };

  const handleDownloadFromPreview = () => {
    if (previewImage && previewFilename) {
      downloadImage(previewImage, previewFilename);
    }
  };

  // 當 modal 關閉時重置狀態
  useEffect(() => {
    if (!isOpen) {
      setData({ signature: '' });
      setPledgeItems({
        responsible: false,
        distinguish: false,
        mark: false,
        think: false,
        ask: false,
      });
      setPreviewImage(null);
      setPreviewFilename('');
      setIsCompleted(false);
      setShowError(false);
      setErrorMessage('');
      setIsDownloading(false);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-0">
          <DialogTitle className="text-xl font-display flex items-center gap-2">
            📝 我的 AI 使用承諾卡
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-0">
          {!isCompleted && (
            <>
              <p className="text-muted-foreground text-sm -mt-2">
                填寫簽名後，可以下載成圖片保存喔！
              </p>

              <div className="space-y-4">
                <div className="bg-muted/50 rounded-xl p-4 space-y-3">
                  <div className="text-sm text-foreground">
                    <p className="font-semibold mb-3">我願意承諾：</p>
                    <div className="space-y-4">
                      {PLEDGE_ITEMS.map((item) => (
                        <div key={item.key} className="flex items-start gap-3">
                          <Checkbox
                            id={item.key}
                            checked={pledgeItems[item.key]}
                            onCheckedChange={(checked) => 
                              handlePledgeChange(item.key, checked === true)
                            }
                            className="mt-1"
                          />
                          <Label
                            htmlFor={item.key}
                            className="text-sm font-normal cursor-pointer flex-1 leading-relaxed"
                          >
                            <span className="font-semibold">{item.title}：</span>
                            <span className="text-muted-foreground block mt-1">{item.description}</span>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Label htmlFor="signature" className="text-sm font-semibold whitespace-nowrap">
                      簽名（可選填）
                    </Label>
                    <Input
                      id="signature"
                      placeholder="請輸入您的簽名"
                      value={data.signature}
                      onChange={(e) => handleChange('signature', e.target.value)}
                      maxLength={50}
                      className="flex-1"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    如果沒有填寫，下載的承諾卡上簽名欄位將為空白，可列印後手寫簽名 😊
                  </p>
                </div>
              </div>

              {/* Error message - similar to quiz feedback */}
              {showError && (
                <div className="rounded-xl p-3 animate-fade-up bg-destructive/10 border border-destructive/30">
                  <p className="font-semibold mb-1 text-sm text-destructive flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    請完成所有承諾項目
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {errorMessage}
                  </p>
                </div>
              )}

              <div className="pt-2">
                <Button
                  variant="playful"
                  className="w-full"
                  onClick={downloadPledgeCard}
                  disabled={isDownloading}
                >
                  {isDownloading ? '生成中...' : '完成提交'}
                </Button>
              </div>
            </>
          )}

          {/* Image preview - 只在完成後顯示 */}
          {previewImage && isCompleted && (
            <div className="rounded-xl border-2 border-primary/30 bg-background p-4 space-y-3">
              <div className="text-center">
                <p className="text-sm font-semibold text-foreground mb-1">
                  {isLineBrowser() ? '📱 長按圖片即可保存' : '📷 你的 AI 使用承諾卡'}
                </p>
                {isLineBrowser() && (
                  <p className="text-xs text-muted-foreground">
                    在圖片上長按，選擇「儲存圖片」或「下載圖片」
                  </p>
                )}
              </div>
              <div className="relative w-full bg-muted rounded-lg overflow-hidden">
                <img
                  src={previewImage}
                  alt="AI 使用承諾卡"
                  className="w-full h-auto"
                  style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
                />
              </div>
              {!isLineBrowser() && (
                <Button
                  variant="playful"
                  className="w-full"
                  onClick={handleDownloadFromPreview}
                >
                  <Download className="w-4 h-4" />
                  下載我的承諾卡
                </Button>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WorksheetModal;
