import { useParams, useNavigate } from 'react-router-dom';
import { useCourse } from '../hooks/useCourse.js';
import ProgressBar from '../components/ProgressBar.jsx';
import { formatPrice } from '../utils/formatters.js';
import { getCategory } from '../constants/categories.js';
import styles from '../styles/pages/Course.module.css';

export default function Course() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { course, loading, error } = useCourse(id);

  if (loading) return <p className={styles.loading}>Carregando curso...</p>;
  if (error)   return <p className={styles.error}>{error}</p>;
  if (!course) return null;

  const cat = getCategory(course.categoria);
  const firstLesson = course.lessons?.[0];

  return (
    <div className={styles.page}>
      {/* Banner */}
      <div className={styles.banner} style={{ background: cat.bannerGradient }}>
        <div className={styles.bannerContent}>
          <span className={styles.category}>{course.categoria}</span>
          <h1 className={styles.bannerTitle}>{course.titulo}</h1>
          <p className={styles.bannerProfessor}>Prof. {course.professor}</p>
          <div className={styles.bannerMeta}>
            <span className={styles.metaItem}>{course.totalAulas} aulas</span>
            <span className={styles.metaItem}>·</span>
            <span className={styles.metaItem}>{course.duracaoTotal}</span>
          </div>
        </div>
      </div>

      {/* Progresso (apenas para cursos comprados) */}
      {course.comprado && (
        <div className={styles.progressSection}>
          <span className={styles.progressTitle}>Seu progresso</span>
          <ProgressBar value={course.progresso} />
          {firstLesson && (
            <button
              className={styles.btnBuy}
              onClick={() => navigate(`/curso/${id}/aula/${firstLesson.id}`)}
            >
              {course.progresso > 0 ? 'Continuar de onde parou' : 'Começar curso'}
            </button>
          )}
        </div>
      )}

      {/* Descrição */}
      <div className={styles.descSection}>
        <h2 className={styles.descTitle}>Sobre o curso</h2>
        <p className={styles.desc}>{course.descricao}</p>
      </div>

      {/* Lista de aulas */}
      <div className={styles.lessonsSection}>
        <h2 className={styles.lessonsTitle}>Aulas do curso</h2>
        {course.lessons?.map((lesson, i) => (
          <div
            key={lesson.id}
            className={styles.lessonItem}
            onClick={() => course.comprado && navigate(`/curso/${id}/aula/${lesson.id}`)}
            style={{ cursor: course.comprado ? 'pointer' : 'default' }}
          >
            <span className={styles.lessonNum}>{String(i + 1).padStart(2, '0')}</span>
            <div className={styles.lessonInfo}>
              <span className={styles.lessonTitle}>{lesson.titulo}</span>
              <span className={styles.lessonDuration}>{lesson.duracao}</span>
            </div>
            {course.comprado && <span className={styles.lessonArrow}>›</span>}
          </div>
        ))}
      </div>

      {/* Compra (apenas para cursos não adquiridos) */}
      {!course.comprado && (
        <div className={styles.buySection}>
          <div className={styles.buyPrice}>
            <span className={styles.buyLabel}>Valor do curso</span>
            <span className={styles.buyValue}>{formatPrice(course.preco)}</span>
          </div>
          <button className={styles.btnBuy}>Adquirir Curso</button>
        </div>
      )}
    </div>
  );
}
