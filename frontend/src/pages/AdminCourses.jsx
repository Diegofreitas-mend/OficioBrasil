import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api.js';
import Pagination from '../components/Pagination.jsx';
import styles from '../styles/pages/AdminCourses.module.css';

const formatBRL = (v) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v ?? 0);

export default function AdminCourses() {
  const [page, setPage] = useState(1);
  const [busca, setBusca] = useState('');
  const [resp, setResp] = useState(null);
  const [erro, setErro] = useState('');

  const carregar = () => {
    const qs = new URLSearchParams({ page: String(page), limit: '10' });
    if (busca) qs.set('search', busca);
    api.get(`/admin/courses?${qs}`).then(setResp).catch((e) => setErro(e.message));
  };

  useEffect(carregar, [page]);

  // Debounce de busca
  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      const qs = new URLSearchParams({ page: '1', limit: '10' });
      if (busca) qs.set('search', busca);
      api.get(`/admin/courses?${qs}`).then(setResp).catch((e) => setErro(e.message));
    }, 250);
    return () => clearTimeout(t);
  }, [busca]);

  const handleDelete = async (id) => {
    if (!confirm('Excluir este curso? Todas as aulas vinculadas também serão removidas.')) return;
    try {
      await api.del(`/admin/courses/${id}`);
      carregar();
    } catch (e) {
      alert(e.message);
    }
  };

  if (erro) return <p className={styles.error}>{erro}</p>;
  if (!resp) return <p className={styles.loading}>Carregando…</p>;

  return (
    <div className={styles.root}>
      <header className={styles.head}>
        <div>
          <h1 className={styles.title}>Cursos</h1>
          <p className={styles.subtitle}>{resp.totalItems} cursos cadastrados.</p>
        </div>
        <Link to="/admin/cursos/novo" className={styles.cta}>+ Novo curso</Link>
      </header>

      <input
        className={styles.search}
        placeholder="Buscar por título, professor ou categoria…"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
      />

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Curso</th>
              <th>Categoria</th>
              <th>Aulas</th>
              <th>Preço</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {resp.data.map((c) => (
              <tr key={c.id}>
                <td>
                  <strong className={styles.cursoTitulo}>{c.titulo}</strong>
                  <span className={styles.cursoProf}>{c.professor}</span>
                </td>
                <td><span className={styles.tag}>{c.categoria}</span></td>
                <td>{c.totalAulas}</td>
                <td>{formatBRL(c.preco)}</td>
                <td className={styles.actionsCol}>
                  <Link to={`/admin/cursos/${c.id}`} className={styles.linkBtn}>Editar</Link>
                  <button type="button" className={styles.dangerBtn} onClick={() => handleDelete(c.id)}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
            {resp.data.length === 0 && (
              <tr><td colSpan={5} className={styles.empty}>Nenhum curso encontrado.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={resp.page} totalPages={resp.totalPages} onChange={setPage} />
    </div>
  );
}
