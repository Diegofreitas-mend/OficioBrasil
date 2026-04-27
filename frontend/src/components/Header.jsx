import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../services/api.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import styles from '../styles/components/Header.module.css';

const PAGE_LABELS = {
  '/':              'Dashboard',
  '/avaliacoes':    'Avaliações',
  '/historico':     'Histórico',
  '/configuracoes': 'Configurações',
};

export default function Header() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [user, setUser] = useState(null);

  useEffect(() => {
    api.get('/user').then(setUser).catch(() => {});
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const pageLabel = PAGE_LABELS[pathname] ?? 'Curso';

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <span className={styles.breadcrumb}>Ofício Brasil</span>
        <span className={styles.pageTitle}>{pageLabel}</span>
      </div>

      <div className={styles.right}>
        {user && (
          <span className={styles.greeting}>
            Olá, <strong>{user.nome}</strong>
          </span>
        )}
        <div className={styles.avatar}>{user ? user.nome[0] : '?'}</div>
        <button
          type="button"
          className={styles.logoutBtn}
          onClick={handleLogout}
          aria-label="Sair"
        >
          Sair
        </button>
      </div>
    </header>
  );
}
