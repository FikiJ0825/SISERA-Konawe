// Proxy tipis ke WebAPI BPS. API key BPS disimpan sebagai secret Supabase (BPS_API_KEY), tidak pernah ke app.
//
// Pemakaian dari app:  GET <FUNCTION_URL>?p=/list/model/publication/domain/7403&page=1
//   - `p`  : path WebAPI BPS TANPA "/v1/api" dan TANPA "/key/...". Proxy yang menambahkan key.
//   - query lain: hanya nama yang ada di daftar putih (QUERY_ALLOWED) yang diteruskan.
// Deploy:
//   supabase secrets set BPS_API_KEY=<key>
//   supabase functions deploy bps-proxy
// (verify_jwt default aktif: app mengirim kunci anon di header Authorization/apikey.)

const BPS_BASE = 'https://webapi.bps.go.id/v1/api';
const DOMAIN = Deno.env.get('BPS_DOMAIN_CODE') ?? '7403'; // Kab. Konawe
const WILAYAH = Deno.env.get('BPS_WILAYAH_CODE') ?? '7403000'; // kode wilayah 7 digit (SIMDASI)
const CACHE_SECONDS = 600;

// Hanya path yang dipakai SI LAIKA dan hanya untuk domain Konawe.
const PATH_ALLOWED = new RegExp(
  `^/(` +
    `list/model/(subcat|subject|var|publication|pressrelease|infographic|news|statictable)/domain/${DOMAIN}` +
    `|list/model/th/domain/${DOMAIN}/var/\\d+` +
    `|list/model/data/domain/${DOMAIN}/var/\\d+/th/\\d+(;\\d+){0,2}` +
    `|view/domain/${DOMAIN}/model/(publication|pressrelease|news|statictable)/lang/(ind|eng)/id/[\\w-]+` +
    // SIMDASI (Kabupaten dalam Angka): daftar tabel per subjek dan isi tabel, hanya wilayah Konawe.
    `|interoperabilitas/datasource/simdasi/id/24/wilayah/${WILAYAH}/id_subjek/\\d+` +
    `|interoperabilitas/datasource/simdasi/id/25/wilayah/${WILAYAH}/tahun/\\d{4}/id_tabel/[A-Za-z0-9+/=_-]+` +
    `)$`,
);
const QUERY_ALLOWED = new Set([
  'page', 'lang', 'keyword', 'year', 'month', 'subcat', 'subject', 'newscat', 'var', 'vervar', 'turvar', 'turth',
]);

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

const json = (body: unknown, status: number, extra: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json; charset=utf-8', ...extra },
  });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
  if (req.method !== 'GET') return json({ status: 'error', message: 'Method not allowed' }, 405);

  const key = Deno.env.get('BPS_API_KEY');
  if (!key) return json({ status: 'error', message: 'BPS_API_KEY belum diset di secret Supabase' }, 500);

  const url = new URL(req.url);
  const path = url.searchParams.get('p') ?? '';
  if (!PATH_ALLOWED.test(path)) return json({ status: 'error', message: 'Path tidak diizinkan' }, 400);

  // id_tabel SIMDASI berupa base64 (bisa memuat "/", "+", "="): encode agar tetap satu segmen path.
  const aman = path.replace(/(\/id_tabel\/)(.+)$/, (_m, a, id) => a + encodeURIComponent(id));
  const upstream = new URL(`${BPS_BASE}${aman}/key/${key}`);
  for (const [k, v] of url.searchParams) {
    if (k !== 'p' && QUERY_ALLOWED.has(k)) upstream.searchParams.set(k, v);
  }

  try {
    const res = await fetch(upstream, { headers: { Accept: 'application/json' } });
    const body = await res.text();
    return new Response(body, {
      status: res.status,
      headers: {
        ...CORS,
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': res.ok ? `public, max-age=${CACHE_SECONDS}` : 'no-store',
      },
    });
  } catch {
    return json({ status: 'error', message: 'Gagal menghubungi WebAPI BPS' }, 502);
  }
});
