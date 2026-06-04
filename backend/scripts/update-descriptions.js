// Atualiza as descrições dos cursos existentes no Supabase usando os textos
// de backend/data/courses.json (match por título). Rode: `node scripts/update-descriptions.js`
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { supabase } from '../lib/supabase.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const courses = JSON.parse(
  readFileSync(join(__dirname, '../data/courses.json'), 'utf-8')
);

async function main() {
  for (const c of courses) {
    if (!c.descricao) continue;
    const { error, count } = await supabase
      .from('courses')
      .update({ descricao: c.descricao }, { count: 'exact' })
      .eq('titulo', c.titulo);
    if (error) {
      console.error(`✘ ${c.titulo}: ${error.message}`);
      continue;
    }
    console.log(`✔ ${c.titulo} (${count ?? 0} linha[s])`);
  }
  console.log('\nDescrições atualizadas.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
