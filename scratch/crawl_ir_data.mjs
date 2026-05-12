import fs from 'fs';

const DOMAIN = 'immersionresearch.myshopify.com';
const BASE_URL = 'https://ymmshp.shpappscws.com/ajax/get_dropdowns_version3.php';
const HEADERS = {
    'Referer': 'https://immersionresearch.com/',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'X-Requested-With': 'XMLHttpRequest'
};

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

function parseOptions(html) {
    if (!html) return [];
    const matches = [...html.matchAll(/<option\s+[^>]*value=["']([^"']+)["'][^>]*>([^<]+)<\/option>/gi)];
    return matches.map(m => ({
        value: m[1],
        label: m[2].trim()
            .replace(/&quot;/g, '"')
            .replace(/&amp;/g, '&')
            .replace(/&#39;/g, "'")
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
    })).filter(o => o.value !== "-1" && o.value !== "");
}

async function fetchRaw(fieldId, currentVal, pathValues) {
    const params = new URLSearchParams({
        domain: DOMAIN,
        load: 'all',
        data_filter: 'updated',
        action: 'onchange',
        use_cart_info_ftr: 'no',
        version: 'updated',
        ver_no: '3',
        current_field: fieldId,
        prev_val: pathValues.join(','),
        current_val: currentVal,
        lang_code: 'en',
        pri_lang_code: 'en'
    });

    const response = await fetch(`${BASE_URL}?${params.toString()}`, { headers: HEADERS });
    return await response.json();
}

async function traceToFinal(fieldId, currentVal, pathValues, depth = 0) {
    if (depth > 6) return "Timeout";
    
    const data = await fetchRaw(fieldId, currentVal, pathValues);
    if (!data || !data.html) return "N/A";

    const options = parseOptions(data.html);
    if (options.length === 0) return "N/A";

    // 檢查是否包含尺寸關鍵字
    const isDefinitive = options.some(o => /large|medium|small|xl|deck|rand|fit/i.test(o.label));
    
    // 如果是最終尺寸，或者是最後一層 (通常是 field_6)
    if (isDefinitive || data.html.includes('field_6')) {
        return options.map(o => o.label).join(', ');
    }

    // 如果回傳的是周長或其他中繼欄位，挖掘第一個選項
    const firstOpt = options[0];
    const newPath = [...pathValues, firstOpt.value];
    
    // 獲取 HTML 中提到的下一個 field 編號
    const fieldMatch = data.html.match(/field_(\d+)/);
    const nextFieldId = fieldMatch ? `field_${fieldMatch[1]}` : 'field_6';

    return await traceToFinal(nextFieldId, firstOpt.value, newPath, depth + 1);
}

async function startCrawl() {
    console.log("🚀 啟動智能遞迴爬蟲 (官網同步模式)...");
    let results = {};

    try {
        const typeData = await fetchRaw('field_1', 'yr_whitewater', ['yr_whitewater']);
        const brands = parseOptions(typeData.html);

        for (const brand of brands) {
            console.log(`\n📦 品牌: ${brand.label}`);
            results[brand.label] = {};

            const modelData = await fetchRaw('field_2', brand.value, ['yr_whitewater', brand.value]);
            const models = parseOptions(modelData.html);

            for (const model of models) {
                process.stdout.write(`  Model: ${model.label} `);
                results[brand.label][model.label] = {};

                const varData = await fetchRaw('field_3', model.value, ['yr_whitewater', brand.value, model.value]);
                const variations = parseOptions(varData.html);

                for (const v of variations) {
                    const finalSize = await traceToFinal('field_4', v.value, ['yr_whitewater', brand.value, model.value, v.value]);
                    results[brand.label][model.label][v.label] = finalSize;
                    process.stdout.write(`[${v.label}:${finalSize}] `);
                    await sleep(30);
                }
                console.log("");
                fs.writeFileSync('src/data/ir_skirt_database.json', JSON.stringify(results, null, 2));
            }
        }
    } catch (e) {
        console.error("\n❌ 爬取過程中發生錯誤:", e.message);
    }

    console.log("\n✅ 採集完成！數據已存至 src/data/ir_skirt_database.json");
}

startCrawl();
