---
description: 船隻規格同步 (CSV 轉 JSON)
---

這個 Agent 專門負責維護「船隻規格資料庫」，確保 CSV 原始數據正確轉換為網頁格式：

1. **第一步：讀取與轉換數據**
   讀取 `_original_sources/Whitewater Kayaks Sheet.csv` 檔案。
   執行 `scratch/process_kayaks.js` 腳本，更新 `src/data/kayaks.json`。

// turbo
2. **第二步：網站預渲染檢查**
   執行 `npm run build`。
   確認新數據在 `src/pages/boat-specs.astro` 頁面顯示正常。

3. **第三步：同步結果回報**
   確認品牌 (Manufacture) 與船型 (Type) 的篩選清單已隨之更新。

---
**使用方式：**
修改 CSV 檔案後，輸入 `/boat-data-sync` 即可啟動。
