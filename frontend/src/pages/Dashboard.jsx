import { useState } from 'react';
import { useCourses, useMyCourses, useCategories } from '../hooks/useCourses.js';
import CourseCard from '../components/CourseCard.jsx';
import Pagination from '../components/Pagination.jsx';
import styles from '../styles/pages/Dashboard.module.css';

export default function Dashboard() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [categoria, setCategoria] = useState('');

  const { courses: myCourses, loading: myLoading, error: myError } = useMyCourses();
  const {
    courses: allCourses,
    totalPages,
    totalItems,
    loading: allLoading,
    error: allError,
  } = useCourses({ page, search, categoria });
  const categories = useCategories();

  const onFilterChange = (setter) => (v) => {
    setPage(1);
    setter(v);
  };

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
        {!myLoading && !myError && myCourses.length > 0 && (
          <div className={styles.gridMy}>
            {myCourses.map((c) => <CourseCard key={c.id} course={c} />)}
          </div>
        )}
      </section>

      {/* Todos os Cursos */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Todos os Cursos</h2>
          {!allLoading && <span className={styles.sectionCount}>{totalItems} disponíveis</span>}
        </div>

        <div className={styles.filters}>
          <input
            type="search"
            placeholder="Buscar por título…"
            value={search}
            onChange={(e) => onFilterChange(setSearch)(e.target.value)}
            className={styles.filterInput}
          />
          <select
            value={categoria}
            onChange={(e) => onFilterChange(setCategoria)(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">Todas as categorias</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {allLoading && <p className={styles.loading}>Carregando...</p>}
        {allError && <p className={styles.error}>{allError}</p>}
        {!allLoading && !allError && (
          <>
            <div className={styles.gridAll}>
              {allCourses.map((c) => <CourseCard key={c.id} course={c} />)}
            </div>
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </>
        )}
      </section>
    </div>
  );
}
