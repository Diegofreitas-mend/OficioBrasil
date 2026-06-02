import { Router } from 'express';
import { supabase } from '../lib/supabase.js';
import { mapCourse, mapLesson } from '../lib/mappers.js';
import { requireStudent } from '../middleware/auth.js';

const router = Router();

const parsePage = (req) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 12));
  return { page, limit, from: (page - 1) * limit, to: page * limit - 1 };
};

async function getEnrolledIds(studentId) {
  const { data } = await supabase
    .from('enrollments')
    .select('course_id')
    .eq('student_id', studentId);
  return new Set((data ?? []).map((e) => e.course_id));
}

async function getCompletedLessonIds(studentId) {
  const { data } = await supabase
    .from('lesson_progress')
    .select('lesson_id')
    .eq('student_id', studentId);
  return new Set((data ?? []).map((e) => e.lesson_id));
}

async function decorateCourse(course, opts) {
  const { studentId, enrolledIds, completedIds, withLessons } = opts;
  const { data: lessons } = await supabase
    .from('lessons')
    .select('*')
    .eq('course_id', course.id)
    .order('ordem');

  const totalAulas = lessons?.length ?? 0;
  const comprado = enrolledIds?.has(course.id) ?? false;

  let concluidas = 0;
  const lessonsDecorated = (lessons ?? []).map((l) => {
    const isDone = completedIds?.has(l.id) ?? false;
    if (isDone) concluidas++;
    return mapLesson(l, { concluida: isDone });
  });

  const progresso = totalAulas > 0 ? Math.round((concluidas / totalAulas) * 100) : 0;

  return mapCourse(course, {
    totalAulas,
    comprado,
    progresso: comprado ? progresso : 0,
    ...(withLessons ? { lessons: lessonsDecorated } : {}),
  });
}

// GET /api/courses?page=1&limit=12&search=&categoria=
router.get('/', requireStudent, async (req, res) => {
  const { page, limit, from, to } = parsePage(req);
  const { search, categoria } = req.query;

  let q = supabase.from('courses').select('*', { count: 'exact' }).order('criado_em', { ascending: false });
  if (search) q = q.ilike('titulo', `%${search}%`);
  if (categoria) q = q.eq('categoria', categoria);
  q = q.range(from, to);

  const { data, count, error } = await q;
  if (error) return res.status(500).json({ error: error.message });

  const enrolledIds = await getEnrolledIds(req.user.id);
  const completedIds = await getCompletedLessonIds(req.user.id);

  const courses = await Promise.all(
    (data ?? []).map((c) =>
      decorateCourse(c, { studentId: req.user.id, enrolledIds, completedIds })
    )
  );

  res.json({
    data: courses,
    page,
    totalPages: Math.max(1, Math.ceil((count ?? 0) / limit)),
    totalItems: count ?? 0,
  });
});

// GET /api/courses/my  → cursos comprados pelo aluno logado
router.get('/my', requireStudent, async (req, res) => {
  const { data: enrolls, error: e1 } = await supabase
    .from('enrollments')
    .select('course_id, courses(*)')
    .eq('student_id', req.user.id);
  if (e1) return res.status(500).json({ error: e1.message });

  const enrolledIds = new Set((enrolls ?? []).map((e) => e.course_id));
  const completedIds = await getCompletedLessonIds(req.user.id);

  const courses = await Promise.all(
    (enrolls ?? []).map((e) =>
      decorateCourse(e.courses, { studentId: req.user.id, enrolledIds, completedIds })
    )
  );
  res.json(courses);
});

// GET /api/courses/history  → enrollments do aluno com data de aquisição
router.get('/history', requireStudent, async (req, res) => {
  const { data, error } = await supabase
    .from('enrollments')
    .select('id, comprado_em, courses(*)')
    .eq('student_id', req.user.id)
    .order('comprado_em', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  const completedIds = await getCompletedLessonIds(req.user.id);
  const items = [];
  for (const e of data ?? []) {
    if (!e.courses) continue;
    const { data: lessons } = await supabase
      .from('lessons')
      .select('id')
      .eq('course_id', e.courses.id);
    const total = lessons?.length ?? 0;
    const feitas = (lessons ?? []).filter((l) => completedIds.has(l.id)).length;
    const progresso = total > 0 ? Math.round((feitas / total) * 100) : 0;
    items.push({
      id: e.id,
      cursoId: e.courses.id,
      tituloCurso: e.courses.titulo,
      professor: e.courses.professor,
      categoria: e.courses.categoria,
      compradoEm: e.comprado_em,
      progresso,
      concluido: progresso === 100,
    });
  }
  res.json(items);
});

// GET /api/courses/categories  → lista distinta de categorias
router.get('/categories', requireStudent, async (_req, res) => {
  const { data, error } = await supabase.from('courses').select('categoria');
  if (error) return res.status(500).json({ error: error.message });
  const set = new Set((data ?? []).map((c) => c.categoria).filter(Boolean));
  res.json([...set].sort());
});

// GET /api/courses/:id  → detalhes + aulas
router.get('/:id', requireStudent, async (req, res) => {
  const { data: course, error } = await supabase
    .from('courses')
    .select('*')
    .eq('id', req.params.id)
    .maybeSingle();
  if (error) return res.status(500).json({ error: error.message });
  if (!course) return res.status(404).json({ error: 'Curso não encontrado' });

  const enrolledIds = await getEnrolledIds(req.user.id);
  const completedIds = await getCompletedLessonIds(req.user.id);
  const decorated = await decorateCourse(course, {
    studentId: req.user.id,
    enrolledIds,
    completedIds,
    withLessons: true,
  });
  res.json(decorated);
});

// POST /api/courses/:id/enroll  → compra simulada
router.post('/:id/enroll', requireStudent, async (req, res) => {
  const { error } = await supabase
    .from('enrollments')
    .insert({ student_id: req.user.id, course_id: req.params.id });
  // 23505 = unique violation (já comprado): idempotente, ok
  if (error && error.code !== '23505') {
    return res.status(500).json({ error: error.message });
  }
  res.status(201).json({ ok: true });
});

export { router };
