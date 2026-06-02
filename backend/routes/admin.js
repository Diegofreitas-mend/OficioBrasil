import { Router } from 'express';
import { supabase } from '../lib/supabase.js';
import { hashPassword, verifyPassword, signToken } from '../lib/auth.js';
import { requireAdmin } from '../middleware/auth.js';
import {
  mapCourse, mapLesson, mapStudent, mapReview, mapAdmin,
} from '../lib/mappers.js';

const router = Router();

const parsePage = (req, defaultLimit = 10) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || defaultLimit));
  return { page, limit, from: (page - 1) * limit, to: page * limit - 1 };
};

const pagedResponse = (data, count, page, limit) => ({
  data,
  page,
  totalPages: Math.max(1, Math.ceil((count ?? 0) / limit)),
  totalItems: count ?? 0,
});

// ───────────── LOGIN ─────────────

router.post('/login', async (req, res) => {
  const { email, senha } = req.body || {};
  if (!email || !senha) return res.status(400).json({ error: 'Informe e-mail e senha.' });
  const { data: admin } = await supabase
    .from('admins')
    .select('*')
    .eq('email', String(email).toLowerCase().trim())
    .maybeSingle();
  if (!admin || !(await verifyPassword(senha, admin.senha_hash))) {
    return res.status(401).json({ error: 'Credenciais inválidas.' });
  }
  const token = signToken({ id: admin.id, role: 'admin' });
  res.json({ token, admin: mapAdmin(admin) });
});

// Todas as rotas abaixo exigem admin
router.use(requireAdmin);

// ───────────── STATS ─────────────

router.get('/stats', async (_req, res) => {
  const [c, l, r, s, sa] = await Promise.all([
    supabase.from('courses').select('id, preco', { count: 'exact' }),
    supabase.from('lessons').select('id', { count: 'exact', head: true }),
    supabase.from('reviews').select('nota'),
    supabase.from('students').select('id, ativo', { count: 'exact' }),
    supabase.from('enrollments').select('course_id, courses(preco)'),
  ]);

  const totalCursos = c.count ?? 0;
  const totalAulas = l.count ?? 0;
  const totalAvaliacoes = (r.data ?? []).length;
  const mediaNotas = totalAvaliacoes
    ? Number(((r.data.reduce((a, x) => a + x.nota, 0)) / totalAvaliacoes).toFixed(2))
    : 0;
  const totalAlunos = s.count ?? 0;
  const alunosAtivos = (s.data ?? []).filter((x) => x.ativo).length;
  const receitaEstimada = (sa.data ?? []).reduce(
    (acc, e) => acc + Number(e.courses?.preco ?? 0),
    0
  );

  res.json({
    totalAlunos,
    alunosAtivos,
    totalCursos,
    totalAulas,
    totalAvaliacoes,
    mediaNotas,
    receitaEstimada: Number(receitaEstimada.toFixed(2)),
  });
});

// ───────────── COURSES ─────────────

async function withLessonCount(courses) {
  if (!courses?.length) return [];
  const ids = courses.map((c) => c.id);
  const { data: lessons } = await supabase
    .from('lessons')
    .select('course_id')
    .in('course_id', ids);
  const counts = {};
  for (const l of lessons ?? []) counts[l.course_id] = (counts[l.course_id] || 0) + 1;
  return courses.map((c) => mapCourse(c, { totalAulas: counts[c.id] || 0 }));
}

router.get('/courses', async (req, res) => {
  const { page, limit, from, to } = parsePage(req);
  const { search } = req.query;
  let q = supabase.from('courses').select('*', { count: 'exact' }).order('criado_em', { ascending: false });
  if (search) q = q.or(`titulo.ilike.%${search}%,professor.ilike.%${search}%,categoria.ilike.%${search}%`);
  q = q.range(from, to);
  const { data, count, error } = await q;
  if (error) return res.status(500).json({ error: error.message });
  res.json(pagedResponse(await withLessonCount(data), count, page, limit));
});

router.get('/courses/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('id', req.params.id)
    .maybeSingle();
  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: 'Curso não encontrado' });
  const { count } = await supabase
    .from('lessons')
    .select('id', { count: 'exact', head: true })
    .eq('course_id', req.params.id);
  res.json(mapCourse(data, { totalAulas: count ?? 0 }));
});

router.post('/courses', async (req, res) => {
  const b = req.body || {};
  const { data, error } = await supabase
    .from('courses')
    .insert({
      titulo: b.titulo ?? '',
      professor: b.professor ?? '',
      descricao: b.descricao ?? '',
      categoria: b.categoria ?? '',
      preco: Number(b.preco ?? 0),
      thumbnail: b.thumbnail || null,
      duracao_total: b.duracaoTotal ?? '',
    })
    .select('*')
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(mapCourse(data, { totalAulas: 0 }));
});

