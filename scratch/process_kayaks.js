import fs from 'fs';
import path from 'path';

const csvPath = '_original_sources/Whitewater Kayaks Sheet.csv';
const content = fs.readFileSync(csvPath, 'utf-8');

const lines = content.split(/\r?\n/);

// New headers mapping from the 13-column CSV
const csvHeaders = ["ID", "Manufacture", "Model Name", "Year Intro", "Last Year", "Type", "Min KG", "Max KG", "Length CM", "Width CM", "Wt KG", "Vol. Liter", "Hull"];

const data = [];
// Data starts from index 1 (skip header)
for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => v.replace(/^"|"$/g, '').trim());
    
    if (values.length < 5) continue;
    
    const obj = {};
    csvHeaders.forEach((h, index) => {
        let value = values[index] || "";
        if (h === "Manufacture") {
            value = value.replace(/^['"]|['"]$/g, '').trim();
        }
        obj[h] = value;
    });
    data.push(obj);
}

// Custom Sorting Priority
const priorityBrands = ["Jackson Kayaks", "Pyranha", "Dagger", "Waka Kayaks", "Spade Kayaks", "Exo Kayak"];

data.sort((a, b) => {
    const mfrA = a.Manufacture || "";
    const mfrB = b.Manufacture || "";
    
    const idxA = priorityBrands.indexOf(mfrA);
    const idxB = priorityBrands.indexOf(mfrB);
    
    // If both are priority brands, sort by priority list order
    if (idxA !== -1 && idxB !== -1) {
        if (idxA !== idxB) return idxA - idxB;
    } 
    // If only one is priority, it comes first
    else if (idxA !== -1) return -1;
    else if (idxB !== -1) return 1;
    
    // Default alphabetical by Manufacture
    const mfrCompare = mfrA.localeCompare(mfrB);
    if (mfrCompare !== 0) return mfrCompare;
    
    // Secondary alphabetical by Model Name
    return (a["Model Name"] || "").localeCompare(b["Model Name"] || "");
});

const outputPath = 'src/data/kayaks.json';
if (!fs.existsSync('src/data')) fs.mkdirSync('src/data');
fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
console.log(`Processed and sorted ${data.length} kayaks to ${outputPath}`);
