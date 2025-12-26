import { useState, useEffect } from 'react';
import { X, CheckCircle, XCircle, Trophy, Download, RotateCcw, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { quizQuestions, PASS_SCORE, type QuizQuestion } from '@/lib/quizData';
import { storage } from '@/lib/storage';
import { canvasToImageUrl, downloadImage, isLineBrowser } from '@/lib/utils';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
}

type QuizState = 'intro' | 'question' | 'result';

const QuizModal = ({ isOpen, onClose, userName }: QuizModalProps) => {
  const [state, setState] = useState<QuizState>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewFilename, setPreviewFilename] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const isCorrect = selectedAnswer === currentQuestion?.correctAnswer;
  const passed = score >= PASS_SCORE;

  const startQuiz = () => {
    setState('question');
    setCurrentQuestionIndex(0);
    setScore(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setShowFeedback(false);
  };

  const handleAnswer = (answerIndex: number) => {
    if (showFeedback) return;
    
    setSelectedAnswer(answerIndex);
    setShowFeedback(true);
    
    if (answerIndex === currentQuestion.correctAnswer) {
      setScore((prev) => prev + 1);
    }
    setAnswers((prev) => [...prev, answerIndex]);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      // Quiz complete
      setState('result');
      storage.setQuizScore(score);
      storage.setQuizCompleted(true);
    }
  };

  const downloadReward = () => {
    // Create a simple reward card using canvas
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, 600, 400);
      gradient.addColorStop(0, '#FFF5E6');
      gradient.addColorStop(1, '#FFE4CC');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 600, 400);

      // Border
      ctx.strokeStyle = '#F97316';
      ctx.lineWidth = 8;
      ctx.strokeRect(20, 20, 560, 360);

      // Title
      ctx.fillStyle = '#1E293B';
      ctx.font = 'bold 32px Comic Neue, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🏆 AI 學習小達人 🏆', 300, 80);

      // Name
      ctx.font = 'bold 48px Comic Neue, sans-serif';
      ctx.fillStyle = '#F97316';
      ctx.fillText(userName, 300, 160);

      // Score
      ctx.font = '24px Nunito, sans-serif';
      ctx.fillStyle = '#64748B';
      ctx.fillText(`測驗成績：${score} / ${quizQuestions.length}`, 300, 220);

      // Message
      ctx.font = '20px Nunito, sans-serif';
      ctx.fillStyle = '#1E293B';
      ctx.fillText('恭喜你完成了 AI 學習測驗！', 300, 280);
      ctx.fillText('你已經是 AI 時代的小達人了！', 300, 310);

      // Date
      ctx.font = '16px Nunito, sans-serif';
      ctx.fillStyle = '#94A3B8';
      ctx.fillText(new Date().toLocaleDateString('zh-TW'), 300, 360);

      // 生成圖片並顯示預覽
      const filename = `${userName}_AI學習證書.png`;
      const imageUrl = canvasToImageUrl(canvas);
      setPreviewImage(imageUrl);
      setPreviewFilename(filename);
      setIsGenerating(false);
    }
  };

  // 當進入結果頁面且通過測驗時，自動生成證書
  useEffect(() => {
    if (state === 'result' && passed && !previewImage && !isGenerating) {
      setIsGenerating(true);
      // 使用 setTimeout 確保狀態更新後再生成
      setTimeout(() => {
        // 直接在 useEffect 中生成證書
        const canvas = document.createElement('canvas');
        canvas.width = 600;
        canvas.height = 400;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          // Background gradient
          const gradient = ctx.createLinearGradient(0, 0, 600, 400);
          gradient.addColorStop(0, '#FFF5E6');
          gradient.addColorStop(1, '#FFE4CC');
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, 600, 400);

          // Border
          ctx.strokeStyle = '#F97316';
          ctx.lineWidth = 8;
          ctx.strokeRect(20, 20, 560, 360);

          // Title
          ctx.fillStyle = '#1E293B';
          ctx.font = 'bold 32px Comic Neue, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('🏆 AI 學習小達人 🏆', 300, 80);

          // Name
          ctx.font = 'bold 48px Comic Neue, sans-serif';
          ctx.fillStyle = '#F97316';
          ctx.fillText(userName, 300, 160);

          // Score
          ctx.font = '24px Nunito, sans-serif';
          ctx.fillStyle = '#64748B';
          ctx.fillText(`測驗成績：${score} / ${quizQuestions.length}`, 300, 220);

          // Message
          ctx.font = '20px Nunito, sans-serif';
          ctx.fillStyle = '#1E293B';
          ctx.fillText('恭喜你完成了 AI 學習測驗！', 300, 280);
          ctx.fillText('你已經是 AI 時代的小達人了！', 300, 310);

          // Date
          ctx.font = '16px Nunito, sans-serif';
          ctx.fillStyle = '#94A3B8';
          ctx.fillText(new Date().toLocaleDateString('zh-TW'), 300, 360);

          // 生成圖片並顯示預覽
          const filename = `${userName}_AI學習證書.png`;
          const imageUrl = canvasToImageUrl(canvas);
          setPreviewImage(imageUrl);
          setPreviewFilename(filename);
          setIsGenerating(false);
        }
      }, 100);
    }
  }, [state, passed, previewImage, isGenerating, userName, score]);

  const handleDownloadFromPreview = () => {
    if (previewImage && previewFilename) {
      downloadImage(previewImage, previewFilename);
    }
  };

  const resetQuiz = () => {
    setState('intro');
    setCurrentQuestionIndex(0);
    setScore(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setPreviewImage(null);
    setPreviewFilename('');
    setIsGenerating(false);
  };

  // 當 modal 關閉時重置狀態
  useEffect(() => {
    if (!isOpen) {
      setState('intro');
      setCurrentQuestionIndex(0);
      setScore(0);
      setAnswers([]);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setPreviewImage(null);
      setPreviewFilename('');
      setIsGenerating(false);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto p-5">
        <DialogHeader className="pb-3">
          <DialogTitle className="text-lg font-display flex items-center gap-2">
            {state === 'intro' && '🎯 AI 知識小測驗'}
            {state === 'question' && `📝 第 ${currentQuestionIndex + 1} 題`}
            {state === 'result' && (passed ? '🎉 太棒了！' : '💪 繼續加油！')}
          </DialogTitle>
        </DialogHeader>

        {/* Intro */}
        {state === 'intro' && (
          <div className="space-y-4 py-2">
            <div className="text-center">
              <div className="text-5xl mb-3">🤖</div>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                這個測驗有 <span className="font-bold text-foreground">10 道題目</span>，
                測試你對 AI 的了解程度。
              </p>
              <p className="text-sm md:text-base text-muted-foreground mt-1.5">
                答對 <span className="font-bold text-primary">{PASS_SCORE} 題以上</span>，
                就能獲得獎勵卡喔！
              </p>
            </div>

            <Button
              variant="playful"
              size="lg"
              className="w-full"
              onClick={startQuiz}
            >
              開始測驗！
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        )}

        {/* Question */}
        {state === 'question' && currentQuestion && (
          <div className="space-y-4 py-2">
            {/* Progress */}
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full gradient-primary transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground">
                {currentQuestionIndex + 1}/{quizQuestions.length}
              </span>
            </div>

            {/* Question */}
            <div className="bg-muted/50 rounded-xl p-3">
              <p className="font-semibold text-base leading-relaxed">
                {currentQuestion.question}
              </p>
            </div>

            {/* Options */}
            <div className="space-y-2">
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrectAnswer = index === currentQuestion.correctAnswer;
                
                let buttonClass = 'w-full justify-start text-left h-auto py-3 px-3 border-2 transition-all';
                
                if (showFeedback) {
                  if (isCorrectAnswer) {
                    buttonClass += ' border-success bg-success/10 text-success';
                  } else if (isSelected && !isCorrectAnswer) {
                    buttonClass += ' border-destructive bg-destructive/10 text-destructive';
                  } else {
                    buttonClass += ' border-border opacity-50';
                  }
                } else if (isSelected) {
                  buttonClass += ' border-primary bg-primary/10';
                } else {
                  buttonClass += ' border-border hover:border-primary/50';
                }

                return (
                  <Button
                    key={index}
                    variant="outline"
                    className={buttonClass}
                    onClick={() => handleAnswer(index)}
                    disabled={showFeedback}
                  >
                    <span className="w-7 h-7 rounded-full bg-muted flex items-center justify-center mr-3 shrink-0 text-sm">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="flex-1 text-sm md:text-base">{option}</span>
                    {showFeedback && isCorrectAnswer && (
                      <CheckCircle className="w-4 h-4 text-success shrink-0" />
                    )}
                    {showFeedback && isSelected && !isCorrectAnswer && (
                      <XCircle className="w-4 h-4 text-destructive shrink-0" />
                    )}
                  </Button>
                );
              })}
            </div>

            {/* Feedback */}
            {showFeedback && (
              <div className={`rounded-xl p-3 animate-fade-up ${
                isCorrect ? 'bg-success/10 border border-success/30' : 'bg-destructive/10 border border-destructive/30'
              }`}>
                <p className={`font-semibold mb-1 text-sm ${isCorrect ? 'text-success' : 'text-destructive'}`}>
                  {isCorrect ? '✓ 答對了！' : '✗ 答錯了'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {currentQuestion.explanation}
                </p>
              </div>
            )}

            {/* Next button */}
            {showFeedback && (
              <Button
                variant="playful"
                size="lg"
                className="w-full animate-fade-up"
                onClick={nextQuestion}
              >
                {currentQuestionIndex < quizQuestions.length - 1 ? '下一題' : '看結果'}
                <ChevronRight className="w-5 h-5" />
              </Button>
            )}
          </div>
        )}

        {/* Result */}
        {state === 'result' && (
          <div className="space-y-4 py-2 text-center">
            {!previewImage && (
              <>
                <div className="text-5xl mb-3">
                  {passed ? '🏆' : '📚'}
                </div>
                
                <div>
                  <p className="text-3xl font-display font-bold text-gradient mb-2">
                    {score} / {quizQuestions.length}
                  </p>
                  <p className="text-sm md:text-base text-muted-foreground">
                    {passed 
                      ? `太厲害了，${userName}！你真的很了解 AI！` 
                      : `${userName}，再多讀一些手冊內容，下次一定可以考得更好！`
                    }
                  </p>
                </div>

                {passed && (
                  <div className="pt-2">
                    {isGenerating ? (
                      <p className="text-sm text-muted-foreground">正在生成證書...</p>
                    ) : (
                      <p className="text-sm text-muted-foreground">正在生成證書...</p>
                    )}
                  </div>
                )}

                {!passed && (
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full"
                    onClick={resetQuiz}
                  >
                    <RotateCcw className="w-5 h-5" />
                    再試一次
                  </Button>
                )}
              </>
            )}

            {/* Image preview - 只在通過測驗且生成圖片後顯示 */}
            {previewImage && passed && (
              <div className="rounded-xl border-2 border-primary/30 bg-background p-4 space-y-3">
                <div className="text-center">
                  <p className="text-sm font-semibold text-foreground mb-1">
                    {isLineBrowser() ? '📱 長按圖片即可保存' : '📷 你的 AI 學習證書'}
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
                    alt="AI 學習證書"
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
                    下載證書
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={resetQuiz}
                >
                  <RotateCcw className="w-5 h-5" />
                  再試一次
                </Button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default QuizModal;
