import styles from '../styles/components/ProgressBar.module.css';

export default function ProgressBar({ value, showLabel = true }) {
  const pct = Math.min(100, Math.max(0, value));

  return (
    <div className={styles.wrap}>
      {showLabel && (
        <div className={styles.labelRow}>
          <span className={styles.label}>Progresso</span>
          <span className={styles.label}>{pct}%</span>
        </div>
      )}
      <div className={styles.track}>
        <div className={styles.fill} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
