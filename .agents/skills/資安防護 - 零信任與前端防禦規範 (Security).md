# 資安防護 - 零信任與前端防禦規範 (Security)

這是一份針對 "Paddles on the Nile" 靜態前端與 GAS 後端架構所定制。
所有關於 `@Sentinel` (資安專家) 與 `@Coder` 的開發工作，都必須以本守則為絕對依歸，採取「零容忍」與「預設拒絕」的態度。

## 1. 跨站腳本攻擊 (XSS) 防禦：DOM 的純潔性

* **禁止直接賦值 HTML (Astro set:html & JS innerHTML)**：專案中 **「絕對禁止」** 將未經過濾的動態數據進入 `element.innerHTML` 或是 Astro 的 **`set:html`** 屬性。
  * **❌ 不合規**：`<div set:html={userInput} />` 或 `element.innerHTML = userInput`
  * **✅ 純文字**：使用 Astro 的預設轉義 `{userInput}` 或 JS 的 `element.textContent`。
  * **✅ 結構化數據**：若在 `Layout.astro` 使用 `set:html` 渲染 JSON-LD，必須確保對象經過 `JSON.stringify()` 處理。
  * **✅ 複雜 HTML 渲染**：若必須渲染外部 HTML，強制引入 `DOMPurify.sanitize()` 過濾後再插入。**嚴禁只使用 `DOMParser`**。
* **危險函式與 URL 淨化**：全面禁用 `eval()`。針對 `window.location` 的參數，渲染前必須經過轉義或嚴格的類型檢查。

## 2. 表單與 GAS 後端通訊防護

* **前端驗證 (Cloudflare Turnstile)**：
  * **Token 強制檢查**：在執行 `fetch` 之前，腳本**必須**檢查 `cf-turnstile-response` 是否為空。若為空則中斷請求並顯示提示。
  * **防止連擊**：點擊送出的瞬間，按鈕即刻被 `disabled` 並顯示載入狀態（如「Sending...」）。
* **後端真實限流 (GAS CacheService)**：
  * **【絕對警告】**：GAS 無法取得訪客真實 IP，**絕對禁止以 IP 進行限流**。
  * **正解**：利用提交的 Email 或電話結合 `CacheService` 實作速率限制。後端必須再次向 Cloudflare `siteverify` 驗證 Token 合法性。
* **強制 HTTPS**：所有 API 調用必須走 `https://`。

## 3. 部署層與 HTTP 安全標頭 (Security Headers)

在 Cloudflare Pages 部署時，應於 `public/_headers` 設置以下標頭：
* **`Content-Security-Policy` (CSP)**：
  * **`script-src` / `frame-src`**：必須放行 `https://challenges.cloudflare.com` 與 `https://www.youtube-nocookie.com`。
  * **`connect-src`**：必須放行 `https://script.google.com` 與 `https://script.googleusercontent.com`。
  * **`img-src`**：必須放行 `data:` (用於 Base64) 以及信任的外部網域。
* **`X-Frame-Options: DENY`**：防止點擊劫持。
* **`Strict-Transport-Security` (HSTS)`**：強制 HTTPS 傳輸（建議 max-age=31536000）。

## 4. 自動化腳本執行與源碼過濾

* **撰寫自動化檔案處理腳本 (Node/Python)**：
  * 當在工作流中建立自動修補工具或檔案爬蟲時，**必須明確保證排除了 `.git` 與 `node_modules`**，防止磁碟 I/O 阻塞或程式崩潰。
  * **禁止脆弱正則**：取代 HTML 屬性或結構時，強烈建議使用 `cheerio` (AST 解析器) 代替純粹的正則 `replace()`，避免多一個空格或換行就導致替換失效。
