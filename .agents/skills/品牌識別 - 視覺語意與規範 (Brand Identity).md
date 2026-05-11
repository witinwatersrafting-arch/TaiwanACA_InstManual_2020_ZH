# 視覺識別與品牌指南 (Brand Identity Standards)

**功能定位**：定義 "Paddles on the Nile" 的核心美學標準。不論是 Logo 設計、網頁排版、社群貼文或圖片浮水印，皆必須嚴格遵守此規範，以維持「在地根植且高端專業」(Local Rooted & Premium) 的品牌形象。

## 1. 核心視覺語彙 (Visual Essence)
*   **關鍵字**：野性 (Wild)、極速 (Rapid)、純粹 (Pure)、專業 (Professional)。
*   **視覺對比**：採用「高對比、暗色系」為主軸，利用螢光黃與加粗標題營造衝擊感。
*   **氛圍**：像是在尼羅河噴濺的水花中感受到的一抹亮色，充滿活力且絕對安全。

## 2. 色彩規範 (Color Palette)
| 用途 | 色碼 (HEX) | 名稱 | 視覺權重 |
| :--- | :--- | :--- | :--- |
| **主打標示色** | `#f3ff00` | **Electric Lime** | 點睛、按鈕、關鍵字 (僅限深色背景) |
| **無障礙輔助色** | `#747a00` | **Accessible Moss** | 淺色背景下的品牌文字/標籤 (WCAG AA 4.5:1) |
| **底層基調色** | `#000000` | **Absolute Black** | 背景、導航列、深邃感 |
| **輔助強調色** | `#dcee00` | **Neon Moss** | Hover 狀態、漸層補償 |
| **內容文字色** | `#FFFFFF` / `#e5e7eb` | **Off-White** | 正文、主要訊息 |

## 3. 字體系統 (Typography)
### 英文排版 (English)
*   **標題 (Headings)**: `Playfair Display`, Serif.
    *   *用途*：展現權威性、歷史感。用於 H1, H2, 與品牌名稱。
    *   *屬性*：加粗 (Bold), 較寬的字間距 (Tracking).
*   **內文與 UI (Body & UI)**: `Montserrat`, Sans-serif.
    *   *用途*：展現現代感、易讀性。用於正文、按鈕、導航列。
    *   *屬性*：中性、專業、全大寫 (用於選單).

### 繁體中文排版 (Traditional Chinese)
*   **標題 (Headings)**: `Noto Sans TC` (思源黑體), Sans-serif.
    *   *用途*：展現戶外野性力量、壓制單薄感。用於所有中文版 H1, H2。
    *   *屬性*：極粗體 (`font-black`), 縮緊字距 (`tracking-tight` 或 `tracking-tighter`), 全大寫以避免高度不均 (`uppercase`)。
    *   *範例*：`<h2 class="text-4xl lg:text-7xl font-sans font-black tracking-tighter uppercase">...</h2>`
*   **內文與 UI (Body & UI)**: `Noto Sans TC`, Sans-serif.
    *   *用途*：正文、卡片敘述。
    *   *屬性*：中性、保持適當行高 (`leading-relaxed`)。

## 4. Logo 設計指導方針 (Logo Design Principles)
在設計 Logo 或其變體時，必須遵循：
*   **簡練感**：避免過度複雜的插畫，優先使用幾何線條勾勒槳葉 (Paddle) 或波浪 (Waves)。
*   **負空間應用**：利用黑色背景與螢光黃的強大反差，創造即使縮小也能辨識的輪廓。
*   **排版結構**：
    *   "Paddles" 字樣需具備主導地位。
    *   建議採用「圖標(Icon) + 文字(Logotype)」並行的結構。
*   **嚴禁行為**：
    *   禁止使用過時的漸層色（除非是微小的陰影處理）。
    *   禁止使用圓潤、可愛、或卡通化的字體。
    *   禁止將 Logo 顏色設為與背景對比度不足的深藍或深紅。

## 5. UI/UX 質感細節 (Skills Details)
*   **玻璃擬態 (Glassmorphism)**: 導航列需使用 `backdrop-blur-md` 與 `bg-black/50`。
*   **圓角規範**: 按鈕與圖片外框統一使用 `rounded-xl` 或 `rounded-full`。
*   **互動反饋**: 所有可點擊元素必須具備 `transition-all` 與微小的 `scale` 或 `opacity` 變化。

---
**版本**：1.0
**最後更新**：2026年3月19日
