from PIL import Image
import sys

def create_bitmap(filedir):
    with Image.open(filedir) as img:
        img.convert('L')
        w, h = img.size
        px = img.load()

    data = bytearray(w * 2)
    for x in range(w):
        for y in range(16):
            i = 2 * x + y // 8
            bit = px[x, y] < 127
            data[i] |= bit << (y % 8)

    return data


if __name__ == '__main__':
    if (len(sys.argv) <= 1):
        print("Usage: gen.py <file> <output_filename>")
        quit()

    filedir = sys.argv[1]
    data = create_bitmap(filedir)

    out = 'display_data.dmd'
    if (len(sys.argv) > 2): out = sys.argv[2]
    out += ".dmd"

    with open(out, 'wb') as file:
        file.write(data)

        print(f"Saved into file {out}")