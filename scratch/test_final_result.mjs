import fs from 'fs';

const BASE_URL = 'https://immersionresearch.com/pages/product-result';

async function getOfficialRecommendation(params) {
    const url = `${BASE_URL}?${new URLSearchParams(params)}`;
    console.log(`🔗 正在請求最終結果頁: ${url}`);
    
    try {
        const r = await fetch(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' }
        });
        const html = await r.text();
        
        // 從產品標題中提取尺寸 (例如 "Klingon - Large Deck")
        // 搜尋包含 "Deck" 或 "Size" 的文字
        const deckMatches = html.match(/(Large|XL|Medium|Small|Big|X-Big)\s+Deck/gi);
        if (deckMatches) {
            return [...new Set(deckMatches)];
        }
        
        return ["未找到明確標籤"];
    } catch (e) {
        return ["請求失敗"];
    }
}

async function test() {
    console.log("🚀 開始模擬「點擊到底」測試...");
    
    const testCases = [
        {
            name: "Jackson AntiX Medium (91.5\")",
            params: { field_1: 'yr_whitewater', field_2: 'mk_jackson', field_3: 'md_antix', field_4: 'qh_medium', field_8: 'sd_91-5' }
        },
        {
            name: "Pyranha ReactR L (88\")",
            params: { field_1: 'yr_whitewater', field_2: 'mk_pyranha', field_3: 'md_reactr', field_4: 'qh_large', field_8: 'sd_88' }
        }
    ];

    for (const tc of testCases) {
        console.log(`\n🔎 測試型號: ${tc.name}`);
        const result = await getOfficialRecommendation(tc.params);
        console.log(`✅ 官網回傳的產品尺寸: ${result.join(', ')}`);
    }
}

test();
