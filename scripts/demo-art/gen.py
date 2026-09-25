"""Generate the SocialAI demo artwork: 12 original illustrations, each in a different
style and of a different subject. Output: SVG files in ./svg (rendered to JPEG by render.py).
Everything here is drawn from code; no external images."""
import math
import random
import os

OUT = os.path.join(os.path.dirname(__file__), "svg")
os.makedirs(OUT, exist_ok=True)


def save(name, w, h, body, defs=""):
    svg = f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}"><defs>{defs}</defs>{body}</svg>'
    with open(os.path.join(OUT, name + ".svg"), "w") as f:
        f.write(svg)


GRAIN = """<filter id="grain" x="0" y="0" width="100%" height="100%">
<feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" result="n"/>
<feColorMatrix in="n" type="saturate" values="0"/>
<feComponentTransfer><feFuncA type="table" tableValues="0 0.10"/></feComponentTransfer>
<feBlend in="SourceGraphic" mode="multiply"/></filter>"""


# 1. Flat illustration — coffee and croissant on a cafe table (4:5)
def cafe():
    w, h = 800, 1000
    b = []
    b.append(f'<rect width="{w}" height="{h}" fill="#f4e3cf"/>')
    # window with rain streaks
    b.append('<rect x="90" y="80" width="620" height="430" rx="18" fill="#9cc3c9"/>')
    b.append('<rect x="90" y="80" width="620" height="430" rx="18" fill="none" stroke="#7a4e2d" stroke-width="18"/>')
    b.append('<rect x="391" y="80" width="18" height="430" fill="#7a4e2d"/>')
    b.append('<rect x="90" y="286" width="620" height="18" fill="#7a4e2d"/>')
    random.seed(2)
    for _ in range(40):
        x = random.uniform(110, 690); y = random.uniform(100, 470); l = random.uniform(18, 46)
        if 385 < x < 415: continue
        b.append(f'<line x1="{x:.0f}" y1="{y:.0f}" x2="{x-6:.0f}" y2="{y+l:.0f}" stroke="#d9eef0" stroke-width="3" stroke-linecap="round" opacity=".8"/>')
    # distant rooftops in window
    b.append('<path d="M108 420 L180 360 L250 420 L250 492 L108 492Z" fill="#6f9ca4"/><path d="M430 410 h120 v82 h-120z" fill="#6f9ca4"/><path d="M560 380 h132 v112 h-132z" fill="#7faab1"/>')
    # hanging plant
    b.append('<line x1="640" y1="0" x2="640" y2="140" stroke="#5b3a22" stroke-width="3"/>')
    b.append('<path d="M600 140 h80 l-10 50 h-60z" fill="#d7774b"/>')
    for i, (dx, dy, r) in enumerate([(-40, 60, 20), (-50, 110, 18), (40, 70, 22), (60, 130, 18), (0, 100, 16), (-20, 170, 15), (30, 190, 15)]):
        b.append(f'<ellipse cx="{640+dx}" cy="{150+dy}" rx="{r}" ry="{r*0.6:.0f}" fill="#4f8a55" transform="rotate({(i*37)%80-40} {640+dx} {150+dy})"/>')
    # table
    b.append(f'<rect x="0" y="600" width="{w}" height="{h-600}" fill="#b9774a"/>')
    b.append(f'<rect x="0" y="600" width="{w}" height="26" fill="#9c5f37"/>')
    for y in (680, 760, 860, 950):
        b.append(f'<path d="M0 {y} C200 {y-12} 520 {y+14} 800 {y-4}" stroke="#a86a40" stroke-width="4" fill="none"/>')
    # saucer + cup
    b.append('<ellipse cx="300" cy="790" rx="190" ry="44" fill="#e9e2d6"/><ellipse cx="300" cy="782" rx="150" ry="30" fill="#f7f2ea"/>')
    b.append('<path d="M185 610 h230 l-20 150 a40 40 0 0 1 -40 32 h-110 a40 40 0 0 1 -40 -32z" fill="#2f6f73"/>')
    b.append('<path d="M415 640 c70 0 70 90 -10 90" fill="none" stroke="#2f6f73" stroke-width="22"/>')
    b.append('<ellipse cx="300" cy="610" rx="115" ry="22" fill="#20504f"/><ellipse cx="300" cy="612" rx="100" ry="16" fill="#6b3b1f"/>')
    b.append('<path d="M270 612 c10 -8 40 -8 60 0 c-10 6 -40 8 -60 0z" fill="#d7a979"/>')
    b.append('<path d="M205 660 h190" stroke="#3d8a8e" stroke-width="10"/>')
    # steam
    for dx in (-35, 5, 45):
        b.append(f'<path d="M{300+dx} 570 c-25 -30 25 -50 0 -80 c-25 -30 25 -50 0 -80" fill="none" stroke="#ffffff" stroke-width="9" stroke-linecap="round" opacity=".75"/>')
    # plate + croissant
    b.append('<ellipse cx="600" cy="850" rx="150" ry="40" fill="#e9e2d6"/>')
    segs = [(-95, 18, 26), (-55, 5, 34), (0, 0, 40), (55, 5, 34), (95, 18, 26)]
    for dx, dy, r in segs:
        b.append(f'<ellipse cx="{600+dx}" cy="{820+dy}" rx="{r+6}" ry="{r}" fill="#e3a14f" stroke="#b86f28" stroke-width="4"/>')
    for dx, dy, r in segs[1:4]:
        b.append(f'<path d="M{600+dx-r*0.5:.0f} {820+dy-r*0.6:.0f} q{r*0.5:.0f} {r*0.4:.0f} {r:.0f} 0" fill="none" stroke="#f3c887" stroke-width="5" stroke-linecap="round"/>')
    # napkin + spoon
    b.append('<path d="M40 900 l150 -30 l40 110 l-160 20z" fill="#e5c7c0"/>')
    b.append('<rect x="440" y="720" width="120" height="10" rx="5" fill="#c8c3bb" transform="rotate(-12 500 725)"/>')
    save("cafe-morning", w, h, f'<g filter="url(#grain)">{"".join(b)}</g>', GRAIN)


