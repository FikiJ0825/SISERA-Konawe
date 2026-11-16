"""Membuat Templat_Laporan_Progres_Bulan_1_SI_LAIKA.docx (laporan sederhana, tanpa daftar isi/pengesahan).

Jalankan dari root project:  python docs/buat_templat_laporan.py
Diagram diambil dari docs/diagram/*.png (hasil docs/diagram/buat_diagram.py).
"""
import re
from pathlib import Path

from docx import Document
from docx.enum.section import WD_ORIENT
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_COLOR_INDEX, WD_LINE_SPACING
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Cm, Pt, RGBColor

ROOT = Path(__file__).resolve().parent.parent
DIAG = ROOT / "docs" / "diagram"
LOGO = ROOT / "assets" / "images" / "logo-silaika-lengkap.png"
OUT = ROOT / "Templat_Laporan_Progres_Bulan_1_SI_LAIKA.docx"
FONT = "Times New Roman"
GRAY = RGBColor(0x59, 0x59, 0x59)

doc = Document()

# ---------------------------------------------------------------- halaman & gaya
sec = doc.sections[0]
sec.page_width, sec.page_height = Cm(21), Cm(29.7)
sec.orientation = WD_ORIENT.PORTRAIT
for side in ("left_margin", "right_margin", "top_margin", "bottom_margin"):
    setattr(sec, side, Cm(3))


def set_font(style, size, bold=None, color=None):
    style.font.name = FONT
    style.font.size = Pt(size)
    if bold is not None:
        style.font.bold = bold
    style.font.color.rgb = color or RGBColor(0, 0, 0)
    rpr = style.element.get_or_add_rPr()
    rfonts = rpr.find(qn("w:rFonts"))
    if rfonts is None:
        rfonts = OxmlElement("w:rFonts")
        rpr.append(rfonts)
    for attr in list(rfonts.attrib):
        if "Theme" in attr:
            del rfonts.attrib[attr]
    for attr in ("w:ascii", "w:hAnsi", "w:eastAsia", "w:cs"):
        rfonts.set(qn(attr), FONT)


normal = doc.styles["Normal"]
set_font(normal, 12)
normal.paragraph_format.line_spacing = 1.5
normal.paragraph_format.space_after = Pt(6)
for name, size in (("Heading 1", 13), ("Heading 2", 12), ("Heading 3", 12)):
    st = doc.styles[name]
    set_font(st, size, bold=True)
    st.font.italic = False
    st.paragraph_format.space_before = Pt(14 if name == "Heading 1" else 10)
    st.paragraph_format.space_after = Pt(6)
    st.paragraph_format.line_spacing = 1.15
    st.paragraph_format.keep_with_next = True

# nomor halaman di footer
fp = sec.footer.paragraphs[0]
fp.alignment = WD_ALIGN_PARAGRAPH.CENTER
run = fp.add_run()
for tag, txt in (("begin", None), (None, "PAGE"), ("end", None)):
    if tag:
        el = OxmlElement("w:fldChar")
        el.set(qn("w:fldCharType"), tag)
    else:
        el = OxmlElement("w:instrText")
        el.set(qn("xml:space"), "preserve")
        el.text = txt
    run._r.append(el)
run.font.size = Pt(10)


# ---------------------------------------------------------------- pembantu
def shade(cell, hex_fill):
    tcpr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:val"), "clear")
    shd.set(qn("w:color"), "auto")
    shd.set(qn("w:fill"), hex_fill)
    tcpr.append(shd)


def runs(par, text, size=None, bold=False, italic=False, color=None):
    """Tambah teks; bagian [dalam kurung siku] diberi stabilo kuning (tempat mengisi)."""
    for part in re.split(r"(\[[^\]]+\])", text):
        if not part:
            continue
        r = par.add_run(part)
        r.bold = bold
        r.italic = italic
        if size:
            r.font.size = Pt(size)
        if color is not None:
            r.font.color.rgb = color
        if part.startswith("[") and part.endswith("]"):
            r.font.highlight_color = WD_COLOR_INDEX.YELLOW
    return par


