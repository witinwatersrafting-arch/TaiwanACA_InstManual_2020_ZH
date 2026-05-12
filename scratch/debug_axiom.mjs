import fs from 'fs';
const DOMAIN = 'immersionresearch.myshopify.com';
const BASE_URL = 'https://ymmshp.shpappscws.com/ajax/get_dropdowns_version3.php';
const HEADERS = {
    'Referer': 'https://immersionresearch.com/pages/skirt-fit',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'X-Requested-With': 'XMLHttpRequest'
};

function parseOptions(html) {
    if (!html) return [];
    const matches = [...html.matchAll(/<option\s+[^>]*value=["']([^"']+)["'][^>]*>([^<]+)<\/option>/gi)];
    return matches.map(m => ({ value: m[1], label: m[2].trim() }))
        .filter(o => o.value !== "-1" && o.value !== "");
}

async function fetchStep(currentField, val, context = {}) {
    const params = new URLSearchParams({
        domain: DOMAIN, load: 'all', data_filter: 'updated',
        action: 'onchange', ver_no: '3', lang_code: 'en',
        current_field: currentField, prev_val: val, current_val: val,
        ...context
    });
    const r = await fetch(`${BASE_URL}?${params}`, { headers: HEADERS });
    return await r.json();
}

async function runDebug() {
    console.log("🚀 深度清查 Dagger 所有型號的尺寸對應...");

    try {
        const daggerVal = 'mk_dagger';
        const r2 = await fetchStep('field_2', daggerVal, { field_1: 'yr_whitewater', field_2: daggerVal });
        const models = parseOptions(r2.html);

        console.log(`找到 ${models.length} 個型號，正在掃描...`);

        for (const m of models) {
            const r3 = await fetchStep('field_3', m.value, { field_1: 'yr_whitewater', field_2: daggerVal, field_3: m.value });
            const variants = parseOptions(r3.html);
            
            for (const v of variants) {
                const r4 = await fetchStep('field_4', v.value, { field_1: 'yr_whitewater', field_2: daggerVal, field_3: m.value, field_4: v.value });
                const circs = parseOptions(r4.html);
                
                for (const c of circs) {
                    const r5 = await fetchStep('field_8', c.value, { field_1: 'yr_whitewater', field_2: daggerVal, field_3: m.value, field_4: v.value, field_8: c.value });
                    const result = r5.html.replace(/<[^>]+>/g, ' ').trim();
                    
                    if (result.includes("Medium")) {
                        console.log(`✨ [發現 Medium] 型號: ${m.label} | 尺寸: ${v.label} | 周長: ${c.label} -> ${result}`);
                    }
                    
                    // 順便看看有沒有任何 89" 的周長被建議為 Medium
                    if (c.label === '89"' && !result.includes("Large")) {
                        console.log(`⚠️ [異常] 周長 89" 但建議不是 Large: ${m.label} -> ${result}`);
                    }
                }
            }
        }
        console.log("\n清查結束。");

    } catch (e) {
        console.error("❌ 錯誤:", e.message);
    }
}

runDebug();
