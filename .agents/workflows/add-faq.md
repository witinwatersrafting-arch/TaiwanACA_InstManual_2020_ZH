---
description: [add-faq] 尼羅河探險官網 FAQ 內容更新與 AEO 優化流
---

此工作流用於在官網的 FAQ 頁面新增內容，並自動同步具備「AEO 直接回答模式」的 Schema 結構化數據。

### 執行步驟

1. **分析需求**：確定 FAQ 所屬分類（top, kayak, travel, health, money, town, trans, indie）。
2. **分配 ID**：讀取 `src/utils/faq-data.ts`，在該分類下分配一個唯一的 ID（通常為下一個 q 序號，如 q6）。
3. **新增 ID**：
    - 將分配好的 ID 新增至 `src/utils/faq-data.ts` 中的對應分類陣列中。
4. **填入內容**：讀取 `src/utils/i18n.ts`，在 `en` 與 `zh` 區塊下分別新增：
    - `"faq.[category].[qId]": "問題標題字串"`
    - `"faq.[category].[aId]": "回答內容字串"`
5. **AEO 優化規範**：
    - 回答內容應包含一個直接、明確的首句。
    - 內容可包含語義化 HTML（如 `<p>`, `<ul>`, `<strong>`）。
6. **驗證與建置**：
    - 執行 `npm run build` 確保靜態 Schema 動態生成無誤。
    - AEO 優化（FAQPage, Breadcrumb Schema）會自動由頁面處理。

### 注意事項
- 嚴禁只修改 `en` 而不修改 `zh`，這會導致 TypeScript 型別報錯。
- 所有的 `aX` (Answer) 必須對應 `qX` (Question) 的 ID 序號。
