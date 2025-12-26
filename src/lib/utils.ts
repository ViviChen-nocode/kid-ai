import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 檢測是否在 Line 瀏覽器中
 */
export function isLineBrowser(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = window.navigator.userAgent.toLowerCase();
  return ua.includes('line/') || ua.includes('lineweb');
}

/**
 * 將 Canvas 轉換為圖片 URL
 * @param canvas - Canvas 元素
 * @returns 圖片的 data URL
 */
export function canvasToImageUrl(canvas: HTMLCanvasElement): string {
  return canvas.toDataURL('image/png');
}

/**
 * 下載圖片（使用 data URL）
 * @param dataUrl - 圖片的 data URL
 * @param filename - 檔案名稱
 */
export function downloadImage(dataUrl: string, filename: string): void {
  try {
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    
    // 將連結添加到 DOM，觸發點擊，然後移除
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('下載失敗:', error);
    // 如果下載失敗，嘗試在新視窗中打開
    window.open(dataUrl, '_blank');
  }
}
