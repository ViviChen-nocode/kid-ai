import { useState, useRef } from 'react';
import { Download, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface WorksheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
}

interface WorksheetData {
  topic: string;
  whatILearned: string;
  myQuestion: string;
  howToUseAI: string;
  myPledge: string;
}

const WorksheetModal = ({ isOpen, onClose, userName }: WorksheetModalProps) => {
  const [data, setData] = useState<WorksheetData>({
    topic: '',
    whatILearned: '',
    myQuestion: '',
    howToUseAI: '',
    myPledge: '',
  });
  const [isDownloading, setIsDownloading] = useState(false);

  const handleChange = (field: keyof WorksheetData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const downloadWorksheet = async () => {
    setIsDownloading(true);

    // Create canvas for worksheet
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 1100;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      // Background
      ctx.fillStyle = '#FFFAF5';
      ctx.fillRect(0, 0, 800, 1100);

      // Border decoration
      ctx.strokeStyle = '#F97316';
      ctx.lineWidth = 4;
      ctx.strokeRect(30, 30, 740, 1040);

      // Inner border
      ctx.strokeStyle = '#FED7AA';
      ctx.lineWidth = 2;
      ctx.strokeRect(40, 40, 720, 1020);

      // Title
      ctx.fillStyle = '#1E293B';
      ctx.font = 'bold 36px Comic Neue, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('📝 我的 AI 學習單', 400, 90);

      // Name and date
      ctx.font = '18px Nunito, sans-serif';
      ctx.fillStyle = '#64748B';
      ctx.textAlign = 'left';
      ctx.fillText(`姓名：${userName}`, 60, 140);
      ctx.textAlign = 'right';
      ctx.fillText(`日期：${new Date().toLocaleDateString('zh-TW')}`, 740, 140);

      // Divider
      ctx.beginPath();
      ctx.moveTo(60, 160);
      ctx.lineTo(740, 160);
      ctx.strokeStyle = '#FED7AA';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Helper function to draw sections
      const drawSection = (title: string, content: string, y: number, height: number) => {
        // Section background
        ctx.fillStyle = '#FFF';
        ctx.fillRect(60, y, 680, height);
        ctx.strokeStyle = '#E5E7EB';
        ctx.lineWidth = 1;
        ctx.strokeRect(60, y, 680, height);

        // Section title
        ctx.fillStyle = '#F97316';
        ctx.font = 'bold 18px Nunito, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(title, 75, y + 30);

        // Content
        ctx.fillStyle = '#1E293B';
        ctx.font = '16px Nunito, sans-serif';
        
        // Word wrap
        const words = content.split('');
        let line = '';
        let lineY = y + 60;
        const maxWidth = 640;
        
        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n];
          const metrics = ctx.measureText(testLine);
          if (metrics.width > maxWidth && n > 0) {
            ctx.fillText(line, 75, lineY);
            line = words[n];
            lineY += 26;
            if (lineY > y + height - 20) break;
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line, 75, lineY);
      };

      // Draw sections
      drawSection('🎯 今天學到的主題', data.topic || '(未填寫)', 180, 120);
      drawSection('💡 我學到了什麼', data.whatILearned || '(未填寫)', 320, 160);
      drawSection('❓ 我想問的問題', data.myQuestion || '(未填寫)', 500, 140);
      drawSection('🤖 我想怎麼使用 AI', data.howToUseAI || '(未填寫)', 660, 140);
      drawSection('✨ 我的 AI 使用承諾', data.myPledge || '(未填寫)', 820, 140);

      // Footer
      ctx.fillStyle = '#94A3B8';
      ctx.font = '14px Nunito, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('教育部《國小生生成式AI學習應用手冊》學習單', 400, 1050);

      // Download
      const link = document.createElement('a');
      link.download = `${userName}_AI學習單.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }

    setIsDownloading(false);
  };

  const resetForm = () => {
    setData({
      topic: '',
      whatILearned: '',
      myQuestion: '',
      howToUseAI: '',
      myPledge: '',
    });
  };

  const isFormEmpty = Object.values(data).every((v) => !v.trim());

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-display flex items-center gap-2">
            📝 我的 AI 學習單
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-4">
          <p className="text-muted-foreground text-sm">
            填寫完成後，可以下載成圖片保存喔！
          </p>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="topic" className="text-sm font-semibold">
                🎯 今天學到的主題
              </Label>
              <Input
                id="topic"
                placeholder="例如：什麼是生成式 AI"
                value={data.topic}
                onChange={(e) => handleChange('topic', e.target.value)}
                maxLength={50}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatILearned" className="text-sm font-semibold">
                💡 我學到了什麼
              </Label>
              <Textarea
                id="whatILearned"
                placeholder="寫下你今天學到的重點..."
                value={data.whatILearned}
                onChange={(e) => handleChange('whatILearned', e.target.value)}
                rows={3}
                maxLength={200}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="myQuestion" className="text-sm font-semibold">
                ❓ 我想問的問題
              </Label>
              <Textarea
                id="myQuestion"
                placeholder="有什麼問題想要問老師或 AI？"
                value={data.myQuestion}
                onChange={(e) => handleChange('myQuestion', e.target.value)}
                rows={2}
                maxLength={150}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="howToUseAI" className="text-sm font-semibold">
                🤖 我想怎麼使用 AI
              </Label>
              <Textarea
                id="howToUseAI"
                placeholder="你想用 AI 來做什麼？"
                value={data.howToUseAI}
                onChange={(e) => handleChange('howToUseAI', e.target.value)}
                rows={2}
                maxLength={150}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="myPledge" className="text-sm font-semibold">
                ✨ 我的 AI 使用承諾
              </Label>
              <Textarea
                id="myPledge"
                placeholder="例如：我會負責任地使用 AI，不會抄襲..."
                value={data.myPledge}
                onChange={(e) => handleChange('myPledge', e.target.value)}
                rows={2}
                maxLength={150}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={resetForm}
              disabled={isFormEmpty}
            >
              <RotateCcw className="w-4 h-4" />
              清除
            </Button>
            <Button
              variant="playful"
              className="flex-1"
              onClick={downloadWorksheet}
              disabled={isDownloading}
            >
              <Download className="w-4 h-4" />
              下載學習單
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WorksheetModal;
