# [Workflow] 建立新功能模式頁面 (Create New Mode Page)

此工作流用於在全站架構中新增一個大型功能模式（如：裝備清單、題庫、名錄等），自動化處理設定檔更新與頁面模板建立。

## 執行步驟 (Execution Steps)

### 1. 更新導航設定 (Update Navigation Config) // turbo
修改 `src/config/navigation.ts`，在 `modes` 陣列中加入新的配置。
請根據使用者提供的名稱自動生成適當的 `id` 與 `path`。

範例：
```typescript
{
  name: "[中文名稱]",
  en_name: "[English Name]",
  path: "[url-slug]",
  id: "[unique-id]"
}
```

### 2. 建立 Astro 頁面 (Create Astro Page) // turbo
在 `src/pages/[url-slug].astro` 建立新檔案，並使用 `StandardPage` 組件。
助理應根據內容自動產生雙語的 Hero 資訊。

模板：
```astro
---
import StandardPage from "../components/StandardPage.astro";
// 如果需要讀取內容集合，在此導入
---

<StandardPage 
  title="[全頁面標題]"
  badgeZh="[分類標籤中文]"
  badgeEn="[Category Label English]"
  heroTitleMainZh="[大標題中文]"
  heroTitleSubZh="[小標題中文]"
  heroTitleMainEn="[Main Title English]"
  heroTitleSubEn="[Sub Title English]"
  descriptionZh="[功能描述中文]"
  descriptionEn="[Function Description English]"
>
  <div class="space-y-12 py-12">
    <!-- 在此處填寫主要功能內容 -->
    <p class="text-slate-500 italic text-center">新模式頁面已建立，請開始填充內容...</p>
  </div>
</StandardPage>
```

### 3. 驗證與同步 (Verification) // turbo
執行建置檢查，確保新頁面與導航列同步顯示：
```bash
npm run build
```

## 使用範例 (Example)
使用者：「幫我新增一個『裝備檢查表』模式。」
助理將自動翻譯標題、更新設定並建立頁面。
