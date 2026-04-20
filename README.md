# Quiz System — Hệ thống Trắc nghiệm

> **Đồ án DevOps** — Đề tài 6: Quiz System  
> Stack: React + Express + Supabase PostgreSQL · Deploy: Vercel · CI/CD: GitHub Actions

---

## 📐 Kiến trúc hệ thống

```
[Browser]
    │
    ▼ HTTPS
[Frontend — Vite + React — Vercel Static]
    │
    ▼ /api/* calls (VITE_API_BASE_URL)
[Backend — Node.js/Express — Vercel Serverless]
    │
    ▼ Supabase Client (SERVICE_ROLE_KEY)
[Supabase PostgreSQL — Database]
```

### 4 Layer debug:
| Layer | Thành phần | Vai trò |
|-------|-----------|---------|
| L1 Infra | Vercel | Deploy, routing, env vars |
| L2 External | Supabase | PostgreSQL database |
| L3 Backend | Express API | Business logic, chấm điểm |
| L4 Frontend | Vite/React | UI/UX, hiển thị quiz |

---

## 🗃️ Database Schema

```sql
-- Câu hỏi
CREATE TABLE questions (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content    TEXT NOT NULL,
  category   TEXT DEFAULT 'general',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Đáp án (4 đáp án/câu)
CREATE TABLE answers (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  content     TEXT NOT NULL,
  is_correct  BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Kết quả làm bài
CREATE TABLE results (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_name  TEXT NOT NULL,
  score        INTEGER NOT NULL,
  total        INTEGER NOT NULL,
  answers_log  JSONB,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

---

## 🔌 API Endpoints

| Method | Path | Mô tả |
|--------|------|-------|
| GET | `/api/health` | Health check → `{ "ok": true }` |
| GET | `/api/questions` | Lấy tất cả câu hỏi kèm đáp án |
| GET | `/api/questions/:id` | Lấy 1 câu hỏi |
| POST | `/api/questions` | Thêm câu hỏi mới |
| POST | `/api/quiz/submit` | Nộp bài, chấm điểm server-side |
| GET | `/api/results` | Xem lịch sử kết quả |
| GET | `/api/results/:id` | Xem chi tiết 1 kết quả |

---

## 🚀 Chạy local với Docker

### Yêu cầu
- Docker & Docker Compose v2
- File `.env` tại root (xem `.env.example`)

### Bước 1: Tạo file `.env`
```bash
cp .env.example .env
# Điền các giá trị từ Supabase vào .env
```

### Bước 2: Khởi động hệ thống
```bash
docker compose up -d
```

### Bước 3: Kiểm tra
```bash
# Xem container đang chạy
docker compose ps

# Xem log backend
docker compose logs backend

# Xem log frontend
docker compose logs frontend

# Health check
curl http://localhost:3001/api/health
# → {"ok":true}
```

### Dừng hệ thống
```bash
docker compose down
```

---

## 💻 Chạy local không dùng Docker

### Yêu cầu
- Node.js >= 20
- File `.env` tại root

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (terminal khác)
cd frontend
npm install
npm run dev
```

Frontend: http://localhost:5173  
Backend: http://localhost:3001

---

## 🧪 Kiểm tra lint và test

```bash
# Backend
cd backend
npm run lint
npm test

# Frontend
cd frontend
npm run lint
npm test
npm run build
```

---

## ⚙️ CI/CD Pipeline

Pipeline tự động chạy trên **GitHub Actions** khi:
- Push lên `main` hoặc `dev`
- Tạo Pull Request vào `main`

```
push / PR
    │
    ├── Job: backend
    │   ├── npm ci
    │   ├── npm run lint
    │   └── npm test
    │
    └── Job: frontend
        ├── npm ci
        ├── npm run lint
        ├── npm test
        └── npm run build
```

**GitHub Secrets cần cấu hình** (Settings → Secrets → Actions):
| Secret | Mô tả |
|--------|-------|
| `VITE_SUPABASE_URL` | URL Supabase project |
| `VITE_SUPABASE_ANON_KEY` | Anon key Supabase |
| `VITE_API_BASE_URL` | URL backend sau khi deploy |

---

## 🌐 Deploy lên Vercel

### Thứ tự deploy (BẮT BUỘC):

```
1. Cấu hình Supabase (tạo bảng + seed data)
        ↓
2. Deploy Backend → copy URL backend
        ↓
3. Deploy Frontend (VITE_API_BASE_URL = URL backend)
        ↓ copy URL frontend
4. Cập nhật CORS Backend (FRONTEND_URL = URL frontend) → Redeploy
        ↓
5. Kiểm tra: /api/health, /api/questions, UI
```

### Deploy Backend
- Vercel → Add New Project → Import repo
- **Root Directory**: `backend`
- **Framework**: Other
- Thêm ENV vars (xem `.env.example` phần backend)
- Deploy → copy URL

### Deploy Frontend
- Vercel → Add New Project → cùng repo
- **Root Directory**: `frontend`
- **Framework**: Vite
- Thêm ENV vars + `VITE_API_BASE_URL` = URL backend
- Deploy

### Cập nhật CORS
- Backend project → Settings → Environment Variables
- `FRONTEND_URL` = URL frontend
- Deployments → Redeploy

---

## 🔧 Environment Variables

Xem file `.env.example` để biết đầy đủ các biến cần thiết.

> ⚠️ **KHÔNG** commit file `.env` vào Git  
> ✅ **CHỈ** commit file `.env.example`

---

## 👥 Phân công vai trò

| Vai trò | Nhiệm vụ |
|---------|---------|
| Backend Engineer | Express API, Supabase, logic chấm điểm |
| Frontend Engineer | React/Vite UI, gọi API, routing |
| DevOps Engineer | GitHub Actions CI/CD pipeline |
| Infrastructure Engineer | Docker, deploy Vercel |
| QA/SRE Engineer | Tạo incidents, debug theo layer, báo cáo |

---

## 📁 Cấu trúc project

```
quiz-system/
├── .env.example
├── .gitignore
├── docker-compose.yml
├── README.md
├── .github/workflows/ci.yml
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── vercel.json
│   ├── server.js
│   └── src/
│       ├── lib/supabase.js
│       ├── controllers/
│       │   ├── questionController.js
│       │   ├── quizController.js
│       │   └── resultController.js
│       └── __tests__/health.test.js
└── frontend/
    ├── Dockerfile
    ├── nginx.conf
    ├── package.json
    ├── vercel.json
    ├── vite.config.js
    └── src/
        ├── lib/api.js
        ├── components/
        ├── pages/
        └── test/
```
