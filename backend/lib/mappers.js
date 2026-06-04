// Converte registros do Supabase (snake_case) para o formato camelCase usado no frontend.

export const mapCourse = (c, extras = {}) => ({
  id: c.id,
  titulo: c.titulo,
  professor: c.professor,
  descricao: c.descricao,
  categoria: c.categoria,
  preco: Number(c.preco ?? 0),
  thumbnail: c.thumbnail,
  duracaoTotal: c.duracao_total ?? '',
  totalAulas: extras.totalAulas ?? c.total_aulas ?? 0,
  comprado: extras.comprado ?? false,
  progresso: extras.progresso ?? 0,
  notaMedia: extras.notaMedia ?? 0,
  totalAvaliacoes: extras.totalAvaliacoes ?? 0,
  ...(extras.lessons ? { lessons: extras.lessons } : {}),
});

export const mapLesson = (l, extras = {}) => ({
  id: l.id,
  courseId: l.course_id,
  ordem: l.ordem ?? 0,
  titulo: l.titulo,
  duracao: l.duracao ?? '',
  videoUrl: l.video_url ?? '',
  descricao: l.descricao ?? '',
  materialComplementar: l.material_complementar ?? '',
  concluida: extras.concluida ?? false,
});

export const mapStudent = (s, extras = {}) => ({
  id: s.id,
  nome: s.nome,
  email: s.email,
  cpf: s.cpf,
  dataNascimento: s.data_nascimento,
  ativo: s.ativo,
  cadastradoEm: s.criado_em,
  cursosComprados: extras.cursosComprados ?? 0,
});

export const mapReview = (r) => ({
  id: r.id,
  cursoId: r.course_id,
  studentId: r.student_id,
  tituloCurso: r.courses?.titulo ?? '',
  professor: r.courses?.professor ?? '',
  alunoNome: r.students?.nome ?? '',
  nota: r.nota,
  comentario: r.comentario,
  data: r.criado_em,
});

export const mapAdmin = (a) => ({
  id: a.id,
  nome: a.nome,
  email: a.email,
});
