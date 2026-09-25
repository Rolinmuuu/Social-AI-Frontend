import os, re, sys
from playwright.sync_api import sync_playwright

D = os.path.dirname(os.path.abspath(__file__))
SVG = os.path.join(D, "svg"); OUT = os.path.join(D, "jpg"); os.makedirs(OUT, exist_ok=True)
only = sys.argv[1:]
with sync_playwright() as p:
    br = p.chromium.launch()
    for f in sorted(os.listdir(SVG)):
        name = f[:-4]
        if only and name not in only:
            continue
        src = open(os.path.join(SVG, f)).read()
        w, h = map(int, re.search(r'width="(\d+)" height="(\d+)"', src).groups())
        pg = br.new_page(viewport={"width": w, "height": h}, device_scale_factor=1)
        pg.set_content(f'<html><body style="margin:0">{src}</body></html>')
        pg.screenshot(path=os.path.join(OUT, name + ".jpg"), type="jpeg", quality=86, clip={"x": 0, "y": 0, "width": w, "height": h})
        pg.close()
    br.close()
print("rendered")
