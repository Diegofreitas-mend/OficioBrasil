import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api.js';
import styles from '../styles/pages/History.module.css';

export default function History() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/courses/history')
      .then(setItems)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>Meus Cursos</h1>

      {loading && <p className={styles.loading}>Carregando...</p>}
      {error && <p className={styles.error}>{error}</p>}
      {!loading && !error && items.length === 0 && (
        <p className={styles.empty}>Você ainda não adquiriu nenhum curso.</p>
      )}

      {items.map((item) => (
        <Link key={item.id} to={`/curso/${item.cursoId}`} className={styles.card}>
          <div className={styles.info}>
            <p className={styles.courseTitle}>{item.tituloCurso}</p>
            <p className={styles.professor}>Prof. {item.professor}</p>
            <span className={styles.categoryTag}>{item.categoria}</span>
          </div>
          <div className={styles.right}>
            <span className={styles.date}>
              Adquirido em {new Date(item.compradoEm).toLocaleDateString('pt-BR')}
            </span>
            <span className={styles.badge}>
              {item.concluido ? '✓ Concluído' : `${item.progresso}% concluído`}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
