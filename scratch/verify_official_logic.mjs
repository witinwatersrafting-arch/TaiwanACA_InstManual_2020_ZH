async function verifyOfficialLogic() {
  const url = 'https://ymmshp.shpappscws.com/ajax/get_dropdowns_version3.php';
  const params = new URLSearchParams({
    load: 'all',
    action: 'onchange',
    field_1: 'Pyranha',
    field_2: 'ReactR',
    field_3: 'L',
    field_4: 'None',
    field_5: 'None',
    v: '3'
  });

  console.log("正在請求 IR 官方 API...");
  const response = await fetch(`${url}?${params.toString()}`, {
    headers: {
      "Referer": "https://immersionresearch.com/",
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
  });

  const text = await response.text();
  console.log("--- 原始 HTML 回應 (部分) ---");
  
  // 尋找被 selected 的選項
  const selectedMatch = text.match(/<option[^>]*selected[^>]*>(.*?)<\/option>/i);
  
  if (selectedMatch) {
    console.log(`找到官方預設選中 (selected) 的尺寸: ${selectedMatch[1]}`);
  } else {
    console.log("警告：官方回傳的選單中沒有任何選項被標註為 selected。");
  }

  // 印出所有選項供參考
  const allOptions = text.match(/<option[^>]*>(.*?)<\/option>/g);
  console.log(`總共有 ${allOptions ? allOptions.length : 0} 個選項。`);
}

verifyOfficialLogic();
