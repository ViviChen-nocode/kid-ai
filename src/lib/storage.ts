// localStorage utilities for user data persistence

const STORAGE_KEYS = {
  USER_NAME: 'userName',
  USER_ROLE: 'userRole',
  LAST_PAGE: 'lastPage',
  QUIZ_SCORE: 'quizScore',
  QUIZ_COMPLETED: 'quizCompleted',
} as const;

export const storage = {
  getUserName: (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.USER_NAME);
  },

  setUserName: (name: string): void => {
    localStorage.setItem(STORAGE_KEYS.USER_NAME, name);
  },

  getUserRole: (): number | null => {
    const role = localStorage.getItem(STORAGE_KEYS.USER_ROLE);
    return role ? parseInt(role, 10) : null;
  },

  setUserRole: (role: number): void => {
    localStorage.setItem(STORAGE_KEYS.USER_ROLE, role.toString());
  },

  getLastPage: (): number => {
    const page = localStorage.getItem(STORAGE_KEYS.LAST_PAGE);
    return page ? parseInt(page, 10) : 1;
  },

  setLastPage: (page: number): void => {
    localStorage.setItem(STORAGE_KEYS.LAST_PAGE, page.toString());
  },

  getQuizScore: (): number | null => {
    const score = localStorage.getItem(STORAGE_KEYS.QUIZ_SCORE);
    return score ? parseInt(score, 10) : null;
  },

  setQuizScore: (score: number): void => {
    const currentBest = storage.getQuizScore();
    if (currentBest === null || score > currentBest) {
      localStorage.setItem(STORAGE_KEYS.QUIZ_SCORE, score.toString());
    }
  },

  isQuizCompleted: (): boolean => {
    return localStorage.getItem(STORAGE_KEYS.QUIZ_COMPLETED) === 'true';
  },

  setQuizCompleted: (completed: boolean): void => {
    localStorage.setItem(STORAGE_KEYS.QUIZ_COMPLETED, completed.toString());
  },

  clearAll: (): void => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  },
};
