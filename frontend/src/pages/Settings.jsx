import { useSettings } from '../contexts/SettingsContext.jsx';
import styles from '../styles/pages/Settings.module.css';

const FONT_OPTIONS = [
  { value: 'sm', label: 'Pequena' },
  { value: 'md', label: 'Padrão' },
  { value: 'lg', label: 'Grande' },
];

export default function Settings() {
  const { settings, update, reset } = useSettings();

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>Configurações</h1>
      <p className={styles.pageSubtitle}>Preferências salvas neste navegador.</p>

      <section className={styles.card}>
        <header className={styles.cardHead}>
          <h2 className={styles.cardTitle}>Aparência</h2>
        </header>

        <div className={styles.row}>
          <div className={styles.rowInfo}>
            <span className={styles.rowLabel}>Tema</span>
            <span className={styles.rowHint}>Escolha entre modo escuro e claro.</span>
          </div>
          <div className={styles.segmented}>
            {[
              { v: 'dark', l: 'Escuro' },
              { v: 'light', l: 'Claro' },
            ].map((o) => (
              <button
                key={o.v}
                type="button"
                onClick={() => update({ theme: o.v })}
                className={`${styles.segBtn} ${settings.theme === o.v ? styles.segBtnActive : ''}`}
              >
                {o.l}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.rowInfo}>
            <span className={styles.rowLabel}>Tamanho da fonte</span>
            <span className={styles.rowHint}>Aumenta o texto em todo o sistema.</span>
          </div>
          <div className={styles.segmented}>
            {FONT_OPTIONS.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => update({ fontSize: o.value })}
                className={`${styles.segBtn} ${settings.fontSize === o.value ? styles.segBtnActive : ''}`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.card}>
        <header className={styles.cardHead}>
          <h2 className={styles.cardTitle}>Acessibilidade</h2>
        </header>

        <label className={styles.row}>
          <div className={styles.rowInfo}>
            <span className={styles.rowLabel}>Alto contraste</span>
            <span className={styles.rowHint}>Reforça cores de texto e bordas.</span>
          </div>
          <input
            type="checkbox"
            checked={settings.highContrast}
            onChange={(e) => update({ highContrast: e.target.checked })}
            className={styles.checkbox}
          />
        </label>

        <label className={styles.row}>
          <div className={styles.rowInfo}>
            <span className={styles.rowLabel}>Reduzir animações</span>
            <span className={styles.rowHint}>Desativa transições e movimentos.</span>
          </div>
          <input
            type="checkbox"
            checked={settings.reduceMotion}
            onChange={(e) => update({ reduceMotion: e.target.checked })}
            className={styles.checkbox}
          />
        </label>
      </section>

      <button type="button" className={styles.resetBtn} onClick={reset}>
        Restaurar padrões
      </button>
    </div>
  );
}