# 2. Pixel art — night city skyline (4:3)
def pixel_city():
    px = 10
    cols, rows = 96, 72
    w, h = cols * px, rows * px
    random.seed(7)
    b = []
    sky = ["#120b2e", "#1b1142", "#241656", "#2e1c69", "#3b2379", "#4c2b85"]
    band = rows // len(sky)
    for i, c in enumerate(sky):
        b.append(f'<rect x="0" y="{i*band*px}" width="{w}" height="{band*px+px}" fill="{c}"/>')
    for _ in range(90):
        x, y = random.randrange(cols), random.randrange(30)
        c = random.choice(["#ffffff", "#ffe9a8", "#b9c7ff"])
        b.append(f'<rect x="{x*px}" y="{y*px}" width="{px}" height="{px}" fill="{c}" opacity="{random.choice([.5,.8,1])}"/>')
    # back buildings
    x = 0
    while x < cols:
        bw = random.randint(5, 10); bh = random.randint(18, 34)
        b.append(f'<rect x="{x*px}" y="{(rows-bh-8)*px}" width="{bw*px}" height="{bh*px}" fill="#2a2150"/>')
        x += bw
    # front buildings with windows
    x = 0
    palette = ["#3a2d6b", "#44337a", "#33285e", "#4b3a85"]
    while x < cols:
        bw = random.randint(7, 13); bh = random.randint(14, 42)
        top = rows - bh - 4
        col = random.choice(palette)
        b.append(f'<rect x="{x*px}" y="{top*px}" width="{bw*px}" height="{bh*px}" fill="{col}"/>')
        if random.random() < .4:
            b.append(f'<rect x="{(x+bw//2)*px}" y="{(top-5)*px}" width="{px}" height="{5*px}" fill="{col}"/>')
            b.append(f'<rect x="{(x+bw//2)*px}" y="{(top-6)*px}" width="{px}" height="{px}" fill="#ff4f6d"/>')
        for wy in range(top + 2, rows - 5, 3):
            for wx in range(x + 1, x + bw - 1, 2):
                if random.random() < .45:
                    c = random.choice(["#ffd66b", "#ffc34d", "#9ee7ff", "#ffe6a6"])
                    b.append(f'<rect x="{wx*px}" y="{wy*px}" width="{px}" height="{px*1}" fill="{c}"/>')
        if random.random() < .3 and bh > 20:
            sy = top + 4
            c = random.choice(["#ff4fa3", "#3ff0ff", "#9cff57"])
            b.append(f'<rect x="{(x+1)*px}" y="{sy*px}" width="{(bw-2)*px}" height="{2*px}" fill="{c}" opacity=".9"/>')
        x += bw + random.randint(0, 1)
    # street
    b.append(f'<rect x="0" y="{(rows-4)*px}" width="{w}" height="{4*px}" fill="#1a1433"/>')
    for sx in range(0, cols, 8):
        b.append(f'<rect x="{sx*px}" y="{(rows-2)*px}" width="{4*px}" height="{px}" fill="#f5d36b"/>')
    # a tiny car
    cx = 60
    b.append(f'<rect x="{cx*px}" y="{(rows-6)*px}" width="{8*px}" height="{2*px}" fill="#ff5a5f"/><rect x="{(cx+2)*px}" y="{(rows-7)*px}" width="{4*px}" height="{px}" fill="#ff5a5f"/><rect x="{(cx+3)*px}" y="{(rows-7)*px}" width="{2*px}" height="{px}" fill="#9ee7ff"/><rect x="{(cx+8)*px}" y="{(rows-6)*px}" width="{px}" height="{px}" fill="#fff4b0"/>')
    save("pixel-night-city", w, h, "".join(b) + '', "")


# 3. Low-poly — mountains over a lake (3:2)
def lowpoly():
    w, h = 1200, 800
    random.seed(11)
    b = []

    def lerp(a, c, t):
        return tuple(int(a[i] + (c[i] - a[i]) * t) for i in range(3))

    def hexc(t):
        return "#%02x%02x%02x" % t

    # sky as triangle strip
    cols, rws = 12, 5
    pts = {}
    for i in range(cols + 1):
        for j in range(rws + 1):
            jx = 0 if i in (0, cols) else random.uniform(-30, 30)
            jy = 0 if j in (0, rws) else random.uniform(-20, 20)
            pts[i, j] = (i * w / cols + jx, j * 420 / rws + jy)
    top, bot = (116, 164, 214), (247, 205, 170)
    for i in range(cols):
        for j in range(rws):
            a, c, d, e = pts[i, j], pts[i + 1, j], pts[i, j + 1], pts[i + 1, j + 1]
            for tri in ((a, c, d), (c, e, d)):
                cy = sum(p[1] for p in tri) / 3
                col = lerp(top, bot, min(1, cy / 420) + random.uniform(-.04, .04))
                b.append(f'<polygon points="{" ".join(f"{x:.0f},{y:.0f}" for x,y in tri)}" fill="{hexc(col)}" stroke="{hexc(col)}"/>')

    def ridge(peaks, base, cl, cd, snow=False):
        out = []
        for k in range(len(peaks) - 1):
            (x1, y1), (x2, y2) = peaks[k], peaks[k + 1]
            if y1 < y2:  # descending
                pass
            mid = ((x1 + x2) / 2 + random.uniform(-20, 20), max(y1, y2) + random.uniform(10, 60))
            out.append(((x1, y1), (x2, y2), mid))
        polys = []
        for (p1, p2, m) in out:
            polys.append(f'<polygon points="{p1[0]:.0f},{p1[1]:.0f} {m[0]:.0f},{m[1]:.0f} {p1[0]:.0f},{base}" fill="{cd}"/>')
            polys.append(f'<polygon points="{p1[0]:.0f},{p1[1]:.0f} {p2[0]:.0f},{p2[1]:.0f} {m[0]:.0f},{m[1]:.0f}" fill="{cl if p1[1] < p2[1] else cd}"/>')
            polys.append(f'<polygon points="{m[0]:.0f},{m[1]:.0f} {p2[0]:.0f},{p2[1]:.0f} {p2[0]:.0f},{base} {p1[0]:.0f},{base}" fill="{cd}"/>')
        return polys

    def mountain(x, peak, width, base, light, dark, snow):
        l, r = x - width / 2, x + width / 2
        ml = (x - width * .22, peak + (base - peak) * .45)
        mr = (x + width * .25, peak + (base - peak) * .5)
        s = []
        s.append(f'<polygon points="{l:.0f},{base} {x:.0f},{peak} {ml[0]:.0f},{ml[1]:.0f}" fill="{light}"/>')
        s.append(f'<polygon points="{l:.0f},{base} {ml[0]:.0f},{ml[1]:.0f} {x-width*0.05:.0f},{base}" fill="{light}" opacity=".85"/>')
        s.append(f'<polygon points="{x:.0f},{peak} {mr[0]:.0f},{mr[1]:.0f} {ml[0]:.0f},{ml[1]:.0f}" fill="{dark}" opacity=".9"/>')
        s.append(f'<polygon points="{ml[0]:.0f},{ml[1]:.0f} {mr[0]:.0f},{mr[1]:.0f} {x-width*0.05:.0f},{base}" fill="{dark}"/>')
        s.append(f'<polygon points="{x:.0f},{peak} {r:.0f},{base} {mr[0]:.0f},{mr[1]:.0f}" fill="{dark}"/>')
        s.append(f'<polygon points="{mr[0]:.0f},{mr[1]:.0f} {r:.0f},{base} {x-width*0.05:.0f},{base}" fill="{dark}" opacity=".8"/>')
        if snow:
            sl = (x - width * .09, peak + (base - peak) * .2)
            sr = (x + width * .1, peak + (base - peak) * .22)
            sm = (x + width * .01, peak + (base - peak) * .14)
            s.append(f'<polygon points="{x:.0f},{peak} {sl[0]:.0f},{sl[1]:.0f} {sm[0]:.0f},{sm[1]:.0f}" fill="#ffffff"/>')
            s.append(f'<polygon points="{x:.0f},{peak} {sm[0]:.0f},{sm[1]:.0f} {sr[0]:.0f},{sr[1]:.0f}" fill="#dfe7f2"/>')
        return s

    horizon = 520
    far = []
    for x, pk, wd in [(150, 250, 520), (520, 190, 560), (900, 230, 600), (1180, 280, 460)]:
        far += mountain(x, pk, wd, horizon, "#8b93c7", "#6c72a8", True)
    near = []
    for x, pk, wd in [(330, 300, 520), (760, 330, 620), (1080, 360, 420)]:
        near += mountain(x, pk, wd, horizon, "#4f7d86", "#35585f", False)
    b += far + near
    # pine forest band
    for i in range(60):
        x = i * 21 + random.uniform(-5, 5)
        th = random.uniform(40, 70)
        b.append(f'<polygon points="{x:.0f},{horizon-th:.0f} {x-12:.0f},{horizon} {x+12:.0f},{horizon}" fill="{random.choice(["#1f3f3a","#264a44","#1b3834"])}"/>')
    # lake: mirrored, darker
    lake = f'<g transform="translate(0 {2*horizon}) scale(1 -1)" opacity=".55">{"".join(far + near)}</g>'
    b.append(f'<rect x="0" y="{horizon}" width="{w}" height="{h-horizon}" fill="#3d5f7a"/>')
    b.append(f'<clipPath id="lk"><rect x="0" y="{horizon}" width="{w}" height="{h-horizon}"/></clipPath>')
    b.append(f'<g clip-path="url(#lk)">{lake}</g>')
    for k in range(14):
        y = horizon + 20 + k * 20
        x = random.uniform(0, w - 200)
        b.append(f'<polygon points="{x:.0f},{y} {x+random.uniform(80,240):.0f},{y-3} {x+random.uniform(60,200):.0f},{y+4}" fill="#cfe0ec" opacity=".35"/>')
    # shore
    b.append(f'<polygon points="0,{h} 0,{h-90} 260,{h-60} 520,{h-20} 600,{h}" fill="#233a33"/>')
    b.append(f'<polygon points="0,{h-90} 260,{h-60} 120,{h-40}" fill="#2f4d43"/>')
    save("lowpoly-alpine-lake", w, h, "".join(b))


