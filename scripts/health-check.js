/**
 * health-check.js
 * Kiem tra he thong sau khi deploy
 * Chay: node scripts/health-check.js [backend_url] [frontend_url]
 * Vi du: node scripts/health-check.js https://quiz-be.vercel.app https://quiz-fe.vercel.app
 */

import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const GREEN  = '\x1b[32m';
const RED    = '\x1b[31m';
const YELLOW = '\x1b[33m';
const CYAN   = '\x1b[36m';
const RESET  = '\x1b[0m';

// Lay URLs tu args hoac .env
const loadEnv = () => {
  const envPath = resolve(ROOT, '.env');
  if (!existsSync(envPath)) return {};
  const lines = readFileSync(envPath, 'utf8').split('\n');
  const vars = {};
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx === -1) continue;
    vars[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim();
  }
  return vars;
};

const args = process.argv.slice(2);
const env = loadEnv();

const BACKEND_URL  = args[0] || env['VITE_API_BASE_URL'] || 'http://localhost:3001';
const FRONTEND_URL = args[1] || env['FRONTEND_URL']      || 'http://localhost:5173';

async function check(label, url, expectedFn) {
  process.stdout.write(`  ${label.padEnd(45)}`);
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    const body = res.headers.get('content-type')?.includes('json')
      ? await res.json()
      : await res.text();

    if (!res.ok) {
      console.log(`${RED}[FAIL] HTTP ${res.status}${RESET}`);
      return false;
    }

    if (expectedFn && !expectedFn(body)) {
      console.log(`${YELLOW}[WARN] Response khong dung dinh dang mong doi${RESET}`);
      console.log(`         Got: ${JSON.stringify(body).slice(0, 80)}`);
      return false;
    }

    console.log(`${GREEN}[OK]${RESET}`);
    return true;
  } catch (err) {
    if (err.name === 'TimeoutError') {
      console.log(`${RED}[FAIL] Timeout (8s)${RESET}`);
    } else {
      console.log(`${RED}[FAIL] ${err.message}${RESET}`);
    }
    return false;
  }
}

async function main() {
  console.log(`\n${CYAN}=== HEALTH CHECK ===\n${RESET}`);
  console.log(`  Backend  : ${BACKEND_URL}`);
  console.log(`  Frontend : ${FRONTEND_URL}\n`);

  const results = [];

  // Backend checks
  results.push(await check(
    'GET /api/health → {ok:true}',
    `${BACKEND_URL}/api/health`,
    (b) => b?.ok === true
  ));

  results.push(await check(
    'GET /api/questions → array',
    `${BACKEND_URL}/api/questions`,
    (b) => Array.isArray(b)
  ));

  results.push(await check(
    'GET /api/results → array',
    `${BACKEND_URL}/api/results`,
    (b) => Array.isArray(b)
  ));

  // Frontend check
  results.push(await check(
    'Frontend load → HTTP 200',
    FRONTEND_URL,
    null
  ));

  // Ket qua
  const passed = results.filter(Boolean).length;
  const total  = results.length;
  console.log('');

  if (passed === total) {
    console.log(`${GREEN}=== ALL PASS (${passed}/${total}) ===${RESET}\n`);
    process.exit(0);
  } else {
    console.log(`${RED}=== FAIL (${passed}/${total} pass) ===${RESET}`);
    console.log(`  -> Kiem tra ENV vars va logs tren Vercel/Docker\n`);
    process.exit(1);
  }
}

main();
