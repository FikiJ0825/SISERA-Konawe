"""Generator diagram laporan SI LAIKA (flowchart, use case, ERD).

Menulis SVG ke folder ini, lalu merender PNG (2x) lewat Microsoft Edge headless.
Jalankan:  python docs/diagram/buat_diagram.py
Ubah teks/posisi di bawah, jalankan ulang, lalu ganti gambar di Word.
"""
from __future__ import annotations

import html
import subprocess
import sys
from pathlib import Path

OUT = Path(__file__).parent
FONT = "Segoe UI, Arial, sans-serif"
INK = "#17324A"
LINE = "#2B3A4A"
BLUE = "#17588A"
BLUE_SOFT = "#EEF5FB"
ORANGE = "#D9772B"
GRAY = "#6B8196"


class Svg:
    def __init__(self, w: int, h: int):
        self.w, self.h = w, h
        self.items: list[str] = []

    def add(self, s: str):
        self.items.append(s)

    def text(self, x, y, s, size=15, anchor="middle", weight="400", fill=INK, italic=False):
        """Teks multi-baris (pisah dengan \\n), titik y = tengah blok teks."""
        lines = s.split("\n")
        lh = size * 1.28
        y0 = y - (len(lines) - 1) * lh / 2 + size * 0.35
        style = ' font-style="italic"' if italic else ""
        for i, ln in enumerate(lines):
            self.add(
                f'<text x="{x}" y="{y0 + i * lh:.1f}" font-family="{FONT}" font-size="{size}" '
                f'text-anchor="{anchor}" font-weight="{weight}" fill="{fill}"{style}>{html.escape(ln)}</text>'
            )

    def rect(self, x, y, w, h, fill="#fff", stroke=LINE, sw=1.6, rx=0, dash=None):
        d = f' stroke-dasharray="{dash}"' if dash else ""
        self.add(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"{d}/>')

    def line(self, pts, arrow=False, stroke=LINE, sw=1.6, dash=None, marker="arrow"):
        d = " ".join(f"{x},{y}" for x, y in pts)
        ds = f' stroke-dasharray="{dash}"' if dash else ""
        m = f' marker-end="url(#{marker})"' if arrow else ""
        self.add(f'<polyline points="{d}" fill="none" stroke="{stroke}" stroke-width="{sw}"{ds}{m}/>')

    # --- simbol flowchart ---
    def terminator(self, cx, cy, w, h, label):
        self.rect(cx - w / 2, cy - h / 2, w, h, fill=BLUE, stroke=BLUE, rx=h / 2)
        self.text(cx, cy, label, 15, weight="600", fill="#fff")

    def process(self, cx, cy, w, h, label, size=14):
        self.rect(cx - w / 2, cy - h / 2, w, h, rx=6)
        self.text(cx, cy, label, size)

    def decision(self, cx, cy, w, h, label, size=13.5):
        pts = f"{cx},{cy - h / 2} {cx + w / 2},{cy} {cx},{cy + h / 2} {cx - w / 2},{cy}"
        self.add(f'<polygon points="{pts}" fill="{BLUE_SOFT}" stroke="{BLUE}" stroke-width="1.8"/>')
        self.text(cx, cy, label, size, weight="600")

    def ellipse(self, cx, cy, w, h, label, size=13.5):
        self.add(f'<ellipse cx="{cx}" cy="{cy}" rx="{w / 2}" ry="{h / 2}" fill="#fff" stroke="{BLUE}" stroke-width="1.7"/>')
        self.text(cx, cy, label, size)

    def tag(self, x, y, s, anchor="middle", size=13, fill=BLUE, weight="700"):
        self.text(x, y, s, size, anchor=anchor, fill=fill, weight=weight)

    def save(self, name: str):
        defs = (
            '<defs>'
            f'<marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" orient="auto-start-reverse">'
            f'<path d="M0,0 L10,5 L0,10 z" fill="{LINE}"/></marker>'
            f'<marker id="arrowOpen" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" orient="auto-start-reverse">'
            f'<path d="M0,0 L10,5 L0,10" fill="none" stroke="{LINE}" stroke-width="1.5"/></marker>'
            '</defs>'
        )
        svg = (
            f'<svg xmlns="http://www.w3.org/2000/svg" width="{self.w}" height="{self.h}" viewBox="0 0 {self.w} {self.h}">'
            f'<rect width="100%" height="100%" fill="#fff"/>{defs}' + "".join(self.items) + "</svg>"
        )
        (OUT / f"{name}.svg").write_text(svg, encoding="utf-8")
        return self.w, self.h


# ---------------------------------------------------------------- Flowchart A
def flowchart_pengguna():
    s = Svg(940, 1420)
    cx = 470
    s.terminator(cx, 50, 170, 48, "Mulai")
    s.process(cx, 135, 320, 52, "Pengguna membuka aplikasi SI LAIKA", 15)
    s.process(cx, 222, 320, 60, "Tampil layar pembuka\n(logo dan nama lengkap SI LAIKA)", 15)
    s.process(cx, 309, 320, 52, "Aplikasi memuat data", 15)
    s.decision(cx, 404, 300, 100, "Data berhasil\ndimuat?", 15)
    s.process(cx, 520, 320, 52, "Tampil halaman Beranda", 15)
    s.process(cx, 605, 320, 52, "Pengguna memilih menu", 15)
    for a, b in [(74, 109), (161, 192), (252, 283), (335, 354), (454, 494), (546, 579)]:
        s.line([(cx, a), (cx, b)], arrow=True)
    s.tag(cx + 12, 472, "Ya", anchor="start", size=14)
    # gagal muat
    s.process(790, 404, 210, 76, "Tampil pesan gagal\ndan tombol\nMuat ulang", 14.5)
    s.line([(cx + 150, 404), (685, 404)], arrow=True)
    s.tag(cx + 168, 394, "Tidak", size=14)
    s.line([(790, 366), (790, 309), (cx + 160, 309)], arrow=True)
    s.tag(800, 345, "Muat ulang", anchor="start", size=13, fill=GRAY, weight="600")

    cols = [95 + 150 * i for i in range(6)]
    bw = 140
    heads = ["Cari data", "Indikator\nStrategis", "Publikasi", "Tabel", "Infografis, BRS,\nBerita, Jadwal\nRilis", "Notifikasi\ndan Lainnya"]
    subs = [
        "Ketik kata\nkunci, lihat\nhasil pencarian",
        "Pilih indikator,\nlihat nilai, tren\ndan definisi",
        "Pilih publikasi,\nlihat detail",
        "Pilih kategori,\npilih subjek,\nlihat tabel",
        "Pilih konten,\nbaca isinya",
        "Pilih menu,\nlihat informasi\natau kontak BPS",
    ]
    bus_top = 655
    s.line([(cols[0], bus_top), (cols[-1], bus_top)])
    s.line([(cx, 631), (cx, bus_top)])
    for c, h, t_ in zip(cols, heads, subs):
        s.line([(c, bus_top), (c, 690)], arrow=True)
        s.process(c, 730, bw, 76, h, size=14.5)
        s.line([(c, 768), (c, 800)], arrow=True)
        s.process(c, 852, bw, 92, t_, size=13.5)
    c = cols[1]
    s.line([(c, 898), (c, 930)], arrow=True)
    s.decision(c, 982, 146, 100, "Simpan ke\nbookmark?", size=13)
    s.line([(c, 1032), (c, 1066)], arrow=True)
    s.tag(c + 8, 1052, "Ya", anchor="start", size=13)
    s.process(c, 1100, bw, 60, "Simpan di\nperangkat", size=13.5)
    s.line([(c + 73, 982), (c + 88, 982), (c + 88, 1180)])
    s.tag(c + 94, 972, "Tidak", anchor="start", size=13)
    bus_bot = 1180
    for i, cc in enumerate(cols):
        s.line([(cc, 1130 if i == 1 else 898), (cc, bus_bot)])
    s.line([(cols[0], bus_bot), (cols[-1], bus_bot)])
    s.line([(cx, bus_bot), (cx, 1222)], arrow=True)
    s.decision(cx, 1272, 300, 100, "Ingin membuka\nmenu lain?", 15)
    s.line([(cx, 1322), (cx, 1352)], arrow=True)
    s.tag(cx + 12, 1338, "Tidak", anchor="start", size=14)
    s.terminator(cx, 1380, 170, 48, "Selesai")
    s.line([(cx - 150, 1272), (14, 1272), (14, 520), (cx - 160, 520)], arrow=True)
    s.tag(cx - 160, 1260, "Ya", anchor="end", size=14)
    return s.save("flowchart-alur-pengguna")


# ---------------------------------------------------------------- Flowchart B
def flowchart_data():
    s = Svg(900, 1080)
    lane_w = 300
    xs = [150 + 0, 450 + 0, 750]  # pusat lajur
    names = ["Aplikasi SI LAIKA", "Proxy API", "WebAPI BPS\n(domain Kab. Konawe)"]
    for i, (x, n) in enumerate(zip(xs, names)):
        s.rect(x - 150 + 0, 20, lane_w, 1040, fill="#fff" if i % 2 else "#FAFCFE", stroke="#B8C7D6", sw=1.2)
        s.rect(x - 150, 20, lane_w, 56, fill=BLUE_SOFT, stroke="#B8C7D6", sw=1.2)
        s.text(x, 48, n, 15, weight="700", fill=BLUE)
    A, P, W = xs
    bw, bh = 230, 58
    s.terminator(A, 125, 150, 42, "Mulai")
    s.process(A, 205, bw, bh, "Aplikasi membutuhkan data\n(mis. indikator, publikasi)")
    s.process(A, 295, bw, bh, "Kirim permintaan\nke Proxy API")
    s.process(P, 385, bw, bh, "Tambahkan API key BPS\ndan kode domain Konawe")
    s.process(P, 475, bw, bh, "Teruskan permintaan\nke WebAPI BPS")
    s.process(W, 565, bw, bh, "Proses permintaan")
    s.decision(W, 665, 250, 100, "Permintaan\nberhasil?")
    s.process(W, 790, bw, bh, "Kirim data (JSON)")
    s.process(P, 790, bw, bh, "Teruskan data\nke aplikasi")
    s.process(A, 790, bw, bh, "Petakan data ke\nmodel data aplikasi")
    s.process(A, 890, bw, bh, "Tampilkan data\nkepada pengguna")
    s.terminator(A, 990, 150, 42, "Selesai")
    # gagal
    s.process(P, 665, bw, bh, "Teruskan pesan galat\nke aplikasi")
    s.process(A, 665, bw, bh, "Tampil pesan gagal\ndan tombol Muat ulang")

    s.line([(A, 146), (A, 176)], arrow=True)
    s.line([(A, 234), (A, 266)], arrow=True)
    s.line([(A + 115, 295), (P, 295), (P, 356)], arrow=True)
    s.line([(P, 414), (P, 446)], arrow=True)
    s.line([(P + 115, 475), (W, 475), (W, 536)], arrow=True)
    s.line([(W, 594), (W, 615)], arrow=True)
    s.line([(W, 715), (W, 761)], arrow=True)
    s.tag(W + 10, 742, "Ya", anchor="start")
    s.line([(W - 115, 790), (P + 115, 790)], arrow=True)
    s.line([(P - 115, 790), (A + 115, 790)], arrow=True)
    s.line([(A, 819), (A, 861)], arrow=True)
    s.line([(A, 919), (A, 969)], arrow=True)
    s.line([(W - 125, 665), (P + 115, 665)], arrow=True)
    s.tag(595, 652, "Tidak", size=12.5)
    s.line([(P - 115, 665), (A + 115, 665)], arrow=True)
    # muat ulang
    s.line([(A - 115, 665), (A - 132, 665), (A - 132, 295), (A - 115, 295)], arrow=True)
    s.tag(A - 124, 480, "Muat ulang", anchor="start", size=12, fill=GRAY, weight="600")
    return s.save("flowchart-alur-data")


# ---------------------------------------------------------------- Use case
def use_case():
    s = Svg(860, 1260)
    bx0, bx1 = 130, 650
    s.rect(bx0, 30, bx1 - bx0, 1165, fill="#FCFDFE", stroke=BLUE, sw=2.2, rx=10)
    s.text((bx0 + bx1) / 2, 64, "Sistem SI LAIKA", 19, weight="700", fill=BLUE)
    cx = (bx0 + bx1) / 2
    lt, rt = 165, 620
    ew, eh = 300, 52
    FS = 13.5

    web = {"UC01", "UC02", "UC03", "UC06", "UC07", "UC08", "UC09", "UC10", "UC11", "UC16"}
    singles = [
        ("UC01", "Lihat beranda", 140),
        ("UC02", "Cari data", 206),
        ("UC03", "Lihat indikator strategis", 272),
        ("UC06", "Lihat publikasi", 466),
        ("UC07", "Lihat tabel per kategori\ndan subjek", 532),
        ("UC08", "Lihat infografis", 598),
        ("UC09", "Baca Berita Resmi\nStatistik (BRS)", 664),
        ("UC10", "Baca berita", 730),
        ("UC11", "Lihat jadwal rilis", 796),
        ("UC12", "Lihat notifikasi", 862),
        ("UC13", "Konsultasi", 928),
        ("UC14", "Buka Syantik", 994),
        ("UC15", "Lihat informasi layanan\n(PPID, standar, survei)", 1060),
        ("UC16", "Lihat kontak dan\nmedia sosial BPS", 1126),
    ]
    yp = 372  # baris pasangan UC04 / UC05
    pw, ph = 204, 66
    xl, xr = cx - 108, cx + 108
    ys_all = [y for _, _, y in singles] + [yp]
    mid = 640
    s.line([(88, mid - 22), (lt, mid - 22)], sw=2)
    s.line([(lt, min(ys_all)), (lt, max(ys_all))], sw=2)
    for _, _, y in singles:
        s.line([(lt, y), (cx - ew / 2, y)], sw=1.4)
    s.line([(lt, yp), (xl - pw / 2, yp)], sw=1.4)
    wys = [y for k, _, y in singles if k in web]
    top, bot = min(wys), max(wys)
    s.line([(rt, top), (rt, bot)], stroke=ORANGE, sw=2, dash="7 5")
    for k, _, y in singles:
        if k in web:
            s.line([(cx + ew / 2, y), (rt, y)], stroke=ORANGE, sw=1.4, dash="7 5")
    wy = (top + bot) / 2
    s.line([(rt, wy), (680, wy)], stroke=ORANGE, sw=2, dash="7 5")
    for k, t_, y in singles:
        s.ellipse(cx, y, ew, eh, f"{k}  {t_}", FS)
    s.ellipse(xl, yp, pw, ph, "UC04\nSimpan indikator\n(bookmark)", 13)
    s.ellipse(xr, yp, pw, ph, "UC05\nLihat grafik tren\ndan definisi", 13)
    y3 = 272
    s.line([(xl + 20, yp - ph / 2 + 2), (cx - 55, y3 + eh / 2 - 1)], arrow=True, dash="6 4", marker="arrowOpen", stroke=BLUE)
    s.tag(cx - 100, y3 + 50, "\u00abextend\u00bb", anchor="end", size=12.5, weight="600")
    s.line([(cx + 55, y3 + eh / 2 - 1), (xr - 20, yp - ph / 2 + 2)], arrow=True, dash="6 4", marker="arrowOpen", stroke=BLUE)
    s.tag(cx + 100, y3 + 50, "\u00abinclude\u00bb", anchor="start", size=12.5, weight="600")
    ax = 58
    s.add(f'<circle cx="{ax}" cy="{mid - 56}" r="15" fill="#fff" stroke="{LINE}" stroke-width="2"/>')
    s.line([(ax, mid - 41), (ax, mid + 10)], sw=2)
    s.line([(ax - 30, mid - 22), (ax + 30, mid - 22)], sw=2)
    s.line([(ax, mid + 10), (ax - 24, mid + 48)], sw=2)
    s.line([(ax, mid + 10), (ax + 24, mid + 48)], sw=2)
    s.text(ax + 8, mid + 76, "Pengguna\nUmum", 14.5, weight="700")
    s.rect(680, wy - 48, 170, 96, fill="#FFF7EE", stroke=ORANGE, sw=2, rx=6)
    s.text(765, wy - 22, "\u00absistem eksternal\u00bb", 12, fill=GRAY, italic=True)
    s.text(765, wy + 4, "WebAPI BPS", 16, weight="700")
    s.text(765, wy + 28, "(Kab. Konawe)", 12.5, fill=GRAY)
    s.line([(135, 1228), (180, 1228)], sw=1.8)
    s.text(188, 1228, "Pengguna menjalankan use case", 13, anchor="start")
    s.line([(450, 1228), (495, 1228)], stroke=ORANGE, sw=2, dash="7 5")
    s.text(503, 1228, "Data dari WebAPI BPS", 13, anchor="start")
    return s.save("use-case")


# ---------------------------------------------------------------- ERD
def entity(s: Svg, x, y, w, name, attrs, dashed=False, note=None):
    """attrs: list of (kunci, nama, tipe). Mengembalikan (x, y, w, h)."""
    rh, hh = 28, 36
    h = hh + rh * len(attrs)
    dash = "7 4" if dashed else None
    s.rect(x, y, w, h, fill="#fff", stroke=BLUE, sw=1.9, rx=4, dash=dash)
    s.add(f'<path d="M{x},{y + hh} L{x},{y + 4} Q{x},{y} {x + 4},{y} L{x + w - 4},{y} Q{x + w},{y} {x + w},{y + 4} L{x + w},{y + hh} Z" fill="{BLUE}"/>')
    s.text(x + w / 2, y + hh / 2, name, 14.5, weight="700", fill="#fff")
    for i, (k, n, t_) in enumerate(attrs):
        yy = y + hh + rh * i + rh / 2
        if i % 2 == 1:
            s.add(f'<rect x="{x + 1}" y="{y + hh + rh * i}" width="{w - 2}" height="{rh}" fill="{BLUE_SOFT}"/>')
        s.text(x + 10, yy, k, 11.5, anchor="start", weight="700", fill=ORANGE)
        s.text(x + 58, yy, n, 14, anchor="start")
        if t_:
            s.text(x + w - 10, yy, t_, 11.5, anchor="end", fill=GRAY)
    if note:
        s.text(x + w / 2, y + h + 18, note, 12, fill=GRAY, italic=True)
    return x, y, w, h


def mark_one(s, x, y, d):
    """Tanda 'tepat satu' (dua garis)."""
    if d in "lr":
        sg = 1 if d == "r" else -1
        for off in (12, 19):
            s.line([(x + sg * off, y - 9), (x + sg * off, y + 9)], sw=1.8)
    else:
        sg = 1 if d == "d" else -1
        for off in (12, 19):
            s.line([(x - 9, y + sg * off), (x + 9, y + sg * off)], sw=1.8)


def mark_many(s, x, y, d):
    """Kaki gagak (nol atau banyak)."""
    if d in "lr":
        sg = 1 if d == "r" else -1
        s.line([(x + sg * 16, y), (x, y - 10)], sw=1.8)
        s.line([(x + sg * 16, y), (x, y + 10)], sw=1.8)
        s.line([(x + sg * 16, y), (x, y)], sw=1.8)
        s.add(f'<circle cx="{x + sg * 25}" cy="{y}" r="5" fill="#fff" stroke="{LINE}" stroke-width="1.6"/>')
    else:
        sg = 1 if d == "d" else -1
        s.line([(x, y + sg * 16), (x - 10, y)], sw=1.8)
        s.line([(x, y + sg * 16), (x + 10, y)], sw=1.8)
        s.line([(x, y + sg * 16), (x, y)], sw=1.8)
        s.add(f'<circle cx="{x}" cy="{y + sg * 25}" r="5" fill="#fff" stroke="{LINE}" stroke-width="1.6"/>')


def erd():
    s = Svg(920, 1290)
    s.text(460, 28, "ERD Logis SI LAIKA", 18, weight="700", fill=BLUE)
    W, G = 240, 80
    x1, x2, x3 = 20, 20 + W + G, 20 + 2 * (W + G)
    y0 = 70
    entity(s, x1, y0, W, "KATEGORI_INDIKATOR", [("PK", "id_kategori", "int"), ("", "nama", "teks")])
    ind = entity(s, x2, y0, W, "INDIKATOR", [("PK", "id_indikator", "int"), ("FK", "id_kategori", "int"), ("", "judul", "teks"), ("", "satuan", "teks"), ("", "definisi", "teks"), ("", "ikon", "teks")])
    entity(s, x3, y0, W, "NILAI_INDIKATOR", [("PK", "id_nilai", "int"), ("FK", "id_indikator", "int"), ("", "periode", "teks"), ("", "nilai", "desimal")], note="data tren; nilai terbaru diturunkan")
    ybm = 380
    entity(s, x2, ybm, W, "BOOKMARK", [("PK/FK", "id_indikator", "int"), ("", "disimpan_pada", "waktu")], dashed=True, note="disimpan di perangkat")
    ykt = 560
    entity(s, x1, ykt, W, "KATEGORI_TABEL", [("PK", "id_kategori_tabel", "int"), ("", "nama", "teks"), ("", "ikon", "teks")])
    entity(s, x2, ykt, W, "SUBJEK_TABEL", [("PK", "id_subjek", "int"), ("FK", "id_kategori_tabel", "int"), ("", "nama", "teks")])

    yr = y0 + 36 + 14
    for xa, xb, lab in [(x1 + W, x2, "memiliki"), (x2 + W, x3, "bernilai")]:
        s.line([(xa, yr), (xb, yr)])
        mark_one(s, xa, yr, "r")
        mark_many(s, xb, yr, "l")
        s.text((xa + xb) / 2, yr - 22, lab, 12.5, fill=GRAY, italic=True)
    xb_ = x2 + W / 2
    s.line([(xb_, y0 + ind[3]), (xb_, ybm)])
    mark_one(s, xb_, y0 + ind[3], "d")
    mark_many(s, xb_, ybm, "u")
    s.text(xb_ + 12, (y0 + ind[3] + ybm) / 2, "ditandai", 12.5, anchor="start", fill=GRAY, italic=True)
    yt = ykt + 36 + 14
    s.line([(x1 + W, yt), (x2, yt)])
    mark_one(s, x1 + W, yt, "r")
    mark_many(s, x2, yt, "l")
    s.text((x1 + W + x2) / 2, yt - 22, "memiliki", 12.5, fill=GRAY, italic=True)

    kx = x3 - 60
    s.rect(kx, 330, 300, 170, fill="#FAFCFE", stroke="#B8C7D6", sw=1.2, rx=6)
    s.text(kx + 150, 354, "Keterangan", 14.5, weight="700", fill=BLUE)
    for i, n in enumerate(["PK = kunci utama, FK = kunci tamu", "Garis ganda = tepat satu (1)", "Kaki gagak = nol atau banyak (N)", "Garis putus-putus = disimpan lokal", "di perangkat, bukan dari sumber data"]):
        s.text(kx + 14, 384 + i * 22, n, 12.5, anchor="start")

    s.text(460, 745, "Entitas konten mandiri (tanpa relasi dengan entitas lain)", 14.5, weight="700", fill=BLUE)
    w2, gap = 280, 20
    xs = [20, 20 + w2 + gap, 20 + 2 * (w2 + gap)]
    ya, yb = 770, 970
    entity(s, xs[0], ya, w2, "PUBLIKASI", [("PK", "id_publikasi", ""), ("", "judul", ""), ("", "tanggal_rilis", ""), ("", "sampul_url", ""), ("", "pdf_url", "")])
    entity(s, xs[1], ya, w2, "INFOGRAFIS", [("PK", "id_infografis", ""), ("", "judul", ""), ("", "tanggal", ""), ("", "gambar_url", "")])
    entity(s, xs[2], ya, w2, "BRS", [("PK", "id_brs", ""), ("", "judul", ""), ("", "tanggal", ""), ("", "ringkasan", "")])
    entity(s, xs[0], yb, w2, "BERITA", [("PK", "id_berita", ""), ("", "judul", ""), ("", "tanggal", ""), ("", "ringkasan", "")])
    entity(s, xs[1], yb, w2, "JADWAL_RILIS", [("PK", "id_jadwal", ""), ("", "judul", ""), ("", "tanggal", ""), ("", "jenis", "")])
    entity(s, xs[2], yb, w2, "KONTAK", [("PK", "id_kontak", ""), ("", "alamat", ""), ("", "telepon", ""), ("", "email", ""), ("", "website", ""), ("", "instagram", ""), ("", "facebook", ""), ("", "youtube", "")])
    return s.save("erd")


def render_png(name: str, w: int, h: int):
    edge = next(
        (p for p in [
            r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
            r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
            r"C:\Program Files\Google\Chrome\Application\chrome.exe",
        ] if Path(p).exists()),
        None,
    )
    if not edge:
        sys.exit("Edge/Chrome tidak ditemukan; buka file .svg di browser lalu simpan sebagai PNG.")
    svg = (OUT / f"{name}.svg").resolve()
    png = (OUT / f"{name}.png").resolve()
    subprocess.run(
        [edge, "--headless=new", "--disable-gpu", "--hide-scrollbars", f"--screenshot={png}",
         f"--window-size={w},{h}", "--force-device-scale-factor=2", "--default-background-color=FFFFFFFF",
         svg.as_uri()],
        check=True, capture_output=True, timeout=120,
    )
    print("ok", png.name)


if __name__ == "__main__":
    for fn, name in [(flowchart_pengguna, "flowchart-alur-pengguna"), (flowchart_data, "flowchart-alur-data"), (use_case, "use-case"), (erd, "erd")]:
        w, h = fn()
        render_png(name, w, h)
