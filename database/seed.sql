-- =============================================================
-- Quiz System — Seed Data (10 cau hoi, 4 dap an moi cau)
-- Chay SAU khi da chay schema.sql
-- =============================================================

-- Xoa du lieu cu (neu can chay lai)
DELETE FROM results;
DELETE FROM answers;
DELETE FROM questions;

-- ===================== CAU HOI =====================
INSERT INTO questions (id, content, category) VALUES
  ('11111111-0001-0000-0000-000000000000', 'Thu do cua Viet Nam la gi?',              'geography'),
  ('11111111-0002-0000-0000-000000000000', '2 + 2 bang bao nhieu?',                   'math'),
  ('11111111-0003-0000-0000-000000000000', 'Nuoc nao co dien tich lon nhat the gioi?','geography'),
  ('11111111-0004-0000-0000-000000000000', 'Ngon ngu lap trinh nao pho bien nhat?',   'tech'),
  ('11111111-0005-0000-0000-000000000000', '1 nam co bao nhieu thang?',               'math'),
  ('11111111-0006-0000-0000-000000000000', 'HTML viet tat cua gi?',                   'tech'),
  ('11111111-0007-0000-0000-000000000000', 'Bien nao lon nhat tren Trai Dat?',        'geography'),
  ('11111111-0008-0000-0000-000000000000', 'CPU viet tat cua gi?',                    'tech'),
  ('11111111-0009-0000-0000-000000000000', '5 x 5 bang bao nhieu?',                   'math'),
  ('11111111-0010-0000-0000-000000000000', 'Git duoc tao ra boi ai?',                 'tech');

-- ===================== DAP AN =====================

-- Cau 1: Thu do Viet Nam
INSERT INTO answers (question_id, content, is_correct) VALUES
  ('11111111-0001-0000-0000-000000000000', 'Ha Noi',       true),
  ('11111111-0001-0000-0000-000000000000', 'Ho Chi Minh',  false),
  ('11111111-0001-0000-0000-000000000000', 'Da Nang',      false),
  ('11111111-0001-0000-0000-000000000000', 'Hue',          false);

-- Cau 2: 2 + 2
INSERT INTO answers (question_id, content, is_correct) VALUES
  ('11111111-0002-0000-0000-000000000000', '3',  false),
  ('11111111-0002-0000-0000-000000000000', '4',  true),
  ('11111111-0002-0000-0000-000000000000', '5',  false),
  ('11111111-0002-0000-0000-000000000000', '22', false);

-- Cau 3: Nuoc lon nhat
INSERT INTO answers (question_id, content, is_correct) VALUES
  ('11111111-0003-0000-0000-000000000000', 'Canada',       false),
  ('11111111-0003-0000-0000-000000000000', 'Nga (Russia)', true),
  ('11111111-0003-0000-0000-000000000000', 'Trung Quoc',   false),
  ('11111111-0003-0000-0000-000000000000', 'My (USA)',      false);

-- Cau 4: Ngon ngu pho bien nhat
INSERT INTO answers (question_id, content, is_correct) VALUES
  ('11111111-0004-0000-0000-000000000000', 'Python',     true),
  ('11111111-0004-0000-0000-000000000000', 'Rust',       false),
  ('11111111-0004-0000-0000-000000000000', 'COBOL',      false),
  ('11111111-0004-0000-0000-000000000000', 'Assembly',   false);

-- Cau 5: 1 nam bao nhieu thang
INSERT INTO answers (question_id, content, is_correct) VALUES
  ('11111111-0005-0000-0000-000000000000', '10',  false),
  ('11111111-0005-0000-0000-000000000000', '11',  false),
  ('11111111-0005-0000-0000-000000000000', '12',  true),
  ('11111111-0005-0000-0000-000000000000', '13',  false);

-- Cau 6: HTML viet tat
INSERT INTO answers (question_id, content, is_correct) VALUES
  ('11111111-0006-0000-0000-000000000000', 'HyperText Markup Language', true),
  ('11111111-0006-0000-0000-000000000000', 'High-Tech Modern Language', false),
  ('11111111-0006-0000-0000-000000000000', 'Home Tool Markup Language', false),
  ('11111111-0006-0000-0000-000000000000', 'Hyperlink Text Mode Logic', false);

-- Cau 7: Bien lon nhat
INSERT INTO answers (question_id, content, is_correct) VALUES
  ('11111111-0007-0000-0000-000000000000', 'Bien Dai Tay Duong',    false),
  ('11111111-0007-0000-0000-000000000000', 'Bien Thai Binh Duong',  true),
  ('11111111-0007-0000-0000-000000000000', 'Bien An Do Duong',      false),
  ('11111111-0007-0000-0000-000000000000', 'Bien Bac Bang Duong',   false);

-- Cau 8: CPU viet tat
INSERT INTO answers (question_id, content, is_correct) VALUES
  ('11111111-0008-0000-0000-000000000000', 'Central Processing Unit',    true),
  ('11111111-0008-0000-0000-000000000000', 'Core Power Unit',            false),
  ('11111111-0008-0000-0000-000000000000', 'Computer Processing Unit',   false),
  ('11111111-0008-0000-0000-000000000000', 'Central Program Utility',    false);

-- Cau 9: 5 x 5
INSERT INTO answers (question_id, content, is_correct) VALUES
  ('11111111-0009-0000-0000-000000000000', '20', false),
  ('11111111-0009-0000-0000-000000000000', '25', true),
  ('11111111-0009-0000-0000-000000000000', '30', false),
  ('11111111-0009-0000-0000-000000000000', '55', false);

-- Cau 10: Git tao ra boi ai
INSERT INTO answers (question_id, content, is_correct) VALUES
  ('11111111-0010-0000-0000-000000000000', 'Bill Gates',      false),
  ('11111111-0010-0000-0000-000000000000', 'Linus Torvalds',  true),
  ('11111111-0010-0000-0000-000000000000', 'Mark Zuckerberg', false),
  ('11111111-0010-0000-0000-000000000000', 'Guido van Rossum',false);