router.put('/courses/:id', async (req, res) => {
  const b = req.body || {};
  const patch = {};
  if ('titulo' in b) patch.titulo = b.titulo;
  if ('professor' in b) patch.professor = b.professor;
  if ('descricao' in b) patch.descricao = b.descricao;
  if ('categoria' in b) patch.categoria = b.categoria;
  if ('preco' in b) patch.preco = Number(b.preco);
  if ('thumbnail' in b) patch.thumbnail = b.thumbnail || null;
  if ('duracaoTotal' in b) patch.duracao_total = b.duracaoTotal;
  const { data, error } = await supabase
    .from('courses')
    .update(patch)
    .eq('id', req.params.id)
    .select('*')
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(mapCourse(data));
});

router.delete('/courses/:id', async (req, res) => {
  const { error } = await supabase.from('courses').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

// ───────────── LESSONS ─────────────

router.get('/lessons', async (req, res) => {
  const { courseId } = req.query;
  let q = supabase.from('lessons').select('*').order('ordem');
  if (courseId) q = q.eq('course_id', courseId);
  const { data, error } = await q;
  if (error) return res.status(500).json({ error: error.message });
  res.json((data ?? []).map((l) => mapLesson(l)));
});

router.post('/lessons', async (req, res) => {
  const b = req.body || {};
  if (!b.courseId) return res.status(400).json({ error: 'courseId é obrigatório.' });

  // Próxima ordem
  const { data: last } = await supabase
    .from('lessons')
    .select('ordem')
    .eq('course_id', b.courseId)
    .order('ordem', { ascending: false })
    .limit(1)
    .maybeSingle();
  const ordem = (last?.ordem ?? 0) + 1;

  const { data, error } = await supabase
    .from('lessons')
    .insert({
      course_id: b.courseId,
      ordem,
      titulo: b.titulo ?? '',
      duracao: b.duracao ?? '',
      video_url: b.videoUrl ?? '',
      descricao: b.descricao ?? '',
      material_complementar: b.materialComplementar ?? '',
    })
    .select('*')
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(mapLesson(data));
});

router.put('/lessons/:id', async (req, res) => {
  const b = req.body || {};
  const patch = {};
  if ('titulo' in b) patch.titulo = b.titulo;
  if ('duracao' in b) patch.duracao = b.duracao;
  if ('videoUrl' in b) patch.video_url = b.videoUrl;
  if ('descricao' in b) patch.descricao = b.descricao;
  if ('materialComplementar' in b) patch.material_complementar = b.materialComplementar;
  if ('ordem' in b) patch.ordem = Number(b.ordem);
  const { data, error } = await supabase
    .from('lessons')
    .update(patch)
    .eq('id', req.params.id)
    .select('*')
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(mapLesson(data));
});

router.delete('/lessons/:id', async (req, res) => {
  const { error } = await supabase.from('lessons').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

// ───────────── REVIEWS ─────────────

router.get('/reviews', async (req, res) => {
  const { page, limit, from, to } = parsePage(req);
  const { data, count, error } = await supabase
    .from('reviews')
    .select('*, courses(titulo, professor), students(nome)', { count: 'exact' })
    .order('criado_em', { ascending: false })
    .range(from, to);
  if (error) return res.status(500).json({ error: error.message });
  res.json(pagedResponse((data ?? []).map(mapReview), count, page, limit));
});

router.delete('/reviews/:id', async (req, res) => {
  const { error } = await supabase.from('reviews').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

// ───────────── STUDENTS ─────────────

router.get('/students', async (req, res) => {
  const { page, limit, from, to } = parsePage(req);
  const { search } = req.query;
  let q = supabase
    .from('students')
    .select('*', { count: 'exact' })
    .order('criado_em', { ascending: false });
  if (search) q = q.or(`nome.ilike.%${search}%,email.ilike.%${search}%`);
  q = q.range(from, to);
  const { data, count, error } = await q;
  if (error) return res.status(500).json({ error: error.message });

  const ids = (data ?? []).map((s) => s.id);
  const enrollCounts = {};
  if (ids.length) {
    const { data: enrolls } = await supabase
      .from('enrollments')
      .select('student_id')
      .in('student_id', ids);
    for (const e of enrolls ?? []) {
      enrollCounts[e.student_id] = (enrollCounts[e.student_id] || 0) + 1;
    }
  }
  const students = (data ?? []).map((s) =>
    mapStudent(s, { cursosComprados: enrollCounts[s.id] || 0 })
  );
  res.json(pagedResponse(students, count, page, limit));
});

router.put('/students/:id', async (req, res) => {
  const b = req.body || {};
  const patch = {};
  if ('nome' in b) patch.nome = b.nome;
  if ('email' in b) patch.email = String(b.email).toLowerCase().trim();
  if ('ativo' in b) patch.ativo = !!b.ativo;
  const { data, error } = await supabase
    .from('students')
    .update(patch)
    .eq('id', req.params.id)
    .select('*')
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(mapStudent(data));
});

router.put('/students/:id/password', async (req, res) => {
  const { novaSenha } = req.body || {};
  if (!novaSenha || String(novaSenha).length < 6) {
    return res.status(400).json({ error: 'Senha deve ter ao menos 6 caracteres.' });
  }
  const senha_hash = await hashPassword(novaSenha);
  const { error } = await supabase
    .from('students')
    .update({ senha_hash })
    .eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

router.delete('/students/:id', async (req, res) => {
  const { error } = await supabase.from('students').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

export { router };
