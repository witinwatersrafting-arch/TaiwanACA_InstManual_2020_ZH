import re
import os

file_path = "/Users/daily/Desktop/Rolling Clinic/Taiwan ACA_InstManual_2020_Download/TaiwanACA_InstManual_2020_Download.html"

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Remove HTML tags more safely
text = re.sub('<[^>]*>', ' ', content)
# Replace common entities
text = text.replace('&nbsp;', ' ')

# Look for patterns like "Unit 1: About the ACA"
# We want to find Unit followed by a number, a colon, and then some text until the next major section or line break
unit_matches = re.finditer(r'Unit\s+(\d+):\s*([^\n\r<]{5,100})', text, re.IGNORECASE)

units = {}
for match in unit_matches:
    num = match.group(1)
    title = match.group(2).strip()
    if num not in units or len(title) > len(units[num]):
        units[num] = title

print("--- Units Found ---")
for num in sorted(units.keys(), key=int):
    print(f"Unit {num}: {units[num]}")

# Look for Appendices
appendix_matches = re.finditer(r'Appendix\s+([A-Z]):\s*([^\n\r<]{5,100})', text, re.IGNORECASE)
appendices = {}
for match in appendix_matches:
    letter = match.group(1)
    title = match.group(2).strip()
    appendices[letter] = title

print("\n--- Appendices Found ---")
for letter in sorted(appendices.keys()):
    print(f"Appendix {letter}: {appendices[letter]}")

# Look for Bibliography, Conclusion, etc.
others = ["Bibliography", "Conclusion", "Introduction", "Acknowledgments"]
print("\n--- Other Sections ---")
for other in others:
    if other in text:
        print(other)
