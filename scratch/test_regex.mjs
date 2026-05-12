function parseOptions(html) {
    if (!html) return [];
    const matches = [...html.matchAll(/<option\s+[^>]*value=["']([^"']+)["'][^>]*>([^<]+)<\/option>/gi)];
    return matches.map(m => ({ value: m[1], label: m[2].trim().replace(/&quot;/g, '"') }))
        .filter(o => o.value !== "-1" && o.value !== "" && !o.label.match(/^Select/i));
}

function getAllFields(html) {
    const fields = {};
    // User's original regex: /<li[^>]*class=\"([^\"]+)\"[^>]*>([\s\S]*?)<\/li>/gi
    // It uses \" which means it only matches double quotes.
    const liMatches = [...html.matchAll(/<li[^>]*class=[\"\']([^\"\']+)[\"\'][^>]*>([\s\S]*?)<\/li>/gi)];
    liMatches.forEach(li => {
        const className = li[1].match(/field_(\d+)/);
        if (className) {
            const fieldId = 'field_' + className[1];
            const opts = parseOptions(li[2]);
            if (opts.length > 0) fields[fieldId] = opts;
        }
    });
    return fields;
}

const sampleHtml = `<li class='field_6'><label>Skirt Size</label><select><option value='1'>Large</option></select></li>`;
console.log("Testing with single quotes:");
console.log(JSON.stringify(getAllFields(sampleHtml), null, 2));

const sampleHtmlDouble = `<li class="field_6"><label>Skirt Size</label><select><option value="1">Large</option></select></li>`;
console.log("\nTesting with double quotes:");
console.log(JSON.stringify(getAllFields(sampleHtmlDouble), null, 2));
