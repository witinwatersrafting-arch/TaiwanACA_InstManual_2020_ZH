---
description: Cloudflare 部署步驟指南
---

# 前置條件
- 已安裝 **Node.js**（>=18）
- 已安裝 **npm** 或 **pnpm**
- 已在 Cloudflare 註冊帳號，並取得 **API Token**（具有 `Account Settings → Workers Scripts` 權限）
- 本地已完成 `public/_headers` 的安全標頭修改（已包含 COOP、COEP、CSP nonce 佔位符）

# 步驟說明
1. **安裝 Wrangler**（Cloudflare 官方 CLI）
   ```bash
   npm install -g wrangler
   ```
   // turbo
2. **在專案根目錄初始化 Wrangler**
   ```bash
   cd /Users/daily/Desktop/paddles-on-the-nile-astro
   wrangler init --site
   ```
   - 會產生 `wrangler.toml`、`functions/` 目錄等。
3. **設定 `wrangler.toml`**
   ```toml
   name = "paddles-on-the-nile-astro"
   compatibility_date = "2024-01-01"
   account_id = "<YOUR_ACCOUNT_ID>"
   workers_dev = true
   route = "*paddles-on-the-nile-astro.com/*"
   
   [site]
   bucket = "./dist"
   
   [vars]
   # 若需要在函式中使用的環境變數，可於此設定
   ```
4. **建立 Edge Function 產生 nonce**
   在 `functions/nonce.js` 新增以下程式碼：
   ```javascript
   export async function onRequest(context) {
     const nonce = crypto.randomUUID(); // 產生唯一 nonce
     const response = await context.next();
     // 取出原始 CSP，替換 %NONCE% 佔位符
     const csp = response.headers.get('Content-Security-Policy')?.replace('%NONCE%', nonce) || '';
     const newHeaders = new Headers(response.headers);
     newHeaders.set('Content-Security-Policy', csp);
     // 於 HTML 中注入 nonce（簡易正則）
     let html = await response.text();
     html = html.replace(/<script(?![^>]*nonce=)/g, `<script nonce="${nonce}"`);
     return new Response(html, {
       status: response.status,
       statusText: response.statusText,
       headers: newHeaders,
     });
   }
   ```
   - 此函式會在每次請求時產生 nonce，並把它寫入 CSP 與所有 `<script>` 標籤。
5. **在 Astro 中傳遞 nonce 給組件**（若有內嵌腳本）
   在需要的 Astro 組件內使用 `Astro.request.headers.get('csp-nonce')`（或自行在 `onRequest` 中加入自訂 header `csp-nonce`），例如：
   ```astro
   ---
   const nonce = Astro.request.headers.get('csp-nonce') ?? '';
   ---
   <script nonce={nonce} src="https://www.googletagmanager.com/gtag/js?id=UA-XXXXXX"></script>
   <script nonce={nonce}>
     // 你的自訂腳本
   </script>
   ```
6. **建置 Astro 專案**
   ```bash
   npm run build   # 產生 ./dist 資料夾
   ```
7. **部署至 Cloudflare Pages**
   ```bash
   wrangler publish
   ```
   - 若使用 CI/CD（GitHub Actions），可在 repo 中加入以下 workflow（可自行放在 `.github/workflows/deploy.yml`）：
   ```yaml
   name: Deploy to Cloudflare Pages
   on:
     push:
       branches: [ main ]
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - name: Setup Node
           uses: actions/setup-node@v3
           with:
             node-version: '20'
         - run: npm ci
         - run: npm run build
         - name: Publish
           uses: cloudflare/wrangler-action@v3
           with:
             apiToken: ${{ secrets.CF_API_TOKEN }}
   ```
8. **驗證部署結果**
   - 使用 `curl -I https://<your-domain>/` 確認回應標頭中包含 `Content-Security-Policy`、`Cross-Origin-Opener-Policy`、`Cross-Origin-Embedder-Policy`。
   - 在 Chrome DevTools → **Security** → **Content Security Policy** 檢查 **Script** 部分只允許帶有 `nonce-xxxx` 的腳本。

# 常見問題
- **為什麼仍保留 `unsafe-inline` 在 `style-src`？** 目前大多數字體與內嵌樣式仍使用 `unsafe-inline`，若想更嚴格可改為 `nonce-%NONCE%`，同樣在 Edge Function 中注入 nonce。
- **如果不想使用 Edge Function，能直接在 `_headers` 中寫死 nonce 嗎？** 可以，但每次部署都會產生相同 nonce，安全性會降低，建議仍使用動態產生。

完成以上步驟後，您的網站將在 Cloudflare 上以 **完整的 CSP（nonce + strict‑dynamic）**、**COOP**、**COEP** 運行，顯著降低 XSS 風險。
