import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCourse } from '../hooks/useCourse.js';
import { api } from '../services/api.js';
import ProgressBar from '../components/ProgressBar.jsx';
import { formatPrice } from '../utils/formatters.js';
import { getCategory } from '../constants/categories.js';
import styles from '../styles/pages/Course.module.css';

export default function Course() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { course, loading, error, refetch } = useCourse(id);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollErr, setEnrollErr] = useState('');

  if (loading) return <p className={styles.loading}>Carregando curso...</p>;
  if (error)   return <p className={styles.error}>{error}</p>;
  if (!course) return null;

  const cat = getCategory(course.categoria);
  const firstLesson = course.lessons?.[0];
  const nextToStudy = course.lessons?.find((l) => !l.concluida) ?? firstLesson;
  const allDone = course.lessons?.length > 0 && course.lessons.every((l) => l.concluida);

  const handleEnroll = async () => {
    setEnrolling(true);
    setEnrollErr('');
    try {
      await api.post(`/courses/${id}/enroll`);
      await refetch();
    } catch (e) {
      setEnrollErr(e.message);
    } finally {
      setEnrolling(false);
    }
  };

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
          {nextToStudy && (
            <button
              className={styles.btnBuy}
              onClick={() => navigate(`/curso/${id}/aula/${nextToStudy.id}`)}
            >
              {allDone
                ? 'Revisar curso'
                : course.progresso > 0
                ? `Continuar de onde parou — ${nextToStudy.titulo}`
                : 'Começar curso'}
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
            {lesson.concluida && <span style={{ color: 'var(--success)', fontSize: 12, marginRight: 8 }}>✓</span>}
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
          <button
            className={styles.btnBuy}
            onClick={handleEnroll}
            disabled={enrolling}
          >
            {enrolling ? 'Processando…' : 'Adquirir Curso'}
          </button>
          {enrollErr && (
            <p style={{ color: 'var(--danger)', fontSize: 13, marginTop: 8 }}>{enrollErr}</p>
          )}
        </div>
      )}
    </div>
  );
}