# 4. Line art — botanical fan palm on cream paper (1:1)
def botanical():
    w = h = 900
    b = [f'<rect width="{w}" height="{h}" fill="#f6f1e6"/>']
    ink = "#23413a"
    fill = "#dbe7d3"
    C = (450, 360)

    def R(th):
        # heart-ish outline: wider at the sides, notch at the bottom (th = pi/2 points down)
        base = 300 - 40 * math.cos(2 * th)
        notch = 120 * math.exp(-((th - math.pi / 2) ** 2) / 0.02)
        return base - notch

    def pt(th, r):
        return (C[0] + math.cos(th) * r, C[1] + math.sin(th) * r * 0.9)

    b.append(f'<path d="M440 880 C430 780 440 680 450 {C[1]+60}" fill="none" stroke="{ink}" stroke-width="6" stroke-linecap="round"/>')
    # lobes: angle ranges (radians), measured clockwise from +x; skip the notch near pi/2
    edges = [math.radians(a) for a in (100, 128, 150, 172, 196, 222, 248, 272, 298, 322, 346, 368, 392, 414, 440, 460)]
    gap = math.radians(3.5)
    for a, c in zip(edges, edges[1:]):
        a0, a1 = a + gap, c - gap
        rin = 70
        p = []
        n = 10
        outer = [pt(a0 + (a1 - a0) * k / n, R(a0 + (a1 - a0) * k / n)) for k in range(n + 1)]
        i0, i1 = pt(a0 + gap, rin), pt(a1 - gap, rin)
        d = f"M{i0[0]:.1f} {i0[1]:.1f} L{outer[0][0]:.1f} {outer[0][1]:.1f} "
        for q in outer[1:]:
            d += f"L{q[0]:.1f} {q[1]:.1f} "
        d += f"L{i1[0]:.1f} {i1[1]:.1f} Z"
        b.append(f'<path d="{d}" fill="{fill}" stroke="{ink}" stroke-width="3.5" stroke-linejoin="round"/>')
        mid = (a0 + a1) / 2
        v0, v1 = pt(mid, rin), pt(mid, R(mid) * 0.93)
        b.append(f'<line x1="{v0[0]:.1f}" y1="{v0[1]:.1f}" x2="{v1[0]:.1f}" y2="{v1[1]:.1f}" stroke="{ink}" stroke-width="1.6" opacity=".7"/>')
        # a small hole in some lobes
        if False:
            hcx, hcy = pt(mid, R(mid) * 0.55)
            b.append(f'<ellipse cx="{hcx:.1f}" cy="{hcy:.1f}" rx="13" ry="7" fill="#f6f1e6" stroke="{ink}" stroke-width="2.5" transform="rotate({math.degrees(mid):.0f} {hcx:.1f} {hcy:.1f})"/>')
    # solid center
    b.append(f'<ellipse cx="{C[0]}" cy="{C[1]}" rx="78" ry="70" fill="{fill}"/>')
    b.append(f'<path d="M{C[0]-10} {C[1]+70} C{C[0]-4} {C[1]} {C[0]+6} {C[1]-150} {C[0]+14} {C[1]-250}" fill="none" stroke="{ink}" stroke-width="4" stroke-linecap="round"/>')
    # a bud leaf
    b.append(f'<path d="M442 760 C520 740 600 720 660 660 C600 650 520 670 470 720 Z" fill="{fill}" stroke="{ink}" stroke-width="3.5"/>')
    b.append(f'<path d="M442 760 C530 720 600 690 660 660" fill="none" stroke="{ink}" stroke-width="2"/>')
    b.append(f'<text x="620" y="850" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="30" fill="{ink}">Livistona chinensis</text>')
    b.append(f'<line x1="500" y1="864" x2="740" y2="864" stroke="{ink}" stroke-width="1.5"/>')
    save("botanical-fan-palm", w, h, f'<g filter="url(#grain)">{"".join(b)}</g>', GRAIN)


