# 檔案 1：前端開發標準與佈局手冊 (Frontend Skills)

## 1. 核心開發原則 (Golden Rules)

- **全面行動優先 (Mobile-first)**：預設樣式必須針對手機端撰寫。僅允許使用 `md:`, `lg:`, `xl:` 斷點進行擴充與覆寫。使用 Tailwind 4 的容器查詢或彈性佈局時需確保極窄螢幕 (320px) 不崩潰。
- **語意化結構**：強制使用 `<header>`、`<main>`、`<section>`、`<article>`、`<footer>` 劃分區塊。
- **i18n 內部連結 (Local Routing)**：為確保語系路徑正確且符合 SEO，嚴禁硬編碼連結。必須使用 **`l('/path')`** 輔助函數（來自 `useI18n(lang)`）來生成連結，確保自動加上 `/zh/` 前綴並移除 `.html`。
- **標題階層**：嚴格遵循 `<h1>` 至 `<h6>` 建立標題階層。
- **絕對禁用 px (No Pixels)**：除 1px 邊框外，全面使用 `rem`, `em`, `%` 或 `vh/vw`。

## 2. 佈局與排版指令集 (Layout Toolbox)

### 全域尺寸與邊界對齊

- **主區塊寬度限制**：統一使用 `w-full max-w-[100rem] mx-auto` 控制最大寬度與絕對居中，維持全站視覺一致性。
- **彈性內距 (Padding)**：依據裝置套用不同內距，例如手機端 `px-4` 或 `px-6`，桌機端 `md:px-10`。

### 響應式佈局 (Flex & Grid 策略)

- **Flex 切換**：適用於導覽列或單一維度對齊。手機端 `flex flex-col` $\rightarrow$ 桌機端 `md:flex-row`，並搭配 `justify-between`, `items-center`。
- **Grid 網格策略**：
  - **全域框架骨架**：預設使用 `grid grid-cols-1 md:grid-cols-12 gap-[1.5rem]`。
  - **內容卡片自適應**：使用 `grid-cols-1` (手機) $\rightarrow$ `md:grid-cols-2` (平板) $\rightarrow$ `lg:grid-cols-3` (桌機) 實現自動折行與佈局適應。

### 字體縮放策略 (Typography)

- **大標題 (Hero/H1)**：強制使用流體字體 `text-[clamp(1.5rem,5vw,3rem)]` 確保跨裝置無縫平滑縮放。
- **一般內文 (Body)**：使用斷點縮放 `text-[1rem] md:text-[1.125rem]` 維持閱讀排版的整齊度與易讀性。

## 3. 防禦性排版與互動規範 (Defensive CSS)

- **防破版機制**：
  - **圖片限制**：強制設定 `w-full object-cover`，並搭配 `aspect-` 維持比例。
  - **文字溢出**：長字串與網址強制套用 `break-words`；對於 Email 連結 (`mailto:`) 必須強制套用 `break-all`。
  - **容器安全**：Flex 容器必須考慮加入 `flex-wrap` 或 `overflow-x-auto`，防止手機端內容擠壓變形。
  - **行動端寬度預算**：手機版導覽列 (Navbar) 內容總寬度（Logo + 語言按鈕 + 漢堡選單 + 間距）嚴禁超過 **375px**。優先透過 `px-4` 或標題字體縮放進行優化。
- **觸控標準 (A11y)**：互動元素（Button/Input）高度至少需達 `h-11` (約 44px)。
- **媒體效能 (Media Performance)**：
  - **LCP 元素**：頁面首圖 (Hero Image) 必須使用 `loading="eager"` 並加上 **`fetchpriority="high"`**。
  - **非首屏媒體**：所有圖文內容區的 `<img>` 或 `<iframe>` 必須使用 **`loading="lazy"`**。
  - **CLS 防護**：所有圖像必須明確標註 `width` 與 `height` 屬性，或使用 `aspect-square` / `aspect-video` 固定顯示比例，防止載入時的版面跳動。
- **動態效能優化**：
  - **硬體加速**：使用 `transform: translate3d(0, y, 0)` 觸發 GPU 優化。
  - **背景優化**：對複雜動畫元素設定 `will-change: transform`。

### V3 沉浸式遊記組件 (V3 Immersive Travelogue)

當開發部落格或故事頁面時，強制採用 **`src/components/blog/v3/`** 下的原子組件：
- **TravelogueHero**：具備全螢幕視覺感與 LCP 優化。
- **TravelogueArticle**：提供最適閱讀寬度 (Max-w-3xl) 與字體排版。
- **TravelogueFigure**：標準化的圖文說明組件（內建 Lazy Loading）。
- **TravelogueGrid**：用於對比展示（如：Matatu vs Rolex）。
- **TravelogueCTA**：位於文末的預訂導引區塊，連結應自動對齊當前語系。

## 4. 常用組件範本庫 (Component Library)

### 響應式導覽列 (Navbar)

- **臨界值保護**：手機版導覽列內容總寬度嚴禁超過 **375px**。優先透過 `px-4` 或標題字體縮放進行優化。
- **桌機切換**：透過 `md:flex` 切換為水平排列，隱藏漢堡按鈕 (`md:hidden`)。
- **i18n 切換**：語言按鈕必須動態對應當前路徑的 `/zh/` 切換，使用 `src/utils/i18n.ts` 工具。

### 產品與特點網格 (Feature Grid)

- **結構**：父容器 `grid grid-cols-1 md:grid-cols-3 gap-[2rem]`。
- **卡片樣式**：子元素 `p-[2rem] rounded-[1rem] border`。

### 頁尾 (Footer)

- **結構**：父容器 `flex flex-col md:flex-row justify-between`。
