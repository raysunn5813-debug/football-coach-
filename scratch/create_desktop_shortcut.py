import os
import sys
from pathlib import Path
from PIL import Image

image_path = Path(r"C:\Users\cybra\.gemini\antigravity\brain\4b4c7b85-6943-48ee-82df-64b499e47e95\flaming_football_icon_1785793029494.jpg")
icon_dir = Path(r"C:\football coach\assets")
icon_dir.mkdir(exist_ok=True, parents=True)
ico_path = icon_dir / "flaming_football.ico"

# Convert JPG to ICO
img = Image.open(image_path)
img.save(ico_path, format="ICO", sizes=[(256, 256), (128, 128), (64, 64), (48, 48), (32, 32), (16, 16)])

print(f"ICO generated at: {ico_path}")
