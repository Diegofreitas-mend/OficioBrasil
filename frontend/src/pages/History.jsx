import { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import { formatDate } from '../utils/formatters.js';
import styles from '../styles/pages/History.module.css';

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/history')
      .then(setHistory)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>Histórico de Cursos</h1>

      {loading && <p className={styles.loading}>Carregando...</p>}
      {error && <p className={styles.error}>{error}</p>}
      {!loading && !error && history.length === 0 && (
        <p className={styles.empty}>Nenhum curso concluído ainda.</p>
      )}

      {history.map(item => (
        <div key={item.id} className={styles.card}>
          <div className={styles.info}>
            <p className={styles.courseTitle}>{item.tituloCurso}</p>
            <p className={styles.professor}>Prof. {item.professor}</p>
            <span className={styles.categoryTag}>{item.categoria}</span>
          </div>
          <div className={styles.right}>
            <span className={styles.date}>Concluído em {formatDate(item.concluidoEm)}</span>
            {item.certificado && (
              <span className={styles.badge}>✓ Certificado</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