# 5. Isometric — tiny home office (1:1)
def isometric():
    w = h = 900
    b = [f'<rect width="{w}" height="{h}" fill="#ffe8d6"/>']
    c30, s30 = math.cos(math.pi / 6), 0.5

    def iso(x, y, z):
        return (450 + (x - y) * c30, 560 + (x + y) * s30 - z)

    def poly(pts, fill):
        return f'<polygon points="{" ".join(f"{p[0]:.1f},{p[1]:.1f}" for p in pts)}" fill="{fill}"/>'

    def box(x, y, z, dx, dy, dz, top, left, right):
        p = lambda a, b_, c: iso(a, b_, c)
        out = [poly([p(x, y, z + dz), p(x + dx, y, z + dz), p(x + dx, y + dy, z + dz), p(x, y + dy, z + dz)], top),
               poly([p(x, y + dy, z), p(x + dx, y + dy, z), p(x + dx, y + dy, z + dz), p(x, y + dy, z + dz)], left),
               poly([p(x + dx, y, z), p(x + dx, y + dy, z), p(x + dx, y + dy, z + dz), p(x + dx, y, z + dz)], right)]
        return out

    S = 300
    # floor and walls
    b.append(poly([iso(0, 0, 0), iso(S, 0, 0), iso(S, S, 0), iso(0, S, 0)], "#e9c9a8"))
    for k in range(1, 6):
        b.append(f'<line x1="{iso(k*50,0,0)[0]:.0f}" y1="{iso(k*50,0,0)[1]:.0f}" x2="{iso(k*50,S,0)[0]:.0f}" y2="{iso(k*50,S,0)[1]:.0f}" stroke="#dcb893" stroke-width="2"/>')
    b.append(poly([iso(0, 0, 0), iso(0, S, 0), iso(0, S, 300), iso(0, 0, 300)], "#8fb8a8"))
    b.append(poly([iso(0, 0, 0), iso(S, 0, 0), iso(S, 0, 300), iso(0, 0, 300)], "#a7cdbd"))
    # window on right wall
    b.append(poly([iso(150, 0, 140), iso(250, 0, 140), iso(250, 0, 250), iso(150, 0, 250)], "#dff3ff"))
    b.append(poly([iso(198, 0, 140), iso(202, 0, 140), iso(202, 0, 250), iso(198, 0, 250)], "#ffffff"))
    b.append(poly([iso(150, 0, 193), iso(250, 0, 193), iso(250, 0, 197), iso(150, 0, 197)], "#ffffff"))
    # shelf + books on left wall
    b += box(0, 60, 190, 30, 140, 8, "#b07a52", "#8f5f3d", "#9d6a45")
    bx = 70
    for i, (wd, ht, col) in enumerate([(14, 40, "#e86a5a"), (12, 34, "#f2b544"), (16, 44, "#4d7cc9"), (12, 30, "#6ab07a"), (14, 38, "#8c6ad1")]):
        b += box(4, bx, 198, 20, wd, ht, col, col, col)
        bx += wd + 3
    # rug
    b.append(poly([iso(40, 150, 0.5), iso(200, 150, 0.5), iso(200, 280, 0.5), iso(40, 280, 0.5)], "#f08a6c"))
    b.append(poly([iso(60, 170, 1), iso(180, 170, 1), iso(180, 260, 1), iso(60, 260, 1)], "#f6b39a"))
    # desk
    b += box(40, 30, 0, 12, 12, 100, "#6c4a35", "#5a3d2b", "#4b3224")
    b += box(40, 150, 0, 12, 12, 100, "#6c4a35", "#5a3d2b", "#4b3224")
    b += box(130, 30, 0, 12, 12, 100, "#6c4a35", "#5a3d2b", "#4b3224")
    b += box(130, 150, 0, 12, 12, 100, "#6c4a35", "#5a3d2b", "#4b3224")
    b += box(36, 26, 100, 110, 140, 10, "#c98b5a", "#a9724a", "#b67c50")
    # laptop
    b += box(70, 70, 110, 50, 70, 4, "#d9dde6", "#b7bcc8", "#c6cbd6")
    b.append(poly([iso(70, 70, 114), iso(70, 140, 114), iso(70, 140, 164), iso(70, 70, 164)], "#3b4252"))
    b.append(poly([iso(71, 75, 118), iso(71, 135, 118), iso(71, 135, 160), iso(71, 75, 160)], "#6d8cff"))
    for k in range(4):
        b.append(poly([iso(71, 82, 150 - k * 9), iso(71, 82 + 20 + k * 7, 150 - k * 9), iso(71, 82 + 20 + k * 7, 147 - k * 9), iso(71, 82, 147 - k * 9)], "#dbe3ff"))
    # mug
    b += box(110, 165, 110, 14, 14, 20, "#ffffff", "#e5e5ea", "#f0f0f4")
    # lamp
    b += box(70, 30, 110, 16, 16, 4, "#333", "#222", "#2a2a2a")
    b.append(f'<line x1="{iso(78,38,114)[0]:.0f}" y1="{iso(78,38,114)[1]:.0f}" x2="{iso(78,38,190)[0]:.0f}" y2="{iso(78,38,190)[1]:.0f}" stroke="#333" stroke-width="4"/>')
    b += box(68, 28, 180, 22, 22, 18, "#ffd166", "#f4b940", "#f7c54f")
    # plant
    b += box(230, 230, 0, 40, 40, 45, "#e07a5f", "#c7654c", "#d36f55")
    for dx, dy, dz, r in [(0, 0, 90, 24), (-18, 10, 72, 20), (16, -8, 76, 20), (6, 14, 110, 18)]:
        cx, cy = iso(250 + dx, 250 + dy, dz)
        b.append(f'<circle cx="{cx:.0f}" cy="{cy:.0f}" r="{r}" fill="#4f9d69"/>')
        b.append(f'<circle cx="{cx-6:.0f}" cy="{cy-6:.0f}" r="{r*0.45:.0f}" fill="#6fbf85"/>')
    # chair
    b += box(170, 90, 0, 8, 8, 55, "#444", "#333", "#3a3a3a")
    b += box(150, 70, 55, 50, 50, 8, "#ef476f", "#d63e62", "#e14268")
    b += box(196, 70, 63, 6, 50, 60, "#ef476f", "#d63e62", "#e14268")
    save("isometric-home-office", w, h, "".join(b))


