import { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import { formatDate } from '../utils/formatters.js';
import styles from '../styles/pages/Reviews.module.css';

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/reviews')
      .then(setReviews)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>Minhas Avaliações</h1>

      {loading && <p className={styles.loading}>Carregando...</p>}
      {error && <p className={styles.error}>{error}</p>}
      {!loading && !error && reviews.length === 0 && (
        <p className={styles.empty}>Você ainda não avaliou nenhum curso.</p>
      )}

      {reviews.map(r => (
        <div key={r.id} className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <p className={styles.courseTitle}>{r.tituloCurso}</p>
              <p className={styles.professor}>Prof. {r.professor}</p>
            </div>
            <div className={styles.stars}>
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={styles.star}>
                  {i < r.nota ? '★' : '☆'}
                </span>
              ))}
            </div>
          </div>
          <p className={styles.comment}>{r.comentario}</p>
          <span className={styles.date}>{formatDate(r.data)}</span>
        </div>
      ))}
    </div>
  );
}
