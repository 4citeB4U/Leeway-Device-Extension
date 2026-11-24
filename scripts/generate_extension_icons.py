"""
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.DEVICE_EXTENSION.STORE_ICON
TAG: LEEWAY.UNIVERSAL_EXTENSION.CHROMIUM_EDGE_ICON_GENERATOR.V1
5WH:
WHAT = Generate deterministic browser-extension icon PNGs for original W01 release packaging.
WHY = Give the real Chrome/Edge/Firefox extension store-ready visible identity without binary private-key material or universal paths.
WHO = Creator-authorized W01 source contributor; not browser-store approval or independent Veritas.
WHERE = scripts/generate_extension_icons.py in 4citeB4U/Leeway-Device-Extension.
WHEN = 2026-11-23.
HOW = Python standard-library PNG encoder, known color palette, explicit sizes and checksum proof.
LICENSE = Existing repository terms apply.
"""
from pathlib import Path
from math import hypot
from struct import pack
from zlib import compress, crc32

SIZES = (16, 32, 48, 128)


def chunk(tag, payload):
    return pack('>I', len(payload)) + tag + payload + pack('>I', crc32(tag + payload) & 0xffffffff)


def pixel(x, y, size):
    # Original LeeWay coin identity: cyan perimeter, gold ring, white L.
    a, b = x / size, y / size
    border = (0.02 < a < 0.98 and 0.02 < b < 0.98 and
              min(a, b, 1 - a, 1 - b) < 0.065)
    r = hypot(a - .5, b - .5)
    ring = abs(r - .355) < .025
    glyph = (.365 <= a <= .445 and .27 <= b <= .71) or (
        .36 <= a <= .69 and .625 <= b <= .71)
    if glyph: return (243, 252, 249)
    if ring: return (238, 196, 110)
    if border: return (36, 203, 221)
    if r <= .355: return (13, 40, 58)
    return (7, 19, 31)


def create_icon(size):
    if size not in SIZES: raise ValueError('ICON_SIZE_NOT_ALLOWED')
    raw = bytearray()
    for y in range(size):
        raw.append(0)
        for x in range(size): raw.extend(pixel(x, y, size))
    return (
        b'\x89PNG\r\n\x1a\n' +
        chunk(b'IHDR', pack('>IIBBBBB', size, size, 8, 2, 0, 0, 0)) +
        chunk(b'IDAT', compress(bytes(raw), 9)) +
        chunk(b'IEND', b'')
    )


def generate(directory):
    target = Path(directory)
    target.mkdir(parents=True, exist_ok=True)
    for size in SIZES:
        (target / f'leeway-{size}.png').write_bytes(create_icon(size))


if __name__ == '__main__':
    generate(Path(__file__).resolve().parents[1] / 'extension' / 'icons')
