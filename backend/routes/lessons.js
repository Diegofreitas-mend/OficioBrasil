import { Router } from 'express';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const router = Router({ mergeParams: true });

function loadLessons() {
  return JSON.parse(readFileSync(join(__dirname, '../data/lessons.json'), 'utf-8'));
}

router.get('/:lessonId', (req, res) => {
  const lesson = loadLessons().find(
    l => l.courseId === req.params.courseId && l.id === req.params.lessonId
  );
  if (!lesson) return res.status(404).json({ error: 'Aula não encontrada' });
  res.json(lesson);
});

export { router };
