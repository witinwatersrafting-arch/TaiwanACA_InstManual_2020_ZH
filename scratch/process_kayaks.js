import fs from 'fs';
import path from 'path';

const csvPath = '_original_sources/Whitewater Kayaks Sheet.csv';
const content = fs.readFileSync(csvPath, 'utf-8');

// Use regex to split lines but keep quoted newlines if any (though here it's simple split)
const lines = content.split(/\r?\n/);

// Manually define headers because the CSV header is broken across two lines
const headers = ["Manufacture", "Model Name", "Year Intro", "Last Year", "Type", "Min KG", "Max KG", "Length CM", "Width CM", "Wt KG", "Vol. Liter", "Hull", "Manufacture Origin"];

const data = [];
// Data starts from index 2
for (let i = 2; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Split by comma, but not inside quotes
    const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => v.replace(/^"|"$/g, '').trim());
    
    if (values.length < 5) continue; // Basic validation
    
    const obj = {};
    headers.forEach((h, index) => {
        let value = values[index] || "";
        if (h === "Manufacture") {
            // Remove potential leading/trailing quotes like 'Jackson
            value = value.replace(/^['"]|['"]$/g, '').trim();
        }
        obj[h] = value;
    });
    data.push(obj);
}

const outputPath = 'src/data/kayaks.json';
if (!fs.existsSync('src/data')) fs.mkdirSync('src/data');
fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
console.log(`Processed ${data.length} kayaks to ${outputPath}`);
