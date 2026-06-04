import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import UserDataModal from './UserDataModal.jsx';
import ChangeRequestModal from './ChangeRequestModal.jsx';
import styles from '../styles/components/Header.module.css';

const PAGE_LABELS = {
  '/':              'Dashboard',
  '/avaliacoes':    'Avaliações',
  '/historico':     'Histórico',
  '/configuracoes': 'Configurações',
};

export default function Header({ onMenu }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { student, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dataOpen, setDataOpen] = useState(false);
  const [requestOpen, setRequestOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setMenuOpen(false);
    };
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('mousedown', onClick);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('mousedown', onClick);
      window.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    navigate('/login', { replace: true });
  };

  const openData = () => { setMenuOpen(false); setDataOpen(true); };
  const openRequest = () => { setMenuOpen(false); setRequestOpen(true); };
  const goSettings = () => { setMenuOpen(false); navigate('/configuracoes'); };

  const pageLabel = PAGE_LABELS[pathname] ?? 'Curso';
  const initial = student?.nome?.[0]?.toUpperCase() ?? '?';

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
          <span className={styles.breadcrumb}>Ofício Brasil</span>
          <span className={styles.pageTitle}>{pageLabel}</span>
        </div>
      </div>

      <div className={styles.right} ref={wrapRef}>
        <button
          type="button"
          className={styles.userBtn}
          onClick={() => setMenuOpen((v) => !v)}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
        >
          {student && (
            <span className={styles.greeting}>
              Olá, <strong>{student.nome.split(' ')[0]}</strong>
            </span>
          )}
          <span className={styles.avatar}>{initial}</span>
          <span className={`${styles.caret} ${menuOpen ? styles.caretUp : ''}`}>▾</span>
        </button>

        {menuOpen && (
          <div className={styles.menu} role="menu">
            <div className={styles.menuHead}>
              <span className={styles.menuName}>{student?.nome}</span>
              <span className={styles.menuEmail}>{student?.email}</span>
            </div>
            <button type="button" className={styles.menuItem} onClick={openData} role="menuitem">
              <span className={styles.menuIcon}>👤</span>
              Meus dados
            </button>
            <button type="button" className={styles.menuItem} onClick={openRequest} role="menuitem">
              <span className={styles.menuIcon}>✎</span>
              Solicitar alterações
            </button>
            <button type="button" className={styles.menuItem} onClick={goSettings} role="menuitem">
              <span className={styles.menuIcon}>⚙</span>
              Configurações
            </button>
            <div className={styles.menuDivider} />
            <button
              type="button"
              className={`${styles.menuItem} ${styles.menuDanger}`}
              onClick={handleLogout}
              role="menuitem"
            >
              <span className={styles.menuIcon}>⎋</span>
              Sair
            </button>
          </div>
        )}
      </div>

      <UserDataModal
        open={dataOpen}
        onClose={() => setDataOpen(false)}
        student={student}
        onRequestChange={() => { setDataOpen(false); setRequestOpen(true); }}
      />
      <ChangeRequestModal
        open={requestOpen}
        onClose={() => setRequestOpen(false)}
        student={student}
      />
    </header>
  );
}
