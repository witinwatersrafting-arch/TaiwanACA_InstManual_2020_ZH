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

async function debugAntix() {
    console.log("🔍 [DEBUG] 開始探測 Jackson AntiX Medium...");

    // 1. 找 Jackson (field_2)
    const step1 = await fetchSym('field_1', 'yr_whitewater');
    const jackson = step1.options.find(o => o.label.includes('Jackson'));
    console.log(`Step 1: 找到 Jackson -> Value: ${jackson.value}`);

    // 2. 找 AntiX (field_3)
    const step2 = await fetchSym('field_2', jackson.value);
    const antix = step2.options.find(o => o.label === 'AntiX');
    console.log(`Step 2: 找到 AntiX -> Value: ${antix.value}`);

    // 3. 找 Medium (field_4)
    const step3 = await fetchSym('field_3', antix.value);
    const medium = step3.options.find(o => o.label === 'Medium');
    console.log(`Step 3: 找到 Medium -> Value: ${medium.value}`);

    // 4. 關鍵：看看選了 Medium 之後，field_4 回傳了什麼給下一步
    console.log("\n--- [核心測試] 當前欄位: field_4, 數值: " + medium.value + " ---");
    const step4 = await fetchSym('field_4', medium.value);
    
    console.log("API 回傳的原始選項列表:");
    step4.options.forEach((o, i) => {
        console.log(`[選項 ${i+1}] Label: ${o.label} | Value: ${o.value}`);
    });

    if (step4.options.length > 0) {
        console.log("\n--- [深度測試] 追蹤第一個選項: " + step4.options[0].label + " ---");
        const step5 = await fetchSym('field_5', step4.options[0].value);
        step5.options.forEach((o, i) => {
            console.log(`[下一層 ${i+1}] Label: ${o.label} | Value: ${o.value}`);
        });
    }
}

debugAntix();
