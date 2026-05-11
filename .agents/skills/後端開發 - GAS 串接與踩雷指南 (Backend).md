# 後端開發 - GAS 串接與踩雷指南 (Backend & GAS Skills)

## 1. GAS 部署與權限地雷 (Deployment & Permissions Traps)

開放 Google Apps Script (GAS) 時，必須嚴格遵守部署規範，否則前端將面臨無聲失敗或 CORS 錯誤：
- **版本更新陷阱**：每次修改 GAS 程式碼後，必須透過「部署 > 管理部署作業 > 編輯 > 建立新版本 (New version)」才能生效。
- **執行身分與存取權限**：「執行身分」必須設為「我 (Me)」，「誰可以存取」必須設為「所有人 (Anyone)」。
- **OAuth 細部權限陷阱**：若授權時漏勾選權限，系統仍會核發權杖導致背景靜默失敗。進入帳戶安全性手動移除存取權再重新跑授權。

## 2. 前端 API 請求規範 (CORS 防禦)

- **資料傳輸格式**：**嚴禁**使用原生的 `FormData` 或純 `JSON` 傳送至 GAS，這會觸發 HTTP 302 重定向導致跨域錯誤或資料遺失。
- 必須轉換為 `URLSearchParams` (`application/x-www-form-urlencoded`)。
- 若有收到回應，確保處理 `data.success`。

## 3. 表單資安與後端驗證 (Security & Rate Limiting)

GAS 常遭受腳本轟炸與濫發攻擊，請實作以下防護策略：
- **【絕對禁忌：用 IP 限流】**：GAS 透過 `e.parameter` 無法拿到真實 Client IP（只會拿到 Google 伺服器的節點 IP）。若實作 IP 限流，一人送出表單就會**連帶封鎖全球其他正常顧客**。
- **正解：以 Email 或電話做特徵限流**：
  ```javascript
  const cache = CacheService.getScriptCache();
  const userEmail = e.parameter.email || "anonymous";
  const rateKey = "rate_limit_" + userEmail.toLowerCase();
  if (cache.get(rateKey)) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, message: "提交過於頻繁" })).setMimeType(ContentService.MimeType.JSON);
  }
  cache.put(rateKey, "1", 60); // 鎖定 60 秒
  ```

- **Cloudflare Turnstile 機器人驗證**：
  在寫入 Google Sheet 前，GAS 必須對前端傳遞過來的 `cf-turnstile-response` 再次向 Cloudflare 發起驗證，確保非純 API 腳本攻擊。

  **GAS 後端檢查函數 (JavaScript)**：
  ```javascript
  function verifyTurnstile(token) {
    const secret = "YOUR_TURNSTILE_SECRET_KEY"; // 替換為你的 Turnstile Secret Key
    const payload = {
      'secret': secret,
      'response': token
    };
    const options = {
      'method': 'post',
      'payload': payload
    };
    const response = UrlFetchApp.fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', options);
    const result = JSON.parse(response.getContentText());
    return result.success;
  }
  ```

  **前端對應 Fetch 邏輯 (包含 Token 檢查)**：
  ```javascript
  const formData = new FormData(bookingForm);
  const token = formData.get("cf-turnstile-response");

  if (!token) {
    alert("Please complete the security challenge.");
    return;
  }

  const urlEncodedData = new URLSearchParams(formData);

  fetch(GAS_URL, {
    method: 'POST',
    body: urlEncodedData
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // 成功處理
      }
    });
  ```

## 4. JavaScript 作用域與事件綁定 (JS Scope & Events)

- **行內事件陷阱**：在 HTML 使用行內綁定（如 `onclick="nextSlide()"`）時，若對應的 JS 函式包在 DOMContentLoaded 內部，會變成區域變數而失效。
- **解決方案**：將該函式綁定至全域物件（如 `window.nextSlide = function() {...}`），或全面改用 `addEventListener` 進行事件綁定（Astro 專案優先採用此法）。

## 5. GAS 後端代碼標準 (GAS Code Standard)

- **試算表欄位強對應**：`sheet.appendRow()` 陣列中的變數順序，必須與 Google 試算表的欄位（如 A1~G1）嚴格、完全一致。
- **標準 doPost 模板**：後端必須攔截 `e.parameter`，處理完畢後一律回傳 `ContentService.MimeType.JSON` 格式的字串，包含 `success` 狀態。

**doPost 基礎結構範本**：
```javascript
function doPost(e) {
  const output = ContentService.createTextOutput().setMimeType(ContentService.MimeType.JSON);
  try {
    const data = e.parameter;
    // 1. 驗證 Turnstile
    if (!verifyTurnstile(data['cf-turnstile-response'])) {
      throw new Error("Security check failed.");
    }
    // 2. 執行寫入與通知...
    return output.setContent(JSON.stringify({ "success": true, "message": "Success" }));
  } catch (error) {
    return output.setContent(JSON.stringify({ "success": false, "error": error.toString() }));
  }
}
```

## 6. 前端表單互動與 UX 規範

- **防呆與狀態管理**：表單送出後，必須立刻更改按鈕文字（如「Sending...」）、將按鈕設為 `disabled` 並加上視覺反饋，防止使用者重複點擊。
- **日期限制**：若包含日期選擇器 `<input type="date">`，需透過 JS 動態設定 `min` 屬性為今日。
