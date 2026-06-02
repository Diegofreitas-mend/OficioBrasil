import { useEffect, useState } from 'react';
import { api } from '../services/api.js';
import Pagination from '../components/Pagination.jsx';
import styles from '../styles/pages/AdminReviews.module.css';

function Stars({ nota }) {
  return (
    <span className={styles.stars} aria-label={`${nota} de 5`}>
      {'★'.repeat(nota)}{'☆'.repeat(5 - nota)}
    </span>
  );
}

export default function AdminReviews() {
  const [resp, setResp] = useState(null);
  const [page, setPage] = useState(1);
  const [erro, setErro] = useState('');

  const carregar = () => {
    api.get(`/admin/reviews?page=${page}&limit=10`)
      .then(setResp)
      .catch((e) => setErro(e.message));
  };

  useEffect(carregar, [page]);

  const handleDelete = async (id) => {
    if (!confirm('Excluir esta avaliação?')) return;
    try {
      await api.del(`/admin/reviews/${id}`);
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
        <h1 className={styles.title}>Avaliações</h1>
        <p className={styles.subtitle}>
          {resp.totalItems} avaliações publicadas pelos alunos.
        </p>
      </header>

      <ul className={styles.list}>
        {resp.data.map((r) => (
          <li key={r.id} className={styles.item}>
            <div className={styles.itemHead}>
              <div>
                <strong className={styles.curso}>{r.tituloCurso}</strong>
                <span className={styles.prof}>com {r.professor}</span>
                {r.alunoNome && <span className={styles.prof}> · por {r.alunoNome}</span>}
              </div>
              <Stars nota={r.nota} />
            </div>
            <p className={styles.comentario}>{r.comentario}</p>
            <div className={styles.itemFoot}>
              <span className={styles.data}>{new Date(r.data).toLocaleDateString('pt-BR')}</span>
              <button type="button" className={styles.dangerBtn} onClick={() => handleDelete(r.id)}>
                Excluir
              </button>
            </div>
          </li>
        ))}
        {resp.data.length === 0 && <li className={styles.empty}>Sem avaliações.</li>}
      </ul>

      <Pagination page={resp.page} totalPages={resp.totalPages} onChange={setPage} />
    </div>
  );
}
