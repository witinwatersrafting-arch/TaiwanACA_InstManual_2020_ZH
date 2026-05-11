# 檔案 2：影片與媒體效能優化規格 (Media Optimization Skills)

## 1. 核心實作原則

- **最高效能標準**：所有外部影片（如 YouTube）強制執行 Facade 模式（Lite Embed），以最大化 LCP (Largest Contentful Paint) 載入效能。
- **視覺防破版**：父容器強制使用 `aspect-video` (16:9) 或 `aspect-[3/2]` 搭配 `overflow-hidden` 進行包裹，防止 iframe 溢出破版。

## 2. HTML5 自管影片規格 (Self-hosted Video)

### 背景影片 (Background Video)

- **必帶屬性**：`autoplay muted loop playsinline object-cover w-full h-full`。
- **效能與相容性**：必須包含 `poster` (優先使用 WebP 格式)、多重來源 (WebM 優先, MP4 後備)。

### 內容影片 (Content Video)

- **必帶屬性**：`aspect-video w-full`。
- **效能優化**：若非自動播放的影片，必須加上 `preload="none"` 節省頻寬。

## 3. 背景影片排版與遮罩技巧 (Background Video Tricks)

- **去邊界/隱藏浮水印**：對於純視覺背景影片，將 iframe 設為絕對置中並放大尺寸（例如 `w-[150%] h-[150%] -translate-x-1/2 -translate-y-1/2`），可將上下黑邊與商標推至可視範圍之外。
- **互動阻斷 (防誤觸)**：在背景影片容器加上 `pointer-events-none`，防止使用者誤觸導致影片暫停或跳轉。

## 4. YouTube 嵌入參數與 Facade 模式

### URL 控制參數

必須透過 URL 參數控制播放行為，確保跨平台表現一致：

- **核心參數組合**：`autoplay=1&mute=1&loop=1&playlist=[VIDEO_ID]&controls=0&rel=0&playsinline=1`。
- **關鍵說明**：`playsinline=1` 為 iOS 裝置行內自動播放的關鍵；`mute=1` 為各現代瀏覽器允許自動播放的先決條件。

### Facade 模式 (Lite Embed) 實作規範

- **結構要求**：外層容器為 `aspect-video rounded-xl shadow-lg overflow-hidden bg-black group`。
- **行為要求**：初始僅載入預覽圖 `<img>` 與播放按鈕 `<button>`，使用者點擊後再透過 JS 動態注入 `iframe` 並附加 `autoplay=1`。
- **iframe 安全要求**：動態生成的 iframe 必須包含 `title`、`loading="lazy"` 與完整的 `allow` 權限。

### YouTube Facade 模式代碼範本

當被要求生成 YouTube 嵌入區塊時，請強制套用此結構替換 `[VIDEO_ID]`：

```html
<div class="relative aspect-video w-full max-w-4xl mx-auto rounded-xl shadow-lg overflow-hidden bg-black group" onclick="this.innerHTML = '<iframe class=\'absolute inset-0 w-full h-full\' src=\'[https://www.youtube.com/embed/](https://www.youtube.com/embed/)[VIDEO_ID]?autoplay=1&rel=0\' title=\'YouTube video player\' frameborder=\'0\' allow=\'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\' allowfullscreen loading=\'lazy\'></iframe>'">
  <img src="[https://img.youtube.com/vi/](https://img.youtube.com/vi/)[VIDEO_ID]/maxresdefault.jpg" alt="Video Preview" class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition duration-300" />
  <button class="absolute inset-0 m-auto w-[4rem] h-[4rem] bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center shadow-xl transition transform group-hover:scale-110" aria-label="Play Video">
    <svg class="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
  </button>
</div>
```
