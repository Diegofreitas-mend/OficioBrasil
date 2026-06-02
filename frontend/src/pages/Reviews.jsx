import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api.js';
import styles from '../styles/pages/Reviews.module.css';

export default function Reviews() {
  const [resp, setResp] = useState(null);
  const [myCourses, setMyCourses] = useState([]);
  const [form, setForm] = useState({ courseId: '', nota: 5, comentario: '' });
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const carregar = useCallback(async () => {
    setLoading(true);
    try {
      const [r, my] = await Promise.all([
        api.get('/reviews?mine=1&limit=20'),
        api.get('/courses/my'),
      ]);
      setResp(r);
      setMyCourses(my);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.courseId) return alert('Selecione um curso.');
    setSubmitting(true);
    try {
      await api.post('/reviews', {
        courseId: form.courseId,
        nota: Number(form.nota),
        comentario: form.comentario,
      });
      setForm({ courseId: '', nota: 5, comentario: '' });
      await carregar();
    } catch (e) {
      alert(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>Minhas Avaliações</h1>

      <form className={styles.card} onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
        <h3 style={{ margin: 0, fontSize: 15, color: 'var(--text)' }}>Avaliar um curso</h3>
        <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '2fr 1fr', marginTop: 12 }}>
          <select
            value={form.courseId}
            onChange={(e) => setForm((p) => ({ ...p, courseId: e.target.value }))}
            required
            style={{
              padding: '10px 12px', background: 'var(--bg-card)', color: 'var(--text)',
              border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)',
              fontSize: 13, outline: 'none',
            }}
          >
            <option value="">Selecione um curso comprado…</option>
            {myCourses.map((c) => (
              <option key={c.id} value={c.id}>{c.titulo}</option>
            ))}
          </select>
          <select
            value={form.nota}
            onChange={(e) => setForm((p) => ({ ...p, nota: Number(e.target.value) }))}
            style={{
              padding: '10px 12px', background: 'var(--bg-card)', color: 'var(--text)',
              border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)',
              fontSize: 13, outline: 'none',
            }}
          >
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>{'★'.repeat(n)}{'☆'.repeat(5 - n)} ({n})</option>
            ))}
          </select>
        </div>
        <textarea
          placeholder="Comentário (opcional)"
          rows={3}
          value={form.comentario}
          onChange={(e) => setForm((p) => ({ ...p, comentario: e.target.value }))}
          style={{
            width: '100%', marginTop: 12, padding: 12,
            background: 'var(--bg-card)', color: 'var(--text)',
            border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)',
            fontSize: 13, outline: 'none', resize: 'vertical', fontFamily: 'inherit',
          }}
        />
        <button
          type="submit"
          disabled={submitting || !form.courseId}
          style={{
            marginTop: 12, padding: '10px 18px', background: 'var(--primary)',
            color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)',
            fontSize: 13, fontWeight: 500, cursor: 'pointer', alignSelf: 'flex-start',
          }}
        >
          {submitting ? 'Enviando…' : 'Publicar avaliação'}
        </button>
      </form>

      {loading && <p className={styles.loading}>Carregando...</p>}
      {error && <p className={styles.error}>{error}</p>}
      {!loading && !error && resp?.data.length === 0 && (
        <p className={styles.empty}>Você ainda não avaliou nenhum curso.</p>
      )}

      {resp?.data.map((r) => (
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
          <span className={styles.date}>{new Date(r.data).toLocaleDateString('pt-BR')}</span>
        </div>
      ))}
    </div>
  );
}
