// Quiz questions based on the AI learning handbook

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  chapter: string;
  explanation: string;
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: 'AI 是什麼的縮寫？',
    options: ['Automatic Intelligence', 'Artificial Intelligence', 'Amazing Internet', 'Advanced Information'],
    correctAnswer: 1,
    chapter: '第一章',
    explanation: 'AI 是 Artificial Intelligence（人工智慧）的縮寫！',
  },
  {
    id: 2,
    question: '下列哪一個是生成式 AI 可以做到的事情？',
    options: ['幫你寫作業的答案', '產生文字、圖片或音樂', '取代老師上課', '自動幫你考試'],
    correctAnswer: 1,
    chapter: '第一章',
    explanation: '生成式 AI 可以根據我們的指令，產生文字、圖片、音樂等內容！',
  },
  {
    id: 3,
    question: '和 AI 溝通時，什麼叫做「提示詞」？',
    options: ['AI 給我們的提示', '我們輸入給 AI 的指令或問題', '電腦的密碼', '遊戲的通關密語'],
    correctAnswer: 1,
    chapter: '第二章',
    explanation: '提示詞就是我們輸入給 AI 的指令或問題，AI 會根據提示詞來回應我們！',
  },
  {
    id: 4,
    question: '寫好的提示詞應該要怎樣？',
    options: ['越短越好', '越複雜越好', '清楚、具體、有條理', '用英文寫'],
    correctAnswer: 2,
    chapter: '第二章',
    explanation: '好的提示詞應該清楚、具體、有條理，這樣 AI 才能更準確地回應！',
  },
  {
    id: 5,
    question: 'AI 產生的內容，我們應該怎麼使用？',
    options: ['直接複製貼上', '當作參考，自己再修改', '完全不要看', '只相信 AI 說的'],
    correctAnswer: 1,
    chapter: '第三章',
    explanation: 'AI 產生的內容應該當作參考，我們要用自己的想法去修改和完善！',
  },
  {
    id: 6,
    question: 'AI 說的話一定都是對的嗎？',
    options: ['是的，AI 比人類聰明', '不一定，AI 也可能會出錯', '只有數學問題會對', 'AI 從不犯錯'],
    correctAnswer: 1,
    chapter: '第四章',
    explanation: 'AI 也可能會出錯！我們要學會判斷和查證 AI 給的資訊。',
  },
  {
    id: 7,
    question: '使用 AI 時，下列哪件事不應該做？',
    options: ['請 AI 幫忙找資料', '把個人隱私告訴 AI', '請 AI 幫忙練習英文', '請 AI 解釋數學題目'],
    correctAnswer: 1,
    chapter: '第四章',
    explanation: '我們不應該把個人隱私（如地址、電話等）告訴 AI，要保護自己的安全！',
  },
  {
    id: 8,
    question: 'AI 可以怎樣幫助我們學習？',
    options: ['直接給我們作業答案', '幫我們理解困難的概念', '取代我們去上課', '讓我們不用學習'],
    correctAnswer: 1,
    chapter: '第五章',
    explanation: 'AI 可以用不同的方式解釋困難的概念，幫助我們更好地理解和學習！',
  },
  {
    id: 9,
    question: '在 AI 時代，什麼能力最重要？',
    options: ['記憶力', '批判思考和判斷力', '打字速度', '玩遊戲的技巧'],
    correctAnswer: 1,
    chapter: '第六章',
    explanation: '在 AI 時代，批判思考和判斷力最重要，幫助我們正確使用 AI！',
  },
  {
    id: 10,
    question: '當一個 AI 時代的好公民，我們應該？',
    options: ['只依賴 AI 做決定', '負責任地使用 AI', '把 AI 當作遊戲玩', '不需要學習新知識'],
    correctAnswer: 1,
    chapter: '第六章',
    explanation: '我們要負責任地使用 AI，成為 AI 時代的好公民！',
  },
];

export const PASS_SCORE = 7; // Minimum score to get reward
