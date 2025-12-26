// Chapter navigation structure based on the PDF table of contents

export interface Chapter {
  id: string;
  title: string;
  startPage: number;
  icon: string;
}

export const chapters: Chapter[] = [
  {
    id: 'intro',
    title: '手冊定位與理念',
    startPage: 3,
    icon: '📖',
  },
  {
    id: 'chapter-1',
    title: '第一章：AI是什麼？我也能懂！',
    startPage: 1,
    icon: '🤖',
  },
  {
    id: 'chapter-2',
    title: '第二章：怎麼和 AI 溝通？',
    startPage: 9,
    icon: '💬',
  },
  {
    id: 'chapter-3',
    title: '第三章：AI小任務—我來試試看！',
    startPage: 21,
    icon: '🎯',
  },
  {
    id: 'chapter-4',
    title: '第四章：AI說的一定對嗎？',
    startPage: 33,
    icon: '🤔',
  },
  {
    id: 'chapter-5',
    title: '第五章：AI幫助我學習',
    startPage: 38,
    icon: '📚',
  },
  {
    id: 'chapter-6',
    title: '第六章：AI時代的好公民',
    startPage: 52,
    icon: '🌟',
  },
];

export const TOTAL_PAGES = 74;
