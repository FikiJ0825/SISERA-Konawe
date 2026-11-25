// Eksplorasi WebAPI BPS untuk Kab. Konawe. Jalankan: node scripts/bps-explore.mjs [folder-keluaran]
// Key dibaca dari .env (BPS_API_KEY), tidak pernah dicetak. Sampel respons disimpan ke folder keluaran
// (default: ./.bps-samples, sudah masuk .gitignore lewat .env.* tidak; lihat catatan di bawah).
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

function loadEnv(file) {
  const out = {};
  try {
    for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m) out[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
    }
  } catch {}
  return out;
}

const env = { ...loadEnv('.env'), ...process.env };
const KEY = env.BPS_API_KEY;
const DOMAIN = env.EXPO_PUBLIC_BPS_DOMAIN_CODE || '7403';
if (!KEY) {
  console.error('BPS_API_KEY belum diisi di .env');
  process.exit(1);
}

const outDir = resolve(process.argv[2] || '.bps-samples');
mkdirSync(outDir, { recursive: true });

const BASE = 'https://webapi.bps.go.id/v1/api';
const targets = {
  domain: `/domain/type/kabbyprov/key/${KEY}?prov=7400`,
  subcat: `/list/model/subcat/domain/${DOMAIN}/key/${KEY}`,
  subject: `/list/model/subject/domain/${DOMAIN}/key/${KEY}`,
  var: `/list/model/var/domain/${DOMAIN}/key/${KEY}`,
  statictable: `/list/model/statictable/domain/${DOMAIN}/key/${KEY}`,
  publication: `/list/model/publication/domain/${DOMAIN}/key/${KEY}`,
  pressrelease: `/list/model/pressrelease/domain/${DOMAIN}/key/${KEY}`,
  infographic: `/list/model/infographic/domain/${DOMAIN}/key/${KEY}`,
  news: `/list/model/news/domain/${DOMAIN}/key/${KEY}`,
  indicators: `/list/model/indicators/domain/${DOMAIN}/key/${KEY}`,
};

for (const [name, path] of Object.entries(targets)) {
  try {
    const res = await fetch(BASE + path);
    const text = await res.text();
    writeFileSync(resolve(outDir, `${name}.json`), text);
    let info = '';
    try {
      const j = JSON.parse(text);
      const meta = Array.isArray(j.data) ? j.data[0] : undefined;
      info = `status=${j.status} avail=${j['data-availability']} total=${meta?.total ?? '-'}`;
    } catch {
      info = 'bukan JSON';
    }
    console.log(`${name.padEnd(13)} HTTP ${res.status}  ${info}`);
  } catch (e) {
    console.log(`${name.padEnd(13)} GAGAL ${e.message}`);
  }
}
console.log(`Sampel tersimpan di ${outDir}`);
