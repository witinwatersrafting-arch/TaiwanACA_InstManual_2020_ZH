import fs from 'fs';

const DOMAIN = 'immersionresearch.myshopify.com';
const BASE_URL = 'https://ymmshp.shpappscws.com/ajax/get_dropdowns_version3.php';
const HEADERS = {
    'Referer': 'https://immersionresearch.com/pages/skirt-fit',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
};

function parseOptions(html) {
    if (!html) return [];
    return [...html.matchAll(/<option\s+[^>]*value=["']([^"']+)["'][^>]*>([^<]+)<\/option>/gi)]
        .map(m => ({ value: m[1], label: m[2].trim().replace(/&quot;/g, '"') }))
        .filter(o => o.value !== "-1" && o.value !== "" && !o.label.match(/^Select/i));
}

async function fetchSym(field, val) {
    const params = new URLSearchParams({
        domain: DOMAIN, load: 'all', data_filter: 'updated',
        action: 'onchange', ver_no: '3',
        current_field: field, prev_val: val, current_val: val,
        lang_code: 'en'
    });
    const r = await fetch(`${BASE_URL}?${params}`, { headers: HEADERS });
    const data = await r.json();
    return { html: data.html, options: parseOptions(data.html) };
}

async function debugReactR() {
    console.log("🔍 [DEBUG] 開始探測 Pyranha ReactR 系列...");

    // 1. 找 Pyranha (field_2)
    const step1 = await fetchSym('field_1', 'yr_whitewater');
    const pyranha = step1.options.find(o => o.label.includes('Pyranha'));
    if (!pyranha) return console.log("找不到 Pyranha 品牌");
    console.log(`Step 1: 找到 Pyranha -> Value: ${pyranha.value}`);

    // 2. 找 ReactR (field_3)
    const step2 = await fetchSym('field_2', pyranha.value);
    const reactr = step2.options.find(o => o.label === 'ReactR');
    if (!reactr) return console.log("找不到 ReactR 型號");
    console.log(`Step 2: 找到 ReactR -> Value: ${reactr.value}`);

    // 3. 獲取 ReactR 的所有尺寸選項 (Small, Medium, Large)
    const step3 = await fetchSym('field_3', reactr.value);
    console.log(`Step 3: 找到 ${step3.options.length} 個尺寸選項:`, step3.options.map(o => o.label).join(', '));

    // 4. 遍歷每個尺寸，看最終回傳
    for (const size of step3.options) {
        console.log(`\n--- 探測 ReactR [${size.label}] ---`);
        const res = await fetchSym('field_4', size.value);
        console.log(`回傳結果:`);
        res.options.forEach((o, i) => {
            console.log(`  [${i+1}] ${o.label} (Value: ${o.value})`);
        });
    }
}

debugReactR();