def para(text="", align=None, size=None, bold=False, italic=False, space_after=None, first_indent=False):
    p = doc.add_paragraph()
    runs(p, text, size=size, bold=bold, italic=italic)
    if align:
        p.alignment = align
    if space_after is not None:
        p.paragraph_format.space_after = Pt(space_after)
    if first_indent:
        p.paragraph_format.first_line_indent = Cm(1)
    return p


def isi(text):
    """Paragraf isian: satu placeholder kuning, rata kiri-kanan."""
    p = para(text, align=WD_ALIGN_PARAGRAPH.JUSTIFY, first_indent=True)
    return p


def h1(t):
    doc.add_heading(t, level=1)


def h2(t):
    doc.add_heading(t, level=2)


def no_split(table):
    for row in table.rows:
        trpr = row._tr.get_or_add_trPr()
        cs = OxmlElement("w:cantSplit")
        cs.set(qn("w:val"), "true")
        trpr.append(cs)


def tight(cell, size=11, bold=False, align=None):
    for p in cell.paragraphs:
        p.paragraph_format.line_spacing = 1.0
        p.paragraph_format.space_after = Pt(2)
        p.paragraph_format.space_before = Pt(2)
        if align:
            p.alignment = align
        for r in p.runs:
            r.font.size = Pt(size)
            if bold:
                r.bold = True


def petunjuk(lines, title="PETUNJUK (hapus kotak ini setelah bagian terisi)"):
    """Kotak abu-abu berisi pemandu pengisian."""
    t = doc.add_table(rows=1, cols=1)
    t.alignment = WD_TABLE_ALIGNMENT.CENTER
    t.style = "Table Grid"
    c = t.rows[0].cells[0]
    shade(c, "EDEDED")
    p = c.paragraphs[0]
    runs(p, title, size=10, bold=True, color=GRAY)
    for ln in lines:
        q = c.add_paragraph()
        runs(q, "• " + ln, size=10, italic=True, color=GRAY)
    tight(c, size=10)
    no_split(t)
    for q in c.paragraphs[:-1]:
        q.paragraph_format.keep_with_next = True
    doc.add_paragraph().paragraph_format.space_after = Pt(0)
    return t


def table(headers, rows, widths_cm, size=11, caption=None):
    if caption:
        cp = para(caption, bold=True, size=11, space_after=3)
        cp.paragraph_format.keep_with_next = True
        cp.paragraph_format.line_spacing = 1.0
    t = doc.add_table(rows=1, cols=len(headers))
    t.style = "Table Grid"
    t.alignment = WD_TABLE_ALIGNMENT.CENTER
    t.autofit = False
    for i, h in enumerate(headers):
        c = t.rows[0].cells[i]
        c.text = ""
        runs(c.paragraphs[0], h, bold=True)
        shade(c, "D9E2F3")
        tight(c, size, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER)
    # ulangi baris judul di halaman berikutnya
    trpr = t.rows[0]._tr.get_or_add_trPr()
    hdr = OxmlElement("w:tblHeader")
    hdr.set(qn("w:val"), "true")
    trpr.append(hdr)
    for row in rows:
        cells = t.add_row().cells
        for i, v in enumerate(row):
            cells[i].text = ""
            runs(cells[i].paragraphs[0], v)
            tight(cells[i], size)
    for row in t.rows:
        for i, w in enumerate(widths_cm):
            row.cells[i].width = Cm(w)
    no_split(t)
    for c in t.rows[0].cells:
        for q in c.paragraphs:
            q.paragraph_format.keep_with_next = True
    doc.add_paragraph().paragraph_format.space_after = Pt(0)
    return t


def figure(png, width_cm, caption):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.keep_with_next = True
    p.paragraph_format.line_spacing = 1.0
    p.add_run().add_picture(str(DIAG / png), width=Cm(width_cm))
    c = para(caption, align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, size=11)
    c.paragraph_format.line_spacing = 1.0


# ================================================================ ISI DOKUMEN
petunjuk(
    [
        "Kotak abu-abu seperti ini = petunjuk pengisian. Hapus setiap kotak setelah bagiannya Anda isi.",
        "Teks berlatar kuning dalam [kurung siku] = bagian yang harus diganti dengan isi Anda.",
        "Gambar flowchart, use case, dan ERD sudah disediakan. Jika perlu diubah, edit lalu buat ulang lewat docs/diagram/buat_diagram.py, kemudian ganti gambarnya di sini.",
        "Laporan ini sengaja belum memuat tampilan antarmuka (UI). Bagian itu dilaporkan pada laporan bulan kedua.",
        "Tidak ada halaman pengesahan, daftar isi, atau daftar tabel/gambar. Jika nanti diperlukan, judul sudah memakai gaya Heading sehingga daftar isi bisa disisipkan lewat menu References.",
    ],
    title="CARA MEMAKAI TEMPLAT (hapus kotak ini dulu)",
)

