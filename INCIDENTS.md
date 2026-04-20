# Bao cao Incidents — Quiz System
> Role: QA / SRE Engineer
> Tong so incidents: 5 (yeu cau toi thieu: 3)

---

## Incident 1: `/api/questions` tra HTTP 500 sau khi cap nhat config

| Truong       | Noi dung |
|-------------|----------|
| **Hien tuong** | Goi `GET /api/questions` tra HTTP 500. `GET /api/health` van tra `{"ok":true}`. |
| **Layer loi**  | **L2 External** (Supabase) |
| **Nguyen nhan**| `SUPABASE_URL` bi sua sai tren Vercel backend ENV vars. Supabase client khoi tao voi URL sai, moi query deu nem exception. `/api/health` khong goi DB nen van OK — day la dau hieu xac dinh layer L2. |
| **Cach fix**   | Vercel backend > Settings > Environment Variables > sua `SUPABASE_URL` ve gia tri dung > Deployments > Redeploy. Xac nhan: `curl https://[backend]/api/questions` phai tra JSON array. |
| **Cach phong tranh** | Sau moi lan thay doi ENV vars tren Vercel, kiem tra ngay `/api/health` va `/api/questions`. Dung `.env.example` lam checklist kiem tra chinh ta URL. |

---

## Incident 2: Frontend trang trang sau khi deploy Vercel

| Truong       | Noi dung |
|-------------|----------|
| **Hien tuong** | Mo URL frontend thi trang trang hoan toan. F12 > Console thay loi do: `supabaseKey is required` hoac bien `undefined`. |
| **Layer loi**  | **L4 Frontend** |
| **Nguyen nhan**| Bien `VITE_SUPABASE_ANON_KEY` bi xoa hoac thieu tren Vercel frontend Environment Variables. Vite chi embed bien co tien to `VITE_` vao bundle luc build — neu thieu, gia tri la `undefined` trong browser. |
| **Cach fix**   | Vercel frontend > Settings > Environment Variables > them lai `VITE_SUPABASE_URL` va `VITE_SUPABASE_ANON_KEY` voi gia tri truc tiep > Redeploy. |
| **Cach phong tranh** | Truoc moi Redeploy, doi chieu ENV vars voi `.env.example`. Khong dung cu phap `${SUPABASE_URL}` vi Vercel khong ho tro interpolation — phai dien gia tri truc tiep. |

---

## Incident 3: CORS error khi submit quiz

| Truong       | Noi dung |
|-------------|----------|
| **Hien tuong** | F12 > Console: `Access to fetch at 'https://[backend].vercel.app/api/quiz/submit' from origin 'https://[frontend].vercel.app' has been blocked by CORS policy`. Backend Vercel Logs cho thay request DA den — nhung browser block response. |
| **Layer loi**  | **L3 Backend** |
| **Nguyen nhan**| `FRONTEND_URL` tren Vercel backend chua duoc cap nhat sau khi deploy frontend. CORS middleware chay nhung `allowedOrigins` khong chua URL frontend production, nen tra loi `CORS blocked`. |
| **Cach fix**   | Vercel backend > Settings > Environment Variables > `FRONTEND_URL` = URL frontend chinh xac (khong co slash cuoi, vi du: `https://quiz-frontend.vercel.app`) > Deployments > Redeploy backend. |
| **Cach phong tranh** | Thu tu deploy bat buoc: Backend truoc, Frontend sau, cap nhat CORS cuoi. Neu dao thu tu se gap dung loi nay. |

---

## Incident 4: Diem cham sai — nop bai sai van duoc 100%

| Truong       | Noi dung |
|-------------|----------|
| **Hien tuong** | Nop bai voi tat ca dap an sai nhung `POST /api/quiz/submit` van tra `{ "score": 10, "total": 10 }`. |
| **Layer loi**  | **L3 Backend** |
| **Nguyen nhan**| Bug logic trong `quizController.js`: truoc khi fix, dieu kien cham diem la `answer.isCorrect` (camelCase) thay vi `answer.is_correct` (snake_case — ten cot Supabase). Tat ca so sanh deu tra `undefined`, nen `score` luon = `total`. |
| **Cach fix**   | Sua dieu kien: `const isCorrect = chosen?.is_correct === true`. Them unit test: nop sai het phai tra `score: 0`, nop dung het phai tra `score: total`. |
| **Cach phong tranh** | Viet unit test cho ham cham diem truoc khi deploy. Map ten truong DB sang JS phai nhat quan — dung `is_correct` nhu trong Supabase. |

---

## Incident 5: CI xanh nhung Vercel frontend loi Supabase

| Truong       | Noi dung |
|-------------|----------|
| **Hien tuong** | GitHub Actions CI chay xanh (tat ca jobs pass). Deploy Vercel thanh cong. Nhung mo URL frontend thi trang trang, console do loi Supabase. |
| **Layer loi**  | **L1 Infra** |
| **Nguyen nhan**| GitHub Secrets va Vercel Environment Variables la 2 he thong doc lap. CI build dung GitHub Secrets (da khai bao day du). Vercel build lai tu dau bang Vercel ENV vars (chua khai bao). CI pass KHONG co nghia Vercel se chay dung. |
| **Cach fix**   | Vercel frontend > Settings > Environment Variables > them du `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_API_BASE_URL` > Redeploy. |
| **Cach phong tranh** | Moi khi khai bao bien moi o GitHub Secrets, kiem tra ngay Vercel ENV vars cung co bien do chua. Dung `.env.example` lam checklist duy nhat cho ca 2 noi. |

---

## Tom tat Layer loi

| # | Incident | Layer |
|---|---|---|
| 1 | `/api/questions` 500 do sai SUPABASE_URL | L2 External |
| 2 | Frontend trang trang do thieu VITE_SUPABASE_ANON_KEY | L4 Frontend |
| 3 | CORS error do FRONTEND_URL sai | L3 Backend |
| 4 | Cham diem sai do bug `is_correct` vs `isCorrect` | L3 Backend |
| 5 | CI xanh nhung Vercel loi do thieu ENV vars Vercel | L1 Infra |
