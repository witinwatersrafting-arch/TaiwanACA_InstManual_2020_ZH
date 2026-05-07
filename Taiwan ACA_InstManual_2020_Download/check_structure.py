import re

with open('TaiwanACA_InstManual_2020_Download.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Search for Unit headers
units = re.findall(r'Unit\s+(\d+)', content, re.IGNORECASE)
print(f"Units found: {set(units)}")

# Search for Appendix headers
appendices = re.findall(r'Appendix\s+([A-Z])', content, re.IGNORECASE)
print(f"Appendices found: {set(appendices)}")

# Search for Bibliography
if re.search(r'Bibliography', content, re.IGNORECASE):
    print("Bibliography found")
else:
    print("Bibliography NOT found")

# Search for specific missing sections if any
# Let's look for "Glossary"
if re.search(r'Glossary', content, re.IGNORECASE):
    print("Glossary found")

# Let's find the text around the last Unit
last_unit_match = list(re.finditer(r'Unit\s+9', content, re.IGNORECASE))
if last_unit_match:
    last_pos = last_unit_match[-1].end()
    print(f"\nText after Unit 9 (first 1000 chars):")
    print(content[last_pos:last_pos+2000])
