import fs from 'fs';

const DOMAIN = 'immersionresearch.myshopify.com';
const BASE_URL = 'https://ymmshp.shpappscws.com/ajax/get_dropdowns_version3.php';

async function fetchField(currentField, currentVal) {
    const params = new URLSearchParams({
        domain: DOMAIN, load: 'all', data_filter: 'updated',
        action: 'onchange', ver_no: '3',
        current_field: currentField, prev_val: currentVal, current_val: currentVal,
        lang_code: 'en'
    });
    const r = await fetch(`${BASE_URL}?${params}`);
    const data = await r.json();
    return data.html;
}

function extractOptions(html, fieldClass) {
    // 尋找特定 field class 的 select 標籤
    const regex = new RegExp(`<li[^>]*class=["'][^"']*${fieldClass}[^"']*["'][^>]*>([\\s\\S]*?)<\\/li>`, 'i');
    const match = html.match(regex);
    if (!match) return [];
    
    return [...match[1].matchAll(/<option\s+[^>]*value=["']([^"']+)["'][^>]*>([^<]+)<\/option>/gi)]
        .map(m => ({ value: m[1], label: m[2].trim().replace(/&quot;/g, '"') }))
        .filter(o => o.value !== "-1" && o.value !== "" && !o.label.match(/^Select/i));
}

async function solveReactR() {
    console.log("🕵️ 正在破解 ReactR M 的真實路徑...");
    
    const brandVal = 'mk_pyranha';
    const modelVal = 'md_reactr';
    const sizeMVal = 'qh_medium'; 

    // 實驗：當我們選了型號 (field_3) 後，API 回傳的 HTML 其實包含了多個 <li>
    const rawHtml = await fetchField('field_3', modelVal);
    
    console.log("\n--- [分析] 選完型號 (ReactR) 後回傳的 HTML 結構 ---");
    ['field_4', 'field_5', 'field_6', 'field_8'].forEach(f => {
        const opts = extractOptions(rawHtml, f);
        console.log(`欄位 ${f}: 找到 ${opts.length} 個選項 ${opts.length > 0 ? '(首項: ' + opts[0].label + ')' : '(無)'}`);
    });

    console.log("\n--- [分析] 選完規格 (Medium) 後回傳的 HTML 結構 ---");
    const rawHtml2 = await fetchField('field_4', sizeMVal);
    ['field_5', 'field_6', 'field_8'].forEach(f => {
        const opts = extractOptions(rawHtml2, f);
        console.log(`欄位 ${f}: 找到 ${opts.length} 個選項 ${opts.length > 0 ? '(首項: ' + opts[0].label + ')' : '(無)'}`);
    });
}

solveReactR();
