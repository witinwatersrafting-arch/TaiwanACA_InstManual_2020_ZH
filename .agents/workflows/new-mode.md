# [Workflow] 建立新功能模式頁面 (Create New Mode Page)

此工作流用於在全站架構中新增一個大型功能模式（如：裝備資料庫、計算器、特定專題等），自動化處理設定檔更新、導航列同步、UI 切換邏輯以及頁面模板建立。

## 執行步驟 (Execution Steps)

### 1. 更新導航與模式設定 // turbo
修改 `src/config/navigation.ts`：
- 在 `modes` 陣列中加入新模式。
- 建立專屬的導航陣列（如 `myNewModeNav`）用於側邊欄細項。

```typescript
// 1. 加入主模式
export const modes = [
  ...
  {
    name: "[中文名稱]",
    en_name: "[English Name]",
    path: "/[url-slug]",
    id: "[unique-id]"
  }
];

// 2. 加入子導航項 (選填)
export const myNewModeNav = [
  { id: "section1", zh: "章節一", en: "Section One", slug: "section-1-id" },
];
```

*附註：前端 `<ModeSwitcher />` 元件已實作自動分段邏輯，每列最多顯示三個 Mode 按鈕，因此只需放心在 `navigation.ts` 中新增項目，UI 會自動換列排列，確保手機版易用性。*

### 2. 同步側邊欄與 UI 切換邏輯 // turbo
為了確保切換模式時側邊欄能正確顯示對應內容，需更新以下兩處：

1. **`src/components/navigation/Sidebar.astro`**:
   - 導入新導航陣列。
   - 新增 `isNewModePage` 判斷變數。
   - 在 `<nav>` 中加入對應的 `<NavSection />`。

2. **`src/scripts/ui.ts`** (在 `initModeSwitcher` 函式內):
   - 加入新頁面的路徑判斷邏輯。
   - 確保側邊欄區塊在對應模式下 `classList.remove("hidden")`。

### 3. 建立 Astro 頁面 // turbo
在 `src/pages/[url-slug].astro` 建立新檔案，必須使用 `StandardPage` 並配合 `SectionHeader`。

**標準模板：**
```astro
---
import StandardPage from "../components/StandardPage.astro";
import SectionHeader from "../components/SectionHeader.astro";
// 導入資料或元件...
---

<StandardPage 
  title="[全頁面 SEO 標題]"
  badgeZh="[分類標籤]"
  badgeEn="[Category]"
  heroTitleMainZh="[大標題]"
  heroTitleSubZh="[副標題]"
  heroTitleMainEn="[Main Title]"
  heroTitleSubEn="[Sub Title]"
  descriptionZh="[中文功能描述...]"
  descriptionEn="[English description...]"
  maxW="max-w-7xl" 
>
  <section class="mb-24">
    <SectionHeader 
      id="section-1-id"
      titleZh="[小節標題]"
      titleEn="[Sub-section Title]"
      descZh="[小節描述]"
      descEn="[Sub-section description]"
    />
    
    <!-- 內容區塊使用目前的佈局樣式：rounded-[2rem] 與 shadow-xl -->
    <div class="bg-white rounded-[2rem] p-8 md:p-12 border border-slate-100 shadow-xl shadow-slate-200/20">
       <p class="zh text-slate-600">中文內容...</p>
       <p class="en text-slate-500 italic">English content...</p>
    </div>
  </section>
</StandardPage>

<script>
  // 如果有交互邏輯，請務必處理 Astro View Transitions
  const init = () => {
    // 你的初始化邏輯
  };
  init();
  document.addEventListener('astro:page-load', init);
</script>
```

### 4. 內容佈局樣式規範
- **雙語容器**: 所有文字必須包裹在 `<span class="zh">` 或 `<span class="en">` 中（或對應 class）。
- **圓角與陰影**: 主要卡片容器使用 `rounded-[2rem]`, `shadow-xl`, `border-slate-100`。
- **色彩系統**: 重點色使用 `#4796cc` (或 `text-blue-600`)，背景使用 `bg-slate-50`。

### 5. 驗證與同步 // turbo
執行建置檢查，確保無引用錯誤：
```bash
npm run build
```

## 使用範例 (Example)
使用者：「我想新增一個『划槳長度計算器』模式。」
助理將翻譯標題、更新 navigation.ts、Sidebar.astro、ui.ts 並建立頁面。
