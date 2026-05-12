
const BASE_URL = 'https://ymmshp.shpappscws.com/ajax/get_dropdowns_version3.php';

async function finalTest() {
    // 加入從 HTML 中挖出來的 shop_id (4379934838)
    const params = {
        v: '3',
        domain: 'immersionresearch.myshopify.com',
        field: 'field_2',
        parent_val: 'yr_whitewater',
        shop_id: '4379934838', // 關鍵商店編號
        is_on_load: 'no'
    };

    const url = `${BASE_URL}?${new URLSearchParams(params).toString()}`;
    console.log("正在嘗試帶有 shop_id 的請求...");
    
    try {
        const response = await fetch(url, {
            headers: {
                'Referer': 'https://immersionresearch.com/pages/skirt-fit',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
            }
        });
        const data = await response.json();
        console.log("回傳結果:", JSON.stringify(data, null, 2));
    } catch (e) {
        console.error("執行失敗:", e.message);
    }
}

finalTest();
