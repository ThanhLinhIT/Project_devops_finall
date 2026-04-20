import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import questionRouter from './src/controllers/questionController.js';
import quizRouter from './src/controllers/quizController.js';
import resultRouter from './src/controllers/resultController.js';

const app = express();

const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
  })
);

app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/api', questionRouter);
app.use('/api', quizRouter);
app.use('/api', resultRouter);

app.use((err, _req, res, _next) => {
  console.error('[Server] Unhandled error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 3001;
  app.listen(port, () => {
    console.log(`Backend running at http://localhost:${port}`);
  });
}

export default app;