# ---- Kop sederhana
p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
p.paragraph_format.space_after = Pt(0)
p.add_run().add_picture(str(LOGO), width=Cm(6))
para("LAPORAN PROGRES BULAN PERTAMA", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, size=14, space_after=0).paragraph_format.line_spacing = 1.15
para("Perancangan Aplikasi SI LAIKA", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, size=13, space_after=0).paragraph_format.line_spacing = 1.15
para("Sistem Informasi dan Layanan Statistik Konawe Terintegrasi", align=WD_ALIGN_PARAGRAPH.CENTER, italic=True, size=12, space_after=10).paragraph_format.line_spacing = 1.15

info = doc.add_table(rows=0, cols=3)
info.alignment = WD_TABLE_ALIGNMENT.CENTER
for k, v in [
    ("Program", "Maganghub"),
    ("Instansi", "Badan Pusat Statistik Kabupaten Konawe"),
    ("Disusun oleh", "[nama tim / nama anggota]"),
    ("Pembimbing", "[nama pembimbing di BPS Konawe]"),
    ("Periode", "[tanggal mulai] s.d. [tanggal akhir bulan pertama]"),
]:
    cells = info.add_row().cells
    cells[0].text, cells[1].text = k, ":"
    runs(cells[2].paragraphs[0], v)
    for c in cells:
        tight(c, 12)
for row in info.rows:
    for i, w in enumerate((3.2, 0.6, 11.2)):
        row.cells[i].width = Cm(w)
doc.add_paragraph()

# ---- 1. Pendahuluan
h1("1. PENDAHULUAN")
h2("1.1 Latar Belakang")
petunjuk(
    [
        "Tulis 2-3 paragraf singkat: (1) BPS Provinsi Sulawesi Tenggara sudah punya aplikasi SISERA; (2) kebutuhan data statistik tingkat Kabupaten Konawe dan kesulitan yang ada sekarang (data tersebar di web/publikasi PDF); (3) tim Maganghub diberi tugas membangun SI LAIKA.",
        "Pastikan klaim 'belum ada aplikasi serupa untuk Konawe' sudah dikonfirmasi ke pembimbing sebelum ditulis.",
    ]
)
isi("[Tulis latar belakang di sini.]")
h2("1.2 Tujuan")
petunjuk(["Cukup 2-3 poin: tujuan aplikasi SI LAIKA dan tujuan laporan bulan pertama ini (menyampaikan gambaran dan rancangan aplikasi)."])
isi("[Tulis tujuan di sini.]")
h2("1.3 Ruang Lingkup Laporan")
petunjuk(["Jelaskan bahwa laporan ini hanya memuat gambaran aplikasi, flowchart, use case, dan ERD. Tegaskan bahwa tampilan antarmuka akan dilaporkan pada laporan bulan kedua."])
isi("[Tulis ruang lingkup laporan di sini.]")

# ---- 2. Gambaran umum
h1("2. GAMBARAN UMUM APLIKASI SI LAIKA")
h2("2.1 Identitas Aplikasi")
table(
    ["Aspek", "Keterangan"],
    [
        ["Nama aplikasi", "SI LAIKA"],
        ["Kepanjangan", "Sistem Informasi dan Layanan Statistik Konawe Terintegrasi"],
        ["Pengguna sasaran", "Masyarakat umum, pelajar, peneliti, dan instansi yang membutuhkan data statistik Kabupaten Konawe"],
        ["Platform", "Aplikasi mobile Android dan iOS"],
        ["Sumber data", "WebAPI BPS (domain Kabupaten Konawe)"],
        ["Pengembang", "[nama tim]"],
        ["Pembimbing / instansi", "[nama pembimbing], BPS Kabupaten Konawe"],
    ],
    (4.5, 10.5),
    caption="Tabel 1. Identitas aplikasi",
)
petunjuk(["Periksa baris di atas dan koreksi jika ada yang tidak sesuai. Tambahkan satu paragraf singkat (3-4 kalimat) yang menjelaskan apa itu SI LAIKA dengan bahasa Anda sendiri."])
isi("[Tulis deskripsi singkat aplikasi di sini.]")

