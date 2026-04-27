import styles from '../styles/components/VideoPlayer.module.css';

export default function VideoPlayer({ title }) {
  return (
    <div className={styles.player} aria-label={`Player: ${title}`}>
      <button className={styles.playBtn} type="button" aria-label="Reproduzir aula">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="5 3 19 12 5 21 5 3"/>
        </svg>
      </button>
      <span className={styles.hint}>Clique para reproduzir</span>
    </div>
  );
}
