---
description: 在 PageSpeed 改善效能後，手動呼叫執行全方位穩定性驗證 (Stability Guard Check)
---

這個工作流將調用 @StabilityGuard 的邏輯，在用戶進行了可能影響功能（如載入順序、預載或 Lazy Load）的修訂後，進行快速回歸測試。

1. **第一步：組件與結構驗證 (Astro Component Integrity)**
   - 確保所有 Astro 組件屬性（如 `l(path)`, `t(key)`）在編輯後保持正確。
   - 檢查 `src/pages/` 與 `src/pages/zh/` 下的雙語頁面結構是否對等（如 Slug 是否正確同步）。

2. **第二步：驗證 LCP 與首屏 (LCP & Priority Check)**
   - 掃描 `src/layouts/Layout.astro` 的 `<head>` 區段，確保預載 (Preload) 的連結與當前頁面的首屏圖像路徑匹配。
   - 驗證 `Hero` 或 `TravelogueHero` 區塊的首圖是否有 `fetchpriority="high"` 及 `loading="eager"`。

3. **第三步：資源載入檢查 (Resources)**
   - 檢查非首屏圖像是否帶有 `loading="lazy"` 與 `decoding="async"`。
   - 確保所有外部腳本（如 Google Tag Manager, Map）皆已標記 `defer` 或 `async`，並未阻礙渲染。

4. **第四步：互動性與語系驗證 (UX/UI Consistency)**
   - 驗證 `Navbar` 的語言切換連結是否失效。
   - 快速檢查 Tailwind 字型縮放 (`clamp`) 與響應式容器是否因 `aspect-ratio` 的變更而變形，特別是 Hero 與 Figure 區塊。

5. **第五步：SEO 與 JSON-LD (Search Integrity)**
   - 驗證 Graph 結構化數據的閉合標籤與實體路徑是否因效能屬性注入而損壞。

6. **第六步：產出報告 (Output Report)**
   - 格式應參照 @StabilityGuard 的測試報告，明確標出受影響的模組或區塊。
