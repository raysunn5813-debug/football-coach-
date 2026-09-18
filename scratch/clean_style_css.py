with open(r'd:\football coach\frontend\css\style.css', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Line numbers in view_file were 1-indexed.
# Line 2017 in 1-based indexing corresponds to index 2016 in 0-based python indexing.
# Line 2160 in 1-based indexing corresponds to index 2159 in 0-based python indexing.

# Let's verify line contents before slicing
print("Start of cut (index 2016):", lines[2016].strip())
print("End of cut (index 2159):", lines[2159].strip())

new_lines = lines[:2016] + lines[2160:]

with open(r'd:\football coach\frontend\css\style.css', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print(f"Successfully cleaned style.css! Reduced line count from {len(lines)} to {len(new_lines)}.")
