import sys
import os

from PIL import Image

if len(sys.argv) < 2:
    print("specify a spritesheet path")
    sys.exit(1)

spritesheet = sys.argv[1]

if os.path.isfile(spritesheet):
    img = Image.open(spritesheet)
    pixels = img.load()
    width, height = img.size

    sprite_count = int(width / 8)
    binary = ""

    for i in range(sprite_count):
        for y in range(8):
            for x in range(8):
                p = pixels[i * 8 + x, y]
                
                if p[0] == 255 and p[1] == 255 and p[2] == 255:
                    binary += "1";
                else:
                    binary += "0"
    print(binary)
else:
    print(spritesheet + " couldn't found.")