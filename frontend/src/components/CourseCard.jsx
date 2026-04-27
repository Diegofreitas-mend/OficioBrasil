import { useNavigate } from 'react-router-dom';
import ProgressBar from './ProgressBar.jsx';
import { formatPrice } from '../utils/formatters.js';
import { getCategory } from '../constants/categories.js';
import styles from '../styles/components/CourseCard.module.css';

export default function CourseCard({ course }) {
  const navigate = useNavigate();
  const cat = getCategory(course.categoria);

  const goToCourse = () => navigate(`/curso/${course.id}`);

  return (
    <article className={styles.card} onClick={goToCourse}>
      <div className={styles.thumbnail} style={{ background: cat.gradient }}>
        <span className={styles.thumbIcon} style={{ fontSize: 40 }}>{cat.icon}</span>
        <span className={styles.categoryBadge}>{course.categoria}</span>
      </div>

      <div className={styles.body}>
        <p className={styles.title}>{course.titulo}</p>
        <p className={styles.professor}>{course.professor}</p>
        <div className={styles.meta}>
          <span className={styles.metaItem}>{course.totalAulas} aulas</span>
          <span className={styles.metaItem}>·</span>
          <span className={styles.metaItem}>{course.duracaoTotal}</span>
        </div>
      </div>

      <div className={styles.footer}>
        {course.comprado ? (
          <>
            <div className={styles.progressWrap}>
              <ProgressBar value={course.progresso} />
            </div>
            <button
              className={styles.btnContinue}
              onClick={e => { e.stopPropagation(); goToCourse(); }}
            >
              Continuar
            </button>
          </>
        ) : (
          <>
            <span className={styles.price}>{formatPrice(course.preco)}</span>
            <button
              className={styles.btnView}
              onClick={e => { e.stopPropagation(); goToCourse(); }}
            >
              Ver Curso
            </button>
          </>
        )}
      </div>
    </article>
  );
}
