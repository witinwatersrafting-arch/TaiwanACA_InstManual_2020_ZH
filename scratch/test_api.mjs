// No import needed for fetch in modern Node.js

const DOMAIN = 'immersionresearch.myshopify.com';
const BASE_URL = 'https://ymmshp.shpappscws.com/ajax/get_dropdowns_version3.php';
const HEADERS = {
    'Referer': 'https://immersionresearch.com/pages/skirt-fit',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'X-Requested-With': 'XMLHttpRequest'
};

async function testFetch(field, val) {
    const params = new URLSearchParams({
        domain: DOMAIN, load: 'all', data_filter: 'updated',
        action: 'onchange', ver_no: '3',
        current_field: field, prev_val: val, current_val: val,
        lang_code: 'en'
    });
    const url = `${BASE_URL}?${params}`;
    console.log(`Fetching: ${url}`);
    const r = await fetch(url, { headers: HEADERS });
    const data = await r.json();
    console.log(JSON.stringify(data, null, 2));
}

// Start with brand field_1 = yr_whitewater
// Then we need to find a brand ID. Let's just run it for field_1 first.
testFetch('field_1', 'yr_whitewater');
