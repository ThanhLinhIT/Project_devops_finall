/**
 * setup-db.js
 * Tu dong tao bang (schema) va seed du lieu len Supabase
 * Chay: node scripts/setup-db.js
 * Yeu cau: .env da dien day du SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

// Load .env thu cong (khong dung dotenv vi la script root, khong phai backend)
const loadEnv = () => {
  const envPath = resolve(ROOT, '.env');
  if (!existsSync(envPath)) throw new Error('.env not found. Chay check-env.js truoc.');
  const lines = readFileSync(envPath, 'utf8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx === -1) continue;
    process.env[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim();
  }
};

loadEnv();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('[FAIL] SUPABASE_URL hoac SUPABASE_SERVICE_ROLE_KEY chua duoc dien trong .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const GREEN  = '\x1b[32m';
const RED    = '\x1b[31m';
const YELLOW = '\x1b[33m';
const CYAN   = '\x1b[36m';
const RESET  = '\x1b[0m';

// =====================================================================
// Seed data — 10 cau hoi, 4 dap an moi cau
// =====================================================================
const QUESTIONS = [
  { content: 'Thu do cua Viet Nam la gi?',               category: 'geography' },
  { content: '2 + 2 bang bao nhieu?',                    category: 'math'      },
  { content: 'Nuoc nao co dien tich lon nhat the gioi?', category: 'geography' },
  { content: 'Ngon ngu lap trinh nao pho bien nhat?',    category: 'tech'      },
  { content: '1 nam co bao nhieu thang?',                category: 'math'      },
  { content: 'HTML viet tat cua gi?',                    category: 'tech'      },
  { content: 'Bien nao lon nhat tren Trai Dat?',         category: 'geography' },
  { content: 'CPU viet tat cua gi?',                     category: 'tech'      },
  { content: '5 x 5 bang bao nhieu?',                    category: 'math'      },
  { content: 'Git duoc tao ra boi ai?',                  category: 'tech'      },
];

const ANSWERS_MAP = {
  'Thu do cua Viet Nam la gi?': [
    { content: 'Ha Noi',       is_correct: true  },
    { content: 'Ho Chi Minh',  is_correct: false },
    { content: 'Da Nang',      is_correct: false },
    { content: 'Hue',          is_correct: false },
  ],
  '2 + 2 bang bao nhieu?': [
    { content: '3',   is_correct: false },
    { content: '4',   is_correct: true  },
    { content: '5',   is_correct: false },
    { content: '22',  is_correct: false },
  ],
  'Nuoc nao co dien tich lon nhat the gioi?': [
    { content: 'Canada',        is_correct: false },
    { content: 'Nga (Russia)',  is_correct: true  },
    { content: 'Trung Quoc',    is_correct: false },
    { content: 'My (USA)',      is_correct: false },
  ],
  'Ngon ngu lap trinh nao pho bien nhat?': [
    { content: 'Python',   is_correct: true  },
    { content: 'Rust',     is_correct: false },
    { content: 'COBOL',    is_correct: false },
    { content: 'Assembly', is_correct: false },
  ],
  '1 nam co bao nhieu thang?': [
    { content: '10', is_correct: false },
    { content: '11', is_correct: false },
    { content: '12', is_correct: true  },
    { content: '13', is_correct: false },
  ],
  'HTML viet tat cua gi?': [
    { content: 'HyperText Markup Language', is_correct: true  },
    { content: 'High-Tech Modern Language', is_correct: false },
    { content: 'Home Tool Markup Language', is_correct: false },
    { content: 'Hyperlink Text Mode Logic', is_correct: false },
  ],
  'Bien nao lon nhat tren Trai Dat?': [
    { content: 'Bien Dai Tay Duong',   is_correct: false },
    { content: 'Bien Thai Binh Duong', is_correct: true  },
    { content: 'Bien An Do Duong',     is_correct: false },
    { content: 'Bien Bac Bang Duong',  is_correct: false },
  ],
  'CPU viet tat cua gi?': [
    { content: 'Central Processing Unit',  is_correct: true  },
    { content: 'Core Power Unit',          is_correct: false },
    { content: 'Computer Processing Unit', is_correct: false },
    { content: 'Central Program Utility',  is_correct: false },
  ],
  '5 x 5 bang bao nhieu?': [
    { content: '20', is_correct: false },
    { content: '25', is_correct: true  },
    { content: '30', is_correct: false },
    { content: '55', is_correct: false },
  ],
  'Git duoc tao ra boi ai?': [
    { content: 'Bill Gates',       is_correct: false },
    { content: 'Linus Torvalds',   is_correct: true  },
    { content: 'Mark Zuckerberg',  is_correct: false },
    { content: 'Guido van Rossum', is_correct: false },
  ],
};

// =====================================================================
async function step(label, fn) {
  process.stdout.write(`  ${label}... `);
  try {
    const result = await fn();
    console.log(`${GREEN}OK${RESET}`);
    return result;
  } catch (err) {
    console.log(`${RED}FAIL${RESET}`);
    throw err;
  }
}

async function checkTablesExist() {
  const tables = ['questions', 'answers', 'results'];
  const missing = [];
  for (const t of tables) {
    const { error } = await supabase.from(t).select('id').limit(1);
    // PostgREST tra ve loi nay khi bang khong ton tai
    if (error && (
      error.code === '42P01' ||
      error.message?.includes('Could not find the table') ||
      error.message?.includes('relation') ||
      error.code === 'PGRST116'
    )) {
      missing.push(t);
    }
  }
  return missing;
}

async function clearTables() {
  await supabase.from('results').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('answers').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('questions').delete().neq('id', '00000000-0000-0000-0000-000000000000');
}

async function seedQuestions() {
  const { data, error } = await supabase
    .from('questions')
    .insert(QUESTIONS)
    .select();
  if (error) throw error;
  return data;
}

async function seedAnswers(questions) {
  const answerRows = [];
  for (const q of questions) {
    const answers = ANSWERS_MAP[q.content];
    if (!answers) continue;
    for (const a of answers) {
      answerRows.push({ question_id: q.id, ...a });
    }
  }
  const { error } = await supabase.from('answers').insert(answerRows);
  if (error) throw error;
  return answerRows.length;
}

async function verifyData() {
  const { data: qs } = await supabase.from('questions').select('id');
  const { data: as } = await supabase.from('answers').select('id');
  return { questions: qs?.length ?? 0, answers: as?.length ?? 0 };
}

// =====================================================================
async function main() {
  console.log(`\n${CYAN}=== SETUP DATABASE ===\n${RESET}`);
  console.log(`  Supabase: ${SUPABASE_URL}\n`);

  // 1. Kiem tra bang ton tai
  let missing;
  try {
    missing = await checkTablesExist();
  } catch {
    console.log(`${RED}[FAIL] Khong the ket noi Supabase. Kiem tra SUPABASE_URL va KEY.${RESET}\n`);
    process.exit(1);
  }

  if (missing.length > 0) {
    console.log(`${RED}[FAIL] Cac bang sau CHUA TON TAI: ${missing.join(', ')}${RESET}`);
    console.log(`\n  -> Vao Supabase Dashboard > SQL Editor > chay file:`);
    console.log(`     database/schema.sql\n`);
    console.log(`  -> Sau do chay lai: npm run setup:db\n`);
    process.exit(1);
  }

  console.log(`${GREEN}[OK]${RESET} Tat ca bang da ton tai (questions, answers, results)\n`);

  // 2. Kiem tra du lieu hien co
  const existing = await verifyData();
  if (existing.questions > 0) {
    console.log(`${YELLOW}[SKIP]${RESET} Da co ${existing.questions} cau hoi va ${existing.answers} dap an.`);
    const args = process.argv.slice(2);
    if (!args.includes('--force')) {
      console.log(`  -> De seed lai, chay: npm run setup:db -- --force\n`);
      process.exit(0);
    }
    console.log(`  -> --force: Xoa du lieu cu va seed lai...\n`);
    await step('Xoa du lieu cu', clearTables);
  }

  // 3. Seed questions
  let insertedQuestions;
  await step(`Insert ${QUESTIONS.length} cau hoi`, async () => {
    insertedQuestions = await seedQuestions();
  });

  // 4. Seed answers
  let answerCount = 0;
  await step(`Insert dap an`, async () => {
    answerCount = await seedAnswers(insertedQuestions);
  });

  // 5. Verify
  const final = await verifyData();
  console.log('');
  console.log(`${GREEN}=== DONE ===\n${RESET}`);
  console.log(`  questions : ${final.questions}`);
  console.log(`  answers   : ${final.answers}`);
  console.log(`  results   : 0 (trong, se co sau khi nguoi dung lam bai)\n`);
}

main().catch((err) => {
  console.error(`\n${RED}[ERROR]${RESET}`, err.message);
  process.exit(1);
});
