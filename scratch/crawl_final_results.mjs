import fs from 'fs';

const BASE_URL = 'https://immersionresearch.com/pages/product-result';

async function fetchFinalPage(params) {
    const url = `${BASE_URL}?${new URLSearchParams(params)}`;
    try {
        const r = await fetch(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' }
        });
        return await r.text();
    } catch (e) { return ""; }
}

function extractResults(html) {
    // 1. 優先找產品標題 (例如 Klingon - Large Deck)
    const titles = [...html.matchAll(/class=["']product-title["'][^>]*>([^<]+)/gi)].map(m => m[1].trim());
    if (titles.length > 0) {
        // 提取標題中的尺寸關鍵字
        const sizes = titles.map(t => {
            const m = t.match(/(Large|XL|Medium|Small|Big|X-Big|XXL)\s+Deck/i);
            return m ? m[0] : t;
        });
        return [...new Set(sizes)].map(s => ({ label: s, value: 'final' }));
    }

    // 2. 如果沒產品，找看看有沒有「座艙周長」選單
    const options = [...html.matchAll(/<option\s+[^>]*value=["']([^"']+)["'][^>]*>([^<]+)<\/option>/gi)]
        .map(m => ({ value: m[1], label: m[2].trim() }))
        .filter(o => o.value !== "-1" && o.value !== "" && !o.label.match(/^Select/i));
    
    return options;
}

async function startCrawl() {
    console.log("🚀 啟動「結果頁模擬」採集器 (比 API 更穩定的終極方案)...");
    
    // 品牌/型號/規格 這部分 API 依然很穩，我們繼續用
    const initialData = JSON.parse(fs.readFileSync('src/data/ir_skirt_database.json', 'utf8'));
    let finalResults = [];

    for (const entry of initialData) {
        process.stdout.write(`🔍 處理: ${entry.manufacturer} ${entry.model} ${entry.variation}... `);
        
        // 構造搜尋參數 (這裡需要 brand_value, model_value 等，我們從之前的爬蟲邏輯中獲取)
        // 為了簡化，我們可以直接發送文字請求，很多 YMM 支持文字參數
        const params = {
            field_1: entry.manufacturer,
            field_2: entry.model,
            field_3: entry.variation === 'None' ? '' : entry.variation
        };

        const html = await fetchFinalPage(params);
        const fits = extractResults(html);
        
        finalResults.push({ ...entry, fit_results: fits });
        console.log(`找到 ${fits.length} 項`);
        
        fs.writeFileSync('src/data/ir_skirt_database.json', JSON.stringify(finalResults, null, 2));
        await new Promise(r => setTimeout(r, 100)); // 禮貌延時
    }
    console.log("\n✅ 最終資料庫已生成！");
}

startCrawl();
