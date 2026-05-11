# 住宿頁面開發規範 (Accommodation Skills)

**適用範圍**：所有提供住宿、房型展示與當地生活資訊的頁面。

### 1. 結構化資料 (JSON-LD Schema)
必須在 `<head>` 區塊內嚴格套用 `@type: Accommodation` 的結構，並包含 `amenityFeature` 陣列來列出設施。
- **標準範本**：
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Accommodation",
    "name": "[填入住宿名稱]",
    "description": "[填入描述]",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Bujagali",
      "addressRegion": "Jinja",
      "addressCountry": "Uganda"
    },
    "priceRange": "[填入價格，例如 500,000 UGX per month]",
    "image": "[填入主圖 WebP 路徑]",
    "amenityFeature": [
      { "@type": "LocationFeatureSpecification", "name": "Secure Gated Compound", "value": true }
    ]
  }
  </script>

### 2. 核心視覺與佈局 (UI & Layout)
禁止模型自行發明 Tailwind Class，必須嚴格套用以下元件結構：

* **Hero Section (頂部主視覺)**
    * 高度鎖定 `h-[60vh]`。
    * 遮罩層必須為 `bg-black/40`。
    * 主標題字體：`text-4xl md:text-6xl font-serif font-bold text-white drop-shadow-lg`。
* **Pricing & Features (定價與特色區塊)**
    * 外層背景：`bg-black py-20`。
    * 定價數字：品牌黃色 `text-[#f3ff00] text-4xl md:text-5xl font-serif font-bold`。
    * 特色卡片 (玻璃透視)：`bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20`。
* **Gallery Grid (圖文展示網格)**
    * 網格容器：`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8`。
    * 圖片卡片：統一比例 `aspect-square`，外層 `group relative rounded-2xl overflow-hidden shadow-lg`。
    * 圖片特效：強制加上 `transition-transform duration-500 group-hover:scale-110 object-cover`。
    * 文字遮罩：`absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6`。
* **Text & Accents (文字與點綴)**
    * 小標題 (Eyebrow text)：`text-xs font-bold uppercase tracking-[0.3em] text-[#b2bb00]`。

### 3. 行動呼籲 (CTA)
針對即時客服與訂房引導，必須標準化 WhatsApp 按鈕樣式：
-   **Class 組合**：`bg-[#25D366] text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-[#1ebd5a] transition-all shadow-xl hover:-translate-y-1`。