# 6. Paper cut — layered ocean with a whale tail (4:5)
def papercut():
    w, h = 800, 1000
    defs = '<filter id="ds" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="-6" stdDeviation="7" flood-color="#0b2540" flood-opacity=".45"/></filter>'
    b = [f'<rect width="{w}" height="{h}" fill="#bfe3ee"/>']
    # clouds
    for cx, cy, s in [(200, 170, 1), (560, 120, .8), (640, 260, .6)]:
        b.append(f'<g filter="url(#ds)" transform="translate({cx} {cy}) scale({s})"><path d="M-120 30 a50 50 0 0 1 60 -50 a70 70 0 0 1 130 10 a45 45 0 0 1 50 40z" fill="#ffffff"/></g>')
    # gulls
    for gx, gy in [(420, 220), (470, 250), (380, 270)]:
        b.append(f'<path d="M{gx-14} {gy} q7 -9 14 0 q7 -9 14 0" fill="none" stroke="#35506b" stroke-width="3" stroke-linecap="round"/>')
    cols = ["#8fd0e0", "#5fb3cf", "#3d93b8", "#2a76a0", "#1d5c85", "#154a6d", "#0f3a58"]
    for i, c in enumerate(cols):
        y = 420 + i * 85
        amp = 26 + i * 4
        per = 260 - i * 12
        d = f"M-200 {h} L-200 {y} "
        x = -200
        k = 0
        while x <= w + 200 + per:
            d += f"Q{x + per/4:.0f} {y - amp if k%2==0 else y + amp} {x + per/2:.0f} {y} "
            x += per / 2
            k += 1
        d += f"L{w+200} {h}Z"
        b.append(f'<path d="{d}" fill="{c}" filter="url(#ds)" transform="translate({-i*37 % 120} 0)"/>')
        if i == 2:
            # whale tail between layers
            b.append('<g filter="url(#ds)"><path d="M470 600 C465 560 470 530 480 500 C440 470 400 450 350 455 C380 430 440 430 490 470 C500 470 505 470 510 470 C560 430 620 430 650 455 C600 450 560 470 522 500 C532 530 535 560 530 600Z" fill="#274b69"/></g>')
    # paper texture
    save("papercut-whale-tail", w, h, f'<g filter="url(#grain)">{"".join(b)}</g>', GRAIN + defs)


# 7. Bauhaus geometric poster (3:4)
def bauhaus():
    w, h = 750, 1000
    b = [f'<rect width="{w}" height="{h}" fill="#efe6d2"/>']
    b.append('<rect x="60" y="60" width="630" height="880" fill="none" stroke="#1d1d1b" stroke-width="6"/>')
    b.append('<rect x="60" y="60" width="315" height="420" fill="#1f4e9c"/>')
    b.append('<path d="M375 480 A250 250 0 0 1 625 730 L375 730Z" fill="#e0412f"/>')
    b.append('<circle cx="560" cy="250" r="110" fill="#f2b632"/>')
    b.append('<rect x="120" y="560" width="200" height="200" fill="#1d1d1b" transform="rotate(12 220 660)"/>')
    b.append('<path d="M375 60 L690 60 L690 150 Z" fill="#1d1d1b"/>')
    for k in range(7):
        b.append(f'<line x1="{470+k*34}" y1="770" x2="{470+k*34}" y2="940" stroke="#1d1d1b" stroke-width="{4 if k%2 else 10}"/>')
    b.append('<circle cx="220" cy="270" r="60" fill="none" stroke="#efe6d2" stroke-width="16"/>')
    b.append('<line x1="60" y1="480" x2="690" y2="480" stroke="#1d1d1b" stroke-width="6"/>')
    b.append('<text x="90" y="860" font-family="Helvetica, Arial, sans-serif" font-weight="800" font-size="64" letter-spacing="4" fill="#1d1d1b">FORM</text>')
    b.append('<text x="92" y="900" font-family="Helvetica, Arial, sans-serif" font-weight="500" font-size="19" letter-spacing="6" fill="#1d1d1b">FOLLOWS FUNCTION</text>')
    save("bauhaus-poster", w, h, f'<g filter="url(#grain)">{"".join(b)}</g>', GRAIN)


# 8. Synthwave — neon grid highway with palms (16:10)
def synthwave():
    w, h = 1200, 750
    defs = ('<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0d0221"/><stop offset=".6" stop-color="#3a0d5c"/><stop offset="1" stop-color="#ff2e88"/></linearGradient>'
            '<linearGradient id="gnd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a0433"/><stop offset="1" stop-color="#05010f"/></linearGradient>'
            '<filter id="glow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>')
    hz = 430
    b = [f'<rect width="{w}" height="{hz}" fill="url(#sky)"/>']
    random.seed(5)
    for _ in range(70):
        b.append(f'<circle cx="{random.uniform(0,w):.0f}" cy="{random.uniform(0,hz-150):.0f}" r="{random.choice([1,1.5,2])}" fill="#fff" opacity="{random.uniform(.3,1):.2f}"/>')
    # wireframe mountains
    m = [(0, hz), (120, 330), (230, 380), (360, 280), (470, hz)]
    m2 = [(730, hz), (850, 300), (960, 360), (1080, 270), (1200, 340), (1200, hz)]
    for pts, c in ((m, "#7b2cbf"), (m2, "#7b2cbf")):
        b.append(f'<polygon points="{" ".join(f"{x},{y}" for x,y in pts)}" fill="#1b0636" stroke="#c77dff" stroke-width="3" filter="url(#glow)"/>')
        for (x1, y1), (x2, y2) in zip(pts, pts[1:]):
            b.append(f'<line x1="{x1}" y1="{y1}" x2="{(x1+x2)/2:.0f}" y2="{hz}" stroke="#9d4edd" stroke-width="1.5" opacity=".7"/>')
    b.append(f'<rect y="{hz}" width="{w}" height="{h-hz}" fill="url(#gnd)"/>')
    vx = w / 2
    for k in range(-14, 15):
        b.append(f'<line x1="{vx}" y1="{hz}" x2="{vx + k*120}" y2="{h}" stroke="#ff2e88" stroke-width="2" opacity=".8" filter="url(#glow)"/>')
    y = hz
    step = 6
    while y < h:
        b.append(f'<rect x="0" y="{y-1:.0f}" width="{w}" height="{2 + (y-hz)/120:.1f}" fill="#ff2e88" opacity=".85" filter="url(#glow)"/>')
        step *= 1.35
        y += step
    b.append(f'<rect x="0" y="{hz-1.5}" width="{w}" height="3" fill="#ffd1f0" filter="url(#glow)"/>')
    # palms (silhouettes)

    def palm(x, base, hgt, flip=1):
        s = [f'<path d="M{x} {base} C{x+10*flip} {base-hgt*0.4} {x+30*flip} {base-hgt*0.8} {x+18*flip} {base-hgt}" stroke="#05010f" stroke-width="12" fill="none" stroke-linecap="round"/>']
        tx, ty = x + 18 * flip, base - hgt
        for ang, ln in [(-160, 110), (-130, 120), (-95, 80), (-60, 120), (-25, 110), (10, 90), (-190, 90)]:
            a = math.radians(ang)
            ex, ey = tx + math.cos(a) * ln, ty + math.sin(a) * ln * .6 + 35
            cx, cy = tx + math.cos(a) * ln * .5, ty + math.sin(a) * ln * .6 - 20
            s.append(f'<path d="M{tx:.0f} {ty:.0f} Q{cx:.0f} {cy:.0f} {ex:.0f} {ey:.0f}" stroke="#05010f" stroke-width="16" fill="none" stroke-linecap="round"/>')
        return "".join(s)
    b.append(palm(90, h, 330))
    b.append(palm(220, h, 250, -1))
    b.append(palm(1110, h, 350, -1))
    # road
    b.append(f'<polygon points="{vx-8},{hz} {vx+8},{hz} {vx+260},{h} {vx-260},{h}" fill="#12031f" opacity=".85"/>')
    y = hz + 10
    ln = 8
    while y < h:
        b.append(f'<polygon points="{vx-2-(y-hz)*0.02:.1f},{y:.0f} {vx+2+(y-hz)*0.02:.1f},{y:.0f} {vx+2+(y+ln-hz)*0.02:.1f},{y+ln:.0f} {vx-2-(y+ln-hz)*0.02:.1f},{y+ln:.0f}" fill="#ffe66d"/>')
        y += ln * 2.2
        ln *= 1.3
    save("synthwave-highway", w, h, "".join(b), defs)


