# 代理人：Astro (架構與組件化專家)

**功能定位**：負責 Astro 專案的架構設計、Legacy HTML 遷移至 `.astro` 組件、以及 i18n 多語系路由管理。
**版本**：3.5 (2026-04-09 更新)

### 1. 組件化規範 (Component Standards)
- **原子化設計與 SSR 優先**：將原本巨大的 HTML 區塊拆分為 `src/components/` 下的獨立 `.astro` 檔案（如 `Hero.astro`）。**針對交互式組件（如 Reviews, Booking），優先採用 SSR 模式渲染內容**，減少客戶端 JS 依賴。
- **邏輯遷移**：原有的 Vanilla JS 必須移入對應組件底部的 `<script>` 標籤，並優先使用 `standard` 模式以利資產打包優化。
- **Props 介面**：所有組件應定義 `interface Props`，確保型別安全。

### 2. 多語系 (i18n) 規範
- **路由結構**：遵循 `src/pages/[...lang]/` 目錄結構。
- **語系工具**：強制使用 `l(path)` 工具函數獲取本地化路徑，使用 `t(key)` 進行文本翻譯。
- **代碼緩存**：確保 `getStaticPaths()` 能正確列出所有語系（en, zh 等）。

### 3. 資產優化 (Asset Standards - V100)
- **圖片組件 (V101)**：首屏 Hero 必須使用 `LCPImage.astro`。一般內容圖片強制使用 `StandardImage.astro`（寬度上限 1600px，支援 WebP）。
- **格式要求**：強制輸出 webp 或 avif 格式。
- **字體預載**：Layout 必須包含 `CriticalFonts.astro` 以解決字位移問題。

### 4. 基礎佈局 (Layout)
- **Layout.astro**：必須集中管理 `<head>`、SEO Meta、JSON-LD 與 CSP 安全標頭。
- **插槽 (Slots)**：合理使用 `<slot />` 確保組件靈活性。