
const BASE_URL = 'https://ymmshp.shpappscws.com/ajax/get_dropdowns_version3.php';

async function testCombination(label, params) {
    const query = new URLSearchParams(params).toString();
    const url = `${BASE_URL}?${query}`;
    console.log(`--- 測試 ${label} ---`);
    
    try {
        const response = await fetch(url, {
            headers: {
                'Referer': 'https://immersionresearch.com/pages/skirt-fit',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
                'X-Requested-With': 'XMLHttpRequest'
            }
        });
        const data = await response.json();
        if (data.html) {
            console.log("✅ 成功！收到資料量:", data.html.length);
            console.log("資料片段:", data.html.substring(0, 100));
            return true;
        } else {
            console.log("❌ 失敗: html 為 null");
        }
    } catch (e) {
        console.log("❌ 錯誤:", e.message);
    }
    return false;
}

async function run() {
    // 組合 1: 原本的 (Shopify domain + yr_whitewater)
    await testCombination("1. Shopify Domain + Key", {
        v: '3',
        domain: 'immersionresearch.myshopify.com',
        field: 'field_2',
        parent_val: 'yr_whitewater'
    });

    // 組合 2: 官方 domain
    await testCombination("2. Official Domain", {
        v: '3',
        domain: 'immersionresearch.com',
        field: 'field_2',
        parent_val: 'yr_whitewater'
    });

    // 組合 3: 使用 Label 作為 parent_val
    await testCombination("3. Label as Parent", {
        v: '3',
        domain: 'immersionresearch.myshopify.com',
        field: 'field_2',
        parent_val: 'Whitewater'
    });
    
    // 組合 4: 加入 is_on_load
    await testCombination("4. With is_on_load", {
        v: '3',
        domain: 'immersionresearch.myshopify.com',
        field: 'field_2',
        parent_val: 'yr_whitewater',
        is_on_load: 'no'
    });
}

run();
