import { Router } from 'express';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const router = Router();

function loadCourses() {
  return JSON.parse(readFileSync(join(__dirname, '../data/courses.json'), 'utf-8'));
}

function loadLessons() {
  return JSON.parse(readFileSync(join(__dirname, '../data/lessons.json'), 'utf-8'));
}

router.get('/', (_req, res) => {
  res.json(loadCourses());
});

router.get('/my', (_req, res) => {
  res.json(loadCourses().filter(c => c.comprado));
});

router.get('/:id', (req, res) => {
  const course = loadCourses().find(c => c.id === req.params.id);
  if (!course) return res.status(404).json({ error: 'Curso não encontrado' });
  const lessons = loadLessons().filter(l => l.courseId === req.params.id);
  res.json({ ...course, lessons });
});

export { router };
