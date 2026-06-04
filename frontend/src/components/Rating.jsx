import styles from '../styles/components/Rating.module.css';

export default function Rating({ nota = 0, total = 0, size = 'sm' }) {
  if (!total) {
    return <span className={styles.empty}>Ainda não tem avaliações</span>;
  }

  const full = Math.floor(nota);
  const hasHalf = nota - full >= 0.5;

  return (
    <span className={`${styles.wrap} ${styles[size] ?? ''}`}>
      <span className={styles.stars} aria-label={`${nota} de 5`}>
        {[0, 1, 2, 3, 4].map((i) => {
          let cls = styles.starEmpty;
          if (i < full) cls = styles.starFull;
          else if (i === full && hasHalf) cls = styles.starHalf;
          return (
            <span key={i} className={`${styles.star} ${cls}`}>★</span>
          );
        })}
      </span>
      <span className={styles.value}>
        {nota.toFixed(1)} <span className={styles.count}>({total})</span>
      </span>
    </span>
  );
}