h2("2.2 Fitur Utama")
petunjuk(
    [
        "Fitur di bawah mengikuti rancangan aplikasi saat ini. Sesuaikan deskripsinya dengan bahasa tim dan hapus/tambah baris bila rancangan berubah.",
        "Cukup deskripsi singkat satu kalimat per fitur. Jangan menampilkan tangkapan layar (UI ditahan untuk laporan bulan kedua).",
    ]
)
table(
    ["No", "Fitur", "Deskripsi"],
    [
        ["1", "Beranda", "Ringkasan indikator strategis, pintasan menu, dan informasi terbaru"],
        ["2", "Pencarian", "Mencari data berdasarkan kata kunci"],
        ["3", "Indikator Strategis", "Daftar indikator dengan nilai terbaru, grafik tren, definisi, dan penyimpanan favorit (bookmark)"],
        ["4", "Publikasi", "Daftar publikasi BPS Kabupaten Konawe beserta tanggal rilis"],
        ["5", "Tabel", "Tabel statistik dikelompokkan per kategori dan subjek"],
        ["6", "Infografis", "Galeri infografis statistik"],
        ["7", "Berita Resmi Statistik (BRS) dan Berita", "Rilis resmi dan berita statistik"],
        ["8", "Jadwal Rilis dan Notifikasi", "Jadwal rilis data dan pemberitahuan informasi baru"],
        ["9", "Layanan dan Kontak", "Konsultasi, Syantik, informasi layanan, serta kontak dan media sosial BPS"],
    ],
    (1.2, 5.0, 8.8),
    caption="Tabel 2. Fitur utama aplikasi",
)

h2("2.3 Sumber Data dan Teknologi")
petunjuk(
    [
        "Jelaskan bahwa data diambil dari WebAPI BPS (domain Kabupaten Konawe), bukan diinput manual, sehingga mengikuti rilis resmi BPS.",
        "Jelaskan peran proxy: API key BPS disimpan di sisi server (proxy), tidak ditanam di aplikasi, demi keamanan.",
        "Tulis status izin akses WebAPI dengan jujur (misalnya masih menunggu perizinan dari BPS pusat, sehingga sementara memakai data contoh).",
        "Teknologi cukup satu kalimat: React Native (Expo) untuk aplikasi Android dan iOS.",
    ]
)
isi("[Tulis penjelasan sumber data, proxy, status izin, dan teknologi di sini.]")

# ---- 3. Perancangan
h1("3. ANALISIS DAN PERANCANGAN SISTEM")
h2("3.1 Flowchart")
petunjuk(
    [
        "Flowchart A menunjukkan alur pengguna dari membuka aplikasi sampai selesai. Flowchart B menunjukkan bagaimana aplikasi mengambil data lewat proxy ke WebAPI BPS.",
        "Di bawah tiap gambar, tulis 1 paragraf penjelasan: sebutkan langkah-langkah utamanya berurutan dan percabangan (keputusan) yang ada.",
    ]
)
figure("flowchart-alur-pengguna.png", 14.5, "Gambar 1. Flowchart alur penggunaan aplikasi")
isi("[Jelaskan Gambar 1 di sini.]")
figure("flowchart-alur-data.png", 15, "Gambar 2. Flowchart alur pengambilan data")
isi("[Jelaskan Gambar 2 di sini.]")

