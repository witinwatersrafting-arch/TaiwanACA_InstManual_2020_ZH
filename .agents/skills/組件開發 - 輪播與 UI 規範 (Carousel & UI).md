# UI Standard: Review Carousel (評價輪播組件)

## 1. 核心技術棧與限制
- **技術棧**：純 HTML5 + Tailwind CSS + Vanilla JS。嚴禁引入第三方輪播套件 (如 Swiper.js) 或前端框架。
- **單位限制**：嚴禁使用 `px`，強制使用 Tailwind 的 `rem` 系統與斷點 (`md:`, `lg:`)。
- **動態資料**：嚴禁串接外部即時 API。評論資料必須獨立提取為靜態 JSON Array 置於 `<script>` 中。
- **圖示與資源**：評分星星與左右控制按鈕強制使用 Inline SVG，嚴禁引入外部圖示庫 (如 FontAwesome)。

## 2. 佈局與互動規範 (UI/UX)
- **Mobile-First**：預設為橫向滾動容器 (`flex overflow-x-auto w-full`)，並透過全域 CSS 隱藏原生滾動條。
- **原生滑動 (Swipe)**：強制套用 CSS Scroll Snap (`snap-x snap-mandatory`)。單一卡片設定 `snap-center shrink-0 w-full`，依賴行動裝置原生觸控硬體加速。
- **Desktop 適配**：`md:` 斷點以上，卡片寬度改為 `md:w-[calc(33.333%-1rem)]` (單屏顯示三則)，並於容器兩側顯示左右控制按鈕。
- **JS 邏輯**：JS 僅處理桌機版按鈕點擊，綁定 `scrollBy({ left: +/- clientWidth, behavior: 'smooth' })`，不處理 `touch` 事件。
- **DOM 渲染邏輯**：強制使用 Template Literals (反引號) 結合陣列的 `.map().join('')` 將卡片字串化後一次性 `innerHTML` 注入容器，嚴禁使用 `document.createElement` 逐一堆疊節點。

## 3. 資料結構 (Data Schema)
必須依賴以下資料結構進行 DOM 渲染：
```javascript
const reviews = [
  { platform: 'Google Maps', author: 'Name', text: 'Review content...', rating: 5, url: '...' }
];
```

## 4. 信任度與 SEO 實作 (Trust Signals & SEO)
- **外部驗證**：區塊底部或側邊需提供靜態按鈕，明確導向真實的 Google Maps 與 TripAdvisor 商家實體頁面。
- **Schema.org**：實作此區塊時，必須同步更新 `<head>` 內的 JSON-LD，在 `TravelAgency` 節點下插入 `aggregateRating` 屬性與真實加總數據。

## 5. 部署與同步工作流
- **多語系同步**：完成英文主頁 `index.html` 寫入後，必須依照多語系架構同步移植並翻譯至 `/zh/index.html`。
- **組件同步腳本**：修改完成後，若有動到全站共用區塊，必須執行 `python scripts/sync.py` 確保組件一致性。
