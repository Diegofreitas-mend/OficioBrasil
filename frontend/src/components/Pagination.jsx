import styles from '../styles/components/Pagination.module.css';

export default function Pagination({ page, totalPages, onChange }) {
  if (!totalPages || totalPages <= 1) return null;
  const prev = () => onChange(Math.max(1, page - 1));
  const next = () => onChange(Math.min(totalPages, page + 1));
  return (
    <nav className={styles.root} aria-label="Paginação">
      <button type="button" onClick={prev} disabled={page <= 1} className={styles.btn}>
        ← Anterior
      </button>
      <span className={styles.info}>
        Página {page} de {totalPages}
      </span>
      <button type="button" onClick={next} disabled={page >= totalPages} className={styles.btn}>
        Próxima →
      </button>
    </nav>
  );
}