h2("3.2 Use Case")
petunjuk(
    [
        "Ada dua aktor: Pengguna Umum dan WebAPI BPS (sistem eksternal penyedia data). Admin BPS Konawe sengaja tidak digambar karena aplikasi tidak menyediakan pengelolaan data; data dikelola BPS di sistemnya sendiri. Tulis satu kalimat tentang hal ini di paragraf penjelasan.",
        "Garis oranye putus-putus menandakan use case yang datanya diambil dari WebAPI BPS.",
        "Kolom Keterangan di Tabel 4 berisi status saat ini. Ubah atau hapus sesuai kondisi saat laporan dikumpulkan.",
    ]
)
table(
    ["Aktor", "Keterangan"],
    [
        ["Pengguna Umum", "Masyarakat, pelajar, peneliti, atau instansi yang memakai aplikasi tanpa perlu login"],
        ["WebAPI BPS", "Sistem eksternal milik BPS yang menyediakan data statistik Kabupaten Konawe"],
    ],
    (4.0, 11.0),
    caption="Tabel 3. Aktor",
)
figure("use-case.png", 14.5, "Gambar 3. Use case diagram SI LAIKA")
isi("[Jelaskan Gambar 3 di sini, termasuk alasan Admin BPS tidak digambar.]")
table(
    ["Kode", "Use case", "Deskripsi singkat", "Keterangan"],
    [
        ["UC01", "Lihat beranda", "Melihat ringkasan indikator, pintasan menu, dan informasi terbaru", ""],
        ["UC02", "Cari data", "Mencari indikator, publikasi, atau tabel dengan kata kunci", ""],
        ["UC03", "Lihat indikator strategis", "Melihat daftar dan detail indikator", ""],
        ["UC04", "Simpan indikator (bookmark)", "Menandai indikator favorit, disimpan di perangkat (extend dari UC03)", ""],
        ["UC05", "Lihat grafik tren dan definisi indikator", "Melihat tren nilai dan definisi pada detail indikator (di-include oleh UC03)", ""],
        ["UC06", "Lihat publikasi", "Melihat daftar dan detail publikasi", "Unduh PDF menyusul"],
        ["UC07", "Lihat tabel per kategori dan subjek", "Menelusuri tabel statistik berdasarkan kategori dan subjek", ""],
        ["UC08", "Lihat infografis", "Melihat galeri infografis", ""],
        ["UC09", "Baca Berita Resmi Statistik (BRS)", "Membaca rilis resmi statistik", ""],
        ["UC10", "Baca berita", "Membaca berita statistik", ""],
        ["UC11", "Lihat jadwal rilis", "Melihat jadwal rilis data BPS", ""],
        ["UC12", "Lihat notifikasi", "Melihat pemberitahuan informasi baru", "Masih contoh, belum terhubung"],
        ["UC13", "Konsultasi", "Menghubungi layanan konsultasi statistik BPS Konawe", "Bentuk layanan menunggu konfirmasi"],
        ["UC14", "Buka Syantik", "Membuka sistem Syantik BPS", "Tujuan tautan menunggu konfirmasi"],
        ["UC15", "Lihat informasi layanan", "Melihat PPID, standar dan maklumat pelayanan, serta survei kepuasan", "Isi menunggu sumber resmi"],
        ["UC16", "Lihat kontak dan media sosial BPS", "Melihat alamat, telepon, email, dan media sosial BPS Konawe", ""],
    ],
    (1.4, 4.2, 6.2, 3.2),
    size=10,
    caption="Tabel 4. Daftar use case",
)

h2("3.3 Entity Relationship Diagram (ERD)")
petunjuk(
    [
        "ERD ini bersifat logis: menggambarkan struktur data yang dipakai aplikasi, apa pun cara penyimpanan atau sumbernya. Entitas mengikuti model data di aplikasi (src/types/index.ts).",
        "Kategori indikator dibuat entitas tersendiri (di kode masih berupa teks) agar relasinya jelas. BOOKMARK berstatus lokal (di perangkat) karena aplikasi tidak memakai akun pengguna.",
        "Tulis satu paragraf penjelasan: sebutkan relasi utama (1 kategori punya banyak indikator, 1 indikator punya banyak nilai per periode, dst.) dan entitas yang berdiri sendiri.",
    ]
)
figure("erd.png", 14.5, "Gambar 4. ERD logis SI LAIKA")
isi("[Jelaskan Gambar 4 di sini.]")
table(
    ["Entitas", "Atribut utama", "Keterangan"],
    [
        ["KATEGORI_INDIKATOR", "id_kategori, nama", "Pengelompokan indikator strategis"],
        ["INDIKATOR", "id_indikator, id_kategori, judul, satuan, definisi, ikon", "Master indikator strategis"],
        ["NILAI_INDIKATOR", "id_nilai, id_indikator, periode, nilai", "Nilai per periode (data tren); nilai terbaru diturunkan dari periode terakhir"],
        ["BOOKMARK", "id_indikator, disimpan_pada", "Indikator favorit pengguna; disimpan di perangkat"],
        ["KATEGORI_TABEL", "id_kategori_tabel, nama, ikon", "Kelompok tabel statistik"],
        ["SUBJEK_TABEL", "id_subjek, id_kategori_tabel, nama", "Subjek di dalam kategori tabel"],
        ["PUBLIKASI", "id_publikasi, judul, tanggal_rilis, sampul_url, pdf_url", "Publikasi BPS"],
        ["INFOGRAFIS", "id_infografis, judul, tanggal, gambar_url", "Infografis statistik"],
        ["BRS", "id_brs, judul, tanggal, ringkasan", "Berita Resmi Statistik"],
        ["BERITA", "id_berita, judul, tanggal, ringkasan", "Berita statistik"],
        ["JADWAL_RILIS", "id_jadwal, judul, tanggal, jenis", "Jadwal rilis data"],
        ["KONTAK", "id_kontak, alamat, telepon, email, website, instagram, facebook, youtube", "Informasi kontak BPS Konawe (satu data)"],
    ],
    (4.6, 5.8, 4.6),
    size=10,
    caption="Tabel 5. Daftar entitas",
)

