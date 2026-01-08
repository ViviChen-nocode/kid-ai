# 🤖 和你一起學 AI - 國小生 AI 學習手冊

[![專案預覽](./public/og-image.png)](https://kid-ai.vivichen.ai)

🌐 **線上預覽**：[https://kid-ai.vivichen.ai](https://kid-ai.vivichen.ai)

一個專為國小生設計的互動式 AI 學習手冊閱讀器，基於教育部《國小生生成式AI學習應用手冊》製作。

## ✨ 功能特色

### 📖 互動式閱讀體驗
- **翻頁式閱讀器**：模擬真實書本翻頁效果，提供流暢的閱讀體驗
- **章節目錄導航**：快速跳轉到各個章節，輕鬆瀏覽內容
- **閱讀進度記錄**：自動記錄閱讀進度，下次回來可繼續閱讀
- **響應式設計**：支援桌面和行動裝置，隨時隨地學習

### 🎯 AI 知識小測驗
- **10 道精選題目**：測試對 AI 知識的理解程度
- **即時反饋**：答題後立即顯示正確答案與詳細解釋
- **獎勵機制**：答對 7 題以上可獲得 AI 學習小達人獎勵卡

### 📝 AI 使用承諾卡
- **5 大承諾項目**：引導學生正確使用 AI 工具
  - 我會自己負責
  - 我會清楚分辨
  - 我會主動標記
  - 我會動腦判斷
  - 我會學會提問
- **個性化簽名**：可填寫簽名並下載成圖片保存
- **驗證機制**：確保所有承諾項目都已勾選才能下載

### 🎨 個人化體驗
- **角色選擇**：5 種可愛角色可選擇
- **使用者名稱**：個人化的歡迎訊息
- **進度追蹤**：記錄閱讀進度和測驗成績

## 🚀 快速開始

### 環境需求
- Node.js 18+ 
- npm 或 yarn

### 安裝步驟

```bash
# 1. 克隆專案
git clone https://github.com/ViviChen-nocode/kid-ai.git
cd kid-ai-reader

# 2. 安裝依賴
npm install

# 3. 啟動開發伺服器
npm run dev
```

開啟瀏覽器訪問 `http://localhost:5173` 即可開始使用。

### 建置生產版本

```bash
# 建置
npm run build

# 預覽建置結果
npm run preview
```

## ✅ 專案必備元素檢查清單

### 📸 圖片資源 (放在 `public/` 目錄)

#### Favicon 圖示（必須）
- ✅ `favicon.ico` - 傳統 favicon（16x16 或 32x32，建議 32x32）
- ⚠️ `favicon-16x16.png` - 16x16 PNG 格式（建議新增）
- ⚠️ `favicon-32x32.png` - 32x32 PNG 格式（建議新增）

#### PWA 圖示（已設定）
- ✅ `apple-touch-icon.png` - Apple Touch Icon（180x180）
- ✅ `icon-192.png` - Android 圖示（192x192）
- ✅ `icon-512.png` - PWA 圖示（512x512）

#### 社交媒體分享圖（已設定）
- ✅ `og-image.png` - Open Graph 分享圖（1200x630 像素）
  - 用於 Facebook、Twitter、LinkedIn 等社交平台分享預覽

### 🔧 HTML Meta Tags 設定

專案的 `index.html` 已包含完整的 meta tags 設定：

- ✅ 基本資訊（標題、描述、關鍵字、作者）
- ✅ Open Graph tags（Facebook、LinkedIn 等）
- ✅ Twitter Card tags
- ✅ PWA 相關設定
- ✅ Google Analytics 追蹤

### 📱 PWA Manifest 設定

`public/manifest.json` 已正確設定：
- ✅ 應用程式名稱和描述
- ✅ 圖示設定（192x192, 512x512）
- ✅ 主題色彩
- ✅ 顯示模式

### 📊 Google Analytics 設定

專案已整合 Google Analytics（追蹤 ID: `G-BERZ25MNER`），設定位置在 `index.html` 的 `<head>` 區塊最上方。

如需修改追蹤 ID，請編輯 `index.html` 中的以下位置：
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-BERZ25MNER"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-BERZ25MNER');
</script>
```

## 📁 專案結構

```
kid-ai-reader/
├── public/                 # 靜態資源
│   ├── pages/             # 手冊頁面圖片
│   ├── role*.png          # 角色圖片
│   ├── favicon.ico        # Favicon
│   ├── apple-touch-icon.png  # Apple Touch Icon
│   ├── icon-192.png       # PWA 圖示 192x192
│   ├── icon-512.png       # PWA 圖示 512x512
│   ├── og-image.png       # Open Graph 分享圖
│   └── manifest.json      # PWA 設定
├── src/
│   ├── components/        # React 元件
│   │   ├── FlipbookReader.tsx    # 翻頁閱讀器
│   │   ├── QuizModal.tsx         # 測驗模態框
│   │   ├── WorksheetModal.tsx    # 承諾卡模態框
│   │   ├── WelcomeScreen.tsx      # 歡迎畫面
│   │   ├── Sidebar.tsx            # 側邊欄（桌面版）
│   │   ├── MobileMenu.tsx         # 選單（行動版）
│   │   └── ui/                    # UI 元件庫
│   ├── lib/               # 工具函數
│   │   ├── chapters.ts    # 章節資料
│   │   ├── quizData.ts    # 測驗題目
│   │   └── storage.ts     # 本地儲存
│   ├── pages/             # 頁面元件
│   └── hooks/             # 自訂 Hooks
└── package.json
```

## 🛠️ 技術棧

- **前端框架**：React 18 + TypeScript
- **建置工具**：Vite
- **樣式**：Tailwind CSS
- **UI 元件**：Radix UI + shadcn/ui
- **路由**：React Router
- **狀態管理**：React Hooks + LocalStorage

## 📚 章節內容

1. **手冊定位與理念** 📖
2. **第一章：AI是什麼？我也能懂！** 🤖
3. **第二章：怎麼和 AI 溝通？** 💬
4. **第三章：AI小任務—我來試試看！** 🎯
5. **第四章：AI說的一定對嗎？** 🤔
6. **第五章：AI幫助我學習** 📚
7. **第六章：AI時代的好公民** 🌟

## 🎯 使用說明

### 首次使用
1. 進入網站後，輸入你的名字
2. 選擇一個喜歡的角色
3. 開始閱讀手冊內容

### 閱讀手冊
- 使用左右箭頭或點擊頁面來翻頁
- 點擊側邊欄的章節標題可快速跳轉
- 閱讀進度會自動保存

### 參與測驗
1. 點擊「小小測驗王」進入測驗
2. 回答 10 道題目
3. 答對 7 題以上可下載獎勵卡

### 簽署承諾卡
1. 點擊「我的 AI 使用承諾」
2. 勾選所有 5 個承諾項目
3. 填寫簽名（可選）
4. 下載承諾卡圖片保存

## 📝 開發說明

### 新增章節
編輯 `src/lib/chapters.ts` 檔案，新增章節資訊：

```typescript
{
  id: 'chapter-7',
  title: '第七章：新章節標題',
  startPage: 75,
  icon: '🎉',
}
```

### 新增測驗題目
編輯 `src/lib/quizData.ts` 檔案，新增題目：

```typescript
{
  id: 11,
  question: '題目內容',
  options: ['選項1', '選項2', '選項3', '選項4'],
  correctAnswer: 1,
  chapter: '第一章',
  explanation: '解釋說明',
}
```

### 修改主題色彩
編輯 `index.html` 中的 theme-color：
```html
<meta name="theme-color" content="#F97316" />
```

同時需要更新 `public/manifest.json` 中的 `theme_color`：
```json
{
  "theme_color": "#F97316"
}
```

## 🔍 SEO 最佳實踐

專案已實作以下 SEO 最佳實踐：

1. ✅ **網站描述**：保持在 150-160 字元之間
2. ✅ **關鍵字**：已設定相關關鍵字
3. ✅ **Open Graph**：完整的 OG tags 設定
4. ✅ **Twitter Card**：Twitter 分享優化
5. ✅ **Canonical URL**：避免重複內容
6. ✅ **結構化資料**：可考慮添加 JSON-LD（未來擴充）

## 🤝 貢獻

歡迎提交 Issue 或 Pull Request！

## 📄 授權

本專案基於教育部《國小生生成式AI學習應用手冊》製作，僅供教育用途。

## 👤 作者

**Vivi Chen 大師姐**

- 網站架設者
- 專案維護者

Facebook 粉絲專頁: [大師姐 Vivi](https://www.facebook.com/viviche.sister)
Instagram: [@thevividai.vi](https://www.instagram.com/thevividai.vi)
個人網站: [https://vivichen.ai](https://vivichen.ai)
如有問題歡迎透過 [GitHub Issues](https://github.com/ViviChen-nocode/kid-ai/issues) 聯繫

## 🙏 致謝

- 教育部《國小生生成式AI學習應用手冊》內容提供
- 所有參與測試和提供建議的使用者

---

**讓 AI 成為孩子學習的好夥伴！** 🌟
