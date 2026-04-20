/**
 * check-env.js — Validate .env truoc khi chay bat ky script nao
 * Chay: node scripts/check-env.js
 */

import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const RED    = '\x1b[31m';
const GREEN  = '\x1b[32m';
const YELLOW = '\x1b[33m';
const CYAN   = '\x1b[36m';
const RESET  = '\x1b[0m';

console.log(`\n${CYAN}=== ENV CHECK ===${RESET}\n`);

const ENV_FILE = resolve(ROOT, '.env');
if (!existsSync(ENV_FILE)) {
  console.error(`${RED}[FAIL] File .env khong ton tai!${RESET}`);
  console.log('  -> Chay: cp .env.example .env  roi dien gia tri thuc\n');
  process.exit(1);
}

const parseEnv = (filePath) => {
  const vars = {};
  for (const line of readFileSync(filePath, 'utf8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const idx = t.indexOf('=');
    if (idx === -1) continue;
    vars[t.slice(0, idx).trim()] = t.slice(idx + 1).trim();
  }
  return vars;
};

const env = parseEnv(ENV_FILE);

const REQUIRED = {
  SUPABASE_URL:              { desc: 'URL Supabase project',      avoid: ['https://your-project.supabase.co', ''] },
  SUPABASE_ANON_KEY:         { desc: 'Anon/Publishable key',      avoid: ['sb_publishable_your_anon_key', ''] },
  SUPABASE_SERVICE_ROLE_KEY: { desc: 'Service role key (secret)', avoid: ['sb_secret_your_service_role_key', ''] },
  FRONTEND_URL:              { desc: 'URL frontend cho CORS',     avoid: [''] },
  PORT:                      { desc: 'Port backend',              avoid: [''] },
  VITE_SUPABASE_URL:         { desc: 'Supabase URL frontend',     avoid: ['https://your-project.supabase.co', ''] },
  VITE_SUPABASE_ANON_KEY:    { desc: 'Anon key frontend',         avoid: ['sb_publishable_your_anon_key', ''] },
};

let hasError = false;

for (const [key, { desc, avoid }] of Object.entries(REQUIRED)) {
  const val = env[key];
  if (!val || val === '') {
    console.log(`${RED}[MISSING]${RESET}     ${key.padEnd(30)} — ${desc}`);
    hasError = true;
  } else if (avoid.includes(val)) {
    console.log(`${YELLOW}[PLACEHOLDER]${RESET} ${key.padEnd(30)} — con gia tri mau`);
    hasError = true;
  } else {
    const preview = val.length > 44 ? val.slice(0, 16) + '...' + val.slice(-8) : val;
    console.log(`${GREEN}[OK]${RESET}          ${key.padEnd(30)} = ${preview}`);
  }
}

// Canh bao SERVICE_ROLE_KEY trong bien VITE_*
const srk = env['SUPABASE_SERVICE_ROLE_KEY'] || '';
if (srk) {
  for (const [k, v] of Object.entries(env)) {
    if (k.startsWith('VITE_') && v === srk) {
      console.log(`\n${RED}[SECURITY] ${k} = SERVICE_ROLE_KEY — NGUY HIEM, se lo ra browser!${RESET}`);
      hasError = true;
    }
  }
}

console.log('');
if (hasError) {
  console.log(`${RED}[FAIL] .env chua hop le. Xem chi tiet o tren.\n${RESET}`);
  process.exit(1);
}
console.log(`${GREEN}[PASS] Tat ca bien moi truong hop le.\n${RESET}`);
