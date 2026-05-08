import os
import re

def split_manual(input_file, output_dir):
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    with open(input_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    # Regex to match units like "第一单元", "第1單元", "Unit 1"
    # Looking for lines that start with "第" and contain "單元" or "单元"
    unit_pattern = re.compile(r'^(第[一二三四五六七八九十\d]+[單单]元.*)')

    current_unit_file = None
    current_unit_num = 0
    buffer = []

    # Include lines before the first unit in a "preamble.md"
    preamble = []
    found_first_unit = False

    for line in lines:
        match = unit_pattern.match(line.strip())
        if match:
            # Save previous unit if it exists
            if found_first_unit and buffer:
                save_unit(output_dir, current_unit_num, buffer)
            else:
                # Save preamble
                if buffer:
                    with open(os.path.join(output_dir, '00-preamble.md'), 'w', encoding='utf-8') as f_out:
                        f_out.writelines(buffer)

            found_first_unit = True
            current_unit_num += 1
            buffer = [line]
        else:
            buffer.append(line)

    # Save the last unit
    if buffer:
        save_unit(output_dir, current_unit_num, buffer)

def save_unit(output_dir, num, content):
    filename = f'unit-{num:02d}.md'
    # Try to extract a better name from the first line if possible
    first_line = content[0].strip()
    # Remove characters not suitable for filenames
    safe_name = re.sub(r'[\\/*?:"<>|]', '', first_line).replace(' ', '_')
    # Actually, keeping it simple unit-01.md is better for Astro logic
    path = os.path.join(output_dir, filename)
    with open(path, 'w', encoding='utf-8') as f_out:
        f_out.writelines(content)
    print(f"Saved {path}")

if __name__ == "__main__":
    split_manual('ACA 手冊中文內容.md', 'src/content/manual')
