"""Two short looping clips for the demo's Videos tab, animated from the generated artwork."""
import math, os, re, subprocess, shutil
from playwright.sync_api import sync_playwright

D = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(D, "video"); os.makedirs(OUT, exist_ok=True)
FPS, SECS = 24, 6
N = FPS * SECS


def synth_frame(t):
    src = open(os.path.join(D, "svg", "synthwave-highway.svg")).read()
    # drop the static horizontal grid lines + lane marks, then redraw them moving towards the viewer
    src = re.sub(r'<rect x="0" y="[\d.]+" width="1200" height="[\d.]+" fill="#ff2e88"[^>]*/>', "", src)
    src = re.sub(r'<polygon points="[^"]*" fill="#ffe66d"/>', "", src)
    hz, h, w, vx = 430, 750, 1200, 600
    extra = []
    # perspective: y = hz + k / (z), move z towards camera
    for i in range(14):
        z = ((i + 1 - t) % 14) + 0.35
        y = hz + 320 / z
        if y < h:
            extra.append(f'<rect x="0" y="{y-1:.1f}" width="{w}" height="{2 + (y-hz)/120:.1f}" fill="#ff2e88" opacity=".85" filter="url(#glow)"/>')
    for i in range(10):
        z1 = ((i * 1.4 + 1 - t * 1.4) % 14) + 0.35
        z2 = z1 + 0.5
        y1, y2 = hz + 320 / z2, hz + 320 / z1
        if y1 < h:
            a, b_ = (y1 - hz) * 0.02 + 2, (min(y2, h) - hz) * 0.02 + 2
            extra.append(f'<polygon points="{vx-a:.1f},{y1:.1f} {vx+a:.1f},{y1:.1f} {vx+b_:.1f},{min(y2,h):.1f} {vx-b_:.1f},{min(y2,h):.1f}" fill="#ffe66d"/>')
    # insert after the road polygon (last element before palms is fine: append at end, palms are silhouettes drawn earlier)

    grid = [e for e in extra if e.startswith("<rect")]
    lanes = [e for e in extra if e.startswith("<polygon")]
    palm_at = src.index('stroke="#05010f" stroke-width="12"')
    palm_at = src.rindex("<path", 0, palm_at)
    src = src[:palm_at] + "".join(grid) + src[palm_at:]
    road_end = src.index("/>", src.index('fill="#12031f"')) + 2
    return src[:road_end] + "".join(lanes) + src[road_end:]


def waves_frame(t):
    src = open(os.path.join(D, "svg", "papercut-whale-tail.svg")).read()
    k = [0]

    def shift(m):
        i = k[0]; k[0] += 1
        dx = math.sin(2 * math.pi * t + i * 0.7) * (18 + i * 3)
        dy = math.cos(2 * math.pi * t + i * 0.7) * 5
        return f'transform="translate({dx:.1f} {dy:.1f})"'
    return re.sub(r'transform="translate\(-?\d+ 0\)"', shift, src)


def render(name, fn, size):
    tmp = os.path.join(OUT, name + "_frames"); shutil.rmtree(tmp, ignore_errors=True); os.makedirs(tmp)
    with sync_playwright() as p:
        br = p.chromium.launch(); pg = br.new_page(viewport={"width": size[0], "height": size[1]})
        for f in range(N):
            pg.set_content(f'<html><body style="margin:0">{fn(f / N)}</body></html>')
            pg.screenshot(path=os.path.join(tmp, f"{f:04d}.png"), clip={"x": 0, "y": 0, "width": size[0], "height": size[1]})
        br.close()
    out = os.path.join(OUT, name + ".mp4")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-framerate", str(FPS), "-i", os.path.join(tmp, "%04d.png"),
                    "-vf", "scale=trunc(iw*0.75/2)*2:-2", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "28", "-movflags", "+faststart", out], check=True)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", os.path.join(tmp, "0000.png"), "-vf", "scale=iw*0.75:-1", "-q:v", "4", os.path.join(OUT, name + "-poster.jpg")], check=True)
    shutil.rmtree(tmp)
    print(name, os.path.getsize(out))


render("synthwave-loop", synth_frame, (1200, 750))
render("waves-loop", waves_frame, (800, 1000))
