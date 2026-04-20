-- =============================================================
-- Quiz System — Database Schema
-- Chay file nay tren Supabase SQL Editor (mot lan duy nhat)
-- =============================================================

-- Bang cau hoi
CREATE TABLE IF NOT EXISTS questions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content     TEXT NOT NULL,
  category    TEXT NOT NULL DEFAULT 'general',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Bang dap an (4 dap an / cau, chi 1 cai is_correct = true)
CREATE TABLE IF NOT EXISTS answers (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  content     TEXT NOT NULL,
  is_correct  BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Bang ket qua lam bai
CREATE TABLE IF NOT EXISTS results (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_name  TEXT NOT NULL,
  score        INTEGER NOT NULL CHECK (score >= 0),
  total        INTEGER NOT NULL CHECK (total > 0),
  answers_log  JSONB,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
