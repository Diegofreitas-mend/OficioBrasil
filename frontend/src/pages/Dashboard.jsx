import { useCourses, useMyCourses } from '../hooks/useCourses.js';
import CourseCard from '../components/CourseCard.jsx';
import styles from '../styles/pages/Dashboard.module.css';

export default function Dashboard() {
  const { courses: myCourses, loading: myLoading, error: myError } = useMyCourses();
  const { courses: allCourses, loading: allLoading, error: allError } = useCourses();

  return (
    <div className={styles.page}>
      {/* Meus Cursos */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Meus Cursos</h2>
          {!myLoading && <span className={styles.sectionCount}>{myCourses.length} cursos</span>}
        </div>

        {myLoading && <p className={styles.loading}>Carregando...</p>}
        {myError && <p className={styles.error}>{myError}</p>}
        {!myLoading && !myError && myCourses.length === 0 && (
          <p className={styles.empty}>Você ainda não adquiriu nenhum curso.</p>
        )}
        {!myLoading && !myError && (
          <div className={styles.gridMy}>
            {myCourses.map(c => <CourseCard key={c.id} course={c} />)}
          </div>
        )}
      </section>

      {/* Todos os Cursos */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Todos os Cursos</h2>
          {!allLoading && <span className={styles.sectionCount}>{allCourses.length} disponíveis</span>}
        </div>

        {allLoading && <p className={styles.loading}>Carregando...</p>}
        {allError && <p className={styles.error}>{allError}</p>}
        {!allLoading && !allError && (
          <div className={styles.gridAll}>
            {allCourses.map(c => <CourseCard key={c.id} course={c} />)}
          </div>
        )}
      </section>
    </div>
  );
}
