---
description: 自動化 SEO 效能與語義優化流程 (Review-Build-Audit)
---

這個工作流將針對 Astro 專案進行「全自動化」的 SEO 與載入效能升級：

1. **第一步：SEO 與無障礙缺口分析 (稽核)**
   呼叫 @Reviewer 讀取 `skills/搜尋優化 - 進階 SEO、Sitemap 與 Robots 規範.md` 並掃描目標 Astro 檔案（例如 `src/pages/**.astro` 與 `src/layouts/Layout.astro`）。找出所有不符合高級標準的缺失（包括 Preload, Preconnect, JSON-LD Graph, CLS 以及 **WCAG 色彩對比度**）。

2. **第二步：實施優化 (解決)**
   呼叫 @Build 讀取第一步產出的稽核報告，執行代碼變更。將缺失的效能標籤、結構化數據（動態傳入 Layout 的 Props）、影像尺寸屬性以及 **無障礙色彩修正 (使用 text-brand-accessible)** 精確補全。

3. **第三步：最終驗收 (整合驗證)**
   再次呼叫 @Reviewer 對完成優化後的 .astro 與 Layout 代碼進行二次掃描。確保 `Astro.props` 中的 SEO 參數與對比度標準（Contrast Ratio > 4.5:1）在翻譯（zh）與主語系（en）版本中皆已同步更新。

// turbo
4. **第四步：預覽與靜態檢查**
   執行 `npm run build` 產生 `dist/` 資料夾，並隨機檢查生成後的 `.html` 檔案，確保 Canonical 與 Hreflang 連結為絕對路徑且不含 `.html` 後綴。
