import re
import os

file_path = "/Users/daily/Desktop/Rolling Clinic/Taiwan ACA_InstManual_2020_Download/TaiwanACA_InstManual_2020_Download.html"

with open(file_path, 'r', encoding='utf-8') as f:
    html_content = f.read()

# Remove HTML tags
text_content = re.sub('<[^>]*>', ' ', html_content)

# Look for Unit patterns
unit_pattern = re.compile(r'Unit \d+:\s*[^.]+')
units = unit_pattern.findall(text_content)

# Look for Appendix/Other headers
other_pattern = re.compile(r'(Appendix [A-Z]|Bibliography|Introduction|Acknowledgments|Conclusion)')
others = other_pattern.findall(text_content)

found = set()
for u in units:
    found.add(u.strip())
for o in others:
    found.add(o.strip())

for item in sorted(list(found)):
    print(item)
