---
description: Astro 組件國際化 (i18n) 遷移工作流
---

此工作流用於將 Astro 組件從硬編碼文字遷移到基於 `src/utils/i18n.ts` 的多語系架構。

### 步驟 1: 內容審查與提取
1.  **掃描文字**：識別組件中所有硬編碼的英文文字。
2.  **掃描連結**：識別所有內部導航連結（例：`/blog/`）。
3.  **掃描無障礙標籤**：檢查 `aria-label` 正確性和對應翻譯。

### 步驟 2: 更新 i18n 資料庫
1.  **英文翻譯**：在 `src/utils/i18n.ts` 的 `en` 對象中新增鍵值對，前綴建議為組件名（例：`hero.title`）。
2.  **中文翻譯**：在 `zh` 對象中新增對應的中文字串。
3.  **驗證語法**：確保 JSON 對象中沒有遺漏的逗號或重複的鍵，保持結構完整。

### 步驟 3: 修改 Astro 組件
1.  **Props 宣告**：
    ```astro
    interface Props {
      lang?: 'en' | 'zh';
    }
    const { lang = 'en' } = Astro.props;
    ```
2.  **導入工具**：
    ```astro
    import { useI18n } from '../utils/i18n';
    const { t, l } = useI18n(lang);
    ```
3.  **替換文字**：
    *   一般文字：`{t('key')}`
    *   含有 HTML 的文字：`<p set:html={t('key')} />`
4.  **替換連結**：使用 `{l('/path/')}` 包裝所有連結。
5.  **處理 Image 組件**：確保 `alt` 屬性也使用 `t()`。

### 步驟 4: 動態數據隔離 (如有必要)
1.  **JS 數據提取**：如果組件內部有 JS array 或 JSON 數據，應移至 `src/data/` 並支持語系切換。
2.  **傳入 Script**：使用 `define:vars` 將翻譯後的數據傳入客戶端腳本。

### 步驟 5: 頁面同步
1.  **確認 `zh/` 目錄**：確保對應頁面（如 `src/pages/zh/index.astro`）已使用組件並傳遞 `lang={lang}`。
### 步驟 6: 效能校準 (LCP Optimization)
1.  **檢查字體加載**：全面使用系統字型 (System Fonts) 作為中文顯示（例如 `PingFang TC`, `Microsoft JhengHei`），零 Payload 載入。禁止在中文版載入 Google Fonts 的中文字體。並且利用 CSS 關閉中文版的斜體（italic）。
2.  **LCP 圖片校驗**：中文版首屏圖片必須使用 `LCPImage` 並正確傳遞 `lang`。
3.  **預防 FOIT**：確認 `font-display: swap` 以避免內容直到字體載入前完全不可見。
