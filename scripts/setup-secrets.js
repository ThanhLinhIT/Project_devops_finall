/**
 * setup-secrets.js
 * Tu dong set GitHub Actions Secrets tu .env
 * Yeu cau: gh CLI da dang nhap (gh auth login)
 * Chay: node scripts/setup-secrets.js
 */

import { execSync } from 'child_process';
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

// Load .env
const loadEnv = () => {
  const envPath = resolve(ROOT, '.env');
  if (!existsSync(envPath)) throw new Error('.env not found');
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

// Cac bien can set len GitHub Secrets (chi VITE_* va cac bien CI can)
const SECRETS_TO_SET = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
  'VITE_API_BASE_URL',
];

function checkGhCli() {
  try {
    execSync('gh auth status', { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

function getRepoName() {
  try {
    const url = execSync('git remote get-url origin', { encoding: 'utf8' }).trim();
    const match = url.match(/github\.com[:/](.+?)(?:\.git)?$/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

function setSecret(repo, name, value) {
  if (!value || value === '') {
    console.log(`${YELLOW}[SKIP]${RESET}  ${name.padEnd(30)} — gia tri trong, bo qua`);
    return false;
  }
  try {
    execSync(`gh secret set ${name} --body "${value}" --repo ${repo}`, { stdio: 'pipe' });
    const preview = value.length > 20 ? value.slice(0, 8) + '...' : value;
    console.log(`${GREEN}[SET]${RESET}   ${name.padEnd(30)} = ${preview}`);
    return true;
  } catch (err) {
    console.log(`${RED}[FAIL]${RESET}  ${name.padEnd(30)} — ${err.message.trim()}`);
    return false;
  }
}

async function main() {
  console.log(`\n${CYAN}=== SETUP GITHUB SECRETS ===\n${RESET}`);

  // 1. Kiem tra gh CLI
  if (!checkGhCli()) {
    console.log(`${RED}[FAIL] gh CLI chua dang nhap.${RESET}`);
    console.log(`  -> Chay: gh auth login\n`);
    process.exit(1);
  }

  // 2. Lay ten repo
  const repo = getRepoName();
  if (!repo) {
    console.log(`${RED}[FAIL] Khong xac dinh duoc GitHub repo.${RESET}`);
    console.log(`  -> Dam bao da chay: git remote add origin https://github.com/user/repo.git\n`);
    process.exit(1);
  }
  console.log(`  Repo: ${repo}\n`);

  // 3. Load env
  let env;
  try {
    env = loadEnv();
  } catch (err) {
    console.log(`${RED}[FAIL] ${err.message}${RESET}\n`);
    process.exit(1);
  }

  // 4. Set tung secret
  let ok = 0;
  let skip = 0;
  for (const key of SECRETS_TO_SET) {
    const set = setSecret(repo, key, env[key] ?? '');
    set ? ok++ : skip++;
  }

  // 5. Ket qua
  console.log('');
  console.log(`${GREEN}=== DONE ===${RESET}  Set: ${ok}  |  Skip: ${skip}\n`);

  if (env['VITE_API_BASE_URL'] === '' || !env['VITE_API_BASE_URL']) {
    console.log(`${YELLOW}[NOTE]${RESET} VITE_API_BASE_URL chua co gia tri.`);
    console.log(`  -> Sau khi deploy backend len Vercel, chay:`);
    console.log(`     gh secret set VITE_API_BASE_URL --body "https://[backend].vercel.app" --repo ${repo}\n`);
  }
}

main().catch((err) => {
  console.error(`${RED}[ERROR]${RESET}`, err.message);
  process.exit(1);
});
