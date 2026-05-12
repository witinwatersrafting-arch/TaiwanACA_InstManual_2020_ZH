# [Workflow] 快速建立手冊單元 (Fast Manual Unit Creation)

此工作流旨在幫助使用者快速建立符合設計系統規格的 ACA 手冊單元，自動化處理 MDX 建立、Frontmatter 設定、組件導入與導航列同步。

## 準備階段 (Preparation)
- 確認新單元的標題 (中文/英文)
- 準備單元的引言描述 (中文/英文)
- 單元編號 (Unit Number)

## 執行步驟 (Execution Steps)

### 1. 建立 MDX 檔案 // turbo
在 `src/content/manual/` 下建立新的 MDX 檔案。檔案命名應為 `unit-XX.mdx`。
寫入標準的 Frontmatter 與 SectionHeader 組件：

```mdx
---
title: "第 X 單元：[中文標題]"
en_title: "[English Title]"
description: "[中文引言]"
en_description: "[English Intro]"
unit_number: X
---
import SectionHeader from "../../components/SectionHeader.astro";

<SectionHeader 
  titleZh="[中文標題]" 
  titleEn="[English Title]" 
  descZh="[中文引言]"
  descEn="[English Intro]"
/>

[在此處開始寫入內容...]
```

### 2. 自動同步 (Automated Sync)
由於 `Layout.astro` 已改為動態讀取，因此不需要手動更新導航列陣列。
只需確認 `src/content/config.ts` 內的 schema 是否支持新加入的欄位（通常已設定好）。

### 3. 驗證與建置 // turbo
執行建置指令確保無路徑引用錯誤：
```bash
npm run build
```

## 使用範例 (Example)
使用者：「幫我加一個第 10 單元，標題是『進階救援技術』，描述是『學習複雜環境下的拖救與系統設立』。」
助理將自動執行上述步驟。
