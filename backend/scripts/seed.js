// Popula o Supabase com os dados iniciais (cursos, aulas) e cria o admin padrão.
// Rode uma vez: `npm run seed --workspace=backend`
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { supabase } from '../lib/supabase.js';
import { hashPassword } from '../lib/auth.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const readJson = (file) =>
  JSON.parse(readFileSync(join(__dirname, '../data', file), 'utf-8'));

async function ensureAdmin() {
  const email = 'admin@oficiobrasil.com.br';
  const { data: existing } = await supabase
    .from('admins')
    .select('id')
    .eq('email', email)
    .maybeSingle();
  if (existing) {
    console.log(`✔ admin já existe (${email})`);
    return;
  }
  const senha_hash = await hashPassword('admin123');
  const { error } = await supabase
    .from('admins')
    .insert({ nome: 'Administrador', email, senha_hash });
  if (error) throw error;
  console.log(`✔ admin criado: ${email} / admin123`);
}

async function seedCourses() {
  const courses = readJson('courses.json');
  const lessons = readJson('lessons.json');

  const oldToNew = {};

  for (const c of courses) {
    const { data: existing } = await supabase
      .from('courses')
      .select('id')
      .eq('titulo', c.titulo)
      .maybeSingle();

    if (existing) {
      oldToNew[c.id] = existing.id;
      console.log(`· curso já existe: ${c.titulo}`);
      continue;
    }

    const { data, error } = await supabase
      .from('courses')
      .insert({
        titulo: c.titulo,
        professor: c.professor ?? '',
        descricao: c.descricao ?? '',
        categoria: c.categoria ?? '',
        preco: c.preco ?? 0,
        thumbnail: c.thumbnail || null,
        duracao_total: c.duracaoTotal ?? '',
      })
      .select('id')
      .single();
    if (error) throw error;
    oldToNew[c.id] = data.id;
    console.log(`✔ curso: ${c.titulo}`);
  }

  for (const l of lessons) {
    const courseId = oldToNew[l.courseId];
    if (!courseId) continue;
    const { count } = await supabase
      .from('lessons')
      .select('*', { count: 'exact', head: true })
      .eq('course_id', courseId)
      .eq('titulo', l.titulo);
    if (count && count > 0) {
      console.log(`· aula já existe: ${l.titulo}`);
      continue;
    }
    const { error } = await supabase.from('lessons').insert({
      course_id: courseId,
      ordem: Number(l.id),
      titulo: l.titulo,
      duracao: l.duracao ?? '',
      video_url: l.videoUrl ?? '',
      descricao: l.descricao ?? '',
      material_complementar: l.materialComplementar ?? '',
    });
    if (error) throw error;
    console.log(`✔ aula: ${l.titulo}`);
  }
}

async function main() {
  await ensureAdmin();
  await seedCourses();
  console.log('\nSeed concluído.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
