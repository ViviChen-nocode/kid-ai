import { useState, useEffect } from 'react';
import { storage } from '@/lib/storage';
import WelcomeScreen from '@/components/WelcomeScreen';
import ReaderLayout from '@/components/ReaderLayout';
import { Helmet } from 'react-helmet-async';

const Index = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing user
    const storedName = storage.getUserName();
    if (storedName) {
      setUserName(storedName);
    }
    setIsLoading(false);
  }, []);

  const handleWelcomeComplete = (name: string) => {
    setUserName(name);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-sunset flex items-center justify-center">
        <div className="text-center animate-pulse">
          <div className="text-6xl mb-4">🤖</div>
          <p className="text-muted-foreground">載入中...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>和你一起學 AI - 國小生 AI 學習手冊</title>
        <meta name="description" content="教育部《國小生生成式AI學習應用手冊》互動式閱讀器，讓小朋友輕鬆學習 AI 知識！" />
        <meta name="keywords" content="AI, 人工智慧, 國小, 教育, 生成式AI, 學習" />
      </Helmet>

      {userName ? (
        <ReaderLayout userName={userName} />
      ) : (
        <WelcomeScreen onComplete={handleWelcomeComplete} />
      )}
    </>
  );
};

export default Index;
