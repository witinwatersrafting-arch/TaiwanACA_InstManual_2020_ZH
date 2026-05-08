---
description: Blog 文章一對一高效遷移 (V3 - 沉浸遊記模式)
---

# Blog 文章遷移 Workflow (V3) - 沉浸遊記模式

## 核心目標
每次對話僅遷移「一篇」文章，徹底拋棄 `MagazineArticle`, `MagazineHero` 等複雜組件，改用 **「看圖說故事」的沉浸遊記風格**。強調視覺協調、排版簡潔、內容連貫。

## 核心原則 (V3 Style Standard)
1. **拒絕壓迫感**：禁止使用 90vh 的巨大 Hero 或滿屏圖片。
2. **視覺協調**：優先考慮圖文比例，標題與內文層級分明但不過度誇大。
3. **沉浸式敘事**：圖片必須緊隨其說明的文字，或文字緊隨其展示的圖片。
4. **禁止組件化**：直接在 `.astro` 檔案中使用標準 HTML/Tailwind 類，不再使用 `Magazine*` 或 `BlogVisual` 組件。
5. **移除特效**：不要「首字下沉 (Drop Cap)」，不要複雜的圖片網格，回歸單純的圖文流。

## 執行流程

1. **內容分析 (Analysis)**：
   - 提取 legacy HTML (EN & ZH)。
   - 分析文章的「故事線」：哪些圖片對應哪些段落？

2. **頁面重構 (Re-engineering)**：
   - 使用 `Layout.astro` 作為佈局。
   - **必須導入 V3 原子組件**：
     ```astro
     import TravelogueHero from "../../components/blog/v3/TravelogueHero.astro";
     import TravelogueArticle from "../../components/blog/v3/TravelogueArticle.astro";
     import TravelogueFigure from "../../components/blog/v3/TravelogueFigure.astro";
     import TravelogueGrid from "../../components/blog/v3/TravelogueGrid.astro";
     import TravelogueCTA from "../../components/blog/v3/TravelogueCTA.astro";
     ```
   - **組件使用規範**：
     - `<TravelogueHero title="..." subtitle="..." image="..." category="..." lang="..." />`
     - `<TravelogueArticle>` 包裹全文。
     - `<TravelogueFigure src="..." alt="..." caption="..." />` 用於單圖。
     - `<TravelogueGrid cols={2} caption="...">` 用於多圖網格。
     - `<TravelogueCTA lang="..." />` 放置於 `</TravelogueArticle>` 之前。

3. **視覺細節**：
   - 標題：`h2 class="text-3xl font-serif font-bold text-gray-900 mt-20 mb-8 border-l-4 border-[#f3ff00] pl-6"`。
   - 連結：`class="text-black font-bold border-b-2 border-[#f3ff00]/30 hover:border-[#f3ff00] transition-colors"`。
   - 引用：使用標準 `blockquote` 搭配 `font-serif`。

3. **連結處理**：
   - 務必使用 `l()` 工具包裹內部連結。
   - 鏈接樣式：`class="text-black font-bold border-b-2 border-[#f3ff00]/30 hover:border-[#f3ff00] transition-colors"`.

4. **SEO 與導航**：
   - 設定標準 SEO 元數據。
   - 底部保留簡單的「呼籲行動 (CTA)」。

## 交接作業 (Handoff)
- 總結已完成的文章。
- 根據 `src/data/blog.ts` 的剩餘文章，產出下一輪對話的 Prompt。