# 9. Watercolor still life — lemons (4:3)
def watercolor():
    w, h = 1000, 750
    defs = ('<filter id="wc" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" seed="3" result="t"/>'
            '<feDisplacementMap in="SourceGraphic" in2="t" scale="18" xChannelSelector="R" yChannelSelector="G" result="d"/>'
            '<feGaussianBlur in="d" stdDeviation="1.2"/></filter>'
            '<filter id="paper"><feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" seed="9"/><feColorMatrix type="matrix" values="0 0 0 0 0.95  0 0 0 0 0.93  0 0 0 0 0.88  0 0 0 -0.9 0.95"/></filter>'
            '<radialGradient id="lem" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#fff3a0"/><stop offset=".55" stop-color="#f7d23c"/><stop offset="1" stop-color="#d9a21b"/></radialGradient>'
            '<radialGradient id="cut" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fffbe0"/><stop offset=".8" stop-color="#f7e27a"/><stop offset="1" stop-color="#e9c243"/></radialGradient>')
    b = [f'<rect width="{w}" height="{h}" fill="#f7f3ea"/>', f'<rect width="{w}" height="{h}" filter="url(#paper)" opacity=".6"/>']
    # table wash & cloth
    b.append('<path d="M0 470 C300 450 700 460 1000 440 L1000 750 L0 750Z" fill="#9fb8c9" opacity=".45" filter="url(#wc)"/>')
    b.append('<path d="M80 520 C300 480 520 500 700 470 L760 700 C520 720 300 710 60 700Z" fill="#e8eef3" opacity=".9" filter="url(#wc)"/>')
    for k in range(6):
        b.append(f'<path d="M{100+k*110} 505 L{90+k*115} 700" stroke="#7aa0bf" stroke-width="10" opacity=".35" filter="url(#wc)"/>')
    # bowl
    b.append('<path d="M560 330 C560 470 860 470 860 330 Z" fill="#3f6fa0" opacity=".85" filter="url(#wc)"/>')
    b.append('<ellipse cx="710" cy="330" rx="150" ry="28" fill="#2c517a" opacity=".85" filter="url(#wc)"/>')
    # lemons
    for cx, cy, rx, ry, rot in [(640, 300, 80, 58, -15), (770, 290, 78, 56, 20), (700, 250, 74, 54, 5), (360, 520, 90, 64, -8)]:
        b.append(f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="url(#lem)" transform="rotate({rot} {cx} {cy})" filter="url(#wc)"/>')
        b.append(f'<ellipse cx="{cx - rx*0.3:.0f}" cy="{cy - ry*0.35:.0f}" rx="{rx*0.25:.0f}" ry="{ry*0.14:.0f}" fill="#fffbe0" opacity=".7" filter="url(#wc)"/>')
    # half lemon
    b.append('<circle cx="520" cy="590" r="62" fill="#e7c23a" filter="url(#wc)"/><circle cx="520" cy="590" r="52" fill="url(#cut)" filter="url(#wc)"/>')
    for k in range(9):
        a = k * 2 * math.pi / 9
        b.append(f'<line x1="520" y1="590" x2="{520+math.cos(a)*48:.0f}" y2="{590+math.sin(a)*48:.0f}" stroke="#f3dc8a" stroke-width="4" filter="url(#wc)"/>')
    # leaves
    for d, c in [("M760 230 C800 170 880 160 920 180 C880 220 820 240 760 230Z", "#5c9b5a"), ("M650 250 C610 190 620 140 650 110 C680 160 680 210 650 250Z", "#4c8a4d")]:
        b.append(f'<path d="{d}" fill="{c}" opacity=".85" filter="url(#wc)"/>')
    # soft shadows
    b.append('<ellipse cx="370" cy="590" rx="100" ry="16" fill="#5a6f86" opacity=".25" filter="url(#wc)"/>')
    save("watercolor-lemons", w, h, "".join(b), defs)


# 10. Flat minimal — cat asleep on a rug (1:1)
def cat():
    w = h = 900
    b = [f'<rect width="{w}" height="{h}" fill="#f3d9c9"/>']
    b.append('<rect x="0" y="560" width="900" height="340" fill="#e7c2ad"/>')
    # rug
    b.append('<ellipse cx="450" cy="640" rx="330" ry="120" fill="#6b8f71"/>')
    b.append('<ellipse cx="450" cy="640" rx="290" ry="98" fill="none" stroke="#f3d9c9" stroke-width="8" stroke-dasharray="4 18" stroke-linecap="round"/>')
    # cat body (curled)
    b.append('<path d="M250 620 C240 520 330 450 450 455 C580 460 650 530 640 610 C630 670 540 690 450 688 C340 686 258 670 250 620Z" fill="#2b2b33"/>')
    # tail wrapping
    b.append('<path d="M620 640 C640 700 520 720 420 705 C360 696 330 680 320 668" fill="none" stroke="#2b2b33" stroke-width="44" stroke-linecap="round"/>')
    # head
    b.append('<ellipse cx="330" cy="560" rx="95" ry="80" fill="#34343e"/>')
    b.append('<path d="M258 520 L268 440 L318 490Z" fill="#34343e"/><path d="M350 486 L398 440 L408 520Z" fill="#34343e"/>')
    b.append('<path d="M272 505 L277 462 L304 490Z" fill="#e8a0a4"/><path d="M364 490 L392 462 L396 505Z" fill="#e8a0a4"/>')
    # closed eyes
    b.append('<path d="M285 560 q18 14 36 0" fill="none" stroke="#f3d9c9" stroke-width="5" stroke-linecap="round"/><path d="M345 560 q18 14 36 0" fill="none" stroke="#f3d9c9" stroke-width="5" stroke-linecap="round"/>')
    b.append('<path d="M326 586 l7 7 l7 -7z" fill="#e8a0a4"/>')
    # paw
    b.append('<ellipse cx="400" cy="640" rx="40" ry="22" fill="#34343e"/>')
    # zzz
    for i, (x, y, s) in enumerate([(430, 430, 30), (470, 385, 40), (520, 330, 52)]):
        b.append(f'<text x="{x}" y="{y}" font-family="Helvetica, Arial, sans-serif" font-weight="800" font-size="{s}" fill="#ffffff" opacity="{.6+i*.15}">z</text>')
    # window light patch & plant
    b.append('<path d="M600 80 h220 v320 h-220z" fill="#fbead9"/><path d="M710 80 v320 M600 240 h220" stroke="#f3d9c9" stroke-width="10"/>')
    b.append('<path d="M110 560 h90 l-12 -80 h-66z" fill="#d97b56"/>')
    for ang in (-60, -30, 0, 30, 60):
        a = math.radians(ang - 90)
        b.append(f'<path d="M155 480 q{math.cos(a)*40:.0f} {math.sin(a)*40-20:.0f} {math.cos(a)*90:.0f} {math.sin(a)*120:.0f}" stroke="#4f7d55" stroke-width="14" fill="none" stroke-linecap="round"/>')
    save("flat-sleepy-cat", w, h, "".join(b))


# 11. Top-down — ramen bowl (1:1)
def ramen():
    w = h = 900
    b = [f'<rect width="{w}" height="{h}" fill="#2d2a32"/>']
    # wood mat stripes
    for k in range(0, 900, 40):
        b.append(f'<rect x="{k}" y="0" width="36" height="900" fill="#3a3540"/>')
    b.append('<circle cx="450" cy="450" r="330" fill="#1b1a1f" opacity=".5" transform="translate(12 16)"/>')
    b.append('<circle cx="450" cy="450" r="330" fill="#c8453a"/>')
    b.append('<circle cx="450" cy="450" r="300" fill="#f1ede4"/>')
    b.append('<circle cx="450" cy="450" r="285" fill="#e2a55a"/>')
    # noodles
    random.seed(3)
    for k in range(26):
        y = 330 + k * 9
        b.append(f'<path d="M230 {y} C300 {y-20} 350 {y+20} 420 {y} S560 {y-18} 640 {y+4}" fill="none" stroke="#f7d98a" stroke-width="7" stroke-linecap="round" opacity=".95" clip-path="url(#bowl)"/>')
    # chashu
    for cx, cy, rot in [(560, 330, 20), (610, 420, -10)]:
        b.append(f'<g transform="rotate({rot} {cx} {cy})"><ellipse cx="{cx}" cy="{cy}" rx="70" ry="55" fill="#b86a45"/><ellipse cx="{cx}" cy="{cy}" rx="56" ry="42" fill="#e6b597"/><path d="M{cx-40} {cy} q20 -30 40 0 t40 0" stroke="#c98563" stroke-width="6" fill="none"/></g>')
    # eggs
    for cx, cy in [(330, 330), (390, 300)]:
        b.append(f'<ellipse cx="{cx}" cy="{cy}" rx="52" ry="40" fill="#fbf7ef"/><ellipse cx="{cx+4}" cy="{cy+2}" rx="26" ry="20" fill="#f29f24"/><ellipse cx="{cx}" cy="{cy-2}" rx="10" ry="7" fill="#fcc56b"/>')
    # nori
    b.append('<rect x="250" y="400" width="90" height="170" rx="6" fill="#1f3a2d" transform="rotate(-18 295 485)"/>')
    # scallions
    for _ in range(40):
        x = random.uniform(360, 560); y = random.uniform(470, 620)
        b.append(f'<circle cx="{x:.0f}" cy="{y:.0f}" r="9" fill="#6db35c"/><circle cx="{x:.0f}" cy="{y:.0f}" r="4" fill="#c7e8a8"/>')
    # narutomaki
    b.append('<circle cx="470" cy="420" r="38" fill="#ffffff"/><path d="M470 420 m-2 0 a6 6 0 1 1 8 4 a14 14 0 1 1 -20 -10 a22 22 0 1 1 30 18" fill="none" stroke="#e8617d" stroke-width="6"/>')
    # chopsticks
    b.append('<rect x="560" y="60" width="16" height="560" rx="8" fill="#d8b98e" transform="rotate(35 568 340)"/><rect x="600" y="60" width="16" height="560" rx="8" fill="#caa877" transform="rotate(30 608 340)"/>')
    save("topdown-ramen", w, h, "".join(b), '<clipPath id="bowl"><circle cx="450" cy="450" r="280"/></clipPath>')


# 12. Space — ringed planet and a small rocket (4:5)
def space():
    w, h = 800, 1000
    defs = ('<radialGradient id="pl" cx=".35" cy=".35" r=".75"><stop offset="0" stop-color="#ffd6a5"/><stop offset=".5" stop-color="#f28482"/><stop offset="1" stop-color="#6d2e46"/></radialGradient>'
            '<radialGradient id="neb" cx=".3" cy=".7" r=".6"><stop offset="0" stop-color="#5a189a" stop-opacity=".8"/><stop offset="1" stop-color="#10002b" stop-opacity="0"/></radialGradient>')
    b = [f'<rect width="{w}" height="{h}" fill="#10002b"/>', f'<rect width="{w}" height="{h}" fill="url(#neb)"/>']
    random.seed(8)
    for _ in range(160):
        r = random.choice([0.8, 1, 1.4, 2])
        b.append(f'<circle cx="{random.uniform(0,w):.0f}" cy="{random.uniform(0,h):.0f}" r="{r}" fill="#fff" opacity="{random.uniform(.3,1):.2f}"/>')
    for _ in range(6):
        x, y = random.uniform(0, w), random.uniform(0, h)
        b.append(f'<path d="M{x:.0f} {y-9:.0f} L{x+2:.0f} {y-2:.0f} L{x+9:.0f} {y:.0f} L{x+2:.0f} {y+2:.0f} L{x:.0f} {y+9:.0f} L{x-2:.0f} {y+2:.0f} L{x-9:.0f} {y:.0f} L{x-2:.0f} {y-2:.0f}Z" fill="#ffe8a3"/>')
    cx, cy = 460, 420
    # ring back
    b.append(f'<ellipse cx="{cx}" cy="{cy}" rx="300" ry="70" fill="none" stroke="#e9c46a" stroke-width="22" opacity=".9" transform="rotate(-18 {cx} {cy})"/>')
    b.append(f'<circle cx="{cx}" cy="{cy}" r="190" fill="url(#pl)"/>')
    for k, (dy, c) in enumerate([(-80, "#f6bd60"), (-20, "#f7a072"), (40, "#e76f51"), (100, "#b5485d")]):
        b.append(f'<path d="M{cx-185} {cy+dy} C{cx-60} {cy+dy-30} {cx+60} {cy+dy+30} {cx+185} {cy+dy}" stroke="{c}" stroke-width="16" fill="none" opacity=".45" clip-path="url(#pc)"/>')
    # ring front (half)
    b.append(f'<path d="M{cx-300} {cy} A300 70 0 0 0 {cx+300} {cy}" fill="none" stroke="#f4d58d" stroke-width="22" transform="rotate(-18 {cx} {cy})"/>')
    # moon
    b.append('<circle cx="170" cy="180" r="46" fill="#c9d6ea"/><circle cx="158" cy="170" r="10" fill="#aebfd8"/><circle cx="185" cy="198" r="7" fill="#aebfd8"/>')
    # rocket
    rx, ry = 250, 760
    b.append(f'<g transform="rotate(-35 {rx} {ry})">'
             f'<path d="M{rx} {ry+70} q-20 60 0 110 q20 -50 0 -110" fill="#ff9f1c"/><path d="M{rx} {ry+70} q-10 40 0 70 q10 -30 0 -70" fill="#ffe066"/>'
             f'<path d="M{rx-30} {ry+70} C{rx-34} {ry} {rx-20} {ry-50} {rx} {ry-80} C{rx+20} {ry-50} {rx+34} {ry} {rx+30} {ry+70}Z" fill="#f1faee"/>'
             f'<path d="M{rx} {ry-80} C{rx-12} {ry-62} {rx-20} {ry-45} {rx-24} {ry-30} h48 C{rx+20} {ry-45} {rx+12} {ry-62} {rx} {ry-80}Z" fill="#e63946"/>'
             f'<circle cx="{rx}" cy="{ry}" r="14" fill="#457b9d" stroke="#1d3557" stroke-width="5"/>'
             f'<path d="M{rx-30} {ry+30} l-26 44 l26 -4z M{rx+30} {ry+30} l26 44 l-26 -4z" fill="#e63946"/></g>')
    save("space-ringed-planet", w, h, "".join(b), defs + f'<clipPath id="pc"><circle cx="{cx}" cy="{cy}" r="190"/></clipPath>')


# 13. Architecture — colorful canal houses (3:4)
def houses():
    w, h = 750, 1000
    b = [f'<rect width="{w}" height="{h}" fill="#cfe8f3"/>']
    random.seed(21)
    x = 0
    cols = ["#e76f51", "#f4a261", "#2a9d8f", "#e9c46a", "#8ab17d", "#b56576", "#6d597a", "#457b9d"]
    i = 0
    while x < w:
        bw = random.randint(110, 150)
        top = random.randint(230, 380)
        c = cols[i % len(cols)]
        base = 780
        b.append(f'<rect x="{x}" y="{top}" width="{bw}" height="{base-top}" fill="{c}" stroke="#2b2d42" stroke-width="3"/>')
        gable = random.choice(["step", "bell", "point"])
        if gable == "point":
            b.append(f'<path d="M{x} {top} L{x+bw/2:.0f} {top-70} L{x+bw} {top}Z" fill="{c}" stroke="#2b2d42" stroke-width="3"/>')
        elif gable == "step":
            s = bw / 5
            d = f"M{x} {top} v-20 h{s:.0f} v-20 h{s:.0f} v-25 h{s:.0f} v25 h{s:.0f} v20 h{s:.0f} v20Z"
            b.append(f'<path d="{d}" fill="{c}" stroke="#2b2d42" stroke-width="3"/>')
        else:
            b.append(f'<path d="M{x} {top} C{x} {top-40} {x+bw*0.3:.0f} {top-30} {x+bw*0.35:.0f} {top-70} h{bw*0.3:.0f} C{x+bw*0.7:.0f} {top-30} {x+bw} {top-40} {x+bw} {top}Z" fill="{c}" stroke="#2b2d42" stroke-width="3"/>')
        b.append(f'<rect x="{x+bw/2-6:.0f}" y="{top-50}" width="12" height="12" fill="#2b2d42"/>')
        for wy in range(top + 30, base - 120, 95):
            for k in range(2):
                wx = x + 18 + k * (bw - 58)
                b.append(f'<rect x="{wx:.0f}" y="{wy}" width="40" height="60" fill="#fdf6e3" stroke="#2b2d42" stroke-width="3"/><line x1="{wx+20:.0f}" y1="{wy}" x2="{wx+20:.0f}" y2="{wy+60}" stroke="#2b2d42" stroke-width="2"/>')
        b.append(f'<rect x="{x+bw/2-20:.0f}" y="{base-80}" width="40" height="80" fill="#2b2d42"/>')
        x += bw
        i += 1
    b.append('<rect x="0" y="780" width="750" height="30" fill="#8d99ae"/>')
    b.append('<rect x="0" y="810" width="750" height="190" fill="#3d7ea6"/>')
    for k in range(12):
        y = 830 + k * 14
        b.append(f'<path d="M{random.randint(0,500)} {y} h{random.randint(60,220)}" stroke="#a9d6e5" stroke-width="4" stroke-linecap="round" opacity=".6"/>')
    # bike on quay
    bx, by = 560, 760
    b.append(f'<circle cx="{bx}" cy="{by}" r="18" fill="none" stroke="#2b2d42" stroke-width="4"/><circle cx="{bx+56}" cy="{by}" r="18" fill="none" stroke="#2b2d42" stroke-width="4"/><path d="M{bx} {by} l20 -30 h26 l10 30 M{bx+20} {by-30} l8 30 l28 0" fill="none" stroke="#d62828" stroke-width="4"/>')
    # boat
    b.append('<path d="M120 870 h220 l-30 40 h-160z" fill="#f1faee" stroke="#2b2d42" stroke-width="3"/><rect x="170" y="840" width="80" height="30" fill="#e63946" stroke="#2b2d42" stroke-width="3"/>')
    save("canal-houses", w, h, "".join(b))


for fn in (cafe, pixel_city, lowpoly, botanical, isometric, papercut, bauhaus, synthwave, watercolor, cat, ramen, space, houses):
    fn()
print("ok", sorted(os.listdir(OUT)))
