import styles from '../styles/pages/Settings.module.css';

export default function Settings() {
  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>Configurações</h1>
      <div className={styles.placeholder}>
        <span className={styles.placeholderIcon}>⚙️</span>
        <p className={styles.placeholderText}>Em breve</p>
        <p className={styles.placeholderSub}>
          Esta seção está sendo desenvolvida e estará disponível em breve.
        </p>
      </div>
    </div>
  );
}
