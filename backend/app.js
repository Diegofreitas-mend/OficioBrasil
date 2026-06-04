import express from 'express';
import cors from 'cors';
import { router as authRouter } from './routes/auth.js';
import { router as coursesRouter } from './routes/courses.js';
import { router as lessonsRouter } from './routes/lessons.js';
import { router as reviewsRouter } from './routes/reviews.js';
import { router as adminRouter } from './routes/admin.js';

const app = express();

// Same-origin em produção (front + API no mesmo domínio Vercel) → CORS nem dispara.
// CORS_ORIGIN permite sobrescrever; default cobre o dev local (Vite em :5173).
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';
app.use(cors({ origin: corsOrigin }));
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/courses', coursesRouter);
app.use('/api/courses/:courseId/lessons', lessonsRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/admin', adminRouter);

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

export default app;
