import { Router } from 'express';
import { supabase } from '../lib/supabase.js';
import { mapLesson } from '../lib/mappers.js';
import { requireStudent } from '../middleware/auth.js';

const router = Router({ mergeParams: true });

async function isEnrolled(studentId, courseId) {
  const { data } = await supabase
    .from('enrollments')
    .select('id')
    .eq('student_id', studentId)
    .eq('course_id', courseId)
    .maybeSingle();
  return !!data;
}

router.get('/:lessonId', requireStudent, async (req, res) => {
  const { courseId, lessonId } = req.params;
  const enrolled = await isEnrolled(req.user.id, courseId);
  if (!enrolled) {
    return res.status(403).json({ error: 'Você precisa adquirir o curso para acessar esta aula.' });
  }
  const { data: lesson, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('id', lessonId)
    .eq('course_id', courseId)
    .maybeSingle();
  if (error) return res.status(500).json({ error: error.message });
  if (!lesson) return res.status(404).json({ error: 'Aula não encontrada' });

  const { data: progress } = await supabase
    .from('lesson_progress')
    .select('id')
    .eq('student_id', req.user.id)
    .eq('lesson_id', lessonId)
    .maybeSingle();

  res.json(mapLesson(lesson, { concluida: !!progress }));
});

router.post('/:lessonId/complete', requireStudent, async (req, res) => {
  const { courseId, lessonId } = req.params;
  const enrolled = await isEnrolled(req.user.id, courseId);
  if (!enrolled) {
    return res.status(403).json({ error: 'Curso não adquirido.' });
  }
  const { error } = await supabase
    .from('lesson_progress')
    .insert({ student_id: req.user.id, lesson_id: lessonId });
  if (error && error.code !== '23505') {
    return res.status(500).json({ error: error.message });
  }
  res.status(201).json({ ok: true });
});

router.delete('/:lessonId/complete', requireStudent, async (req, res) => {
  const { error } = await supabase
    .from('lesson_progress')
    .delete()
    .eq('student_id', req.user.id)
    .eq('lesson_id', req.params.lessonId);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

export { router };