# ---- 4. Progres
h1("4. PROGRES, KENDALA, DAN RENCANA")
h2("4.1 Kegiatan Bulan Pertama")
petunjuk(
    [
        "Isi kegiatan yang benar-benar sudah dikerjakan selama bulan pertama, misalnya: pengumpulan kebutuhan dan kajian aplikasi SISERA Sultra, penyusunan use case, perancangan flowchart dan ERD, penentuan teknologi, persiapan integrasi WebAPI BPS.",
        "Tulis tampilan antarmuka di sini hanya jika Anda memang ingin menyebutnya sebagai kegiatan; rinciannya tetap ditahan untuk laporan bulan kedua.",
    ]
)
table(
    ["No", "Kegiatan", "Hasil / keluaran", "Status"],
    [
        ["1", "[kegiatan]", "[hasil]", "[selesai / berjalan]"],
        ["2", "[kegiatan]", "[hasil]", "[selesai / berjalan]"],
        ["3", "[kegiatan]", "[hasil]", "[selesai / berjalan]"],
    ],
    (1.2, 6.0, 4.8, 3.0),
    caption="Tabel 6. Kegiatan bulan pertama",
)
h2("4.2 Kendala")
petunjuk(["Tulis kendala nyata dan cara menyikapinya. Contoh: izin akses WebAPI BPS dari BPS pusat belum keluar sehingga data sementara memakai contoh."])
isi("[Tulis kendala di sini.]")
h2("4.3 Rencana Bulan Kedua")
petunjuk(["Tuliskan rencana bulan kedua. Salah satunya: perancangan dan implementasi tampilan antarmuka serta integrasi WebAPI, yang hasilnya dilaporkan pada laporan bulan kedua."])
table(
    ["No", "Rencana kegiatan", "Keterangan"],
    [
        ["1", "[rencana]", "[keterangan]"],
        ["2", "[rencana]", "[keterangan]"],
        ["3", "[rencana]", "[keterangan]"],
    ],
    (1.2, 8.0, 5.8),
    caption="Tabel 7. Rencana bulan kedua",
)

# ---- 5. Penutup
h1("5. PENUTUP")
petunjuk(["Cukup 2-3 kalimat: ringkas apa yang sudah dihasilkan bulan ini (gambaran aplikasi, flowchart, use case, ERD) dan apa yang akan dikerjakan berikutnya."])
isi("[Tulis penutup di sini.]")
para("")
para("[Kota], [tanggal] [bulan] 2026", align=WD_ALIGN_PARAGRAPH.RIGHT, space_after=0)
para("Disusun oleh,", align=WD_ALIGN_PARAGRAPH.RIGHT, space_after=40)
para("[Nama]", align=WD_ALIGN_PARAGRAPH.RIGHT, bold=True)

doc.core_properties.title = "Laporan Progres Bulan Pertama - SI LAIKA"
doc.core_properties.author = ""
doc.save(OUT)
print("tersimpan:", OUT)
