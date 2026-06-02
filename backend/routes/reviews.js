import { Router } from 'express';
import { supabase } from '../lib/supabase.js';
import { mapReview } from '../lib/mappers.js';
import { requireStudent } from '../middleware/auth.js';

const router = Router();

const parsePage = (req) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
  return { page, limit, from: (page - 1) * limit, to: page * limit - 1 };
};

// GET /api/reviews?mine=1&page=&limit=
router.get('/', requireStudent, async (req, res) => {
  const { page, limit, from, to } = parsePage(req);
  let q = supabase
    .from('reviews')
    .select('*, courses(titulo, professor)', { count: 'exact' })
    .order('criado_em', { ascending: false });

  if (req.query.mine === '1') {
    q = q.eq('student_id', req.user.id);
  }
  q = q.range(from, to);

  const { data, count, error } = await q;
  if (error) return res.status(500).json({ error: error.message });
  res.json({
    data: (data ?? []).map(mapReview),
    page,
    totalPages: Math.max(1, Math.ceil((count ?? 0) / limit)),
    totalItems: count ?? 0,
  });
});

// POST /api/reviews { courseId, nota, comentario }
router.post('/', requireStudent, async (req, res) => {
  const { courseId, nota, comentario } = req.body || {};
  const notaInt = Number(nota);
  if (!courseId) return res.status(400).json({ error: 'courseId é obrigatório.' });
  if (!Number.isInteger(notaInt) || notaInt < 1 || notaInt > 5) {
    return res.status(400).json({ error: 'Nota deve ser entre 1 e 5.' });
  }

  const { data: enroll } = await supabase
    .from('enrollments')
    .select('id')
    .eq('student_id', req.user.id)
    .eq('course_id', courseId)
    .maybeSingle();
  if (!enroll) {
    return res.status(403).json({ error: 'Você só pode avaliar cursos que adquiriu.' });
  }

  const { data, error } = await supabase
    .from('reviews')
    .upsert(
      {
        student_id: req.user.id,
        course_id: courseId,
        nota: notaInt,
        comentario: String(comentario || ''),
      },
      { onConflict: 'student_id,course_id' }
    )
    .select('*, courses(titulo, professor)')
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(mapReview(data));
});

export { router };
