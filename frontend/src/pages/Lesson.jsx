import { useParams, useNavigate, Link } from 'react-router-dom';
import { useLesson } from '../hooks/useLesson.js';
import { useCourse } from '../hooks/useCourse.js';
import VideoPlayer from '../components/VideoPlayer.jsx';
import styles from '../styles/pages/Lesson.module.css';

export default function Lesson() {
  const { id: courseId, lessonId } = useParams();
  const navigate = useNavigate();

  const { lesson, loading: lLoading, error: lError } = useLesson(courseId, lessonId);
  const { course, loading: cLoading } = useCourse(courseId);

  if (lLoading || cLoading) return <p className={styles.loading}>Carregando aula...</p>;
  if (lError) return <p className={styles.error}>{lError}</p>;
  if (!lesson || !course) return null;

  const lessons = course.lessons ?? [];
  const currentIdx = lessons.findIndex(l => l.id === lessonId);
  const nextLesson = lessons[currentIdx + 1] ?? null;

  return (
    <div className={styles.page}>
      {/* Coluna principal */}
      <div className={styles.main}>
        <VideoPlayer title={lesson.titulo} />

        <div className={styles.titleRow}>
          <h1 className={styles.lessonTitle}>{lesson.titulo}</h1>
          <div className={styles.meta}>
            <span className={styles.metaItem}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              {lesson.duracao}
            </span>
            <span className={styles.metaItem}>Aula {currentIdx + 1} de {lessons.length}</span>
          </div>
        </div>

        <p className={styles.desc}>{lesson.descricao}</p>

        {lesson.materialComplementar && (
          <div className={styles.material}>
            <span>📎 Material complementar:</span>
            <a
              className={styles.materialLink}
              href={lesson.materialComplementar}
              target="_blank"
              rel="noreferrer"
            >
              Baixar PDF
            </a>
          </div>
        )}

        <button
          className={styles.nextBtn}
          disabled={!nextLesson}
          onClick={() => nextLesson && navigate(`/curso/${courseId}/aula/${nextLesson.id}`)}
        >
          <span>{nextLesson ? `Próxima: ${nextLesson.titulo}` : 'Última aula do curso'}</span>
          {nextLesson && <span>›</span>}
        </button>
      </div>

      {/* Sidebar: outras aulas */}
      <aside className={styles.sidebar}>
        <p className={styles.sidebarTitle}>Outras aulas</p>
        {lessons.map((l, i) => (
          <Link
            key={l.id}
            to={`/curso/${courseId}/aula/${l.id}`}
            className={`${styles.lessonListItem} ${l.id === lessonId ? styles.current : ''}`}
          >
            <span className={styles.lessonNum}>{String(i + 1).padStart(2, '0')}</span>
            <div className={styles.lessonInfo}>
              <span className={styles.lessonName}>{l.titulo}</span>
              <span className={styles.lessonDur}>{l.duracao}</span>
            </div>
          </Link>
        ))}
      </aside>
    </div>
  );
}
