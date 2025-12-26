import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { storage } from '@/lib/storage';
import { Sparkles, BookOpen } from 'lucide-react';
import coverIllustration from '@/assets/pic.png';

interface WelcomeScreenProps {
  onComplete: (name: string, role: number) => void;
}

const WelcomeScreen = ({ onComplete }: WelcomeScreenProps) => {
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState<number>(1);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      setIsAnimating(true);
      storage.setUserName(name.trim());
      storage.setUserRole(selectedRole);
      setTimeout(() => {
        onComplete(name.trim(), selectedRole);
      }, 500);
    }
  };

  return (
    <div className="min-h-screen gradient-sunset flex items-center justify-center p-4 overflow-hidden">
      {/* Floating decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-5xl animate-float opacity-60">🤖</div>
        <div className="absolute top-20 right-20 text-4xl animate-float opacity-60" style={{ animationDelay: '0.5s' }}>✨</div>
        <div className="absolute bottom-20 left-20 text-4xl animate-float opacity-60" style={{ animationDelay: '1s' }}>📚</div>
        <div className="absolute bottom-32 right-16 text-5xl animate-float opacity-60" style={{ animationDelay: '1.5s' }}>💡</div>
        <div className="absolute top-1/3 left-1/4 text-3xl animate-bounce-slow opacity-40">🌟</div>
        <div className="absolute top-1/2 right-1/4 text-3xl animate-bounce-slow opacity-40" style={{ animationDelay: '0.7s' }}>🎯</div>
      </div>

      <div className={`relative z-10 w-full max-w-md transition-all duration-500 ${isAnimating ? 'scale-110 opacity-0' : 'animate-fade-up'}`}>
        {/* Card */}
        <div className="bg-card rounded-3xl shadow-card p-6 md:p-8">
          {/* Cover Illustration */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <img 
                src={coverIllustration} 
                alt="AI 學習夥伴" 
                className="w-32 h-32 object-cover rounded-2xl shadow-soft"
              />
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-sunshine flex items-center justify-center animate-bounce-slow">
                <Sparkles className="w-5 h-5 text-foreground" />
              </div>
            </div>
          </div>

          {/* Title and Description */}
          <div className="text-center mb-6 space-y-2">
            <h1 className="text-xl md:text-2xl font-display font-bold text-foreground">
              歡迎來到《和你一起學 AI》！
            </h1>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              準備好展開一段有趣的 AI 學習旅程了嗎？
            </p>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              讓我們一起探索人工智慧的奧秘吧！
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-semibold text-foreground">
                請告訴我你的名字 ✏️
              </label>
              <Input
                id="name"
                type="text"
                placeholder="輸入你的名字..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-14 text-lg"
                maxLength={20}
                autoFocus
              />
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-foreground">
                選擇你的角色 🎭
              </label>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setSelectedRole(role)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      selectedRole === role
                        ? 'border-primary shadow-lg scale-105 ring-2 ring-primary/30'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <img
                      src={`/role0${role}.png`}
                      alt={`角色 ${role}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            <Button
              type="submit"
              variant="playful"
              size="lg"
              className="w-full"
              disabled={!name.trim()}
            >
              <BookOpen className="w-5 h-5" />
              開始閱讀！
            </Button>
          </form>
        </div>

        {/* Footer hint */}
        <p className="text-center text-muted-foreground text-sm mt-4">
          根據教育部
          <a 
            href="https://pads.moe.edu.tw/pads/upload/%E4%B8%AD%E5%B0%8F%E5%AD%B8%E7%94%9F%E6%88%90%E5%BC%8FAI%E4%B9%8B%E5%AD%B8%E7%BF%92%E6%87%89%E7%94%A8%E6%89%8B%E5%86%8A-%E3%80%8A%E6%88%91%E5%92%8CAI%E4%B8%80%E8%B5%B7%E5%AD%B8%E3%80%8Bfor%E5%9C%8B%E5%B0%8F1141218.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline font-medium"
          >
            《國小生生成式AI學習應用手冊》
          </a>
          製作
        </p>
      </div>
    </div>
  );
};

export default WelcomeScreen;
