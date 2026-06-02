import { useEffect, useRef } from 'react';
import { extractYoutubeId } from '../utils/youtube.js';
import styles from '../styles/components/VideoPlayer.module.css';

let apiLoadingPromise = null;
function loadYouTubeApi() {
  if (window.YT?.Player) return Promise.resolve();
  if (apiLoadingPromise) return apiLoadingPromise;
  apiLoadingPromise = new Promise((resolve) => {
    if (!document.querySelector('script[data-yt-iframe-api]')) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      tag.dataset.ytIframeApi = '1';
      document.head.appendChild(tag);
    }
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve();
    };
  });
  return apiLoadingPromise;
}

export default function VideoPlayer({ title, videoUrl, onEnded }) {
  const mountRef = useRef(null);
  const playerRef = useRef(null);
  const onEndedRef = useRef(onEnded);
  onEndedRef.current = onEnded;

  const videoId = extractYoutubeId(videoUrl);

  useEffect(() => {
    if (!videoId) return;
    let cancelled = false;

    loadYouTubeApi().then(() => {
      if (cancelled || !mountRef.current) return;
      playerRef.current = new window.YT.Player(mountRef.current, {
        videoId,
        playerVars: { rel: 0, modestbranding: 1, playsinline: 1 },
        events: {
          onStateChange: (e) => {
            if (e.data === window.YT.PlayerState.ENDED) {
              onEndedRef.current?.();
            }
          },
        },
      });
    });

    return () => {
      cancelled = true;
      try { playerRef.current?.destroy?.(); } catch {}
      playerRef.current = null;
    };
  }, [videoId]);

  if (!videoId) {
    return (
      <div className={styles.player} aria-label={`Player: ${title}`}>
        <span className={styles.hint}>Vídeo indisponível para esta aula.</span>
      </div>
    );
  }

  return (
    <div className={styles.player}>
      <div ref={mountRef} className={styles.iframe} title={title} />
    </div>
  );
}
