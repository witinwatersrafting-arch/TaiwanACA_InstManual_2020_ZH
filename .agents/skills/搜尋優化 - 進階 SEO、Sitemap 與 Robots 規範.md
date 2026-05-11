# 檔案 4：進階 SEO、高效能渲染與搜尋權威規範 (Technical SEO & Performance Guidelines)

## 0. 核心設計原則：效能即 SEO (Performance is SEO)
依據 `seo.html` 的成功實踐，優質的 SEO 不僅是 Meta 標籤，更包含「極致的資源調度」與「清晰的實體關係」。

---

## 1. 效能優化與資源調度 (Performance Hints & Preloading)
在 `<head>` 中必須包含以下「效能暗示」標籤，以優化核心網頁指標 (Core Web Vitals)：

### A. 域名預解析與連接
- **Preconnect**：針對重要外部資源（如 Google Fonts）。
  ```html
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  ```
- **DNS-Prefetch**：針對第三方工具（如 Analytics, GTM, Kit）。
  ```html
  <link rel="dns-prefetch" href="https://www.googletagmanager.com">
  ```

### B. 關鍵資源預載入 (LCP 優化)
- **Hero Image**：所有頁面的首屏大圖必須使用 `preload` 並加上 `fetchpriority="high"`。
  ```html
  <link rel="preload" as="image" href="/images/hero.webp" fetchpriority="high">
  ```
- **字體非同步載入**：避免字體阻塞渲染。
  ```html
  <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=...&display=swap">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=...&display=swap" media="print" onload="this.media='all'">
  ```

---

## 2. 搜尋語義與權威實體 (Metadata & Structured Data)

### A. 基礎與社群標籤 (必須 100% 覆蓋)
- **Title/Description**：長度分別控制在 30-60 字元與 120-150 字元。
- **Canonical**：必須使用**絕對路徑**且**嚴禁包含 .html**。
- **OG & Twitter Cards**：確保圖片網址為絕對路徑。

### B. JSON-LD 進階結構化數據 (Graph Linking & Labeling)
不應僅使用單一的 `WebSite` 標籤，應建立實體間的關聯。同時，**所有頂層 Schema 實體（如 FAQPage, BreadcrumbList）必須具備 `name` 屬性**，以防止 Google Search Console 報表將其顯示為「未命名的項目」。
```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "name": "Paddles on the Nile",
      ...
    }
  ]
}
```

---

## 3. 多語系與權威發布 (I18n & Feeds)

### A. Hreflang 矩陣 (必須遵守)
每一頁必須包含自己以及所有對應語言版本的宣告：
```html
<link rel="alternate" hreflang="en" href="https://uganda-rafting.com/page/" />
<link rel="alternate" hreflang="zh-TW" href="https://uganda-rafting.com/zh/page/" />
<link rel="alternate" hreflang="x-default" href="https://uganda-rafting.com/page/" />
```

### B. RSS Feed
包含 RSS 宣告有助於爬蟲更快發現內容更新。
```html
<link rel="alternate" type="application/rss+xml" title="RSS Feed" href="/rss.xml">
```

---

## 4. 穩定性與無障礙 (Stability & Accessibility)

### A. 視覺穩定性 (CLS 優化)
- **影像佔位**：所有 `<img>` 標籤必須明確標註 `width` 與 `height` 屬性。
- **字體 Swap**：CSS 中必須包含 `font-display: swap;` 避免文字閃爍。

### B. 無障礙路徑
- **跳過內容連結**：在 `<body>` 啟始處加入跳過連結。
  ```html
  <a href="#main-content" class="sr-only focus:not-sr-only">跳到主要內容</a>
  ```

---

## 5. 網站地圖 (Sitemap.xml) 與 Robots.txt
- **Sitemap**：必須包含 Hreflang 資訊，且必須是絕對路徑。
- **Robots.txt**：必須明確指向 Sitemap 定位。

---

## 6. Agent 執行檢核清單 (Reviewers Checklist)
在使用 `Build Agent` 或 `Reviewer Agent` 時，請檢查：
1. [ ] 網址是否已去除 `.html` 並符合斜線規範？
2. [ ] 是否已 Preload 當前頁面的 Hero Image？
3. [ ] 是否已加入 JSON-LD 結構化數據且包含 `name` 屬性（避免 GSC 未命名項目）？
4. [ ] 影像標籤是否有 `width` 和 `height`？
5. [ ] Hreflang 連結是否為絕對路徑？
