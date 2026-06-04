import { useLocation, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../contexts/AdminAuthContext.jsx';
import styles from '../styles/components/AdminHeader.module.css';

const PAGE_LABELS = {
  '/admin':            'Visão geral',
  '/admin/cursos':     'Cursos',
  '/admin/cursos/novo':'Novo curso',
  '/admin/alunos':     'Alunos',
  '/admin/avaliacoes': 'Avaliações',
};

function resolveLabel(pathname) {
  if (PAGE_LABELS[pathname]) return PAGE_LABELS[pathname];
  if (pathname.startsWith('/admin/cursos/')) return 'Editar curso';
  return 'Admin';
}

export default function AdminHeader({ onMenu }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { admin, logout } = useAdminAuth();

  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <header className={styles.header}>
      <div className={styles.leftZone}>
        <button
          type="button"
          className={styles.menuBtn}
          onClick={onMenu}
          aria-label="Abrir menu"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <div className={styles.left}>
          <span className={styles.breadcrumb}>Painel Administrativo</span>
          <span className={styles.pageTitle}>{resolveLabel(pathname)}</span>
        </div>
      </div>

      <div className={styles.right}>
        {admin && (
          <span className={styles.greeting}>
            <strong>{admin.nome}</strong>
          </span>
        )}
        <div className={styles.avatar}>A</div>
        <button
          type="button"
          className={styles.logoutBtn}
          onClick={handleLogout}
        >
          Sair
        </button>
      </div>
    </header>
  );
}
